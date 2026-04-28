# Phase 35 Retrospective — Sprint E P2 (ASSUMPTIONS_ATOM + LLM Lift)

> **Composite (estimated):** 96/100 (+1 vs P34 95)
> **Sealed:** 2026-04-28 (~95m / ~2.5× velocity)

## What worked

- **Stub-then-LLM pattern paying compound interest.** P31 CONTENT_ATOM established it; P35 ASSUMPTIONS_ATOM reuses verbatim — same Σ contract feeds stub and LLM, so the swap is implementation-only. The contract written in ATOM ⟦…⟧ is the single source of truth for both paths.
- **6-tier fallback chain is honest.** Every failure mode has a named branch with a trace string ("LLM error: rate_limit", "cost-cap reserve hit", "ATOM Σ/Γ validation"). EXPERT users see exactly why a particular path fired.
- **EXPERT-only trace pane.** Hides from Grandma, materializes the thesis for Framer/Capstone. Same pattern as ADR-049 CostPill (3-tier states for different audiences).
- **BYOK matrix audit caught real gaps.** OpenAI was missing entirely; Claude+Gemini cost-per-million numbers were stale (off by 4×). Without the audit we'd have shipped to capstone-defense with cost-cap math 4× too lenient on paid providers.
- **PURE-UNIT pattern locked in.** 211 tests across 12 spec files, all first-pass green, zero browser flake. The pattern from P24 is now the asset that makes velocity real.

## What to keep

- **Crystal Atom = single source of truth.** Both for static prompt embedding (system prompt includes ASSUMPTIONS_ATOM verbatim) AND runtime validation (validateAssumptionsAtomOutput enforces Γ Ε rules). One artifact, two enforcement surfaces.
- **Source-level tests for cross-cutting wiring.** Reading the file and grepping for substrings is honest, fast, and resilient — pendingAispRef.current.assumptions = … is unambiguous and survives refactor.
- **One-call LLM gate (auditedComplete).** Cost-cap, audit logging, mutex are ALL inherited from one helper. assumptionsLLM doesn't reimplement any of them; it just calls auditedComplete with the right SystemPrompt + UserPrompt.

## What to drop

- Nothing in P35. Every phase since P29 has shipped clean fix-pass cycles.

## What to reframe

- **Live-call BYOK testing deferred to end-of-phase.** Acceptable per owner mandate — adapter contracts are uniform, so testing one provider end-to-end exercises the same code path. Will pair with the Vercel deploy so live keys can be exercised in a deployed environment.
- **EXPECT pane is 1-of-many.** P34 had AISPTranslationPanel inline; P35 adds AISPPipelineTracePane below it. Future phases may need a unified "AISP card" component to avoid panel-pile-up. Defer.

## Velocity

| Activity | Est | Actual | × |
|---|---:|---:|---:|
| BYOK audit + OpenAI + costs + 20 tests | 90m | ~30m | 3× |
| P35 A1 (ATOM + LLM gen) | 60m | ~20m | 3× |
| P35 A2 (EXPERT pane) | 30m | ~15m | 2× |
| P35 A3 (ADR + 34 tests) | 45m | ~20m | 2.25× |
| Seal | 15m | ~10m | 1.5× |
| **Total** | 4h | **~95m** | **~2.5×** |

## Sprint E trajectory

| Phase | Title | Composite | Tests new | Cum |
|---|---|---:|---:|---:|
| P34 | UI Closure + Assumptions | 95 | 66 | 165 |
| **P35** | **ASSUMPTIONS_ATOM + LLM + EXPERT pane** | **96** | **54** (20 BYOK + 34 P35) | **211** |

Composite climbs from 95 → 96. Capstone 98 → 99. 5-atom AISP architecture is the strongest thesis exhibit yet.

## Next phase

**P36 — Sprint E P3** (TBD). Owner-defined; candidates include per-project assumption scoping, replay affordance, or Sprint E close brutal review.
