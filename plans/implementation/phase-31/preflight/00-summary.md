# Phase 31 — Preflight 00 Summary

> **Phase title:** Sprint D Phase 3 — Content Generators POC
> **Status:** PREFLIGHT
> **Successor of:** P30 (Persistence)
> **Successor:** P32 (Multi-section content pipeline)

## North Star

> **First `kind: 'generator'` template + CONTENT_ATOM Crystal Atom.** Replaces 2-step Step 2 with LLM content generation when matched template has `kind: 'generator'`. Output is Σ-restricted to `{text, tone, length}`.

## Scope IN

- `contentAtom.ts` — CONTENT_ATOM Crystal Atom (Ω/Σ/Γ/Λ/Ε)
- `generateContent(template, context)` — pure function (deterministic stub w/ Σ-shaped output; LLM wiring at P33)
- 1 generator template registered: `generate-headline` (replaces P23 `change-headline` for content-rewrite case; both coexist)
- ADR-060
- 5+ pure-unit tests

## Scope OUT (P32+)

- All-section pipeline (P32)
- AISPTranslationPanel UI wiring (P33)
- Real LLM call (P33; uses existing Claude/Gemini adapters)

## Files

| File | Purpose |
|---|---|
| `src/contexts/intelligence/aisp/contentAtom.ts` | NEW |
| `src/contexts/intelligence/aisp/contentGenerator.ts` | NEW |
| `src/contexts/intelligence/templates/registry.ts` | EDIT — add generator template |
| `docs/adr/ADR-060-content-generators.md` | NEW |
| `tests/p31-content-generators.spec.ts` | NEW |

## DoD

- [ ] CONTENT_ATOM constant exported
- [ ] generateContent returns Σ-shaped result
- [ ] 1 generator template in registry w/ `kind: 'generator'`
- [ ] +5 pure-unit tests
- [ ] ADR-060 full Accepted
- [ ] Build green; backward-compat
- [ ] Seal artifacts + P32 preflight

## Composite target: 92+ (climb on first generator demo)
