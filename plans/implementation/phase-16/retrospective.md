# Phase 16 Retrospective

## Phase 16 — MVP Track CLOSED 2026-04-27

**Focus:** Local SQLite persistence (sql.js + IndexedDB). Replace `localStorage`-backed
`projectStore` with a typed-CRUD repository layer over a single sql.js Database, persisted
to IndexedDB and serialized cross-tab via `navigator.locks` + `BroadcastChannel`. Add
`.heybradley` zip export/import with sanitized DB clone. One-time legacy localStorage
migration. Settings "Clear local data" wipes both stores.

**Sealed at HEAD:** `212185f`
**Baseline (P15 seal):** `47b95f6`
**Persona note:** No persona gate this phase per plan; resumes at P18.

### DoD Result

**25 / 25 PASS.** See `phase-16/session-log.md` for the per-item evidence walk.

### What Shipped

- `src/contexts/persistence/db.ts` — sql.js + IndexedDB bootstrap, lazy wasm load,
  cross-tab Web Lock + BroadcastChannel invalidation, idempotent singleton.
- `src/contexts/persistence/migrations/000-init.sql` — 7 tables (schema_version, projects,
  sessions, chat_messages, listen_transcripts, llm_calls, kv) + 3 indexes.
- `src/contexts/persistence/migrations/index.ts` — forward-only runner; per-migration
  transactions; pre-migration snapshot + restore + clear hooks; idempotent.
- `src/contexts/persistence/migrations/README.md` — forward-only policy documented.
- 5 typed CRUD repositories (`projects`, `sessions`, `messages`, `llmCalls`, `kv`) — all
  use prepared statements with `.free()` and call `persist()` after writes.
- `src/contexts/persistence/autosave.ts` — 800 ms debounced auto-save subscribed to
  `configStore` + `projectStore`, coalescing bursts.
- `src/contexts/persistence/legacyMigration.ts` — one-time scan/copy/remove of legacy
  `hb-project-*`, `hb-project-list`, and `hey-bradley-project` keys; preserves `hb-byok*`
  and `selectedExampleId`; idempotent via `kv.legacy_migration_complete`.
- `src/contexts/persistence/exportImport.ts` — `.heybradley` zip with `project.json` +
  sanitized `db.sqlite`; `SENSITIVE_KV_KEYS = {byok_key, pre_migration_backup}`; import
  rejects bundles whose `schema_version` exceeds `knownMigrationCount()`.
- `src/store/projectStore.ts` swapped to repository calls; Zustand action names preserved.
- `src/main.tsx` awaits `initDB()` before first render; runs legacy migration, autosave
  setup, and last-project hydration in order.
- `src/components/settings/SettingsDrawer.tsx#handleClearLocalData` wipes both the
  `hb-` / `heybradley` / `selectedExampleId` localStorage keys *and* `del('hb-db')` from
  IndexedDB, then reloads.
- `docs/adr/ADR-040-local-sqlite-persistence.md` (115 lines, Accepted).
- `docs/adr/ADR-041-schema-versioning.md` (92 lines, Accepted).
- `tests/persistence.spec.ts` — 3 Playwright cases: write→reload restore, export/import
  round-trip, sensitive-key strip on export.

### Verification

- `npx tsc --noEmit --ignoreDeprecations 5.0` — exit 0, zero output.
- `npm run build` — green in 2.03s; main JS 2,244.08 KB / gzip 588.24 KB; sql-wasm-browser
  chunk 39.62 KB / gzip 14.05 KB; CSS 95.22 KB / gzip 16.11 KB.
- Bundle delta vs P15 baseline (555.68 KB gzip): **+32.56 KB**, well under the 800 KB DoD.
- Targeted Playwright (kitchen-sink + blog-standard + persistence) — **5 passed in 21.7 s**.
- Total `test()` calls across `tests/**/*.spec.ts` — **118** (target ≥ 106).
- `any` / `console.*` policy: 0 violations on the full `47b95f6..HEAD` diff. Only 2 added
  `console.warn` lines, both guarded by `import.meta.env.DEV`.

### Phase 16 Commits (chronological)

| Commit | Wave | Summary |
|---|---|---|
| `a85bef6` | W2 | 5 typed CRUD repositories (projects, sessions, messages, llmCalls, kv) |
| `a1bee02` | W3 | projectStore DB adapter + autosave + cross-tab + legacy migration |
| `0552b2a` | W4 | exportImport zip + persistence.spec.ts + build verify |
| `212185f` | Fix-Pass | reviewer must-fix items (cross-tab BroadcastChannel relifecycle, sanitized export clone, schema-version reject on import, kv pre-migration backup, etc.) |

### What Worked

1. **One singleton, two coordination primitives.** `navigator.locks` for write
   serialization + `BroadcastChannel` for read invalidation kept the per-tab in-memory
   sql.js Database honest without ever blocking the active tab's reads.
2. **Sanitized clone for export.** `cloneDBForExport()` + a temporary `DELETE FROM kv
   WHERE k IN (...)` against the clone meant export sanitization could never leak the
   live DB's BYOK key, even on a buggy code path.
3. **Migration runner owns the version bump.** SQL files are pure schema deltas; the
   runner wraps each in BEGIN/COMMIT and bumps `schema_version` inside the same txn.
   This keeps migrations easy to read and impossible to half-apply.
4. **Pre-migration backup in `kv`.** Snapshotting the entire DB bytes (b64) into
   `kv.pre_migration_backup` before any migration runs gave us a 1-deep recovery hatch
   without standing up a separate IndexedDB store.
5. **Forward-only policy from day one.** No down migrations; the README spells out the
   "write a new migration to undo" rule. ADR-041 codifies it.

### What Didn't Work / What I'd Do Differently

1. **CJS interop for sql.js needed three fallbacks.** `(await import('sql.js')).default`
   shape differs between Vite dev and prod; `db.ts:60-69` handles all three observed
   shapes. Worth documenting in ADR-040.
2. **`runMigrations` runs before the `getDB()` singleton is wired.** Forced
   `snapshotPreMigration` to accept an optional raw `Database` arg. Slightly less clean
   than a pure singleton API; documented inline.
3. **Bundle warning still fires.** vite reports the >500 KB chunk warning. sql.js is
   already split into its own chunk; the rest is app code. Code-splitting the app shell
   is a separate concern (deferred — slated for P20 polish).
4. **Snapshot strategy is bytes-not-deltas.** Doubles DB size on disk during migration.
   Acceptable for MVP; revisit if user DBs grow past a few MB.

### Deferred to Later Phases

- LRU cap on `llm_calls` (ADR-040 mentions; no row-count enforcement yet).
- Redrive the Web Lock fallback through a simple in-memory mutex when `navigator.locks`
  is missing — currently we just DEV-warn and proceed.
- A persisted `db.sqlite` dump in dev tools (debug surface only).

### Hand-off to Phase 17

Phase 16 leaves `kv` and `projects` ready for the LLM provider work that lands in P17:
- `kv` already supports BYOK persistence (gated by user opt-in in P17).
- `llm_calls` table is present and indexed by `(session_id, id)` so the first real
  adapter call from P18 has a place to land its audit row.
- `SENSITIVE_KV_KEYS` already covers `byok_key` for export sanitization.

No code from Phase 16 needs to be revisited as a precondition for P17.

---
