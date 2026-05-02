# ADR-126 — Comprehensive LLM Interaction Logging

- **Status:** Accepted
- **Date:** 2026-05-01
- **Phase:** P100 W2 / LOG-BUILD
- **Cross-refs:** ADR-016 (sql.js Local DB), ADR-018 (Real Chat Mode), ADR-074 (Conversation Log), ADR-104 (Page-Aware Pipeline)

## Context

P100 Wave 1 audit (`plans/implementation/phase-100/log-design.md`)
identified 18 distinct pipeline stages spanning chat / listen / planning
modes and grouped them into **11 log categories**. The pre-P100 surface
(`llm_logs` per ADR-018 + `messages` per ADR-074) captured only LLM
adapter calls + chat thread renderings — leaving 9 stage-categories
unobserved (intent classification, decomposition split, template match,
patch validation, personality display, listen capture, multi-page scope,
process/ddd atom output, error events).

Wave 2 wires the SQLite write path end-to-end: A1 ships migration 005 +
`comprehensiveLogs` repo; A2 wires `chatPipeline.ts` with 7+
`writeLogEvent` call sites + 1 `writeEditHistory` call; A3-A6 fixture
**4 scenarios** (Axon CLI dev / adversarial edge cases / listen mode
startup / Planning SaaS auth) totalling ~190+ simulated SQLite rows
across 40 prompts; A7 ships the prompt audit report
(`docs/prompt-audit/prompt-quality-report.md`) scoring **88/100 SOTA**
vs Lovable's 80/100 baseline + 3 atom-helper improvements
(`UNMEASURABLE_GOAL_RE`, `CONTRADICTION_RE`,
`ASSUMPTIONS_FALLBACK_TEMPLATES`); A8 wires the ConversationLogTab
drill-down; A9 (this ADR) closes.

## Decisions

### Decision 1 — Two-table log architecture

`log_events` captures every pipeline stage as a typed event (13
`event_type` values map onto the §3 categories: `input_event`,
`intent_classification`, `decomposition`, `template_match`,
`patch_validation`, `personality_display`, `listen_capture`,
`multi_page_scope`, `process_atom_output`, `ddd_atom_output`,
`error_event`, `response_summary`, `todo_execution`). Verbose by
design; **30-day retention**. `edit_history` captures per-patch
before/after snapshots for replay/forensics; **90-day retention**.
Two tables — not one fat table — because the access patterns diverge:
event-stream reads (debug a request) vs project-scoped diff reads
(undo / forensic replay).

### Decision 2 — Three-level ID hierarchy

`session_id` (browser session) → `request_id` (single user submit;
UUID v4 generated at `chatPipeline.submit` entry) → per-stage `event_id`.
The `request_id` is threaded through all 7+ `writeLogEvent` call sites
in `chatPipeline.ts` so one user prompt produces N rows that drill-down
joins cleanly. `newRequestId()` in `comprehensiveLogs.ts` returns
`crypto.randomUUID()` with a Math.random fallback for older harnesses.

### Decision 3 — BYOK trust boundary preserved

`redactKeyShapes(s)` strips `sk-ant-*` / `sk-proj-*` / `sk-or-*` /
`sk-*` / `AIza*` / `Bearer ` patterns at every write boundary
(`event_data`, `before_snapshot`, `after_snapshot`, `user_prompt`).
**BYOK keys never persist** — defence-in-depth at the repo write
boundary, not the schema (per ADR-043 + ADR-114 D3). The schema does
NOT enforce redaction; the repo DOES. P100W2.4 hard-tests both regex
shapes are present in repo source.

### Decision 4 — Fire-and-forget writes

Every write is wrapped `try { ... } catch { console.warn(...) }`;
**never throws upward**; pipeline continues even if SQLite is
unavailable. Logging is observability, not a correctness gate — a
write failure cannot block the user's response. Mirrors the
ADR-018 pattern for `llm_logs` writes in the LLM adapter wrapper.

## Out of scope (deferred)

- **Real-time observability dashboard** — Tier-2 commercial; live
  log-tail UI / SSE channel / aggregate stats by event_type
- **Cross-session analytics** — Tier-2 commercial; multi-session
  funnel + cohort analysis on log_events
- **ML-based anomaly detection** on log streams — Tier-2 commercial;
  pattern-mining over log_events to flag pipeline regressions
- **Real LLM cost capture** — deferred until live BYOK runtime
  activates; current `latency_ms` field captures wall-clock; cost +
  token counts wait on adapter-side instrumentation

## Acceptance gates

- 4 scenarios validated end-to-end with simulated SQLite rows
  (Axon CLI dev / edge cases / listen startup / Planning SaaS auth);
  ~190+ rows across 40 prompts; per-scenario build logs at
  `plans/implementation/phase-100/scenarios/`
- Prompt audit landed at `docs/prompt-audit/prompt-quality-report.md`
  with 88/100 SOTA score (≥150 LOC)
- 3 atom helpers exported (`UNMEASURABLE_GOAL_RE`,
  `CONTRADICTION_RE`, `ASSUMPTIONS_FALLBACK_TEMPLATES`)
- Migration 005 + `comprehensiveLogs` repo + `chatPipeline` wire
  shipped (A1/A2)
- ADR ≤120 LOC; **Status: Accepted**; 4 decisions enumerated
- EOP triplet at `plans/implementation/phase-100/seal/`

## Consequences

- **Positive:** every pipeline stage now observable in SQLite;
  drill-down per `request_id` reconstructs full pipeline trace;
  per-patch undo/replay possible via `edit_history`; BYOK trust
  boundary preserved at repo layer; future scenarios automatically
  benefit (no per-scenario instrumentation work); 88/100 SOTA score
  beats Lovable 80/100 baseline on intent precision + spec fidelity.
- **Negative:** 13 event_type values is verbose surface area; 30/90
  day retention means rolling DB growth (mitigated by `pruneOldLogs`
  + `pruneOldEditHistory`); ConversationLogTab UI surface widens;
  no real-time observability at open-core (Tier-2 dashboard).
- **Mitigations:** retention pruning ships in repo; redaction is
  enforced at every write boundary (defence-in-depth); fire-and-forget
  pattern prevents log infrastructure from breaking pipeline; A8's
  drill-down UI surfaces the data without bloating the canvas.
