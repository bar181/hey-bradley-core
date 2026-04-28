# ADR-040: Local SQLite Persistence — sql.js + IndexedDB

**Status:** Accepted
**Date:** 2026-04-27
**Deciders:** Bradley Ross
**Phase:** 16

---

## Context

Hey Bradley is a frontend-only application. The MVP charter (ADR-029) forbids a backend, and the LLM stage starting at Phase 17 must run from the browser using BYOK keys. Persistence today is a thin `localStorage`-backed wrapper inside `projectStore`. That choice is no longer load-bearing for the work coming in Phases 16–20.

Three forces push past `localStorage`:

1. **Capacity** — the per-origin `localStorage` cap is 5–10 MB depending on browser. Chat history plus listen transcripts plus the LLM audit log will exceed that ceiling within a single sustained session, especially once Phase 18 begins recording every JSON-Patch round-trip.
2. **Relational shape** — `projects`, `sessions`, `chat_messages`, `listen_transcripts`, and `llm_calls` form a small but real relational graph. Reconstructing joins, indexed scans, and FK-cascade deletes in JS over a flat KV store is the kind of code we keep paying interest on.
3. **Audit log requirement** — Phase 17 introduces `llm_calls` (provider, model, tokens, cost, status, patch payload). Reviewing cost incidents and validation failures needs queryable history, not a JSON blob we re-parse on every read.

Going server-side would solve all three but violates the MVP constraint. The flywheel project (`.swarm/memory.db`) already uses `sql.js`, so the team has shipped the pattern before. The persistence story for Phase 16 is therefore "stay frontend-only, but pivot to a real relational store inside the browser."

This ADR records the choice of that store. ADR-041 records the migration policy that goes with it.

---

## Decision

Adopt **`sql.js`** (SQLite compiled to WebAssembly) as the in-browser relational store, persisted to **IndexedDB** under a single key `hb-db` via `idb-keyval`. The `Persistence` bounded context owns the database, schema, migrations, and import/export.

### 1. Storage shape

- One IndexedDB database, one object store, one key (`hb-db`) holding the serialized SQLite file as a `Uint8Array`.
- `idb-keyval` provides a thin promise-based wrapper; no Dexie, no hand-rolled IDB transactions in app code.
- Writes are debounced (800 ms) and flush via `db.export()` → `idbSet('hb-db', buf)`.

### 2. Loading

- The `sql.js` wasm module is **lazy-loaded on first persistence call**. Boot does not pay the cost; the app only initializes the DB when the user takes a persistence-affecting action (load project, append chat, finalize transcript) or when a previously saved project must be hydrated.
- Vite code-splits `sql.js` into its own chunk so the main bundle stays unaffected. The wasm asset is served from `/sqljs/` via `locateFile` so cache-busting and CDN-fronting remain straightforward.

### 3. Module layout

| Path | Role |
|---|---|
| `src/contexts/persistence/db.ts` | sql.js bootstrap, IndexedDB read/write, `initDB` / `persist` |
| `src/contexts/persistence/migrations/` | Forward-only SQL migrations (per ADR-041) |
| `src/contexts/persistence/repositories/` | Typed CRUD per table (`projects`, `sessions`, `messages`, `llmCalls`, `kv`) |
| `src/contexts/persistence/exportImport.ts` | `.heybradley` zip pack/unpack |

The Zustand contract in `src/store/projectStore.ts` is preserved; consumers do not learn that the backing store changed.

### 4. Export and import

A `.heybradley` file is a zip containing `project.json` (the live MasterConfig) and `db.sqlite` (the raw `db.export()` bytes). Both halves round-trip together: importing replaces the IndexedDB blob and re-hydrates the config store. The artifact is inspectable by any standard SQLite tool.

### 5. Cross-tab safety

Concurrent tabs are a real risk because two tabs writing to the same IndexedDB key clobber each other. The Wave 3 plan introduces Web Locks (`navigator.locks.request('hb-db', ...)`) around every `persist()` call, plus a `BroadcastChannel('hb-db')` notification so reader tabs reload before the next write. This ADR accepts the constraint; the implementation lands in the Wave-3 task list of Phase 16.

---

## Alternatives considered

- **`Dexie` over IndexedDB only.** Rejected. Dexie is a clean IDB wrapper but offers no SQL, no joins, no `CHECK` constraints, no parameterized queries. The audit log and chat history queries are exactly the workload SQL was designed for. Reimplementing query planning in JS for a single-tenant local DB is the wrong trade.
- **`wa-sqlite`.** Rejected. More features (VFS pluggability, OPFS support) at the cost of a larger surface and slower init. Hey Bradley does not need OPFS or custom VFS for MVP; `sql.js` is the simpler tool.
- **Stay on `localStorage`.** Rejected. Capacity ceiling, no relational primitives, synchronous API blocks the main thread, no transactional semantics. Every objection above remains.
- **Server database (Supabase, Postgres, etc.).** Rejected. Violates the frontend-only MVP charter (ADR-029). Re-evaluated post-MVP if cloud sync becomes a goal.
- **A custom JSON-on-IndexedDB blob.** Rejected. We would re-derive indexes, joins, and migration tooling in app code. That is the work `sql.js` exists to absorb.

---

## Consequences

### Positive

- **Single source of truth for relational state.** Projects, sessions, chat history, listen transcripts, and the LLM audit log live in one queryable store with FK-cascade deletes.
- **Inspectable export.** Any developer can open a `.heybradley` archive in `sqlite3` or DB Browser for SQLite. Bug reports become reproducible.
- **Frontend-only honored.** No backend, no account, no network dependency. Aligns with ADR-029.
- **Capacity headroom.** IndexedDB quotas are large (hundreds of MB on most browsers); the LRU cap on `chat_messages` and `listen_transcripts` (5 000 rows each) is the policy backstop, not the storage backstop.
- **Familiar pattern.** `sql.js` is already in use in the flywheel project; idioms transfer.

### Negative

- **~700 KB wasm chunk.** Lazy-loaded and code-split, so it does not affect first paint, but a user who triggers persistence pays a one-time download. Acceptable for the relational primitives gained.
- **No multi-writer guarantees out of the box.** Concurrent tabs require the Web Locks layer landing in Wave 3. Until then, the failure mode is "last write wins on `persist()`," which can drop a chat message at the worst moment.
- **Wasm fetch path must be correct in production.** A 404 on the wasm asset bricks persistence. Mitigated by build-time asset checks and the `locateFile` indirection.
- **Browsers without IndexedDB (very rare).** Fall back to in-memory `Database`; warn the user that data will not persist. The fallback path is an explicit feature, not a silent degradation.

### Risks

- **Schema drift across deploys.** Mitigated by ADR-041 (forward-only migrations with a `schema_version` row).
- **Loss of legacy `localStorage` data.** Mitigated by a one-time read-and-clear migration that copies legacy keys into the DB on first boot of the new code path.
- **IndexedDB quota exceeded.** Mitigated by the LRU caps above and a "Clear local data" affordance under Settings.

---

## Implementation pointer

- `src/contexts/persistence/db.ts` — sql.js bootstrap and IndexedDB adapter (lazy `initDB`, debounced `persist`)
- `src/contexts/persistence/migrations/000-init.sql` — initial schema; sets `schema_version = 1` (per ADR-041)
- `src/contexts/persistence/migrations/index.ts` — migration runner
- `src/store/projectStore.ts` — Zustand store swapped to DB adapter; UI unaffected
- `src/main.tsx` — `await persistence.init()` before render
- `tests/persistence.spec.ts` — Playwright round-trip: write → reload → assert restored

Phase 16 plan: `plans/implementation/mvp-plan/02-phase-16-local-db.md`.

---

## Related ADRs

- ADR-001: JSON Single Source — the MasterConfig serialized into `projects.config_json` is still the source of truth for site state
- ADR-029: Pre-LLM MVP Architecture — frontend-only constraint that scopes this decision
- ADR-031: JSON Data Architecture — schema discipline preserved across export/import
- ADR-041: Schema Versioning — migration policy for the database introduced here

---

## Status as of P20

- 30-day llm_logs retention LIVE in `db.ts:initDB` (auto-prune at session start).
- Cross-tab Web Locks (`hb-db-write`) + BroadcastChannel (`hb-db`) confirmed working.
- `.heybradley` zip export with `SENSITIVE_TABLE_OPS` registry strips `byok_*` kv prefix + `llm_logs` + `example_prompt_runs` (P18b sealed).
- Schema versioning (ADR-041) reached version 3 (P18b llm_logs migration).
