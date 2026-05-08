-- 004-prompt-library.sql
-- Spec: P59 Test Library — comprehensive prompt corpus persisted alongside
-- the existing `example_prompts` (P18b) and `user_templates` (P30) tables.
-- Cross-ref: tests/prompts/*.json (Agent A1 owns the source-of-truth JSON
-- corpus; this table mirrors those entries so the running app can browse,
-- filter, and EXPERT-tab inspect the library at runtime).
--
-- Schema-only here; runner bumps schema_version 4 -> 5.
--
-- Why a separate table from `example_prompts`:
-- * `example_prompts` (P18b) holds expected JSON Patch envelopes — pipeline
--   regression fixtures keyed on `expected_envelope_json`.
-- * `prompt_library` (this table) holds the AISP-aware corpus — keyed on
--   the 5-atom protocol (PATCH / INTENT / SELECTION / CONTENT / ASSUMPTIONS
--   + FALLBACK) plus persona / difficulty for capstone-grade evaluation.
-- The two tables are intentionally independent; a slug here can collide
-- with one in example_prompts without contention.
--
-- Privacy: `input` is user-authored prompt text — passes through
-- redactKeyShapes at the seed boundary (see promptLibrary.ts) for
-- defence-in-depth even though the corpus ships in source.
--
-- Seed: NOT in this file. Seeding lives in
-- repositories/promptLibrary.ts::seedPromptLibraryFromFiles() so we can
-- read the 4 JSON files via Vite's import.meta.glob at runtime. Idempotent
-- via ON CONFLICT(slug) DO UPDATE — re-running initDB() never duplicates rows.
CREATE TABLE prompt_library (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  slug            TEXT NOT NULL UNIQUE,
  file_source     TEXT NOT NULL CHECK (file_source IN ('by-persona','by-atom','by-section','edge-cases')),
  input           TEXT NOT NULL,
  expected_atom   TEXT NOT NULL CHECK (expected_atom IN ('PATCH','INTENT','SELECTION','CONTENT','ASSUMPTIONS','FALLBACK')),
  expected_verb   TEXT,
  expected_target TEXT,
  expected_route  TEXT CHECK (expected_route IN ('design','content','ambiguous') OR expected_route IS NULL),
  persona         TEXT NOT NULL,
  difficulty      TEXT NOT NULL CHECK (difficulty IN ('trivial','easy','medium','hard','adversarial')),
  created_at      INTEGER NOT NULL
);
CREATE INDEX idx_prompt_library_persona    ON prompt_library(persona);
CREATE INDEX idx_prompt_library_atom       ON prompt_library(expected_atom);
CREATE INDEX idx_prompt_library_difficulty ON prompt_library(difficulty);
