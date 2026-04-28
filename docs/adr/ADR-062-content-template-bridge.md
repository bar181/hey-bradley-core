# ADR-062: Content + Template Bridge (kind dispatch)

**Status:** Accepted
**Date:** 2026-04-28 (P33 Sprint D P5 — Sprint D close)
**Deciders:** Bradley Ross
**Phase:** P33

## Context

Sprint D P29-P32 built the supporting infrastructure for content generators:
- ADR-058 introduced `kind: 'patcher' | 'generator'` on TemplateMeta
- ADR-059 added persistence
- ADR-060 shipped CONTENT_ATOM + `generateContent` stub
- ADR-061 added section-aware tone/length defaults

P33 closes the Sprint by **wiring the generator path into the 2-step pipeline**: when the LLM selects a template whose `kind === 'generator'`, the pipeline dispatches to `generateContent` (CONTENT_ATOM consumer) instead of the legacy regex-envelope path. The first generator template (`generate-headline`) is registered.

## Decision

### `Template.kind` promoted from library-only to runtime field

ADR-058 left `kind` on `TemplateMeta` (library-decoration). ADR-062 promotes `kind` (and `category`, `examples`) to **optional fields on `Template` itself** so registry entries declare metadata directly. Library-decoration falls back to `BASELINE_META` only for the 3 P23 legacy templates that pre-date the field.

Resolution order in `library.ts`:
1. Template's own `category` / `examples` / `kind` (when declared)
2. `BASELINE_META[t.id]` (P23 legacy shim)
3. Hard fallback (`'content'` / `[]` / `'patcher'`)

### `generate-headline` registered

First `kind: 'generator'` entry. Matches `rewrite the headline`, `regenerate hero copy`, `rewrite headline more bold`. The template's own `envelope` returns an empty/help envelope when invoked by the legacy router (template-router doesn't know how to run generators). The 2-step pipeline detects `kind === 'generator'` and dispatches.

### 2-step pipeline kind dispatch

```ts
if (tpl.kind === 'generator') {
  const sectionType = intent?.target?.type ?? 'hero'
  const generated = generateContent({ text: userText, sectionType })
  if (!generated) return null
  const path = heroHeadingPath(config)
  if (!path) return null
  return { ..., step2: { applied: true, envelope: { patches: [...], summary: ... } }, generated }
}
```

Generator path:
1. Pull section type from INTENT_ATOM target (defaults to 'hero')
2. Run `generateContent({ text, sectionType })` — section-aware defaults flow through
3. Resolve target path (`heroHeadingPath` for now; P32+ generators that target other sections will swap this resolver)
4. Produce JSON-Patch envelope replacing the heading
5. Surface `generated` field in result for AISPTranslationPanel

Patcher path is unchanged (P28 behavior preserved).

### TwoStepResult.generated optional field

Added to expose CONTENT_ATOM output to UI consumers. AISPTranslationPanel ChatInput integration (deferred to a dedicated UI mini-phase) will display the generated tone/length/confidence so users see WHY a particular copy was chosen.

## Trade-offs accepted

- **Generator stub still in place.** `generateContent` is the deterministic stub from P31. Real LLM-call wiring deferred to a Sprint-E micro-phase or post-MVP. The Σ contract is identical between stub and LLM path — swap is implementation-only.
- **Generator path resolves to hero heading by default.** Future generators that target other sections will need section-type → patch-path resolvers (similar to how `findSectionByType` + `heroHeadingPath` already serve patcher templates).
- **No AISPTranslationPanel UI work in P33.** The panel exists (ADR-056 P27) but is opt-in and doesn't yet surface 2-step output. Deferred to dedicated UI mini-phase post-Sprint-D.

## Consequences

- (+) Sprint D closes with a working generator path end-to-end (template selection → kind dispatch → CONTENT_ATOM → JSON-Patch envelope)
- (+) 4-atom AISP architecture (INTENT → SELECTION → CONTENT → PATCH) flows in production for the first time
- (+) Future generators (Sprint E+) plug in via a single registry entry + optional path-resolver
- (-) Adds ~30 LOC to twoStepPipeline (kind branch); minimal complexity
- (-) `TwoStepResult.generated` is optional — UI consumers must guard

## Cross-references

- ADR-045 (P18; PATCH_ATOM)
- ADR-053 (P26; INTENT_ATOM)
- ADR-057 (P28; SELECTION_ATOM + 2-step pipeline)
- ADR-058 (P29; Library API)
- ADR-060 (P31; CONTENT_ATOM)
- ADR-061 (P32; section defaults)

## Status as of P33 seal

- Template type extended w/ optional category/examples/kind ✅
- generate-headline template registered (kind:'generator') ✅
- twoStepPipeline kind dispatch ✅
- generated field exposed on TwoStepResult ✅
- ADR-062 full Accepted ✅
- 8+ PURE-UNIT tests covering kind dispatch + envelope shape + sectionType passthrough ✅
- Build green; tsc clean; full Sprint D regression P29-P33 GREEN ✅
