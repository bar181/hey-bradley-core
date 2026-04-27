-- 000-init.sql
CREATE TABLE schema_version (version INTEGER NOT NULL);
INSERT INTO schema_version (version) VALUES (1);

CREATE TABLE projects (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  config_json TEXT NOT NULL,
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
