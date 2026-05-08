# Phase 32 — Preflight 00 Summary

> **Phase title:** Sprint D Phase 4 — Multi-section Content Pipeline
> **Status:** PREFLIGHT
> **Successor of:** P31 (Content POC)
> **Successor:** P33 (UI bridge + LLM wiring)

## North Star

> **Section-aware content dispatch + style-aware tone defaults.** P31's `generateContent` is generic; P32 layers a section-type lookup that picks reasonable tone/length defaults per section (hero = bold/short; blog = neutral/medium; footer = warm/short).

## Scope IN

- `contentDefaults.ts` — section-type → tone/length defaults map
- `generateContent` extended to accept optional `sectionType` hint
- ADR-061
- 6+ pure-unit tests

## Scope OUT (P33+)

- LLM wiring (P33)
- AISPTranslationPanel ChatInput integration (P33)

## Files

| File | Purpose |
|---|---|
| `src/contexts/intelligence/aisp/contentDefaults.ts` | NEW |
| `src/contexts/intelligence/aisp/contentGenerator.ts` | EDIT — accept sectionType param |
| `docs/adr/ADR-061-multi-section-content-pipeline.md` | NEW |
| `tests/p32-multi-section-content.spec.ts` | NEW |

## DoD

- [ ] Section defaults map for ≥5 section types
- [ ] generateContent accepts sectionType (opt) and applies defaults
- [ ] +6 pure-unit tests
- [ ] ADR-061
- [ ] Build green; backward-compat
- [ ] Seal + P33 preflight

## Composite target: 92+ (held or +1 if section dispatch reads convincingly)
