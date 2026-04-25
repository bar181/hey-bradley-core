# Phase 16 — Local Database (sql.js + IndexedDB)

> **Stage:** B — Foundation for LLM
> **Estimated effort:** 3–4 days
> **Prerequisite:** Phase 15 closed.
> **Successor:** Phase 17 — LLM Provider Abstraction.

---

## North Star

> **A user closes the tab and reopens it tomorrow — their projects, chat history, and listen transcripts are all there. No backend, no account, no internet required.**

---

## 1. Specification (S)

### 1.1 What changes

1. Introduce a **browser-side SQLite** via `sql.js`, persisted to **IndexedDB**.
2. Replace `localStorage`-backed `projectStore` with a thin DB-backed adapter that exposes the same Zustand contract (no UI changes).
3. Add tables: `projects`, `sessions`, `chat_messages`, `listen_transcripts`, `llm_calls`, `kv` (for misc settings, including BYOK key entry stored *only* if user opts-in via a "remember key" checkbox in Phase 17).
4. Add export/import: a `.heybradley` zip = `{ project.json, db-snapshot.sqlite }`.
5. Schema versioning via a `schema_version` row; migration runner for forward-only migrations.

### 1.2 What does **not** change

- Zustand store contract (consumers unaware).
- Any UI other than: a tiny "Saved" indicator and a "Clear local data" button under Settings.
- The site config JSON shape.

### 1.3 Novice impact

- Closing the tab no longer destroys work.
- Reload restores last opened project automatically.
- No new buttons in DRAFT.

---

## 2. Pseudocode (P)

```
on app boot:
  await DB.open()         // dynamic-import sql.js wasm; load from IndexedDB if present
  if DB is empty:
    DB.migrate()          // run all migrations up to current
  state.lastProjectId = DB.kv.get("lastProjectId")
  if state.lastProjectId:
    project = DB.projects.findById(state.lastProjectId)
    configStore.hydrateFromJSON(project.config)

on configStore change (debounced 800 ms):
  DB.projects.upsert({ id: current.id, config: current.toJSON(), updated_at: now() })
  DB.kv.set("lastProjectId", current.id)

on chat message append:
  DB.chat_messages.insert({ session_id, role, text, created_at })

on listen transcript final:
  DB.listen_transcripts.insert({ session_id, text, created_at })

on export:
  blob = zip({ "project.json": current, "db.sqlite": DB.export() })
  download(blob, `${project.name}.heybradley`)

on import(file):
  { project, dbSnapshot } = unzip(file)
  DB.replaceFrom(dbSnapshot)
  configStore.hydrateFromJSON(project)
```

---

## 3. Architecture (A)

### 3.1 DDD context

`Persistence` becomes a first-class bounded context. It owns the DB, the schema, the migrations, the import/export.

### 3.2 Files touched / created

| Action | Path | Purpose |
|---|---|---|
| CREATE | `src/contexts/persistence/db.ts` | sql.js bootstrap + IndexedDB adapter |
| CREATE | `src/contexts/persistence/migrations/000-init.sql` | Initial schema |
| CREATE | `src/contexts/persistence/migrations/index.ts` | Migration runner |
| CREATE | `src/contexts/persistence/repositories/projects.ts` | CRUD for projects |
| CREATE | `src/contexts/persistence/repositories/sessions.ts` | CRUD for sessions |
| CREATE | `src/contexts/persistence/repositories/messages.ts` | CRUD for chat + listen |
| CREATE | `src/contexts/persistence/repositories/llmCalls.ts` | Audit log of LLM calls |
| CREATE | `src/contexts/persistence/repositories/kv.ts` | Misc key/value |
| CREATE | `src/contexts/persistence/exportImport.ts` | `.heybradley` zip pack/unpack |
| EDIT   | `src/store/projectStore.ts` | Swap localStorage for DB adapter |
| EDIT   | `src/lib/persistence.ts` | Become a thin re-export of the new module |
| EDIT   | `src/main.tsx` | `await persistence.init()` before render |
| EDIT   | `package.json` | add deps: `sql.js`, `idb` (or hand-rolled), `jszip` (already present) |
| CREATE | `docs/adr/ADR-040-local-sqlite-persistence.md` | Decision record |
| CREATE | `docs/adr/ADR-041-schema-versioning.md` | Migration policy |
| CREATE | `tests/persistence.spec.ts` | Headless e2e: write → reload → assert restored |

### 3.3 ADRs to author

#### ADR-040 — Local SQLite Persistence (sql.js + IndexedDB)

- **Decision:** Use `sql.js` (SQLite compiled to WASM) backed by IndexedDB for all local persistence. Bundle is lazy-loaded on first persistence call.
- **Context:** Existing `localStorage` is fragile (5–10 MB cap, sync API, no relations). Going server-side violates the "frontend-only" MVP constraint. The flywheel already uses `sql.js` (`.swarm/memory.db`), so the pattern is familiar.
- **Alternatives considered:**
  - `localStorage` (kept for legacy fallback only; below quota for chat history)
  - `Dexie` / IndexedDB only (no SQL, joins painful)
  - `wa-sqlite` (more features, larger surface, slower init)
- **Consequences:** ~700 KB wasm bundle (lazy). Single source of truth for relational state. Easy export.
- **Status:** Accepted.

#### ADR-041 — Schema Versioning

- **Decision:** Forward-only numbered SQL migrations under `migrations/`. The DB stores `schema_version`; on boot, the runner applies any pending migrations in order. No down migrations.
- **Status:** Accepted.

### 3.4 Schema (initial)

```sql
-- 000-init.sql
CREATE TABLE schema_version (version INTEGER NOT NULL);
INSERT INTO schema_version (version) VALUES (0);

CREATE TABLE projects (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  config_json TEXT NOT NULL,        -- the MasterConfig serialized
  created_at  INTEGER NOT NULL,
  updated_at  INTEGER NOT NULL
);

CREATE TABLE sessions (
  id          TEXT PRIMARY KEY,
  project_id  TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  started_at  INTEGER NOT NULL,
  ended_at    INTEGER
);

CREATE TABLE chat_messages (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id  TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  role        TEXT NOT NULL CHECK (role IN ('user','bradley','system')),
  text        TEXT NOT NULL,
  created_at  INTEGER NOT NULL
);

CREATE TABLE listen_transcripts (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id  TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  text        TEXT NOT NULL,
  created_at  INTEGER NOT NULL
);

CREATE TABLE llm_calls (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id      TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  provider        TEXT NOT NULL,
  model           TEXT NOT NULL,
  prompt_tokens   INTEGER,
  output_tokens   INTEGER,
  cost_usd        REAL,
  status          TEXT NOT NULL CHECK (status IN ('ok','error','timeout','validation_failed')),
  patch_json      TEXT,
  error_text      TEXT,
  created_at      INTEGER NOT NULL
);

CREATE TABLE kv (
  k TEXT PRIMARY KEY,
  v TEXT NOT NULL
);

CREATE INDEX idx_chat_session ON chat_messages(session_id, id);
CREATE INDEX idx_listen_session ON listen_transcripts(session_id, id);
CREATE INDEX idx_llm_session ON llm_calls(session_id, id);
```

`schema_version` becomes the source of truth for migrations. After this, runner sets it to 1.

### 3.5 Bootstrap shape

```ts
// src/contexts/persistence/db.ts
import initSqlJs, { Database } from 'sql.js';

let db: Database | null = null;

export async function initDB() {
  if (db) return db;
  const SQL = await initSqlJs({ locateFile: f => `/sqljs/${f}` });
  const buf = await idbGet('hb-db');
  db = buf ? new SQL.Database(new Uint8Array(buf)) : new SQL.Database();
  await runMigrations(db);
  return db;
}

export async function persist() {
  if (!db) return;
  const buf = db.export();
  await idbSet('hb-db', buf);
}
```

`persist()` is called debounced (800 ms) after writes.

### 3.6 Adapter shape

```ts
// src/store/projectStore.ts (after edit)
const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  current: null,
  async load(id: string) {
    const row = await projectsRepo.findById(id);
    set({ current: row });
    configStore.getState().hydrateFromJSON(row.config_json);
  },
  async save() {
    const cur = get().current;
    if (!cur) return;
    await projectsRepo.upsert(cur);
    await persist();
  },
  // ...
}));
```

UI components remain untouched.

---

## 4. Refinement (R)

### 4.1 Checkpoints

- **A — Bootstrap.** sql.js loads, IndexedDB round-trips a write/read.
- **B — Adapter.** All `projectStore` consumers function unchanged after swap.
- **C — Export/Import.** Round-trip preserves project config + chat history.
- **D — Reload.** Closing and reopening the tab restores last project.

### 4.2 Intentionally deferred

- Cloud sync (post-MVP).
- Encryption-at-rest (post-MVP; document threat model in ADR-043 instead).
- Vector embeddings table (placeholder column only; no HNSW indexing in MVP).

---

## 5. Completion (C) — DoD Checklist

- [ ] `sql.js` and persistence module land under `src/contexts/persistence/`
- [ ] `wasm` is lazy-loaded; build size delta ≤ 800 KB gzip
- [ ] Migrations run idempotently; `schema_version` reflects highest applied
- [ ] All five repository modules expose typed CRUD
- [ ] `projectStore` swapped to DB adapter; UI unaffected
- [ ] Auto-save debounce works; observable in DevTools IndexedDB
- [ ] Reload restores last project
- [ ] Export `.heybradley` produces a valid zip with `project.json` + `db.sqlite`
- [ ] Import `.heybradley` round-trips; chat history preserved
- [ ] Settings panel: "Clear local data" button works (with confirm)
- [ ] ADR-040 and ADR-041 merged
- [ ] `tests/persistence.spec.ts` Playwright test green: write → reload → assert
- [ ] `npx tsc --noEmit` clean
- [ ] `npm run build` succeeds; bundle inspected
- [ ] Test count ≥ previous + 2
- [ ] Master checklist updated
- [ ] No write to `localStorage` from app code (a one-time migration *reads* legacy keys, then deletes them)

### Persona scoring targets

Persona scores are not gated on DB phase; defer to Phase 20 final review.

---

## 6. GOAP Plan

### 6.1 Goal state

```
goal := DBInitialized ∧ AdapterSwapped ∧ AutoSaveWorks ∧ ExportImportWorks ∧ TestsPass(n ≥ previous + 2)
```

### 6.2 Actions

| Action | Preconditions | Effects | Cost |
|---|---|---|---|
| `add_sqljs_dep` | repo clean | DepInstalled | 1 |
| `bootstrap_db_module` | DepInstalled | DBInitialized | 3 |
| `write_init_migration` | DBInitialized | SchemaPresent | 2 |
| `build_repositories` | SchemaPresent | ReposReady | 4 |
| `swap_project_store` | ReposReady | AdapterSwapped | 2 |
| `wire_autosave_debounce` | AdapterSwapped | AutoSaveWorks | 1 |
| `legacy_localstorage_migration` | AdapterSwapped | LegacyMigrated | 2 |
| `implement_export_import` | ReposReady | ExportImportWorks | 2 |
| `add_clear_data_button` | AdapterSwapped | UIControlsReady | 1 |
| `author_adr_040_041` | DBInitialized | ADRsMerged | 1 |
| `add_persistence_test` | AutoSaveWorks ∧ ExportImportWorks | TestsPass | 2 |
| `run_build` | TestsPass | GoalMet | 1 |

### 6.3 Optimal plan (cost = 22)

```
1. add_sqljs_dep
2. bootstrap_db_module
3. write_init_migration       ┐ parallel with #4 (after #2)
4. author_adr_040_041         ┘
5. build_repositories
6. swap_project_store
7. wire_autosave_debounce     ┐ parallel
8. legacy_localstorage_migration ┘
9. implement_export_import
10. add_clear_data_button
11. add_persistence_test
12. run_build
```

### 6.4 Replan triggers

- WASM 404 in production → switch to `wasm` import-as-asset path; re-test.
- IndexedDB quota exceeded → enforce LRU on `chat_messages` and `listen_transcripts` (cap 5 000 rows each).

---

## 7. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Build size jump | M | Code-split sql.js to its own chunk; preload only on first persistence call |
| Browser without IndexedDB (very rare) | L | Fall back to in-memory `Database`; warn user "data will not persist" |
| Concurrent tabs corrupt DB | M | `BroadcastChannel('hb-db')` on writes; readers reload before write; one writer at a time |
| Schema drift | M | Migrations are forward-only and tested in CI |
| Loss of legacy localStorage data | M | One-time migration reads, copies, then clears |

---

## 8. Hand-off to Phase 17

- DB is operational and the only project store.
- A KV row exists for future BYOK key storage.
- `llm_calls` table is empty but ready to receive Phase 17/18 audit entries.
- ADR-040 and ADR-041 are reference for future persistence work.

Phase 17 begins by adding the LLM provider abstraction, reading from env var, and writing key + first call into the DB.
