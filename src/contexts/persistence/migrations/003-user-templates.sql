-- 003-user-templates.sql
-- Spec: P30 Sprint D P2 (Template Persistence).
-- Cross-ref: docs/adr/ADR-058-template-library-api.md (Library API; P29)
-- Cross-ref: docs/adr/ADR-059-template-persistence.md (this migration's contract)
--
-- Persists user-generated templates so the Library API (P29 library.ts)
-- can return registry-baked + user-authored templates as a unified set.
-- Schema-only here; runner bumps schema_version 3 -> 4.
--
-- Privacy: user_templates rows are USER CONTENT — explicitly NOT stripped
-- from .heybradley export bundles (opt-in by export). See ADR-059 §Privacy.
--
-- FK to projects deferred (consistent with ADR-040b llm_logs FK deferral):
-- application-layer invariant via createUserTemplate() validates project_id
-- before insert; sql.js DDL-rebuild cost not justified for this table.
CREATE TABLE user_templates (
  id            TEXT PRIMARY KEY,                       -- slug-style id (e.g. 'my-cta-section')
  name          TEXT NOT NULL,                          -- display name (user-authored)
  category      TEXT NOT NULL CHECK (category IN ('theme','section','content')),
  kind          TEXT NOT NULL CHECK (kind IN ('patcher','generator')),
  examples_json TEXT NOT NULL DEFAULT '[]',             -- JSON-serialized string[]
  payload_json  TEXT NOT NULL,                          -- JSON-serialized Template (id, match, build, etc.)
  created_at    INTEGER NOT NULL,
  updated_at    INTEGER NOT NULL
);
CREATE INDEX idx_user_templates_category ON user_templates(category);
CREATE INDEX idx_user_templates_kind     ON user_templates(kind);
