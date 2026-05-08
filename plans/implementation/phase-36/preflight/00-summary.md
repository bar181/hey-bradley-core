# Phase 36 — Preflight 00 Summary

> **Phase title:** Sprint E P3 — TBD (per owner mandate at greenlight)
> **Status:** PREFLIGHT
> **Successor of:** P35 (ASSUMPTIONS_ATOM + LLM Lift + EXPERT trace)

## Candidate north-stars (owner picks one)

1. **Per-project assumption scoping** — extend `assumptionStore` w/ project_id; deferred from ADR-063
2. **Replay affordance** — "you confirmed X last time — same now?" UI surface using `listAcceptedAssumptions()`
3. **Sprint E close + brutal-honest review** — 4-reviewer pass on P34+P35 cumulative; persona re-walk
4. **Live-call human review of BYOK matrix** — paired with Vercel deploy; deferred from P35

## Carryforward into P36 (from P35)

- Vercel deploy live URL (owner-triggered)
- Live-call BYOK validation w/ 4 providers (Claude/Gemini/OpenAI/OpenRouter)
- AISPTranslationPanel + AISPPipelineTracePane unified-component refactor (defer to P36+)
- C04 ListenTab full <500 LOC split (still queued)

## Cross-references

- ADR-063 (Assumptions Engine + Clarification UX; P34)
- ADR-064 (ASSUMPTIONS_ATOM + LLM Lift; P35) — direct predecessor
- `phase-18/roadmap-sprints-a-to-h.md` Sprint E P34-P37

P36 activates on owner greenlight.
