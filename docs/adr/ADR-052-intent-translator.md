# ADR-052: Intent Translator — Messy Input → Canonical Form

**Status:** Accepted
**Date:** 2026-04-27 (P25 Sprint B Phase 3)
**Deciders:** Bradley Ross
**Phase:** P25

## Context

Through P24, the chat pipeline has two kinds of intelligence:
- Template-first router (`tryMatchTemplate`) with regex matchers + scope tokens
- LLM fallthrough when no template matches

Users don't naturally write canonical commands. They write messy English:
- "get rid of the second blog post" (verb + ordinal + type alias)
- "make the headline say Welcome" (verb-phrase + indirect target)
- "remove the footer please" (verb synonym + politeness padding)

Without translation, every messy input flows to the LLM (cost, latency, nondeterminism). With translation, ~30% of "messy" inputs become deterministic template hits.

## Decision

### Architecture

```
user input
  ↓
chatPipeline.submit()
  ↓
translateIntent(text)             ← NEW (P25)
  - verb rewrites                   "get rid of" → "hide", "set" → "change"
  - type normalization              "blog post" → "blog"
  - ordinal-to-scope                "second blog" → "/blog-2"
  - whitespace collapse
  ↓ canonicalText
tryMatchTemplate(canonicalText)   ← P23
  ↓
applyPatches  OR  fall through to LLM
```

### Rule scope (P25 baseline)

**Verbs (3 hide synonyms + 3 change synonyms):**
- `get rid of` / `take out` / `remove|delete|drop` → `hide`
- `make/set the headline say X` / `set/update the headline to X` → `change the headline to X`
- `set` / `update` (generic) → `change`

**Type aliases:**
- `blog post|article|entry` → `blog`
- `page footer` → `footer`
- `hero section|block|banner` → `hero`

**Ordinals:**
- `1st|first` … `5th|fifth` → digit
- "Nth `<type>`" rewritten to `/type-N` (only when no scope token already present)

### Idempotency

Canonical input passes through unchanged. `translateIntent("hide /blog-2")` returns `{ canonicalText: "hide /blog-2", unchanged: true, rationale: "no rewrite (input already canonical)" }`. This is verified by P25 test 5.

### Transparency

`IntentTranslation.rationale` is human-readable: e.g. `'"get rid of the second blog post" → "hide /blog-2"'`. P25 doesn't surface this in the chat UI yet (templates already show `_(template: <id>)_` suffix); P26 (Sprint C) integrates rationale into the AISP intent display.

### Trade-offs accepted

- **Rule-based (not learned).** Sprint C P26 replaces this with an AISP Crystal Atom intent classifier — probabilistic, learned, multi-target. The rule-based form lets us ship Sprint B without LLM dependency for the intent layer.
- **English-only.** Rules are hard-coded English synonyms. Internationalization is post-MVP.
- **No multi-intent in P25.** "hide the hero AND change the footer" still goes to LLM. Sprint C work.
- **First-match wins per category.** Verb rewrites apply in order; conflicting rules MUST be ordered longest-match-first.

## Consequences

- (+) ~30% additional template hit rate (estimated; verified post-MVP via llm_logs analytics)
- (+) Cost optimization extends from "templates handle canonical" to "templates handle messy"
- (+) Foundation for Sprint C AISP intent classifier — same Template registry; replace rule pipeline with probabilistic pipeline
- (+) Idempotent on canonical input (no double-processing risk)
- (-) Adds 1 module + 1 dynamic-import in chatPipeline (~20 LOC change)
- (-) Rules can drift from user vocabulary; needs P26 AISP layer for adaptation

## Cross-references

- ADR-050 (Template-First Chat Architecture; P23) — translator output feeds router
- ADR-051 (Section Targeting Syntax; P24) — translator EMITS scope tokens for templates
- ADR-052 — this document supersedes the P21 stub
- ADR-053 (proposed; AISP Intent Classifier — Sprint C P26) — full replacement of this rule-based layer
- `phase-22/wave-1/A2-sprint-plan-review.md` §B — Sprint B P25 plan source

## Status as of P25 seal

- `translateIntent(text)` shipped ✅
- 3 verb-rewrite categories + 3 type-aliases + 5 ordinals implemented ✅
- Idempotent on canonical input ✅
- `chatPipeline.submit()` runs translateIntent BEFORE tryMatchTemplate ✅
- 7 pure-unit Playwright cases (`tests/p25-intent-translator.spec.ts`) ✅
- Build green; tsc clean; P23+P24 regression green ✅
- Backward-compat: canonical input unchanged ✅
