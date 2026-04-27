-- 002-llm-logs.sql
-- Spec: 18b mandate Wave 2 Agent A4 (per-call observability log).
-- Cross-ref: plans/implementation/phase-18b/ruvector-research.md (Schema Deltas D1-D3).
-- Cross-ref: docs/adr/ADR-047-multi-provider-logging.md (export exclusion).
--
-- This is supplementary to llm_calls (P16/P17 audit-light, used for cap math).
-- llm_logs is forensic + observability: dual-id, retry chain, prompt hash,
-- split tokens. Schema-only here; runner bumps schema_version 2 -> 3.
--
-- Privacy: system_prompt + user_prompt + response_raw are STRIPPED from
-- .heybradley export bundles via exportSanitizedDBBytes (ADR-047). error_kind
-- holds a short slug only; raw error text is redacted via redactKeyShapes
-- before any persistence per ADR-043.
CREATE TABLE llm_logs (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id        TEXT NOT NULL UNIQUE,             -- D1: ruvector dual-id (UUID v4)
  parent_request_id TEXT,                              -- D1: retry chain root; NULL on first attempt
  session_id        TEXT NOT NULL,
  project_id        TEXT NOT NULL,
  provider          TEXT NOT NULL,                    -- claude|gemini|openrouter|simulated|mock|agent-proxy
  model             TEXT NOT NULL,
  prompt_hash       TEXT NOT NULL,                    -- D3: SHA-256 hex of (system||'\n'||user)
  system_prompt     TEXT,
  user_prompt       TEXT,
  response_raw      TEXT,
  patch_count       INTEGER NOT NULL DEFAULT 0,
  input_tokens      INTEGER,                           -- D2: split from monolithic tokens
  output_tokens     INTEGER,                           -- D2: split
  cost_usd          REAL,
  latency_ms        INTEGER,                           -- ruvector P2: ms unit
  status            TEXT NOT NULL CHECK (status IN ('ok','error','timeout','validation_failed','cost_cap','rate_limit')),
  error_kind        TEXT,                              -- LLMError.kind member (no raw detail)
  started_at        INTEGER NOT NULL,                  -- ruvector P5: started; completed = started + latency_ms
  created_at        INTEGER NOT NULL                   -- when row was written
);
CREATE INDEX idx_llm_logs_session  ON llm_logs(session_id, id);
CREATE INDEX idx_llm_logs_provider ON llm_logs(provider, created_at);
CREATE INDEX idx_llm_logs_request  ON llm_logs(request_id);
CREATE INDEX idx_llm_logs_parent   ON llm_logs(parent_request_id);
