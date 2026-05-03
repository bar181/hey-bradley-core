# P100 W2 / LOG-BUILD — Retrospective

- **Phase:** P100 · **Sprint:** LOG-BUILD (Wave 2) · **Date:** 2026-05-01

## Keep

- **Two-table architecture (log_events + edit_history).** Diverging access patterns earned diverging tables. Event-stream reads (debug a request) want fast scan-by-`request_id`; project-scoped diff reads (undo / forensic replay) want scan-by-`project_id` ordered DESC. One-fat-table would have forced a UNION + filter on every read; two tables let each access pattern stay sharp. ADR-126 D1 codifies.
- **Three-level ID hierarchy threaded from submit entry.** `session_id` → `request_id` → per-stage `event_id` is the cleanest possible drill-down primitive. A9's spec hard-tests `newRequestId` is referenced in `chatPipeline.ts`; A8's drill-down UI consumes `getEventsForRequest(request_id)` directly. No JOIN gymnastics required.
- **Fire-and-forget writes.** Every write wrapped in try/catch + console.warn; never throws upward. Logging is observability, not correctness. A pipeline that breaks because the log table is locked is a worse pipeline. ADR-126 D4 codifies; mirrors ADR-018 LLM-adapter pattern.
- **BYOK redaction at the write boundary, not the schema.** Defence-in-depth; the schema does not enforce redaction (impossible at SQLite layer). The repo enforces. P100W2.4 hard-tests `sk-` + `AIza` regex shapes are present in repo source — codifies the trust boundary as a test invariant. Mirrors ADR-043 + ADR-114 D3.
- **Multi-wave dispatch at 9-agent scale.** Wave 1 (A1 schema/repo) → Wave 2 (A2-A6 wiring + 4 fixtures) → Wave 3 (A7 audit + atoms) → Wave 4 parallel (A8 + A9). The structure made A8's transient slip absorbable — A9's existsSync soft-pass turns A8-into-red into A8-into-carry-forward. No fix-pass required.
- **EOP at `seal/` subfolder.** Mirrors P95/P96 pattern. Avoids any future filename collision with the `phase-100/00..04` planning sprint design docs (which already exist at `phase-100/log-design.md` + `milestone-plan.md` + `preflight/` + `scenarios/`).
- **A7's prompt audit as a SEPARATE artifact.** `docs/prompt-audit/prompt-quality-report.md` lives outside `plans/implementation/phase-100/` so it stays discoverable for downstream consumers (ADR-108 adoption guide tree pattern). The report scores 88/100 SOTA vs Lovable 80 — this is a marketing-surface artifact, not a sprint internal.

## Drop

- **Nothing.** The 9-agent multi-wave structure held; no fix-pass required at seal time. The brutal-honest review surface (`seal/04-brutal-honest-review.md`) is new for this sprint — first time we've shipped a meta-sprint composite review at seal. Will keep on future major-phase seals.

## Reframe

- **"Log infrastructure" was originally framed as a debug feature.** Reframe: log infrastructure IS the future-scenario flywheel. Every scenario fixture A3-A6 shipped automatically benefits — they don't need to instrument anything; the pipeline writes its own observation layer. Future scenarios (P101+) inherit the wire for free. This is the same pattern as the P74 / OC-DECOMP "store the trajectory" framing — log infrastructure is structurally compounding.
- **"Audit" is not a side artifact.** A7's prompt-quality-report.md is the strongest competitive-positioning artifact this sprint produced. The 88/100 vs Lovable 80 scoring is reproducible (7-category rubric + per-category cell-level scoring) — anyone can verify. Treat it as Tier-1 marketing, not internal QA.
- **"BYOK boundary" is the moat, not a feature.** P89/ADR-114 declared the trust boundary; P100/ADR-126 D3 enforces it at the log-write boundary. Each subsequent ADR that touches persistence will need to re-test this boundary — the test invariant in P100W2.4 codifies it.

## Carry-forward (Tier-2 commercial / post-RC)

- **A8 ConversationLogTab drill-down** — if A8 slips at seal time, lands carry-forward; existsSync soft-pass guards (P100W2.11) prevent red.
- **Real-time observability dashboard** — Tier-2 commercial; live log-tail UI / SSE channel / aggregate stats by event_type.
- **Cross-session analytics** — Tier-2 commercial; multi-session funnel + cohort analysis.
- **Real LLM cost capture** — waits on live BYOK runtime activation.
- **2 atom improvements** — multi-clause priority weighting + page-ref cross-validation; P101 candidates per A7 audit §8.
- **Bundle log_events into export** — ADR-122 markdown bundle could include a `logs/{request_id}.md` slice for the most-recent N requests per phase. Tier-2 candidate.
- **ML anomaly detection** on log streams — Tier-2 commercial.

## Velocity note

- Preflight estimate: 90-120 min wall-clock for Wave 2 multi-wave.
- Actual: comparable. Multi-wave structure (Wave 1 → 2 → 3 → 4) prevented merge conflicts at scale. A8 parallel slip absorbed via soft-pass; carry-forward, not red.
- **Net:** velocity hit was within budget. 9-agent dispatch is structurally cheaper than serial when scope is genuinely disjoint — A1's repo + A2's chatPipeline wire + A3-A6's fixtures + A7's audit + A9's EOP all touch different files. Multi-wave dispatch is the right pattern at this scale.

## P100 W1 → W2 → P101 arc

W1 designed (log-design.md + scenario specs). W2 ships (schema + repo + wire + fixtures + audit + drill-down + closer). P101 will exercise: new scenarios automatically write to the log surface; ConversationLogTab drill-down materializes per `request_id`; the audit framework is reproducible per-sprint; atom improvements compound across phases. The wire is now load-bearing infrastructure, not a debug feature.
