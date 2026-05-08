# P100 W2 / FMT-VERIFY — Post-Review

**Sprint:** Format Verification + Top-3 Atom-Helper Fixes
**Wall-clock:** ~3-4h (5-wave dispatch; agents disjoint)
**ADR ledger:** 126 → **127 Accepted**
**Tests:** ~1219 → **~1234+ PURE-UNIT GREEN**

## Per-agent score

| Agent | Surface | Score | Notes |
|-------|---------|-------|-------|
| A1    | format-verification.md (245 LOC) | 9/10 | Walked 12 fields × 8 atoms; surfaced 5 LIVE-LLM unknowns honestly |
| B1    | scenario-1-trace.md (Axon CLI dev; 307 LOC) | 9/10 | Full code-path trace; matched expected event flow |
| B2    | scenario-2-trace.md (adversarial edge cases; 199 LOC) | 10/10 | **Found A7 dead code** — top finding of sprint |
| B3    | scenario-3-trace.md (listen mode startup; 219 LOC) | 10/10 | **Found listen cleanup unwired** — Fix 2 emerged here |
| B4    | scenario-4-trace.md (Planning SaaS auth; 196 LOC) | 9/10 | **Found AGENT_ATOM unwired** + PROCESS/DDD outputs not persisted |
| C1    | hey-bradley-vs-sota.md (207 LOC) | 9/10 | Honest re-score 88 → 79; with-fixes 84 |
| D1    | 3 fixes wired (47 LOC; 551/551 GREEN) | 10/10 | Top-3 ranked by impact-per-LOC; clean diff; tests stayed green |
| E1    | this ADR-127 + tests + EOP + CLAUDE.md | 9/10 | Closer; hard-gate on owned surfaces; 15 cases (≥15 required) |

**Composite (8-agent average):** 9.4/10

## Honest finding — score correction

Prior P100 W2 / LOG-BUILD seal claimed **88/100 SOTA** (A7 prompt audit
report). This verification sprint revealed **5 real gaps** when we
traced through actual code paths instead of fixture text:

1. A7 helpers (`isUnmeasurableGoal` + `hasContradiction` +
   `ASSUMPTIONS_FALLBACK_TEMPLATES`) exported but never imported
2. Listen mode had no transcript-cleanup module
3. Schema CHECK enum missing `decomp_split` + `export_emit`
4. AGENT_ATOM unwired into AgentProxy invocation
5. PROCESS+DDD outputs not persisted to log_events

**Revised composite (C1):** 88/100 → **79/100** (-9 honesty haircut).
**With D1 top-3 fixes wired:** 79/100 → **84/100** (+5).

The remaining 4-point gap to the prior 88/100 claim is documented as
P101 carry-forward — not papered over.

## Honest deferred (P101)

- Wire AGENT_ATOM into AgentProxy invocation path (B4 finding)
- Persist PROCESS_ATOM + DDD_ATOM outputs to `log_events`
  (`process_atom_output` + `ddd_atom_output` event types declared but
  no emit site)
- Verb classifier gaps in DECOMP_ATOM (`forget` / `need` / `create`
  verbs not in the lookup table; D1 took top-3 by impact, deferred
  this as a separate atom-edit ticket)
- 5 LIVE LLM unknowns from A1 §9 (await first owner BYOK smoke run):
  streaming chunk boundaries, JSON-fence escape edges, model-version
  enum drift, function-call vs free-text mode swap, refusal shape
