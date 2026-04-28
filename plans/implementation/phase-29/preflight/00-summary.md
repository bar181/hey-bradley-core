# Phase 29 — Preflight 00 Summary

> **Phase title:** Sprint D Phase 1 — Templates + Content Generators
> **Status:** PREFLIGHT (activates post-P28 seal; Sprint D opener)
> **Successor of:** P28 Sprint C P3 (91/100; Sprint C complete; Sprint D greenlight)
> **Successor:** P30 (Sprint D P2 — Content pipeline for all section types)

## North Star

> **Sprint D opens the content-generation arc. P29 ships content-generator templates: Step 2 of the 2-step pipeline replaces regex-match with an LLM call that generates content (headlines, copy, descriptions) constrained by template structure. Crystal Atoms move from intent classification to content generation.**

## Scope IN

- **2-3 content-generator templates** for hero copy / blog body / footer text
- **CONTENT_ATOM** (new Crystal Atom for content generation; constrains output to `{text, tone, length}` shape)
- **`generateContent(template, context)`** function that replaces 2-step Step 2 when the matched template has `kind: 'generator'` instead of `kind: 'patcher'`
- **`AISPTranslationPanel` wiring** — surface 2-step output (Step 1 selection + Step 2 generation) in the chat UI
- **+5 pure-unit tests** (CONTENT_ATOM shape + generator schema + tone enforcement)
- **ADR-058** — Content-Generator Templates

## Scope OUT (P30+)

- All-section content pipeline (P30)
- Multi-page generation (P31; possibly post-MVP)
- Tone-style learning per project (post-MVP)

## Effort estimate

- ~30m CONTENT_ATOM + content-generator type
- ~30m 2-3 generator templates (hero copy, blog body, footer)
- ~15m AISPTranslationPanel wiring in ChatInput
- ~30m ADR-058 + 5 tests
- ~15m retro + seal
- **Total: ~2h** at velocity

## Files (planned)

| File | Type | Purpose |
|---|---|---|
| `src/contexts/intelligence/aisp/contentAtom.ts` | NEW | CONTENT_ATOM Crystal Atom |
| `src/contexts/intelligence/aisp/contentGenerator.ts` | NEW | `generateContent(template, context)` |
| `src/contexts/intelligence/templates/registry.ts` | EDIT | add 2-3 `kind: 'generator'` templates |
| `src/components/shell/ChatInput.tsx` | EDIT | wire AISPTranslationPanel with 2-step output |
| `src/contexts/intelligence/aisp/twoStepPipeline.ts` | EDIT | dispatch on template.kind: 'generator' → generateContent vs 'patcher' → existing |
| `docs/adr/ADR-058-content-generator-templates.md` | NEW | full Accepted |
| `tests/p29-content-generators.spec.ts` | NEW | 5+ pure-unit cases |

## DoD

- [ ] CONTENT_ATOM Crystal Atom exported as constant
- [ ] 2-3 content-generator templates registered (hero copy, blog body, footer)
- [ ] 2-step pipeline dispatches based on template.kind
- [ ] AISPTranslationPanel shows Step 1 + Step 2 in chat UI
- [ ] Cost-cap aware (Step 2 LLM generator call respects per-call cost-cap math)
- [ ] +5 pure-unit Playwright cases
- [ ] ADR-058 full Accepted
- [ ] Build green; tsc clean; P15-P28 regression green
- [ ] Retro + STATE + Sprint D P30 preflight scaffold

## Composite target

- Grandma 76+ (held; content generation visible in chat reply)
- Framer 89+ (held / +1 if content quality reads well)
- Capstone 96+ (held / +1 if content-generation is convincing demo)
- **Target: 91+ (held or climb)**

## Carryforward into P29 (from P28)

- C04 ListenTab full <500 LOC split (queued for dedicated cleanup pass)
- C17 remaining 10 logic-layer casts (deepMerge + applyPatches paths)
- C11 Vertical mobile carousel (P22 cosmetic)
- C12 AISP Blueprint sub-tab refresh (P22 cosmetic)
- Vercel deploy (owner-triggered)

## Cross-references

- ADR-053 (AISP Intent Classifier; P26) — parent
- ADR-055 (AISP Conversion + Verification; P27)
- ADR-056 (LLM-Native AISP Understanding; P27)
- ADR-057 (2-step AISP Template Selection; P28) — direct predecessor
- ADR-058 (Content-Generator Templates) — to be authored at P29

---

**Phase 29 activates immediately on owner greenlight. Sprint D opens. Content generation is the next major capstone-thesis surface.**
