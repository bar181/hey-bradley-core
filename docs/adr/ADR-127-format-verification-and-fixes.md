# ADR-127 — Format Verification + Top-3 Atom-Helper Fixes

- **Status:** Accepted
- **Date:** 2026-05-01
- **Phase:** P100 W2 / FMT-VERIFY
- **Cross-refs:** ADR-045 (PATCH_ATOM), ADR-053 (INTENT_ATOM), ADR-099 (DECOMP_ATOM), ADR-126 (Comprehensive Log Infrastructure)

## Context

P100 W2 / LOG-BUILD shipped comprehensive logging end-to-end (ADR-126)
and the A7 prompt audit scored Hey Bradley **88/100 SOTA** vs Lovable's
80/100 baseline. Owner pushed back: *"do AgentProxy responses match
real LLM responses format-exactly? did we just declare victory on a
green test?"*

A 5-wave format-verification sprint dispatched (A1 schema/regex compare
+ B1-B4 four scenario traces walking real code paths + C1 SOTA re-score
+ D1 fixes + E1 closer/this ADR). Three concrete gaps surfaced once we
traced through actual chatPipeline + listen + planning code paths
instead of fixture text:

1. A7 atom helpers (`isUnmeasurableGoal`, `hasContradiction`,
   `ASSUMPTIONS_FALLBACK_TEMPLATES`) were exported but **never imported
   anywhere downstream**. Dead code masquerading as production wiring.
2. Listen mode fed raw STT transcripts straight into chatPipeline with
   no cleanup module. Filler words / repeats / partial fragments
   reached intent classification untouched.
3. Schema CHECK enum on `log_events.event_type` did not include
   `decomp_split` or `export_emit` — fixture rows for the 4 B-wave
   scenarios would fail constraint validation if persisted to a real
   sql.js instance.

Revised SOTA composite (C1): **88 → 79/100** raw (-9 honesty haircut).
With D1 top-3 fixes wired: **79 → 84/100** (+5).

## Decisions

### Decision 1 — AgentProxy response shape MATCHES Zod schema (happy path)

A1 §5 walked all 12 fields of every Crystal Atom output type and
confirmed AgentProxy fixture responses validate against the same Zod
schemas the live LLM path would consume. Live-LLM divergence risks
are documented (A1 §9 top-5: streaming chunk boundaries, JSON-fence
escape edge cases, model-version drift on enum vocabularies, function-
call vs free-text mode swap, refusal-message shape).

### Decision 2 — Memory model CONFIRMED stateless

B1-B4 traces confirm every `chatPipeline.submit(text)` call rebuilds
the system prompt from `MasterConfig` + `intelligenceStore` + `brandContext`
on entry. There is **no LLM-side conversation state** — no thread IDs,
no provider-side history, no cached context. Reproducibility holds.

### Decision 3 — 3 critical helpers wired into production (D1)

`isUnmeasurableGoal` (intentAtom) + `hasContradiction` (decompAtom) are
now consulted at chatPipeline submit and emitted as flags on the
`intent_classification` log event. `cleanTranscript` is a new pure
module (`src/contexts/intelligence/stt/transcriptCleanup.ts`) called
inside the listen-capture pre-submit step. Helpers were dead code
before D1; today they end the dead-code state per C1 §4.1.

### Decision 4 — Schema CHECK enum extended

`migrations/005-comprehensive-logs.sql` CHECK constraint on
`log_events.event_type` extended with `decomp_split` and `export_emit`.
Closes the constraint-violation latent bug surfaced by B-wave fixture
runs through a real sql.js instance.

## Out of Scope (P101 carry-forward)

- Live LLM calls (no BYOK keys present in CI; A1 §9 risks remain
  theoretical until first paid call)
- AGENT_ATOM unwired into AgentProxy invocation path (B4 finding)
- PROCESS_ATOM + DDD_ATOM outputs not persisted to log_events
  (`process_atom_output` / `ddd_atom_output` types declared but no
  emit site — B4 finding)
- DECOMP verb classifier gaps for `forget` / `need` / `create`
  (D1 took top-3; verb-table widening is a separate atom-edit sprint)
- 5 LIVE-LLM unknowns from A1 §9 (await first owner BYOK smoke run)

## Acceptance Gates

1. AgentProxy fixture outputs validate against Crystal Atom Zod schemas
   for all 8 atoms (PATCH/INTENT/SELECTION/CONTENT/ASSUMPTIONS/DECOMP/
   PROCESS/DDD/AGENT) at the 12-field happy-path level — A1 §5.
2. `chatPipeline.submit` is stateless: no `this.history`, no
   provider-side thread ID, no cross-call mutable buffer survives
   beyond the single submit's lifetime — B1-B4 grep evidence.
3. `isUnmeasurable` + `isContradiction` flags appear on every
   `intent_classification` event row emitted from chatPipeline — D1
   wire verification.
4. `migrations/005-comprehensive-logs.sql` CHECK constraint accepts
   all 13 declared event types including `decomp_split` + `export_emit`
   — D1 enum extension verification.

## Consequences

**Positive:** Dead-code helpers now load-bearing → atom-helper authoring
becomes a meaningful contract (export = consumed). Listen transcripts
no longer pollute intent classification with STT noise. Schema enum
matches fixture data — no constraint-violation surprise on first sql.js
write. Composite score 84/100 is **honest** (was 88/100 optimistic).

**Negative:** +47 LOC across 3 surfaces increases chatPipeline coupling
to atom-helper exports. P101 must wire AGENT_ATOM + PROCESS+DDD persistence
or the 84/100 gap to 88+ widens, not closes.

**Mitigations:** EOP retro flags AGENT_ATOM wiring as P101 P1 carry-forward
with explicit acceptance criteria. Verb-classifier widening tracked as
separate atom-edit ticket — not bundled with FMT-VERIFY.
