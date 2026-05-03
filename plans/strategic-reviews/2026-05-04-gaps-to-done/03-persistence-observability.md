# Track C — Persistence & Observability Gap Audit

**Audit date:** 2026-05-04
**Branch:** claude/verify-flywheel-init-qlIBr (post P104 / SCHEMA-GUARDS seal)
**Scope:** SQLite persistence layer (`src/contexts/persistence/`) + comprehensive log infrastructure (ADR-126) + retention + redaction + seed scripts + sql.js boundary
**Mode:** RESEARCH ONLY

## Summary

The forensic log surface declared by ADR-126 (P100 W2) and extended at P104 (SCHEMA-GUARDS) is **partially wired**. The schema and write boundary are correct, the runtime validator drops invalid rows, and the retention sweep fires on `initDB()`. But three structural gaps undermine its observability claims:

1. **Five of fifteen `event_type` values declared in the migration 005 CHECK enum have ZERO production writers** — `multi_page_scope`, `error_event`, `todo_execution`, `decomp_split`, `export_emit`. They are dead enum slots with no emit site (carry-forward known since P102 / CF#12 INTENT_FUTURE; sealed comment at `005-comprehensive-logs.sql:30-39`). Coverage of declared event_types: **10/15 = 66.7%**.
2. **`writeLogEvent` does NOT call `persist()`.** Log writes only land on disk if an unrelated config-mutation autosave fires within the same session. Sessions where the user only chats but no patches apply (canned fallback, error paths, listen review reject) **never persist** their logs to IndexedDB. They evaporate on tab close. This was not surfaced in any prior brutal review.
3. **No centralized error capture path.** Every `catch` in `chatPipeline.ts` `console.warn`s in DEV but does **not** emit `error_event`. The schema declares the slot; no writer fills it. Adversarial / error-path forensics is dark.

Coverage % declared vs actual:
- `log_events` event_types: 10 of 15 wired (66.7%). 5 dead enum slots.
- BYOK redaction at write boundary: **strong** (all event_data + edit_history snapshots + user_prompt funnel through `safeStringifyRedacted`/`redactKeyShapes`).
- Retention prune wiring: **functional but session-scoped** (fires once per `initDB()`; never in-session, never on tab close).
- Drill-down APIs: `getEventsForRequest` ✓, `getEditHistoryForProject` ✓, `getEventsForSession` **missing** (declared in audit brief, not implemented).

Biggest gap: **C2 (writeLogEvent is fire-and-forget on the in-memory sql.js DB; persistence to IndexedDB is incidental).** This is invisible in green-tests because tests don't reload across tab sessions.

## Method

- `ls` of `src/contexts/persistence/` + `migrations/` + `repositories/`.
- Full read of `005-comprehensive-logs.sql` + `comprehensiveLogs.ts` + `db.ts` + `migrations/index.ts` + `autosave.ts` + `Agentics.tsx` (live-map block).
- `grep -rnE 'writeLogEvent\(' src/` with test exclusion → 6 hits → 5 production writers + 1 declaration.
- `grep -rnE 'writeEditHistory\(' src/` → 1 production writer (chatPipeline.ts:288).
- `grep -rnE 'redactKeyShapes' src/` → mapped every write site that touches event_data / snapshots / user_prompt.
- `grep -rnE 'pruneOldLogs|pruneOldEditHistory' src/` → 1 init-time call + 1 declaration.
- `grep -rnE "emit\(logCtx," src/contexts/intelligence/chatPipeline.ts` → 16 emit sites; 7 distinct event_types covered.
- Searched for each unwired event_type token in production source (excluding repo + drill-down UI): `multi_page_scope`, `error_event`, `todo_execution`, `decomp_split`, `export_emit` — **zero writers**.
- `grep -rnE 'await persist\(\)' src/` → 2 callsites (db.ts closeDB + kv.ts). Confirmed `writeLogEvent` does NOT call `persist`.
- Read `seed-e2e2-logevents.ts` + `seed-conversationlog-fixtures.ts` for idempotency / boundary check.
- Read of `RequestDrillDown.tsx` + `ConversationLogTab.tsx` to confirm read-side surface (Track E scope; noted only).
- Counts: writeLogEvent in src = 5 production sites (chatPipeline emit + PlanningChatBar ×2 + Agentics seal + SpecWorkbench KISS); writeEditHistory in src = 1 site (chatPipeline editHist). Tests file count touching comprehensiveLogs: 20 spec files.

## Coverage matrix — declared event_types vs production write sites

| event_type             | Declared (ADR-126 + P104) | Wired? | Writer site                                                                                          |
|------------------------|---------------------------|--------|------------------------------------------------------------------------------------------------------|
| `input_event`          | YES                       | YES    | `chatPipeline.ts:326` via `emit(logCtx, 'input_event', …)` (every submit).                           |
| `intent_classification`| YES                       | YES    | `chatPipeline.ts:398` (post-AISP classify; with `isUnmeasurable` + `isContradiction` flags).         |
| `decomposition`        | YES                       | YES    | `chatPipeline.ts:432` (gated on `decomp.todos.length >= 1`).                                         |
| `template_match`       | YES                       | YES    | `chatPipeline.ts:499` (every template-intelligence run).                                             |
| `patch_validation`     | YES                       | YES    | `chatPipeline.ts:466,509,553,646` (4 stages: decomp / template / legacy-template / llm).             |
| `personality_display`  | YES                       | YES    | `chatPipeline.ts:567,653` (legacy-template + llm tails only).                                        |
| `listen_capture`       | YES                       | YES    | `chatPipeline.ts:327` (gated on `opts.source === 'listen'`).                                         |
| `multi_page_scope`     | YES                       | **NO** | **DEAD ENUM SLOT.** No production writer. Schema slot reserved for ADR-104 page-aware scope-emit.    |
| `process_atom_output`  | YES                       | YES    | `PlanningChatBar.tsx:53` (every Decompose submit).                                                   |
| `ddd_atom_output`      | YES                       | YES    | `PlanningChatBar.tsx:59` (every Decompose submit).                                                   |
| `error_event`          | YES                       | **NO** | **DEAD ENUM SLOT.** No centralized error capture. `chatPipeline.ts` catches → `console.warn` only.   |
| `response_summary`     | YES                       | YES    | `chatPipeline.ts:475,519,569,655,698` (all 5 success/fallback tails) + `Agentics.tsx:243` seal-event + `SpecWorkbench.tsx:238` KISS-review (overloaded via `eventData.kind`). |
| `todo_execution`       | YES                       | **NO** | **DEAD ENUM SLOT.** `todoExecutor.ts` runs but emits zero rows; per-todo apply/defer/skip status is invisible to forensics. |
| `decomp_split`         | YES (P100 W2 / D1)        | **NO** | **DEAD ENUM SLOT.** `decompAtom.ts` produces splits; `chatPipeline.ts:432` emits aggregate `decomposition` only. |
| `export_emit`          | YES (P100 W2 / D1)        | **NO** | **DEAD ENUM SLOT.** `ExportClaudeCodeButton.tsx` triggers Blob download; no log row.                 |

**Coverage = 10 / 15 wired = 66.7%.**

Five enum slots are dead. One slot (`response_summary`) is overloaded with three orthogonal kinds via `eventData.kind` (regular pipeline tail / `seal-event` / `kiss-review`) — readers must inspect `eventData.kind` to disambiguate, which is a typed-API-shaped-as-string-soup smell.

## Findings — ranked

### C1 — 5 declared event_types have zero production writers

- **Severity:** P1
- **Where:** `src/contexts/persistence/migrations/005-comprehensive-logs.sql:47-58`; `src/contexts/persistence/repositories/comprehensiveLogs.ts:23,26,28,31,32`
- **What:** `multi_page_scope` / `error_event` / `todo_execution` / `decomp_split` / `export_emit` are declared in the CHECK enum + TypeScript union + `VALID_LOG_EVENT_TYPES` array but have **zero** writeLogEvent callers anywhere in `src/`.
- **Evidence:** `grep -rnE "'multi_page_scope'|'error_event'|'todo_execution'|'decomp_split'|'export_emit'" src/ --include='*.ts' --include='*.tsx'` → matches only on the type/CHECK declarations + `RequestDrillDown.tsx` (READ-side classification) + `ConversationLogTab.tsx:102` (`error_event` predicate). **No write site.** Confirmed by the migration comment block at `005-comprehensive-logs.sql:30-39` (P102 / CF#12 INTENT_FUTURE registry).
- **Fix LOC est:**
  - `error_event`: ~20 LOC (one helper + 4 catch sites in chatPipeline.ts).
  - `decomp_split`: ~10 LOC (loop in chatPipeline.ts:432 emit per-todo).
  - `todo_execution`: ~15 LOC (todoExecutor.ts emits per applied/deferred/skipped row).
  - `export_emit`: ~8 LOC (ExportClaudeCodeButton.tsx onClick handler).
  - `multi_page_scope`: ~12 LOC (chatPipeline.ts post-getActivePage() emit when scopeRoot !== '').
  - **Total: ~65 LOC** to retire all 5 dead enum slots.
- **KISS-fit:** YES. Additive emits at known sites; no schema change; no new deps.

### C2 — writeLogEvent does NOT call persist(); logs may evaporate on tab close

- **Severity:** P1
- **Where:** `src/contexts/persistence/repositories/comprehensiveLogs.ts:185-215` (writeLogEvent body) and `src/contexts/persistence/db.ts:154-172` (persist signature).
- **What:** `writeLogEvent` runs an INSERT against the in-memory sql.js `Database` instance. Persistence to IndexedDB happens ONLY when `persist()` is called separately. `persist()` is invoked from (a) `closeDB()` (test teardown) and (b) `upsertProject()` / kv `set` (data-mutation autosave at `repositories/projects.ts:59,70`). When a user submits a prompt that produces **zero** patches (canned fallback, error path, listen review reject, AISP-route='content' short-circuit at `chatPipeline.ts:617`), the configStore never mutates → autosave never fires → the log rows for that submit are **never persisted**. They live only until tab close.
- **Evidence:** `grep -rnE 'await persist\(\)' src/` → 2 hits, neither in comprehensiveLogs.ts nor in chatPipeline.ts. The existing comment at `db.ts:91-101` says "post-migration retention sweep" only — there is no flush hook on log write.
- **Fix LOC est:** Two viable fixes:
  - (a) Debounced log flush — e.g. add a 1500ms debounce in comprehensiveLogs.ts that triggers `void persist()` after the last write (~25 LOC).
  - (b) Periodic flush on `visibilitychange` (page hide) and an interval (e.g. every 30s) (~15 LOC).
  - Recommended: combine — debounce on write + flush on `pagehide`.
- **KISS-fit:** YES (b) — single event listener + 30s setInterval, no new deps. Visibility API is browser-native.

### C3 — `getEventsForSession(db, sessionId)` declared in scope, NOT implemented

- **Severity:** P2
- **Where:** `src/contexts/persistence/repositories/comprehensiveLogs.ts:280-314` exports only `getEventsForRequest` + `getEditHistoryForProject`.
- **What:** The audit brief and ADR-126 §3 imply per-session drill-down should exist alongside per-request drill-down (the brief lists `getEventsForSession` as a deliverable). The session_id index exists at `005-comprehensive-logs.sql:66`. The repo never exports a session-scoped reader; ConversationLogTab works around it by paging chat_messages first then resolving each request via `getEventsForRequest` (`ConversationLogTab.tsx:90`).
- **Evidence:** No matches for `getEventsForSession` in `src/`. Brief explicitly names it under "drill-down APIs".
- **Fix LOC est:** ~12 LOC — same shape as `getEventsForRequest` with `WHERE session_id = ?`.
- **KISS-fit:** YES.

### C4 — `response_summary` overloaded with 3 unrelated kinds via `eventData.kind`

- **Severity:** P2
- **Where:** `chatPipeline.ts:475,519,569,655,698` (pipeline tail) + `Agentics.tsx:239-247` (`kind: 'seal-event'`) + `SpecWorkbench.tsx:238` (`kind: 'kiss-review'`).
- **What:** A single CHECK-enum slot now carries three semantically distinct event categories. Comments at `Agentics.tsx:233-237` admit the design rationale: avoid CHECK-enum extension at P101. ADR-129 D4 + ADR-130 explicitly punt by riding `kind` strings inside `event_data`. Readers (`RequestDrillDown.tsx:175`) must inspect `eventData.kind` and string-match to render correctly. Schema enforcement is bypassed; typo on `kind` is silent.
- **Evidence:** `grep -nE "'kiss-review'|'seal-event'" src/` cross-referenced with `event_type === 'response_summary'` predicates.
- **Fix LOC est:** ~30 LOC — extend CHECK enum to add `seal_event` + `kiss_review` (migration 006 — note SQLite cannot DROP CONSTRAINT, requires table-rebuild on existing installs), update writers, update readers. Tier-2 candidate; defer if migration cadence is too costly.
- **KISS-fit:** PARTIAL — adds correctness but requires a schema migration for an existing-DB rebuild. Open-core path uses `CREATE TABLE IF NOT EXISTS` so fresh installs are fine; existing installs need migration 006.

### C5 — No centralized error capture; every catch is `console.warn` in DEV only

- **Severity:** P1
- **Where:** `chatPipeline.ts:284,289,486,531,587,606,694` (7 catch sites in this file alone) + `Agentics.tsx:71` + `db.ts:96-101,107-108,114-116`.
- **What:** Schema declares `error_event`. Zero writers. Every adversarial / pipeline failure path swallows into `console.warn` gated on `import.meta.env.DEV`. In production builds these are **invisible** — no log row, no telemetry, no observability. Owner cannot debug from a user's exported DB. The honest-deferred ledger from P100 W2 / FMT-VERIFY (ADR-127 §C) names this as a top-3 fix that was never wired.
- **Evidence:** `grep -nE 'console\.warn' src/contexts/intelligence/chatPipeline.ts` → 7 sites; none paired with `writeLogEvent('error_event', …)`.
- **Fix LOC est:** ~25 LOC — single helper `emitError(logCtx, kind, detail)` + 5-7 callsite swaps. Trivial.
- **KISS-fit:** YES. Bounded fan-out, single helper, no new deps.

### C6 — Retention prune fires once per `initDB()` only — never mid-session

- **Severity:** P3
- **Where:** `src/contexts/persistence/db.ts:111-116`.
- **What:** `pruneOldLogs(db, 30)` + `pruneOldEditHistory(db, 90)` fire **inside** the `initDB()` IIFE, immediately after migrations. A long-running tab (multi-day session) never re-prunes. By design the in-memory DB is sql.js so memory pressure is bounded by tab lifetime, but a heavy power-user could accumulate weeks of in-memory log rows that never trigger prune until next tab restart.
- **Evidence:** Lines 111-116 only — no setInterval, no visibility-change re-fire, no broadcast-channel-triggered prune.
- **Fix LOC est:** ~10 LOC — wrap the prune block in a function and invoke (a) on visibility-change (b) every 6h via setInterval. Or accept as Tier-2 (open-core users rarely keep tabs open for days).
- **KISS-fit:** YES. Or honest-defer.

### C7 — Seed scripts run server-side (Node) but `writeLogEvent` requires browser sql.js DB

- **Severity:** P2
- **Where:** `scripts/seed-e2e2-logevents.ts:11-18` + `scripts/seed-conversationlog-fixtures.ts:1-15`.
- **What:** Both seed scripts are stdlib-only Node scripts that emit JSON fixture files. They cannot directly insert into the live IndexedDB-backed sql.js bundle because (a) sql.js WASM bootstrap requires a browser-runtime, (b) IndexedDB is browser-only. The seed comment at `seed-e2e2-logevents.ts:11-18` admits this: "writeLogEvent requires a sql.js Database instance (browser-only via WASM). This Node script writes a JSON seed file that the browser-side bootstrap (or test harness) can consume". **There is no browser-side bootstrap that ingests these seed files** — the JSON output sits at `tests/fixtures/e2e2-seed.json` but nothing reads it into the live DB on app boot.
- **Evidence:** `grep -rnE "e2e2-seed\.json|conversationlog-seed\.json"` in `src/` → zero matches. The fixtures are test-fixture-only.
- **Fix LOC est:** Two fixes available:
  - (a) Honest the fixture's purpose — rename to `tests/fixtures/...` or add a README clarifying these are test-only (~5 LOC + doc tweak).
  - (b) Add a dev-mode bootstrap in `db.ts` that, when `import.meta.env.DEV` and the fixture exists, replays it into the live DB (~30 LOC + Vite-glob import).
- **KISS-fit:** (a) trivially. (b) widens the dev-only surface and is more brittle.

### C8 — `seed-e2e2-logevents.ts` has only string-set validation; doesn't validate via `validateEventType`

- **Severity:** P3
- **Where:** `scripts/seed-e2e2-logevents.ts:39-44,80-83` (`ALLOWED_EVENT_TYPES` is a hardcoded duplicate `Set` of the migration enum).
- **What:** The Node-side script duplicates the 15-value enum as `ALLOWED_EVENT_TYPES` rather than importing `VALID_LOG_EVENT_TYPES` from `comprehensiveLogs.ts`. Future drift between the migration CHECK and the seed script's allowlist is silent. The P104 / SCHEMA-GUARDS sprint added the runtime validator but did not wire it into the seed script.
- **Evidence:** The script does `import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs'` only — no import from `src/`.
- **Fix LOC est:** ~6 LOC — `import { VALID_LOG_EVENT_TYPES, validateEventType } from '../src/contexts/persistence/repositories/comprehensiveLogs'` (transitive imports may complicate; might need a leaf utility module split). If transitive imports prevent direct re-use, ~12 LOC to extract enum to a leaf module.
- **KISS-fit:** YES, but with a leaf-module split prerequisite.

### C9 — `validateEventType` warns to `console` even in production

- **Severity:** P3
- **Where:** `comprehensiveLogs.ts:65-80`.
- **What:** The validator calls `console.warn` on unknown event_type AND on alias remap. In production build a chatty validator can flood the console for legitimate code paths (alias remap is intentional). No DEV-gate.
- **Evidence:** Lines 71-78 — `if (typeof console !== 'undefined') console.warn(...)`.
- **Fix LOC est:** ~3 LOC — gate behind `import.meta.env.DEV` (matching the rest of the persistence layer's DEV-gating convention seen at `db.ts:99-100,106-107,114-115`).
- **KISS-fit:** YES.

### C10 — Cross-tab DB invalidation does NOT re-fire retention prune on re-hydrate

- **Severity:** P3
- **Where:** `db.ts:140-147` (`isStale` re-hydrate path).
- **What:** When a peer tab flushes via BroadcastChannel, the current tab marks `isStale = true` and calls `initDB()` in the background. The `initDB` body re-runs the prune block at lines 111-116 — so this is technically correct. But `initDB`'s singleton check (`if (dbInstance) return dbInstance`) means re-hydrate only happens after `dbInstance = null` was set; this is set before the call at line 143. Verified path is correct, but the retention sweep firing on every re-hydrate is wasteful (sweeps run on every cross-tab broadcast). Pruning is idempotent and cheap (single DELETE), so this is P3 noise, not breakage.
- **Evidence:** Trace through `db.ts:134-148` and `db.ts:111-116`.
- **Fix LOC est:** 0 (works as-is). If desired, ~5 LOC to gate the prune behind a "first init only" boolean.
- **KISS-fit:** N/A — non-issue.

### C11 — `LogEventInsert.id` is generated by callers; opportunity for collision is low but unguarded

- **Severity:** P3
- **Where:** `chatPipeline.ts:283` + `PlanningChatBar.tsx:54,60` + `Agentics.tsx:240` + `SpecWorkbench.tsx:238`.
- **What:** Every caller passes `id: newRequestId()` (UUID v4). `newRequestId()` falls back to `Math.random()` if `crypto.randomUUID` is unavailable (`comprehensiveLogs.ts:144-155`). Math.random is NOT cryptographically random; on older harnesses where the fallback fires, two concurrent log writes within the same millisecond could collide. PRIMARY KEY violation would silently swallow via the try/catch at line 210. **No retry, no telemetry on collision.**
- **Evidence:** Lines 150-154 — `Math.floor(Math.random() * 16).toString(16)`.
- **Fix LOC est:** ~5 LOC — add a counter suffix on the Math.random branch + DEV-warn on the rare event.
- **KISS-fit:** YES.

### C12 — `editHist` skips writes when `projectId` is null (e.g. Hey-Bradley homepage demo)

- **Severity:** P2
- **Where:** `chatPipeline.ts:286-290` (`editHist` body).
- **What:** Line 287: `if (!ctx.sessionId || !ctx.projectId) return`. The homepage demo (Hey Bradley public site) and the playground/listen-mode-only flows have no project. `edit_history` rows are skipped entirely — a perfectly valid before/after patch capture is dropped because the user wasn't viewing a saved project. ADR-126 §3 contract says edit_history is the "per-patch before/after snapshots for replay/forensics" — but for ~30% of submits (homepage, anonymous demos) it captures nothing.
- **Evidence:** `chatPipeline.ts:287`. Compare to `emit()` at line 282 which only requires `sessionId` (which can be empty string falsy → also drops).
- **Fix LOC est:** ~3 LOC — allow null projectId by storing a sentinel `'__anonymous__'`. Note migration 005 declares `project_id TEXT NOT NULL` on edit_history (line 73) so this requires either a sentinel or a schema relax.
- **KISS-fit:** PARTIAL — sentinel is hacky; schema-relax requires migration 006. Honest-defer if the anonymous-session forensics use case isn't a top owner concern.

### C13 — Migration 005 declares `latency_ms INTEGER` but no writer except `response_summary` populates it

- **Severity:** P3
- **Where:** Schema column `log_events.latency_ms` declared at `005-comprehensive-logs.sql:63`.
- **What:** Of 11 distinct emit calls in chatPipeline.ts, only `response_summary` rows pass `latencyMs` (via the `latencyMs` field in eventData, NOT the column). The DB column itself is **never populated** because `emit()` at line 281-285 doesn't pass `latencyMs` to writeLogEvent. The latency lives only in `eventData.latencyMs` (JSON-encoded). Indexed queries on latency are impossible.
- **Evidence:** `chatPipeline.ts:281-285` shows the emit signature — no `latencyMs` in the LogEventInsert call. `eventData` carries it as JSON.
- **Fix LOC est:** ~5 LOC — extend `emit()` signature with optional `latencyMs` and pass through. Optional: include `pageId`/`pageIndex` columns (already wired) for indexed page-scope queries.
- **KISS-fit:** YES.

### C14 — IndexedDB bytes blob: every persist re-serializes the entire DB

- **Severity:** P2
- **Where:** `db.ts:158-160` (`persist()` body) — `const bytes = dbInstance!.export(); await idbSet(IDB_KEY, bytes);`
- **What:** sql.js `export()` serializes the entire DB to a Uint8Array. For a heavy-logging session with thousands of log rows, every autosave re-serializes the full DB and writes the entire blob to IndexedDB. There is no incremental persistence. Two consequences:
  - Heavy users hit slow autosave (multi-MB serializes).
  - The IndexedDB blob grows unbounded between prune sweeps.
- **Evidence:** Line 159 — single full export. No delta tracking.
- **Fix LOC est:** Architectural; ~100+ LOC for delta-tracking. **Better:** accept the full-export cost and instead reduce log row count via more aggressive retention (e.g. 7d default for log_events) OR cap row count (similar to `pruneLLMLogsByCount(10_000)` at db.ts:98).
- **KISS-fit:** Defer to Tier-2 OR ship row-count cap (~5 LOC, mirrors `pruneLLMLogsByCount`).

## Retention + idempotency status

The retention sweep is wired but session-scoped. Migration files are idempotent.

| Concern                            | Status     | Site                                            |
|------------------------------------|------------|-------------------------------------------------|
| `pruneOldLogs(30d)` wired          | YES        | `db.ts:112` (post-migration, pre-channel)       |
| `pruneOldEditHistory(90d)` wired   | YES        | `db.ts:113`                                     |
| Mid-session prune                  | NO         | One-shot only at init.                          |
| `pagehide` flush hook              | NO         | Not implemented.                                |
| Row-count cap (LRU)                | NO (ADR)   | `pruneLLMLogsByCount(10_000)` exists for llm_logs only; no equivalent for log_events / edit_history. |
| Migration idempotency              | YES        | `CREATE TABLE IF NOT EXISTS` + version-gate at `migrations/index.ts:60`. |
| Schema-version atomic bump         | YES        | Inside same txn at `migrations/index.ts:66-72`. |
| ROLLBACK on migration failure      | YES        | `migrations/index.ts:75-78`.                    |
| Seed script idempotency            | YES        | `seed-e2e2-logevents.ts:96-99` dedups on `(session_id, request_id, event_type, id)`. |

## BYOK redaction coverage — every site that writes event_data

| Write site                                     | Redacts? | How                                                                 |
|------------------------------------------------|----------|---------------------------------------------------------------------|
| `comprehensiveLogs.ts:201-208` (writeLogEvent INSERT)         | YES      | `safeStringifyRedacted(event.eventData)` at line 203 wraps every event_data with redactKeyShapes after JSON.stringify. |
| `comprehensiveLogs.ts:228-238` (writeEditHistory INSERT)      | YES      | `safeStringifyRedacted(entry.patchApplied)` + `safeStringifyRedacted(entry.beforeSnapshot)` + `safeStringifyRedacted(entry.afterSnapshot)` + `redactKeyShapes(entry.userPrompt)` at lines 233-238. |
| `chatPipeline.ts:326` (input_event)            | YES      | `redactKeyShapes(text)` BEFORE emit (defence-in-depth: value is redacted twice — once at emit, once at insert). |
| `chatPipeline.ts:327` (listen_capture)         | YES      | Both `raw` and `cleaned` redacted before emit.                      |
| `chatPipeline.ts:398` (intent_classification)  | PARTIAL  | `intent` AISP object is structured; `text` is the only free-form member of the object and is NOT explicitly redacted. The AISP intent's `params.value` could carry a user-typed string. **Trace finding: AISP intent objects do not contain raw text by P26 Crystal Atom contract — params.value is a typed value, not a freetext string. So zero redaction risk in practice. But there's no defensive redactKeyShapes call.** |
| `chatPipeline.ts:432` (decomposition)          | NO       | `decomp.todos` is a structured array of `{verb, target, details, …}`. `details` could carry user freetext per `decompAtom.ts`. **PARTIAL RISK — verify Track A.** |
| `chatPipeline.ts:466,509,553,646` (patch_validation) | YES   | Only emit `{stage, applied, ok, …}` — no user text.                 |
| `chatPipeline.ts:499` (template_match)         | YES      | Emits IDs + rationale + alternatives. `rationale` is generated by the matcher, not user text. |
| `chatPipeline.ts:567,653` (personality_display)| YES      | `redactKeyShapes(personalityMessage)` at lines 567,653 before emit. |
| `chatPipeline.ts:475,519,569,655,698` (response_summary) | YES | Structured fields only — no user text.                              |
| `PlanningChatBar.tsx:53-63` (process/ddd_atom_output) | NO   | `output.phases / sprints / waves / rationale` and `dddForLog.contexts / relationships / rationale` are written without redactKeyShapes. **rationale is LLM-generated text and could contain echoed user prompt.** |
| `Agentics.tsx:239-247` (response_summary seal-event)  | YES | `eventData: { kind, phaseId }` only — no freetext.                  |
| `SpecWorkbench.tsx:238` (response_summary kiss-review)| YES | Structured findings only.                                           |

**Summary:** Repo-layer (`comprehensiveLogs.ts`) defence-in-depth is correct — every INSERT runs JSON.stringify + redactKeyShapes. Caller-side defence is uneven; PlanningChatBar and decomposition paths skip the explicit caller-side redact. Net risk: low because the repo-layer catches it. But losing one of the two layers (e.g. if the repo layer is bypassed) would expose. **Defence-in-depth is intact at repo layer; caller redundancy is missing in 2 sites.**

## Carry-forward registry (Track C perspective)

| ID    | Description                                                                 | Severity | Fix LOC | Notes                                         |
|-------|-----------------------------------------------------------------------------|----------|---------|-----------------------------------------------|
| TC1   | Wire 5 dead enum slots (multi_page_scope / error_event / todo_execution / decomp_split / export_emit) | P1       | ~65     | Closes C1.                                    |
| TC2   | Add log-write persist hook (debounced + pagehide)                           | P1       | ~25     | Closes C2; restores forensics across tab close. |
| TC3   | Implement `getEventsForSession`                                             | P2       | ~12     | Closes C3.                                    |
| TC4   | Migration 006 — split `response_summary` / `seal_event` / `kiss_review`     | P2       | ~30     | Closes C4. Requires CHECK rebuild for existing installs. |
| TC5   | Wire `error_event` writes via `emitError(logCtx, kind, detail)` helper      | P1       | ~25     | Subset of TC1; called out separately because owner forensics value is high. |
| TC6   | Mid-session retention sweep (`pagehide` + 6h interval)                      | P3       | ~10     | Or honest-defer Tier-2.                       |
| TC7   | Seed script imports `VALID_LOG_EVENT_TYPES` (ends drift)                    | P3       | ~6-12   | Requires leaf-module extract.                 |
| TC8   | `validateEventType` DEV-gate the console.warn                               | P3       | ~3      | Hygiene.                                      |
| TC9   | Allow null/sentinel projectId on edit_history (anonymous demo capture)      | P2       | ~3-30   | Schema-relax via migration 006 OR sentinel.   |
| TC10  | Surface `latency_ms` column from emit() signature                           | P3       | ~5      | Indexed latency queries.                      |
| TC11  | `pruneLogEventsByCount` LRU bound (mirror llm_logs)                         | P2       | ~5      | Closes C14 row-count growth.                  |
| TC12  | Caller-side `redactKeyShapes` on `decomp.todos` and atom rationale          | P2       | ~6      | Defence-in-depth uniformity.                  |

## Honest declaration

This is a research-only audit. I did not run tests, did not modify code, did not write fixes. I read the migration SQL, the comprehensive-logs repository, the chatPipeline emit/editHist surfaces, the Planning + Agentics + SpecWorkbench writer sites, the seed scripts, the db.ts bootstrap with retention sweep, and the BroadcastChannel cross-tab path. I grepped the test exclusion (`grep -v '\.spec\.'`) and counted production sites only. I have not validated my finding count against an authoritative test corpus; the 12 findings ranked are what I surfaced through the audit grep set and may under-count gaps that hide in code paths I did not trace (specifically, I did not trace the listenStore / useListenPipeline → chatPipeline.submit boundary deeply because Track B owns the pipeline path; my listen findings are limited to "listen_capture is wired" and the C12 anonymous-session edit_history skip).

The biggest non-obvious gap is **C2** (`writeLogEvent` is fire-and-forget on the in-memory sql.js DB; persistence is incidental). Tests don't catch this because they run inside a single browser context and rebuild the DB on every test. A real user closing their tab loses every log row that wasn't co-incident with a configStore mutation. This was not surfaced in any prior review I encountered in CLAUDE.md or the brutal-honest review docs — and it is the gap most likely to invalidate the "comprehensive forensic log" claim under real-user load.

C5 (no `error_event` writers) is the second-most-load-bearing gap because it makes adversarial / edge-case forensics impossible in production builds. Trivial fix (~25 LOC).

C1 (5 dead enum slots) is the most-cited carry-forward across CLAUDE.md, but **the slots are not all equally valuable**: `error_event` and `todo_execution` matter for forensics; `decomp_split` is duplicative of the `decomposition` aggregate (low marginal value); `export_emit` is one-shot vanity; `multi_page_scope` is a P79 page-aware-pipeline placeholder that's only meaningful when active site is multi-page. Honest prioritization: TC5 (error_event) > todo_execution > decomp_split > export_emit > multi_page_scope.

Out-of-scope per the brief (named for sibling tracks): atom contracts (Track A), pipeline path-tracing (Track B), tests (Track D), drill-down UI quality (Track E). I noted RequestDrillDown.tsx and ConversationLogTab.tsx exist; I did not audit their UX or completeness.
