# P100 — Log System Design + Milestone Planning (Wave 1 Preflight)

> **Phase:** P100 · **Sprint:** LOG-SYS-DESIGN (read-only Wave 1; build Wave 2 later)
> **Date:** 2026-05-01
> **Cross-refs:** ADR-018 (chat pipeline), ADR-053 (INTENT_ATOM), ADR-074 (Conversation Log), ADR-104 (Page-Aware Pipeline), ADR-118 (PROCESS_ATOM), ADR-119 (DDD_ATOM)

## Mandate — design first, build later

Wave 1 (this sprint): TWO read-only audit agents produce design + planning docs. ZERO source code edits. Runs in parallel with P94 AGENT_ATOM (no file conflicts).

Wave 2 (subsequent sprint): A3 + A4 + A5 build the log system based on A1's findings. NOT dispatched this sprint.

## 2 read-only agents · parallel with P94

### A1 — Full pipeline audit + log design
**Owns:** `plans/implementation/phase-100/log-design.md` (NEW; ≤500 LOC)

Required reading (read-only):
- `src/contexts/intelligence/chatPipeline.ts`
- `src/contexts/intelligence/aisp/todoExecutor.ts`
- `src/contexts/intelligence/aisp/intentClassifier.ts`
- `src/contexts/intelligence/aisp/llmClassifier.ts`
- `src/contexts/intelligence/templates/templateApplier.ts`
- `src/contexts/intelligence/aisp/processAtom.ts`
- `src/contexts/intelligence/aisp/dddAtom.ts`
- `src/contexts/intelligence/auditedComplete.ts` (if exists; locate via grep)
- `src/contexts/intelligence/aisp/personalityRenderer.ts` (or equivalent personality engine)
- `src/contexts/persistence/migrations/` (existing migration list)
- `src/contexts/persistence/repositories/` (existing repos)

Required output sections:
1. **Pipeline-stage map** — every stage that produces loggable data (with file:line citations)
2. **Log categories** — categories (NOT table schema) with what each captures
3. **Linking strategy** — session → request → stage IDs
4. **In-SQLite vs in-memory** — what persists, what stays ephemeral
5. **Silently-discarded data flags** — stages currently producing data that drops on the floor
6. **Synthetic data shapes** — realistic shape per category for test seeding

**Owner-flagged items A1 MUST evaluate (confirm or reject based on actual codebase state):**
- (a) Listen mode 3-stage capture (raw transcript → cleaned → intent classification)
- (b) Multi-page page_id + page_index alongside project_id (P79 made pipeline page-aware)
- (c) Template intelligence per-layer match logging (theme + section + content separately)
- (d) PROCESS_ATOM + DDD_ATOM persistence (currently in-memory only)
- (e) All-5-personality response variants (not just rendered one)

Each flagged item: confirm with file:line evidence OR reject with rationale.

**Constraints:** READ-ONLY. Doc artifact only. ≤500 LOC. Cite file:line for every claim.

### A2 — Milestone planning through v2.0.0-RC1
**Owns:** `plans/implementation/phase-100/milestone-plan.md` (NEW; ≤400 LOC)

Required reading:
- `plans/implementation/mvp-plan/STATE.md`
- `CLAUDE.md`
- All phase preflights P94-P99 (P94 in-flight; P95-P99 not yet drafted — extrapolate from session-top roadmap if absent)

Required output:
1. **Phase-by-phase plan P94-P104** — each: deliverable / gate / agent count / dependencies
2. **Critical path to v2.0.0-RC1** — which phases gate the RC; which can slip
3. **Parallelism opportunities** — explicit pairs that can ship together
4. **Risk register** — 3-5 highest-risk items with mitigation
5. **Estimated total wall-clock** — at observed velocity (CLAUDE.md velocity rule)

**Constraints:** READ-ONLY. Doc artifact only. ≤400 LOC.

## Hard rules
1. READ-ONLY — no source edits, no test edits, no ADR edits
2. Both A1 + A2 produce doc artifacts only
3. ZERO file conflicts with P94 (atomically disjoint)
4. NO shell commands except grep / cat / wc / head / ls

## Acceptance gates
- log-design.md ≤500 LOC; 6 sections; all 5 owner-flagged items addressed
- milestone-plan.md ≤400 LOC; 5 sections; P94-P104 mapped
- Wave 2 (A3 + A4 + A5) NOT dispatched this sprint — gated on owner review

## Carry-forwards
- Wave 2 dispatch (after owner reviews A1 + A2 docs): SQLite migrations + repos (A3); pipeline wiring + synthetic data (A4); ADR-121 + ConversationLogTab drill-down + tests + EOP (A5)
