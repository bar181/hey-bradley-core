-- 005-comprehensive-logs.sql
-- Spec: P100 Wave 2 / Agent A1 (comprehensive forensic log infrastructure).
-- Cross-ref: plans/implementation/phase-100/log-design.md §3 (11 categories).
-- Cross-ref: docs/adr/ADR-126 (P100 W2 — comprehensive log architecture).
--
-- This migration installs the forensic log surface that captures every
-- pipeline stage (chat / listen / planning) into two tables:
--   * log_events     — master event log; the 13 event_type values map onto the
--                      11 §3 categories plus split rows for decomp_per_todo
--                      and todo_execution traces (modeled at the repo layer).
--   * edit_history   — per-patch before/after snapshots for replay/forensics.
--
-- Privacy: writers MUST run redactKeyShapes over event_data + before/after
-- snapshots before insert (see comprehensiveLogs.ts). The schema itself does
-- NOT enforce redaction — defence-in-depth lives at the repo write boundary.
--
-- Idempotency: CREATE TABLE IF NOT EXISTS + CREATE INDEX IF NOT EXISTS make
-- this migration safe to re-run. The runner additionally gates on
-- schema_version > num (migrations/index.ts:58-59), so under normal operation
-- this migration applies exactly once per DB.
--
-- llm_logs.project_id: NOTE — migration 002 already declares
-- `project_id TEXT NOT NULL` on llm_logs (see 002-llm-logs.sql:19), so no
-- ALTER TABLE is needed here. The §4 join key is already present. This
-- comment is load-bearing: the original P100 W2 / A1 brief asked for an
-- ALTER ADD COLUMN, but the column already exists from P18b. Adding it
-- again would raise "duplicate column name" and rollback the entire
-- migration. Confirmed via grep on 002-llm-logs.sql. See log-design.md §7(b).
--
-- Schema-only here; runner bumps schema_version 5 -> 6.
CREATE TABLE IF NOT EXISTS log_events (
  id           TEXT PRIMARY KEY,                      -- UUID v4 (stage_id)
  session_id   TEXT NOT NULL,
  request_id   TEXT NOT NULL,
  project_id   TEXT,
  event_type   TEXT NOT NULL CHECK (event_type IN (
    'input_event','intent_classification','decomposition','template_match',
    'patch_validation','personality_display','listen_capture','multi_page_scope',
    'process_atom_output','ddd_atom_output','error_event','response_summary',
    'todo_execution'
  )),
  event_data   TEXT NOT NULL,                          -- JSON blob (redacted before write)
  page_id      TEXT,
  page_index   INTEGER,
  input_type   TEXT CHECK (input_type IN ('chat','listen')),
  latency_ms   INTEGER,
  created_at   INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000)
);
CREATE INDEX IF NOT EXISTS idx_log_events_session ON log_events(session_id);
CREATE INDEX IF NOT EXISTS idx_log_events_request ON log_events(request_id);
CREATE INDEX IF NOT EXISTS idx_log_events_project ON log_events(project_id);
CREATE INDEX IF NOT EXISTS idx_log_events_created ON log_events(created_at);

CREATE TABLE IF NOT EXISTS edit_history (
  id                TEXT PRIMARY KEY,                 -- UUID v4
  project_id        TEXT NOT NULL,
  session_id        TEXT NOT NULL,
  request_id        TEXT NOT NULL,
  patch_applied     TEXT NOT NULL,                    -- JSON Patch array
  section_affected  TEXT,
  page_id           TEXT,
  before_snapshot   TEXT NOT NULL,                    -- JSON of relevant config slice (redacted)
  after_snapshot   TEXT NOT NULL,                     -- JSON of relevant config slice (redacted)
  user_prompt       TEXT NOT NULL,                    -- redacted
  created_at        INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000)
);
CREATE INDEX IF NOT EXISTS idx_edit_history_project ON edit_history(project_id);
CREATE INDEX IF NOT EXISTS idx_edit_history_session ON edit_history(session_id);
CREATE INDEX IF NOT EXISTS idx_edit_history_request ON edit_history(request_id);
