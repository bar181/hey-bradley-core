# Persistence Verification — End-to-End Trace

**Branch:** eval/persistence-and-competitors · **Date:** 2026-05-04
**Scope:** Verify saved-site persistence works end-to-end at the user level (Q1-Q7).
**Method:** Source-only trace; zero source mods.

## Summary

**Verdict: PARTIAL.**

The persistence *infrastructure* is real and well-engineered: sql.js + IndexedDB
bootstrap, Web-Locks-guarded cross-tab writes, BroadcastChannel invalidation,
debounced log flush, pagehide listener, ADR-126 retention sweep, BYOK redaction
at every write boundary. **What is missing is the consumer wire.** The
auto-save loop is a no-op for new users because no UI surface ever calls
`saveProject()` to attach a name → activeProject. A user who picks a theme on
Onboarding and starts editing has their config written to the *legacy localStorage
singleton* (`hey-bradley-project`), NOT to the projects table. They will see
"Unsaved" forever and reopening the app a week later will surface zero recent
projects under the new repo (only the legacy singleton, recovered on the *next*
init via `migrateLegacyLocalStorage`). Once a saved project exists (e.g., from
the legacy migration path or a hypothetical future Save dialog), every other
piece works as designed.

## Q1-Q7 with file:line evidence

### Q1 — When does a project get persisted?

| Path | Evidence |
| --- | --- |
| `setupAutosave()` registers Zustand subs at boot | `src/contexts/persistence/autosave.ts:41-47` (subs to configStore + projectStore) and `src/main.tsx:56` |
| Debounce window = **800 ms** after the last config mutation | `src/contexts/persistence/autosave.ts:13` (`DEBOUNCE_MS = 800`) |
| Flush gates on `activeProject != null` | `src/contexts/persistence/autosave.ts:20-22` (`if (!activeProject) return`) |
| Writes via `repoUpsert` → `INSERT OR REPLACE INTO projects ...` then `void persist()` | `src/contexts/persistence/repositories/projects.ts:48-61` |
| chatPipeline writes `edit_history` row per applyPatches (separate from projects table) | `src/contexts/intelligence/chatPipeline.ts:289` (writeEditHistory) |
| `saveProject()` IS NEVER called from any UI surface | `grep saveProject src/components/ src/pages/` returns zero hits beyond the store definition itself |

**HONEST GAP G1:** A fresh Onboarding flow writes to legacy localStorage
(`STORAGE_KEY = 'hey-bradley-project'`) at `src/pages/Onboarding.tsx:504, 511, 538`,
NOT to `projects` table. `activeProject` stays `null` so autosave is a no-op for
new users. Existing localStorage projects are migrated on next boot
(`migrateLegacyLocalStorage`) but only ONCE, and the legacy singleton ends up
slugged `legacy-default` (`src/contexts/persistence/legacyMigration.ts:78`).

### Q2 — pagehide flush — does it actually run?

| Path | Evidence |
| --- | --- |
| Listener registered inside `initDB()` once-only flag | `src/contexts/persistence/db.ts:34` (`pageHideRegistered`) and `src/contexts/persistence/db.ts:126-133` |
| Flushes via `void persist().catch(...)` — full sql.js → IDB write | `src/contexts/persistence/db.ts:130` |
| `persist()` writes complete DB BLOB so it covers projects + log_events + edit_history | `src/contexts/persistence/db.ts:168-186` |
| Independent `beforeunload` ends the active session row | `src/main.tsx:62-64` |

**Persists EVERYTHING in the sql.js binary, not just logs.** Idempotent across
re-init because of the `pageHideRegistered` flag.

**HONEST GAP G2:** **No `beforeunload` fallback for `persist()`.** Mobile Safari
fires `pagehide` reliably, but Chrome on Android sometimes does not (back-forward
cache eviction). Only the *intelligence-store session-end* runs on `beforeunload`
— the DB BLOB does not. If the 500 ms log-flush debounce hasn't fired AND
pagehide doesn't fire, those last-second writes evaporate.

**HONEST GAP G3:** The pagehide handler is registered with `{ capture: true }`
but does not call `event.preventDefault()` or use `navigator.sendBeacon` —
`persist()` is async and `await idbSet(...)` may not complete before the page
dies. IndexedDB writes ARE allowed during `pagehide` per spec but are NOT
guaranteed to flush; this is best-effort.

### Q3 — Cross-session re-hydrate — what does the user see?

| Path | Evidence |
| --- | --- |
| `hydrateLastProjectAfterDB()` runs once after `initDB()` | `src/main.tsx:57` |
| Reads `kv['lastProjectId']`; if present, loads + validates via Zod | `src/store/projectStore.ts:116-129` |
| Bad rows fall through silently (no toast) | `src/store/projectStore.ts:126-128` (catch block) |
| Welcome (`/`) does NOT show a recent-projects list — purely marketing | `src/pages/Welcome.tsx` (no `useProjectStore` import) |
| Onboarding (`/new-project`) shows ProjectCard list when `projects.length > 0` | `src/pages/Onboarding.tsx:417-454, 764` |
| Default tab when 0 saved projects = `'examples'` (no empty-state coaching) | `src/pages/Onboarding.tsx:454` |

**HONEST GAP G4:** Welcome is the front door. It hides the saved-projects list
entirely. A returning user MUST navigate to `/new-project` to see their
projects — the route is named "new project" and reads as "start over." That is
hostile UX for the cross-session re-hydrate scenario.

### Q4 — Cross-tab integrity

| Path | Evidence |
| --- | --- |
| Web Lock `'hb-db-write'` (exclusive mode) wraps every `persist()` flush | `src/contexts/persistence/db.ts:177-178, 22` |
| BroadcastChannel `'hb-db'` posts `'hb-db-invalidate'` after a successful flush | `src/contexts/persistence/db.ts:175, 23-24` |
| Peer marks singleton stale; next `getDB()` re-hydrates async | `src/contexts/persistence/db.ts:154-160` |
| Browsers without `navigator.locks` fall through with a one-time DEV warn | `src/contexts/persistence/db.ts:177-184` |
| Stale-handle resolution swaps `dbInstance = null` → `void initDB().then(...)` | `src/contexts/persistence/db.ts:156-159` |

**Cross-tab is genuinely wired.** Both pieces work. Last-writer-wins semantics
across tabs (the wasm DB is per-tab/in-memory; the IDB blob is shared).

**HONEST GAP G5:** Two tabs editing the **same** activeProject can stomp each
other in the 800 ms debounce window. There is no project-level optimistic-lock
or merge — Tab A writes, fires invalidate, Tab B's next save flushes its own
in-memory state which has not yet been re-hydrated → Tab A's edits are gone.
The 800 ms debounce makes the race window non-trivial. Acceptable single-user
trade-off, but it is not "two tabs are safe."

### Q5 — Retention prune — what does it touch?

| Path | Evidence |
| --- | --- |
| Init-time prune fires on every `initDB()` resolve | `src/contexts/persistence/db.ts:114-120` |
| `pruneOldLogs(db, 30)` → DELETE FROM log_events WHERE created_at < cutoff | `src/contexts/persistence/repositories/comprehensiveLogs.ts:340-351` |
| `pruneOldEditHistory(db, 90)` → DELETE FROM edit_history | `src/contexts/persistence/repositories/comprehensiveLogs.ts:354-365` |
| Separate llm_logs prune (30d default + 10K LRU bound) | `src/contexts/persistence/db.ts:99-105` |
| `projects` table is **NOT** in any DELETE — only listed/upserted/deleted via UI | `grep "DELETE FROM projects" src/` → only `repoDelete` (explicit user action) |

**Projects are EXEMPT from automatic retention. CONFIRMED.** Only direct user
deletion via `useProjectStore.deleteProject()` removes a row from `projects`.

### Q6 — BYOK boundary

| Path | Evidence |
| --- | --- |
| BYOK is held in `inMemoryKey` / `inMemoryProvider` module-locals + opt-in `kv` | `src/contexts/intelligence/llm/keys.ts:14-15, 36-43` |
| When user picks "Remember" → keys land in `kv['byok_key']` + `kv['byok_provider']` (sql.js, NOT localStorage) | `src/contexts/intelligence/llm/keys.ts:36-38` |
| Export sanitization: `DELETE FROM kv WHERE k LIKE 'byok_%' OR ...` before zip | `src/contexts/persistence/exportImport.ts:99-101` |
| `redactKeyShapes()` strips `sk-ant-`, `sk-proj-`, `sk-or-`, `sk-`, `AIza`, `Bearer` | `src/contexts/intelligence/llm/keys.ts:94-106` |
| comprehensiveLogs writers call `safeStringifyRedacted` on every event_data + snapshot + user_prompt | `src/contexts/persistence/repositories/comprehensiveLogs.ts:179-184, 249, 320-325` |
| writeErrorEvent redacts both `message` AND `stack` | `src/contexts/persistence/repositories/comprehensiveLogs.ts:294-296` |

**Projects table never holds keys.** `config_json` is a serialized MasterConfig
(theme, palette, sections, content). The MasterConfig schema does not include
any field that could carry a BYOK string. Log_events redacts at the boundary.

**HONEST GAP G6:** "Remember" *does* persist BYOK to sql.js → IndexedDB, which
the user may not realize is durable across sessions. The opt-in is honest
(checkbox in BYOK UI) but the storage is unencrypted (raw text in the kv
table). A more conservative default would be `sessionStorage` for "Remember
this session" semantics. ADR-043 explicitly accepts this trade-off
(`docs/adr/ADR-043` §Trust Boundary).

### Q7 — Storage limits

| Path | Evidence |
| --- | --- |
| No `navigator.storage.estimate()` calls anywhere in `src/` | `grep -r navigator.storage src/` returns 0 hits |
| No `QuotaExceededError` catch handler | `grep -r QuotaExceededError src/` returns 0 hits |
| `idbSet(IDB_KEY, bytes)` is a single oversized BLOB write — failures bubble as raw idb-keyval errors | `src/contexts/persistence/db.ts:174` |
| `persist()` failures only swallow at the chat-pipeline layer (`writeLogEvent` catch) | `src/contexts/persistence/repositories/comprehensiveLogs.ts:204-206` (warn-and-swallow) |
| `PersistenceErrorBanner` only fires if `initDB()` itself rejects, NOT on `persist()` quota fails | `src/main.tsx:97-101` |

**HONEST GAP G7:** **No quota awareness at all.** When IndexedDB hits ~50% of
free disk on Chrome, the next `idbSet` will reject with `QuotaExceededError`.
The current path: `persist()` rejects → `void persist().catch(...)` swallows
silently in chatPipeline / pagehide. The user sees "Saved" indicator flip
green even though the write failed. A user with a large DB (heavy use over
months) will eventually lose silently.

## Honest gaps named

1. **G1 — `saveProject()` is not wired into the new-project flow.** Onboarding
   writes to legacy localStorage + sets `isDirty: true` but never names/saves
   the project to the projects table. `activeProject` stays null → autosave is
   a no-op. Single-loop fix: name the project at handleStartNew /
   handleExampleSelect / handleThemeSelect time.
   `src/pages/Onboarding.tsx:500-540`.
2. **G2 — No `beforeunload` fallback for full DB persist.** The 500 ms log-flush
   debounce + best-effort pagehide leaves a window where last writes evaporate
   on Chrome Android BFCache eviction. `src/main.tsx:62-64` ends the session
   but does not call `void persist()`.
3. **G3 — pagehide handler does not use sendBeacon-or-equivalent.** Best-effort
   `void persist()` is documented but not guaranteed.
   `src/contexts/persistence/db.ts:128-132`.
4. **G4 — Welcome page hides recent projects.** Returning users must navigate
   to `/new-project` to see their work. `src/pages/Welcome.tsx` has no
   `useProjectStore` import. Hostile UX.
5. **G5 — Two-tab same-project edit race.** No row-level optimistic lock; 800
   ms debounce widens the loss window. Acceptable single-user trade-off,
   misleading to call this "cross-tab safe" without the caveat.
6. **G6 — BYOK "Remember" persists to durable IDB unencrypted.** ADR-043
   accepts this. Documented but worth flagging.
7. **G7 — Zero quota awareness.** No `navigator.storage.estimate()`, no
   `QuotaExceededError` handler. Silent loss after long usage.
8. **G8 — `markSaved()` is never invoked.** TopBar shows "Unsaved" forever
   because no autosave callback flips `isDirty: false`. Cosmetic but it tells
   users the persistence is broken even when it works.
   `src/components/shell/TopBar.tsx:167-170` ; `src/store/configStore.ts:491`.

## Recommendations

1. **Wire `saveProject()` into Onboarding entry points (G1, ~30 LOC).** At
   handleThemeSelect / handleExampleSelect / handleStartNew, replace the
   `localStorage.setItem(STORAGE_KEY, ...)` with
   `useProjectStore.getState().saveProject(name, config)` so `activeProject` is
   set and autosave begins working immediately. This is the single load-bearing
   fix — the entire infrastructure is downstream-ready, just unwired upstream.
2. **Add `void persist()` to the `beforeunload` listener and add a
   `markSaved()` callback inside `setupAutosave().flush` (G2 + G8, ~10 LOC).**
   Fixes the BFCache write loss AND the "Unsaved forever" indicator in one go.
3. **Add a `navigator.storage.estimate()` check + soft warning at >80% (G7,
   ~25 LOC).** Render in the existing PersistenceErrorBanner pattern. Failure
   to write should also surface via a banner, not silent swallow.
