# Hey Bradley — Database Migrations Catalog

> **Purpose:** Canonical reference for every SQL migration shipped against the sql.js + IndexedDB store. Pair with `db.ts` (initDB) and `index.ts` (runner) for operational details.
> **Last updated:** 2026-04-28 (P37 mid-flight; 4 migrations / schema_version target = 4)
> **Supersedes:** earlier README which incorrectly instructed migrations to update `schema_version` themselves; the runner now owns that bump.

---

## 1. Why this exists

Hey Bradley persists state in the browser via `sql.js` (WASM-compiled SQLite) backed by IndexedDB. Every schema change ships as a **numbered SQL file** in this directory. The runner (`./index.ts`) applies any migration whose number ≥ current `schema_version`, wraps each in its own BEGIN/COMMIT, and bumps `schema_version` after a successful apply.

**Invariants the runner enforces:**

1. SQL files MUST NOT include their own `BEGIN`/`COMMIT` (the runner wraps them).
2. SQL files MUST NOT update `schema_version` (the runner does it inside the same txn).
3. Migrations are applied in **alphabetical filename order** (so `000-…` runs before `001-…`).
4. Failure rolls back ONLY the failing migration; previously-applied migrations stay committed.
5. A snapshot of the pre-migration DB is written to `kv['pre_migration_backup']` before the first pending migration; cleared on full success.

**Bundle import safety (P28 C15):** `exportImport.ts` rejects an imported `.heybradley` whose `schema_version > knownMigrationCount()` — old builds refuse newer DBs gracefully.

---

## 2. The Catalog

| File | Schema Version Target | Phase | Adds | Sentinel C14 | Privacy on Export |
|---|---:|---|---|:---:|---|
| `000-init.sql` | 1 | P16 | `kv`, `schema_version`, `projects`, `sessions`, `chat_messages`, `listen_transcripts`, `llm_calls` | ✅ | `llm_calls.error_text` → NULL on export (ADR-043) |
| `001-example-prompts.sql` | 2 | P18b | `example_prompts` (35 golden) + `example_prompt_runs` | ✅ | `example_prompt_runs` truncated on export |
| `002-llm-logs.sql` | 3 | P18b | `llm_logs` w/ ruvector D1/D2/D3 deltas | ✅ | Full table truncated on export (ADR-046, ADR-047) |
| `003-user-templates.sql` | 4 | P30 | `user_templates` (CHECK enums on category + kind) | ✅ | OPT-IN export per ADR-059 (intentionally NOT stripped); import truncates |

### 000-init.sql — baseline schema (P16)

Creates the foundational tables:

- **`schema_version`** — single-row table with `version INTEGER`. Runner reads + bumps.
- **`kv`** — generic key-value store for small persisted data (BYOK key/provider, cost cap, accepted assumptions ring buffer, etc.). Stripped keys: `byok_key`, `byok_provider`, `pre_migration_backup` (see `SENSITIVE_KV_KEYS` in `exportImport.ts`).
- **`projects`** — user projects with `config` (JSON-stringified MasterConfig) + soft-delete via `deleted_at`.
- **`sessions`** — chat/listen/build sessions; FK to projects (logical, not enforced — see ADR-040b).
- **`chat_messages`** — text-mode turns (one row per user/bradley message).
- **`listen_transcripts`** — voice-mode final transcripts (one row per PTT release).
- **`llm_calls`** — audit-light row per adapter call (cost-cap math source).

### 001-example-prompts.sql — golden corpus + run history (P18b)

- **`example_prompts`** — 35 user-prompt → expected-envelope pairs (categories: starter, edge_case, safety, multi_section, site_context, content_gen). Drives `AgentProxyAdapter` (the DB-backed mock). Re-seeded on `.heybradley` import to prevent template-poisoning (P28 C15).
- **`example_prompt_runs`** — actual LLM responses keyed to a prompt for cross-checking. Truncated on export per `SENSITIVE_TABLE_OPS`.

### 002-llm-logs.sql — observability (P18b)

- **`llm_logs`** — full forensic audit row per call (one per adapter decision incl. cost_cap rejects). Schema captures ruvector deltas:
  - **D1** dual `request_id` (UUID v4) + `parent_request_id` (retry chain root, NULL on first attempt)
  - **D2** split `input_tokens` + `output_tokens` (was monolithic)
  - **D3** SHA-256 `prompt_hash` of `(system||'\n'||user)` for fixture matching + dedup without storing prompt text
- 4 indexes for common queries (session+id, provider+created_at, request_id, parent_request_id)
- 30-day auto-prune at `initDB` + 10K LRU cap (P23 C18)
- **Privacy:** `system_prompt` + `user_prompt` + `response_raw` + `error_kind` are truncated on export (`SENSITIVE_TABLE_OPS`); ADR-047

### 003-user-templates.sql — user-authored templates (P30)

- **`user_templates`** — id (TEXT PK), name, category (CHECK theme|section|content), kind (CHECK patcher|generator), examples_json, payload_json, created_at, updated_at
- 2 indexes for `category` and `kind` filter queries
- **CHECK constraints** on category + kind enums (DB-layer defense-in-depth even if TS validator is bypassed)
- **No FK to projects** — application-layer invariant in `createUserTemplate`; consistent with ADR-040b
- **OPT-IN export** (NOT stripped on `.heybradley` export per ADR-059); but on import the table is **truncated** (P35 R3 F1) so a malicious bundle can't smuggle templates that shadow registry IDs
- Application-layer guards in `userTemplates.ts`: `ID_ALLOWLIST_RE`, `RESERVED_IDS` (collision with built-in registry), `PAYLOAD_BYTES_CAP=64K`, `EXAMPLES_BYTES_CAP=8K`, `NAME_CHAR_CAP=200`, `ROW_COUNT_CAP=1000`, `LIMIT 1000` on `listUserTemplates`

---

## 3. The runner contract

`migrations/index.ts:runMigrations(db)` — applied at every `initDB`, idempotent.

```
1. Read current schema_version (default 0 on missing).
2. Glob ./*.sql, sort alphabetically, parse migration number from filename.
3. Snapshot pre-migration DB to kv['pre_migration_backup'] (best-effort).
4. For each migration:
   a. Skip if current_version > migration_number.
   b. BEGIN
   c. exec(SQL)
   d. UPDATE schema_version SET version = migration_number + 1
   e. COMMIT (or ROLLBACK on throw + propagate)
5. On full success, clearPreMigration().
```

`knownMigrationCount()` returns the count of `.sql` files in this folder; used by `exportImport.ts` to clamp imported bundles.

---

## 4. Backup procedure (operational)

The DB is browser-side. Backup paths (in order of recommendation):

1. **`.heybradley` export** — the sanctioned cross-device backup. `exportImport.ts:exportSanitizedDBBytes()` produces a privacy-stripped clone; users save the file. Includes everything except `byok_*` kv rows + `llm_logs` rows + `example_prompt_runs` rows + `llm_calls.error_text`. **`user_templates` IS included** (opt-in user content).
2. **`kv['pre_migration_backup']`** — automatic; written before any pending migration runs. Restored via `restorePreMigration()` if a migration fails. Cleared on success.
3. **Browser DevTools → Application → IndexedDB → `hey-bradley` → `db`** — raw bytes; for emergency recovery.
4. **`SENTINEL_TABLE_OPS` audit (`tests/p23-sentinel-table-ops.spec.ts`)** — schema-evolution canary. Any new migration that adds a column matching `/(prompt|key|secret|password|token|auth)\b/i` MUST register the table in `SENSITIVE_TABLE_OPS` or the test fails CI.

**There is NO automated backup to a remote service.** This is a frontend-only single-tenant app; the user's browser is the source of truth. Future Tauri/Electron build adds local-disk backup; out of MVP scope.

---

## 5. Adding a new migration (procedure)

**Trigger:** any phase that needs to persist state across sessions in a structured (typed-column) shape that doesn't fit `kv`.

1. **Number it.** Next number after the highest `*.sql` file. Pad to 3 digits. (e.g. `004-name.sql`)
2. **Write the SQL.** Use this template:

   ```sql
   -- 004-foo.sql
   -- Spec: <plan path>
   -- Cross-ref: docs/adr/ADR-NNN-decision.md
   -- Sentinel: any sensitive-named column ⇒ register in SENSITIVE_TABLE_OPS
   --
   -- Schema-only here; runner bumps schema_version <prev> -> <next>.
   CREATE TABLE foo (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     ...
   );
   CREATE INDEX idx_foo_field ON foo(field);
   ```

3. **NEVER** include `BEGIN`/`COMMIT`. **NEVER** update `schema_version`.
4. **Add a typed repository** at `src/contexts/persistence/repositories/foo.ts` mirroring the row shape; export typed CRUD.
5. **Register in `SENSITIVE_TABLE_OPS`** (in `exportImport.ts`) IF the table holds privacy-sensitive content (free-text user prompts, API responses, etc.). Choose `truncate` or `null_column`.
6. **Sentinel test** runs automatically (P23 C14). If your table contains a column whose name matches the sensitive-word regex, the test will fail unless you register it.
7. **Author/amend an ADR** documenting the decision. Cross-reference it from the migration's header comment.
8. **Add typed-column tests** (PURE-UNIT pattern; FS-level reads of the SQL file + repo source).

---

## 6. Future-migration candidates (not yet committed)

These have been considered but not yet shipped. Listed here so the next contributor (or the next Claude session) doesn't reinvent the analysis.

| Candidate | Triggering phase | Why deferred |
|---|---|---|
| `004-content-history.sql` | Sprint D (post-P33) | CONTENT_ATOM stub doesn't persist generated text yet; would land alongside the LLM swap from stub to live. Tracked in `plans/deferred-features.md`. |
| `005-command-audit.sql` | Sprint F P37 | `parseCommand` (ADR-066) currently fires-and-forgets. If we want a "you used /browse 12 times this week" surface, we'd persist; meanwhile counts can live in kv. |
| `006-clarifications.sql` | Sprint E P34/P35 | Accepted assumptions live in `kv['aisp_accepted_assumptions']` as a 50-row ring buffer (P34 ADR-063). Promotion to a proper table only matters if we surface a "you confirmed X 3x — make this default?" feature. |
| `007-cost-by-day.sql` | post-P20 | Daily cost rollups for the CostPill. Currently computed live from `llm_logs`. Defer until `llm_logs` row count crosses ~50K (current LRU cap = 10K). |

**Decision rule:** if the data fits in `kv` (small, single-tenant, infrequent reads), keep it there. If it needs filtering / aggregation / FK referential integrity, promote to a table.

---

## 7. Health checks

Run these to verify migration integrity:

```bash
# All migration files present + numbered correctly
ls src/contexts/persistence/migrations/*.sql

# Sentinel covers every sensitive column
npx playwright test tests/p23-sentinel-table-ops.spec.ts

# All migration tests still green (P30 P33 fix-passes)
npx playwright test tests/p30-template-persistence.spec.ts tests/p33-fix-pass-3.spec.ts

# Full DDL shape audit
grep -c "CREATE TABLE" src/contexts/persistence/migrations/*.sql
```

Expected counts (as of P37):
- 4 SQL files (000–003)
- `schema_version` target = 4
- 9 unique `CREATE TABLE` statements across all migrations
- 0 `BEGIN`/`COMMIT` statements inside migration files (the runner owns those)
- 0 manual `UPDATE schema_version` statements inside migration files (the runner owns that too)

---

## 8. Cross-references

- `docs/GROUNDING.md` §9 — high-level summary of database state
- `docs/adr/ADR-040-local-sqlite-persistence.md` — original decision
- `docs/adr/ADR-040b-llm-logs-fk-deferral.md` — sql.js FK rationale
- `docs/adr/ADR-046-multi-provider-llm-architecture.md` — `llm_logs` schema decisions
- `docs/adr/ADR-047-llm-logging-observability.md` — privacy / SENSITIVE_TABLE_OPS rules
- `docs/adr/ADR-058-template-library-api.md` — Library decoration over registry
- `docs/adr/ADR-059-template-persistence.md` — `user_templates` schema + opt-in export decision
- `src/contexts/persistence/db.ts` — initDB + lifecycle
- `src/contexts/persistence/migrations/index.ts` — the runner
- `src/contexts/persistence/exportImport.ts` — `.heybradley` round-trip
- `src/contexts/persistence/repositories/kv.ts` — generic key-value access
- `tests/p23-sentinel-table-ops.spec.ts` — schema-evolution canary

---

*This catalog is updated whenever a migration ships. Pair with `docs/GROUNDING.md` for the broader project picture.*
