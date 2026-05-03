# P100 W2 / FMT-VERIFY — Retrospective

## Keep

- **5-wave disjoint-scope dispatch.** Agents touched non-overlapping
  surfaces (A1 doc / B1-B4 traces in own files / C1 own file / D1
  source / E1 closer). Zero merge collisions. ~3-4h wall-clock.
- **Code-path tracing as verification primitive.** B2/B3/B4 each
  surfaced a real production gap by walking the actual code (not
  fixture data). The trace docs are now reusable "shadow-tests".
- **Honest re-score discipline.** C1 dropped composite 88 → 79 with
  evidence. D1 lifted to 84 with measured deltas. Neither agent papered
  over the gap to the prior claim.
- **Top-3-by-impact fix selection.** D1 didn't try to close all 5 gaps
  in one wave. Stayed at 47 LOC; 551/551 GREEN; clean diff.

## Drop

- **Treating A7 prompt audit score as production validation.** "88/100
  on a fixture comparison" is not the same as "88/100 in production
  pipeline." The audit measured prompt quality; it didn't verify the
  helpers it celebrated were ever imported.
- **ADR-126 LOG-BUILD seal claim of "comprehensive coverage."** It was
  comprehensive at the *write-call-site* level. It was NOT comprehensive
  at the *event-type-coverage* level (PROCESS/DDD outputs declared
  but never emitted).

## Reframe

- **Prior brutal-honest review was insufficient.** The P100 W2 LOG-BUILD
  brutal review scored 88/100 across 7 categories but used fixture-data
  walkthroughs instead of pure-function traces. The dead-code helpers
  + unwired listen cleanup + missing AGENT_ATOM wire would have all
  been caught by a single `grep -r "isUnmeasurableGoal" src/` from any
  reviewer. **New rule:** every Crystal Atom helper export ships with a
  grep-trace verifying ≥1 import site exists in `chatPipeline.ts` or
  equivalent dispatch surface.

## Carry-forward (P101 P1)

1. **AGENT_ATOM wire** into AgentProxy invocation path (B4 finding;
   blocks SpecWorkbench → real-LLM hand-off)
2. **PROCESS/DDD persistence** to `log_events` (`process_atom_output`
   + `ddd_atom_output` emit sites — declared but absent)
3. **DECOMP verb classifier gaps** (`forget` / `need` / `create`
   verbs missing from lookup table)
4. **First owner BYOK smoke run** to dissolve A1 §9 5 LIVE-LLM
   unknowns into either confirmed-OK or new gaps

## Velocity note

5-wave sprint kept agents disjoint and shipped in ~3-4h wall-clock —
consistent with post-P19 velocity bracket (multi-hour shifts, not
multi-day shifts) per CLAUDE.md effort estimation rule. Quality
discipline held: tests stayed green (551/551 + new 15+); ADR-127
under cap; brutal-honest score correction was published not buried.
