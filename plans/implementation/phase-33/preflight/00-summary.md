# Phase 33 — Preflight 00 Summary

> **Phase title:** Sprint D Phase 5 — Content + Template Bridge (UI wire)
> **Status:** PREFLIGHT
> **Successor of:** P32 (Multi-section pipeline)
> **Successor:** End-of-Sprint-D brutal-honest review

## North Star

> **Sprint D close.** Register first `kind: 'generator'` template; 2-step pipeline dispatches by `template.kind`; AISPTranslationPanel ChatInput integration surfaces 2-step output to user. ADR-062 documents the bridge.

## Scope IN (KISS)

- Register `generate-headline` template w/ `kind: 'generator'` in registry
- Update `BASELINE_META` to mark `generate-headline` correctly
- Extend `twoStepPipeline.ts` to dispatch on `template.kind`:
  - `'patcher'` → existing P28 path (regex envelope)
  - `'generator'` → call `generateContent({ text, sectionType: target.type })` and produce a JSON-Patch envelope from result
- ADR-062
- 6+ pure-unit tests

## Scope OUT (post-Sprint-D)

- Real LLM call wiring inside generateContent (the stub still ships; LLM adapter integration deferred to a Sprint-E micro-phase or post-MVP)
- AISPTranslationPanel ChatInput visual reorganization (deferred to dedicated UI mini-phase)

## Files

| File | Purpose |
|---|---|
| `src/contexts/intelligence/templates/registry.ts` | EDIT — add `generate-headline` |
| `src/contexts/intelligence/templates/library.ts` | EDIT — BASELINE_META update |
| `src/contexts/intelligence/aisp/twoStepPipeline.ts` | EDIT — kind-based dispatch |
| `docs/adr/ADR-062-content-template-bridge.md` | NEW |
| `tests/p33-content-bridge.spec.ts` | NEW |

## DoD

- [ ] `generate-headline` registered with kind:'generator'
- [ ] twoStepPipeline dispatches by kind
- [ ] +6 pure-unit tests
- [ ] ADR-062
- [ ] Build green; full Sprint D regression
- [ ] Seal + Sprint D close + brutal-honest review trigger

## Composite target: 93+ (Sprint D close climb)
