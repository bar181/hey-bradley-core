# ADR-041: Schema Versioning — Forward-Only SQL Migrations

**Status:** Accepted
**Date:** 2026-04-27
**Deciders:** Bradley Ross + claude-flow swarm
**Phase:** 16

---

## Context

ADR-040 introduces a local SQLite database (`sql.js` over IndexedDB) as the persistence store for Hey Bradley. A real database needs a real migration policy: tables will gain columns, indexes, and `CHECK` constraints across Phases 16–20 as the LLM audit log, BYOK key storage, and listen transcripts evolve. Without a policy, schema drift between deployed builds and locally-stored databases becomes a silent corruption surface.

The store is single-tenant (one user, one browser, one database). It is not a multi-author production database. The migration system therefore does not need the full apparatus of an ORM-driven up/down generator. It needs a small, auditable, forward-only path that runs on boot and is impossible to misuse.

---

## Decision

Adopt **forward-only numbered SQL migrations** under `src/contexts/persistence/migrations/`. Each migration is a `.sql` file named `NNN-slug.sql` (e.g. `000-init.sql`, `001-add-llm-cost-cap.sql`). The database holds a `schema_version` row that names the highest migration applied. On every boot, the runner applies every migration whose number exceeds the current `schema_version`, in order, in a transaction, and writes the new version when finished.

### 1. File naming and ordering

- Migrations are named `NNN-slug.sql` where `NNN` is a zero-padded integer.
- The number is the version. `000-init.sql` establishes the baseline and writes `schema_version = 1` (the version becomes 1 once `000` is applied; the table is initialized empty before that).
- Names are immutable once merged. Reordering is a new migration, not a rename.

### 2. Runner contract

- `runMigrations(db)` reads `SELECT version FROM schema_version`. If the table does not exist, current is treated as `0`.
- The runner enumerates migration files at build time (Vite glob import), filters those with `number > current`, sorts ascending, and applies each in a single SQL transaction.
- After each migration commits, the runner updates `schema_version` to that file's number.
- A failure inside a migration aborts the transaction and rethrows; the DB remains at the prior version. The user sees a clear error and the snapshot (below) is available for recovery.

### 3. No down migrations

There are no `down`, `revert`, or paired `up/down` files. A mistaken migration is corrected by adding a new migration that fixes it. This rule is non-negotiable: it eliminates an entire class of "did the down run cleanly?" questions and keeps the audit trail linear.

### 4. Pre-migration snapshot

Before applying any pending migrations, the runner serializes the current DB (`db.export()`) and stores it under `kv.pre_migration_backup` as a single row, replacing any prior snapshot. The depth is exactly **1**: only the most recent pre-migration state is retained. If a migration succeeds, the snapshot is left in place until the next migration window overwrites it.

Rollback is therefore a **write**, not a destruction: restoring the snapshot replaces the live DB with the saved bytes. No file is deleted; no history is lost.

### 5. Initial schema

`000-init.sql` creates `schema_version`, `projects`, `sessions`, `chat_messages`, `listen_transcripts`, `llm_calls`, `kv`, and the three session-scoped indexes listed in the Phase 16 plan. After it runs, `schema_version = 1`.

---

## Alternatives considered

- **Up/down migration pairs.** Rejected. Down migrations are the source of most migration bugs in single-tenant apps: they are written less carefully than ups, exercised less often, and fail at the worst time. Forward-only with a one-deep snapshot covers the recovery case without the maintenance burden.
- **Generated migrations from a schema DSL (e.g. Drizzle, Prisma).** Rejected. KISS. The diff between hand-written SQL and generated SQL is small for a database this size, and the generated path imports a meaningful dependency graph plus its own migration metadata. Hand-written `.sql` files are the smallest thing that works.
- **Idempotent `CREATE TABLE IF NOT EXISTS` blocks at boot.** Rejected. Works for the initial schema but does not handle column additions, index changes, or data backfills. Drifts silently the first time a real change ships.
- **Version stored in `localStorage` instead of the DB.** Rejected. The version belongs with the data it describes; cross-storage divergence (DB restored from export but `localStorage` cleared) would lie about the schema state.

---

## Consequences

### Positive

- **Linear, auditable history.** Every migration is a numbered file checked into git. The DB tells you exactly which ones it has applied.
- **Mistakes are recoverable.** A bad migration is corrected by a new migration; the prior state is on disk in `kv.pre_migration_backup`.
- **No tooling to learn.** Reading and reviewing a migration is reading SQL.
- **Cheap to run.** A boot that finds no pending migrations is a single `SELECT` on `schema_version`.

### Negative

- **No automatic rollback.** A user must explicitly invoke restore from the snapshot. Acceptable: silent rollback is the failure mode this policy is designed to avoid.
- **Snapshot doubles peak memory once per migration window.** One copy of the DB lives in `kv` plus the live DB. At MVP sizes (tens of MB ceiling) this is well within IndexedDB quota.

### Risks

- **A migration that needs data transformation across many rows is still hand-written SQL.** Mitigated by keeping migrations small and frequent rather than large and rare.
- **Forgetting to bump `schema_version` inside a migration.** Mitigated: the runner writes the version after the SQL transaction commits, not the SQL itself. The author cannot forget.

---

## Implementation pointer

- `src/contexts/persistence/migrations/index.ts` — runner; reads current version, applies pending files in order, writes snapshot before, updates `schema_version` after
- `src/contexts/persistence/migrations/000-init.sql` — initial schema; sets `schema_version = 1`
- `src/contexts/persistence/db.ts` — calls `runMigrations(db)` from `initDB`
- Phase 16 plan: `plans/implementation/mvp-plan/02-phase-16-local-db.md`

---

## Related ADRs

- ADR-040: Local SQLite Persistence — establishes the database this policy governs
