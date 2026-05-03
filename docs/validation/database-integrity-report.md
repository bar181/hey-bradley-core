# Database Integrity Report

> Generated: 2026-05-04 · Sources: 6 fixtures (5 project + e2e2-seed) + comprehensiveLogs.ts + migrations/005-comprehensive-logs.sql · Branch: `claude/verify-flywheel-init-qlIBr` · Predecessor: 5-projects sealed at `067f92c`

## Summary

98 rows total across 6 fixtures, 8 distinct sessions. All `event_type` values map to migration 005 CHECK enum (15 values) **except** project-4 which uses `patch_applied` (8 rows) — silently remapped to `patch_validation` by the `validateEventType()` helper at write-time per ADR-126 D4 / ADR-127. BYOK regex sweep returns ZERO matches across all 6 fixtures. Verdict: **PARTIAL PASS** — schema integrity + BYOK boundary + retention wiring all GREEN; structural inconsistency in fixture format (project-4 wraps in `{_meta, rows}` while siblings are bare arrays) and 2 of 5 declared event_types still uncovered (`todo_execution` + `error_event`) flag honest carry-forwards.

## Check 1 — Total row count

| Fixture | Rows | Sessions |
|---------|------|----------|
| project-1-axon-cli | 19 | 1 |
| project-2-greenlane-startup | 13 | 1 |
| project-3-quattro-studio | 12 | 1 |
| project-4-mrs-albright-tutoring | 11 | 1 |
| project-5-bordo-spec | 8 | 1 |
| e2e2-seed | 35 | 3 |
| **TOTAL** | **98** | **8** |

NOTE: project-4 wraps as `{_meta: {...}, rows: [...]}` (object root) — the 5 sibling project fixtures + e2e2-seed are bare arrays. Row count uses `.rows.length` for project-4 and `.length` for the others. Structural inconsistency flagged but not failing — `_meta` block at lines 1-12 of project-4 documents the wrap intentionally (input_type=listen, persona=grandma, ADR-126 + ADR-127 listen-mode 2-stage capture per fixture comment).

## Check 2 — Event type histogram

| event_type | Count | Status |
|-----------|-------|--------|
| intent_classification | 31 | OK |
| patch_validation | 27 | OK |
| decomp_split | 13 | OK |
| patch_applied | 8 | ALIAS (project-4 only — remapped → patch_validation at write-time per `comprehensiveLogs.ts:80`) |
| process_atom_output | 7 | OK |
| template_match | 5 | OK |
| response_summary | 4 | OK |
| multi_page_scope | 1 | OK |
| export_emit | 1 | OK |
| ddd_atom_output | 1 | OK |
| **TOTAL** | **98** | |

### VALID_LOG_EVENT_TYPES (15) — coverage matrix

| Declared (migration 005:48-58 / comprehensiveLogs.ts:50-66) | Has rows? |
|---|---|
| input_event | 0 — gap |
| intent_classification | 31 |
| decomposition | 0 — gap (closely-related `decomp_split` covers DECOMP) |
| template_match | 5 |
| patch_validation | 27 |
| personality_display | 0 — gap |
| listen_capture | 0 — gap (listen mode rows in project-4 use `intent_classification` + `patch_applied`) |
| multi_page_scope | 1 |
| process_atom_output | 7 |
| ddd_atom_output | 1 |
| error_event | **0 — P107 carry-forward** |
| response_summary | 4 |
| todo_execution | **0 — P107 carry-forward** |
| decomp_split | 13 |
| export_emit | 1 |

**Unknown event_types: ZERO** (after `patch_applied` alias remap).

**P107 closure status (5 declared event_types ≥1 row each):** 3 of 5 covered (`multi_page_scope` 1 / `decomp_split` 13 / `export_emit` 1); 2 still uncovered (`todo_execution` / `error_event`).

## Check 3 — Session distribution

8 distinct `session_id` values (target: ≥5 + e2e2 sessions [3] = 8 ✓):

```
project-1-axon-session-01           (project-1)
p5-greenlane-session-01             (project-2)  -- naming inconsistency: "p5-" prefix on project 2
p5-quattro-session-01               (project-3)  -- naming inconsistency: "p5-" prefix on project 3
p4-albright-session-01              (project-4)
project-5-bordo-spec-session-01     (project-5)
e2e2-coffee-essay-session-01        (e2e2-seed)
e2e2-northlight-session-01          (e2e2-seed)
e2e2-switchback-session-01          (e2e2-seed)
```

**Session naming inconsistency flagged** — project-2 + project-3 both use the `p5-` prefix (legacy from a draft sequence). Functionally distinct (different IDs), but the prefix mislabels. Carry-forward fix-pass candidate; non-blocking.

## Check 4 — BYOK boundary

Regex `sk-[a-zA-Z0-9]{20,}|AIza[0-9A-Za-z_-]{35}|Bearer\s+[a-zA-Z0-9]{20,}` swept across all 6 fixtures:

```
ZERO matches ✓
```

BYOK trust boundary holds (ADR-043 + ADR-114 D3). The runtime `redactKeyShapes()` function at `comprehensiveLogs.ts:168` provides defense-in-depth at every write boundary (sites at lines 183 / 294-295 / 325).

## Check 5 — Schema completeness

All 98 rows carry the 5 required fields (`session_id`, `request_id`, `event_type`, `event_data`, `created_at`):

```
ALL ROWS HAVE REQUIRED FIELDS
```

`latency_ms` (recommended/optional) — present on all 98 rows (100% coverage; range observed 380ms-2890ms). `event_data` is a non-empty object on every row.

## Check 6 — Retention prune wiring

| Item | Location | Status |
|------|----------|--------|
| `pruneOldLogs(db, retentionDays)` | `src/contexts/persistence/repositories/comprehensiveLogs.ts:340` | DEFINED |
| `pruneOldEditHistory(db, retentionDays)` | `src/contexts/persistence/repositories/comprehensiveLogs.ts:354` | DEFINED |
| Default log_events retention | `comprehensiveLogs.ts:149` (`DEFAULT_EVENT_RETENTION_DAYS = 30`) | 30 days ✓ |
| Default edit_history retention | `comprehensiveLogs.ts:150` (`DEFAULT_EDIT_RETENTION_DAYS = 90`) | 90 days |
| Wired into initDB | `src/contexts/persistence/db.ts:116-117` (post-migrations, post-llm-prune, in try/catch — fire-and-forget) | ACTIVE ✓ |

Both prune calls fire **once per `initDB()`** invocation (per session bootstrap). Failures non-fatal (DEV-only `console.warn`). Per-row cutoff: `Date.now() - retentionDays * DAY_MS` — DELETE WHERE created_at < cutoff (lines 341 / 355).

**Status: ACTIVE** (P101 / R3 P1 fix-pass landed at db.ts:113-120; comment cites ADR-126 retention sweep). Tested fixture rows have `created_at` values in the range 1714705200000-1714730400000 (May 3, 2026) — all FRESH relative to a 30-day cutoff at 2026-05-04.

## Verdict

**PARTIAL PASS**

| Check | Status | Notes |
|-------|--------|-------|
| 1. Row count | PASS | 98 rows / 8 sessions |
| 2. Event type histogram | PASS | All values in CHECK enum after `patch_applied → patch_validation` alias remap |
| 3. Session distribution | PASS | 8 distinct sessions ≥ target 8 |
| 4. BYOK boundary | PASS | ZERO regex matches |
| 5. Schema completeness | PASS | 5 required fields on all 98 rows |
| 6. Retention prune wiring | PASS | ACTIVE at db.ts:116-117 |

Rationale for PARTIAL (not full PASS):

1. **Fixture format inconsistency** — project-4 wraps in `{_meta, rows}` while the 5 siblings + e2e2-seed are bare JSON arrays. Loaders must branch on shape. Non-blocking but a fix-pass candidate.
2. **Session naming drift** — project-2 + project-3 prefix sessions with `p5-` instead of `p2-`/`p3-`. Functionally distinct IDs (no collision); cosmetic mislabel; fix-pass candidate.
3. **`patch_applied` (8 rows in project-4)** is NOT in the migration 005 CHECK enum directly — it relies on the runtime `validateEventType()` alias remap. If a fixture loader bypasses `writeLogEvent` and inserts straight to SQLite, those 8 rows would fail the CHECK constraint. Defense-in-depth holds at the documented write path; direct-insert paths would surprise.
4. **5 declared event_types coverage**: `todo_execution` + `error_event` still have ZERO rows across all 6 fixtures. Migration 005 + comprehensiveLogs.ts both declared these in the CHECK enum since P100 W2 LOG-BUILD; P107 named "≥1 row each" as a closure target. 3 of 5 covered, 2 outstanding.

## Coverage gaps

- **`todo_execution`** — declared in CHECK enum + VALID_LOG_EVENT_TYPES but no fixture row emits it. Carry-forward to P107 / next fixture sprint.
- **`error_event`** — declared but no fixture row emits it. Carry-forward to P107 / next fixture sprint.
- **`input_event` / `decomposition` / `personality_display` / `listen_capture`** — declared in the 15-value enum but no fixture row exercises them. (`decomposition` is closely related to `decomp_split` which has 13 rows; `listen_capture` is structurally covered by listen-mode `intent_classification` rows in project-4 carrying `raw_transcript` + `cleaned_transcript` per ADR-127, but never emitted as its own event_type.) Lower-priority gaps; not blocking.
- **`patch_applied` in project-4** — should be remapped at fixture-author time to `patch_validation` for direct-insert safety; alias remap remains the runtime safety net. Fixture-level fix-pass candidate.
- **No CI smoke test exercises the `patch_applied → patch_validation` alias remap path against an actual sql.js in-memory DB at PR time** — P104 smoke test is regex-based per `tests/p104-seed-smoke.spec.ts` (12 cases). Full WASM DB load per P104 § honest-deferred remains TBD.

---

Sources:

- `tests/fixtures/project-1-axon-cli-logevents.json` (19 rows, bare array)
- `tests/fixtures/project-2-greenlane-startup-logevents.json` (13 rows, bare array; `p5-greenlane-session-01`)
- `tests/fixtures/project-3-quattro-studio-logevents.json` (12 rows, bare array; `p5-quattro-session-01`)
- `tests/fixtures/project-4-mrs-albright-tutoring-logevents.json` (11 rows in `.rows[]`; object root with `_meta`)
- `tests/fixtures/project-5-bordo-spec-logevents.json` (8 rows, bare array)
- `tests/fixtures/e2e2-seed.json` (35 rows, bare array; 3 sessions)
- `src/contexts/persistence/repositories/comprehensiveLogs.ts` (lines 50-66 enum / 75-90 validator / 168-183 redaction / 340-365 prune)
- `src/contexts/persistence/migrations/005-comprehensive-logs.sql` (lines 42-69 log_events table; CHECK enum at 47-58)
- `src/contexts/persistence/db.ts` (lines 113-120 retention sweep wire)
