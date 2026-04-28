# ADR-040b: Migration 003 FK on `llm_logs.session_id` — Formal Deferral

**Status:** Accepted (deferral with rationale)
**Date:** 2026-04-27 (P28 Sprint C P3 carryforward closure)
**Deciders:** Bradley Ross
**Phase:** P28
**Amends:** ADR-040 (Local SQLite Persistence) + ADR-047 (LLM Logging)

> **Per CLAUDE.md numbering convention:** ADR-054 = DDD; new ADRs continue 049+. This is a **lettered amendment** (040b) rather than a fresh number, signalling it's a follow-on to ADR-040 not a brand-new decision.

## Context

Carryforward C16 (originally surfaced in P19 deep-dive, deferred through P20-P27): add a foreign-key constraint on `llm_logs.session_id` referencing `sessions.id` (matching the pre-existing FK on `llm_calls.session_id`).

Five phases of carryforward review have ranked C16 LOW priority. P27 R4 brutal-review still flagged it as outstanding (alongside C04/C15/C17). P28 must either ship the migration OR formally document the deferral with rationale.

## Decision: **DEFER** (long-term; revisit at SQLite 3.x backend swap)

### Why defer

1. **sql.js (compiled SQLite via Emscripten) does not enforce FKs without `PRAGMA foreign_keys = ON`** at every connection. Adding the PRAGMA is not strictly hard but requires touching the connection bootstrap (`db.ts:initDB`) AND every test rig (`tests/persistence.spec.ts` etc).

2. **Adding a FK to an existing table requires DDL recreation**: SQLite's `ALTER TABLE` does NOT support adding FK constraints. The migration would need to:
   - `CREATE TABLE llm_logs_new (...same columns... + FK)`
   - `INSERT INTO llm_logs_new SELECT * FROM llm_logs`
   - `DROP TABLE llm_logs`
   - `ALTER TABLE llm_logs_new RENAME TO llm_logs`
   - Plus re-create all 4 existing indices on the new table

3. **Application-layer integrity already satisfied**:
   - `auditedComplete.ts:ensureSession()` guarantees `session_id` is valid + present BEFORE any `recordLLMLog` call (FIX 5, P18b)
   - `endActiveSession()` is wired to project-switch + window beforeunload — orphan rows can only arise via DB corruption or external mutation (both already-out-of-scope per ADR-040 same-origin trust model)
   - `llm_logs` is forensic-only (NOT load-bearing for cap math; that's `llm_calls` which DOES have the FK)

4. **Cost vs benefit**: ~30 LOC migration + risk of test rig changes + risk of breaking existing data → catches a class of bug (orphan rows) that hasn't been observed in 30+ days of llm_logs usage and is bounded by application-layer invariants.

5. **30-day retention auto-prune** (`pruneOldLLMLogs` at every `initDB`) caps any stray-row growth automatically.

### When to revisit

Re-evaluate C16 at:
- **Backend swap** to native SQLite (post-MVP; e.g., Tauri / Electron build) — FK enforcement is free
- **First observed orphan row** in `llm_logs` via `SELECT count(*) FROM llm_logs WHERE session_id NOT IN (SELECT id FROM sessions)` — would indicate the application-layer invariant was violated
- **Open-core RC** (Sprint K) — if a downstream consumer of `.heybradley` exports needs referential integrity guarantees

## Consequences

- (+) Avoids ~30 LOC migration + test-rig churn during Sprint D opener
- (+) Closes carryforward debt list at end of Sprint C — Sprint D opens clean
- (+) Documented decision survives session-resume (cross-session anchor)
- (-) Future contributors may re-flag the absence as "missing FK"; this ADR pre-empts the question
- (-) `llm_logs.session_id` lacks the same hard-guarantee as `llm_calls.session_id`; mitigated by application-layer invariant

## Cross-references

- ADR-040 (Local SQLite Persistence) — base decision being amended
- ADR-047 (LLM Logging & Observability) — `llm_logs` schema definition
- `phase-19/deep-dive/05-fix-pass-plan.md` §5 C16 — original carryforward source
- `phase-22/A6-cleanup-plan.md` §1.4 — earlier deferral
- `src/contexts/persistence/repositories/llmLogs.ts` — runtime layer
- `src/contexts/persistence/migrations/000-init.sql` — sister `llm_calls` FK
