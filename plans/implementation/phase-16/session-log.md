# Phase 16 Session Log

**Phase:** 16 — Local Database (sql.js + IndexedDB)
**Started:** 2026-04-26
**Sealed:** 2026-04-27
**Status:** CLOSED

---

## Metrics Tracking

| Metric | Start | Current | Target |
|--------|-------|---------|--------|
| Tests | 111 | — | 115+ |
| Effects verified | 0 | — | 13 |
| Context → spec verified | 0 | — | 3+ examples |
| Build Plan reproduction | — | — | 88%+ |
| Resources tab items | — | — | 4 sub-tabs verified |

---

## P16 W4 Verification Sweep — 2026-04-27

| Check | Status | Detail |
|---|---|---|
| tsc --noEmit | PASS | exit 0, zero output |
| tsc -b | PASS | composite build clean, exit 0 |
| npm run build | PASS | 2.11s vite build (11s wall incl. prebuild+tsc); main JS 2,141.14 KB / gzip 557.34 KB; sql-wasm-browser chunk 39.62 KB / gzip 14.05 KB; CSS 95.22 KB / gzip 16.11 KB. Only the pre-existing 500 KB chunk warning (no new warnings vs P15). Bundle delta: +1.66 KB gzip vs P15 baseline (555.68 → 557.34). Well under the 800 KB DoD; sql.js is split into a separate browser chunk keeping main near baseline. |
| any/console violations | 0 | 2 console.warn additions in diff are both guarded by `if (import.meta.env.DEV)` blocks (autosave upsertProject + persistence navigator.locks fallback). No bare `: any` or unguarded console calls. |
| wasm in dist | PASS | dist/sqljs/sql-wasm.wasm (645K) copied via prebuild script; also present in public/sqljs/ |
| existing playwright | 2/2 PASS | kitchen-sink + blog-standard green in 11.8s |

---

## Phase 16 — CLOSED 2026-04-27

**Sealed at HEAD:** `212185f` (P16 Fix-Pass: address all reviewer must-fix items)
**Baseline (P15 seal):** `47b95f6`
**DoD Confirmation:** 25 / 25 PASS (see "DoD Confirmation Walk" below).
**Persona gate:** none this phase per plan; persona scoring resumes at P18.

### Phase 16 Commits (chronological)

| Commit | Wave | Summary |
|---|---|---|
| `a85bef6` | W2 | 5 typed CRUD repositories (projects, sessions, messages, llmCalls, kv) |
| `a1bee02` | W3 | projectStore DB adapter + autosave + cross-tab + legacy migration |
| `0552b2a` | W4 | exportImport zip + persistence.spec.ts + build verify |
| `212185f` | Fix-Pass | reviewer must-fix items (cross-tab BroadcastChannel relifecycle, sanitized export clone, schema-version reject on import, kv pre-migration backup, etc.) |

### DoD Confirmation Walk (2026-04-27)

| # | Item | Result | Evidence |
|---:|---|---|---|
| 1 | `db.ts` exports + lazy sql.js | PASS | `src/contexts/persistence/db.ts:52-91` (initDB), `:97-111` (getDB), `:117-135` (persist), `:138-153` (closeDB/closeBroadcastChannel), `:159-168` (cloneDBForExport), `:174-182` (loadDBFromBytes); dynamic `await import('sql.js')` at `:63` |
| 2 | `000-init.sql` 7 tables + 3 indexes | PASS | tables: schema_version, projects, sessions, chat_messages, listen_transcripts, llm_calls, kv. Indexes: idx_chat_session, idx_listen_session, idx_llm_session (lines 54-56) |
| 3 | schema_version seeded to 1 | PASS | `000-init.sql:3` `INSERT INTO schema_version (version) VALUES (1);` |
| 4 | migrations/index.ts idempotent + version bump + snapshot wiring | PASS | `migrations/index.ts:35-91`; UPDATE at `:67-72`; snapshot/clear wired at `:50` and `:84` |
| 5 | migrations/README.md forward-only policy | PASS | `migrations/README.md:7-15` documents forward-only + idempotent runner |
| 6 | 5 repositories with prepared stmts + free + persist | PASS | `repositories/projects.ts`, `sessions.ts`, `messages.ts`, `llmCalls.ts`, `kv.ts` — every write `prepare()` → `try{run()}finally{free()}` and calls `void persist()` |
| 7 | kv.ts snapshot/restore/clear + get/set/delete/has | PASS | `repositories/kv.ts:11-49` (kvGet/kvSet/kvDelete/kvHas), `:84-117` (snapshotPreMigration/restorePreMigration/clearPreMigration) |
| 8 | projectStore swapped to repos, no localStorage | PASS | `src/store/projectStore.ts:4-16` imports repos; only `localStorage` references are doc comments at `:20`. Zustand actions preserved (saveProject, loadProject, deleteProject, listProjects, exportProject, importProject, refreshList) |
| 9 | lib/persistence.ts thin re-export, no localStorage | PASS | `src/lib/persistence.ts:10-22` re-exports from repos; only `localStorage` strings are doc comments at `:3,28` |
| 10 | main.tsx awaits initDB before render + autosave + hydrate | PASS | `src/main.tsx:31-36` `initDB().then(...)` then `migrateLegacyLocalStorage()`, `setupAutosave()`, `await hydrateLastProjectAfterDB()` |
| 11 | autosave.ts 800 ms debounce + dual subscribe + coalesce | PASS | `autosave.ts:13` `DEBOUNCE_MS = 800`; `:41-47` subscribes to configStore + projectStore; `:35-39` coalesces via single `setTimeout` |
| 12 | persist() Web Lock + BroadcastChannel + DEV warn fallback | PASS | `db.ts:117-135` wraps flush in `navigator.locks.request('hb-db-write','exclusive', ...)`; `:124` posts invalidate; `:128-134` DEV-gated one-time warn for older browsers |
| 13 | legacyMigration: scan/copy/remove + preserve byok + idempotent | PASS | `legacyMigration.ts:23-26` preserves `hb-byok*` and `selectedExampleId`; `:39` early-exits on FLAG_KEY; `:85` sets `legacy_migration_complete='1'` |
| 14 | exportImport.ts exports the 5 names + ImportBundleError | PASS | `exportImport.ts:22-27` `ImportBundleError`; `:72-76` `exportProject`; `:78-81` `exportAllProjects`; `:112-156` `importBundle`; `:158-167` `downloadBundle` |
| 15 | SENSITIVE_KV_KEYS strip on export | PASS | `exportImport.ts:20` includes `byok_key` + `pre_migration_backup`; `:48-62` `exportSanitizedDBBytes()` deletes those rows in a clone before export |
| 16 | import path: closeDB → idbSet('hb-db', bytes) → initDB | PASS | `exportImport.ts:136-138` exact sequence |
| 17 | import rejects newer schema | PASS | `exportImport.ts:128-132` reads importedVersion + throws `ImportBundleError('Imported DB schema is newer than this build')` if `importedVersion > knownMigrationCount()` |
| 18 | SettingsDrawer.handleClearLocalData wipes localStorage prefix + IDB | PASS | `src/components/settings/SettingsDrawer.tsx:24-36` removes `hb-`/`heybradley`/`selectedExampleId` keys then `await del('hb-db')` (idb-keyval) |
| 19 | ADR-040 Accepted, ≥80 lines | PASS | `docs/adr/ADR-040-local-sqlite-persistence.md:3` "Status: Accepted"; 115 lines |
| 20 | ADR-041 Accepted, ≥80 lines | PASS | `docs/adr/ADR-041-schema-versioning.md:3` "Status: Accepted"; 92 lines |
| 21 | tsc --noEmit clean | PASS | `npx tsc --noEmit --ignoreDeprecations 5.0` → exit 0, zero stdout/stderr |
| 22 | npm run build succeeds | PASS | vite build 2.03s; main JS gzip 588.24 kB; sql-wasm-browser chunk gzip 14.05 kB; CSS gzip 16.11 kB |
| 23 | Bundle delta ≤ 800 KB gzip vs P15 (555.68) | PASS | 588.24 − 555.68 = +32.56 KB gzip (well under 800 KB cap) |
| 24 | Targeted Playwright (kitchen + blog + persistence) | PASS | 5 passed (21.7s) on chromium — line reporter |
| 25 | Test count ≥ 106 | PASS | `find tests -name '*.spec.ts' -exec grep -c 'test(' {} \; \| awk '{s+=$1} END {print s}'` → 118 (well above 106 target) |

### `any` / `console.*` audit on full P16 chain (47b95f6..HEAD)

`grep -E '^\\+[^+]' /tmp/p16.diff | grep -E ':\\s*any\\b|console\\.(log\\|error\\|warn)' | grep -v 'import.meta.env.DEV'` returns 2 lines:
- `autosave.ts:30` `console.warn('[autosave] upsertProject failed', err);` — wrapped at line 28 in `if (import.meta.env.DEV)`.
- `db.ts:131` `console.warn('[persistence] navigator.locks unavailable; cross-tab writes unguarded');` — wrapped at line 129 in `if (import.meta.env.DEV && !warnedNoLocks)`.

Both guarded by `import.meta.env.DEV`; no policy violation.

**Sealed:** 2026-04-27 (UTC) at HEAD `212185f`. Ready for P17.
