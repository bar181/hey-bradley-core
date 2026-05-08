# Phase 35 — Preflight 00 Summary

> **Phase title:** Sprint E P2 — Assumptions Engine LLM Lift + Persistence Surface
> **Status:** PREFLIGHT
> **Successor of:** P34 (UI Closure + Assumptions Engine)
> **Successor:** P36 (Sprint E P3)

## North Star

> **Promote `generateAssumptions` from rule-based stub to LLM-driven** (gated by cost-cap, falling back to rules on failure), and **surface `listAcceptedAssumptions()` in the EXPERT-tab Data pane** so the user can see what they've confirmed across sessions. ADR-064.

## Scope IN (KISS)

- `generateAssumptionsLLM(text, intent)` — Σ-restricted Crystal Atom for assumption generation
- ASSUMPTIONS_ATOM (5th Crystal Atom) — Ω/Σ/Γ/Λ/Ε per AISP guide
- Cost-cap reservation: 0.65 (lower than CONTENT 0.85; smaller Σ surface)
- Fallback chain: LLM → rule-based stub (P34) → empty
- EXPERT-tab Data pane sub-section: "Recent assumptions you confirmed" (5-row preview)
- ADR-064
- 8+ pure-unit tests

## Scope OUT (P36+)

- Per-project scoping of accepted assumptions (post-MVP)
- Replay / "use last assumption" affordance (Sprint E P3 candidate)

## Files

| File | Purpose |
|---|---|
| `src/contexts/intelligence/aisp/assumptionsAtom.ts` | NEW — ASSUMPTIONS_ATOM Crystal Atom |
| `src/contexts/intelligence/aisp/assumptionsLLM.ts` | NEW — LLM-driven generator |
| `src/contexts/intelligence/aisp/assumptions.ts` | EDIT — wire LLM-first w/ stub fallback |
| `src/components/center-panel/data/AssumptionsPane.tsx` | NEW — EXPERT-tab debug pane |
| `docs/adr/ADR-064-assumptions-llm-lift.md` | NEW |
| `tests/p35-assumptions-llm.spec.ts` | NEW |

## DoD

- [ ] ASSUMPTIONS_ATOM verbatim AISP
- [ ] LLM generator gated by cost-cap; rule-based fallback on failure
- [ ] EXPERT-tab pane showing 5 recent accepted assumptions
- [ ] +8 PURE-UNIT tests
- [ ] ADR-064
- [ ] Build green; backward-compat with P34
- [ ] Seal artifacts + P36 preflight

## Composite target: 95+ (Sprint E mid-arc climb)
