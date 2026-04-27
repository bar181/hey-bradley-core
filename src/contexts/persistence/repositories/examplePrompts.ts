// Typed CRUD over `example_prompts` + `example_prompt_runs`.
// Spec: plans/implementation/mvp-plan/04-phase-18b-wave1.md (Agent A1b).
// Decision record: docs/adr/ADR-040-local-sqlite-persistence.md.
// Holds golden user-prompt -> envelope pairs; runs table records actual LLM
// responses for cross-checking against the predicted envelopes.

import { getDB, persist } from '../db';

export type ExamplePromptCategory =
  | 'starter' | 'edge_case' | 'safety' | 'multi_section' | 'site_context' | 'content_gen';
export type ExamplePromptOutcome = 'success' | 'reject' | 'fallback';
export type ExamplePromptMatch = 0 | 1 | 2;

export interface ExamplePromptRow {
  id: number; slug: string; category: ExamplePromptCategory;
  user_prompt: string; match_pattern: string | null;
  expected_envelope_json: string; expected_outcome: ExamplePromptOutcome;
  notes: string | null; created_at: number; updated_at: number;
}
export interface ExamplePromptRunRow {
  id: number; example_prompt_id: number; provider: string; model: string;
  actual_response_json: string; matches_expected: ExamplePromptMatch;
  diff_summary: string | null;
  tokens_in: number | null; tokens_out: number | null;
  cost_usd: number | null; latency_ms: number | null; created_at: number;
}

const PCOLS = 'id, slug, category, user_prompt, match_pattern, expected_envelope_json, expected_outcome, notes, created_at, updated_at';
const RCOLS = 'id, example_prompt_id, provider, model, actual_response_json, matches_expected, diff_summary, tokens_in, tokens_out, cost_usd, latency_ms, created_at';

export function listExamplePrompts(filter?: { category?: ExamplePromptCategory }): ExamplePromptRow[] {
  const where = filter?.category ? ' WHERE category = ?' : '';
  const stmt = getDB().prepare(`SELECT ${PCOLS} FROM example_prompts${where} ORDER BY id ASC`);
  const rows: ExamplePromptRow[] = [];
  try {
    if (filter?.category) stmt.bind([filter.category]);
    while (stmt.step()) rows.push(stmt.getAsObject() as unknown as ExamplePromptRow);
  } finally { stmt.free(); }
  return rows;
}

export function getExamplePrompt(id: number): ExamplePromptRow | null {
  const stmt = getDB().prepare(`SELECT ${PCOLS} FROM example_prompts WHERE id = ?`);
  try {
    stmt.bind([id]);
    return stmt.step() ? (stmt.getAsObject() as unknown as ExamplePromptRow) : null;
  } finally { stmt.free(); }
}

/** Exact match on user_prompt first; otherwise scan match_pattern rows and
 *  return the first whose regex (case-insensitive) matches. Malformed
 *  patterns are skipped silently. Returns null when nothing matches. */
export function findExamplePromptForUserPrompt(userPrompt: string): ExamplePromptRow | null {
  const db = getDB();
  const exact = db.prepare(`SELECT ${PCOLS} FROM example_prompts WHERE user_prompt = ? LIMIT 1`);
  try {
    exact.bind([userPrompt]);
    if (exact.step()) return exact.getAsObject() as unknown as ExamplePromptRow;
  } finally { exact.free(); }
  const re = db.prepare(`SELECT ${PCOLS} FROM example_prompts WHERE match_pattern IS NOT NULL ORDER BY id ASC`);
  try {
    while (re.step()) {
      const row = re.getAsObject() as unknown as ExamplePromptRow;
      if (!row.match_pattern) continue;
      try { if (new RegExp(row.match_pattern, 'i').test(userPrompt)) return row; }
      catch { /* malformed pattern — skip */ }
    }
  } finally { re.free(); }
  return null;
}

export function recordExamplePromptRun(args: {
  example_prompt_id: number; provider: string; model: string;
  actual_response_json: string; matches_expected: ExamplePromptMatch;
  diff_summary?: string; tokens_in?: number; tokens_out?: number;
  cost_usd?: number; latency_ms?: number;
}): ExamplePromptRunRow {
  const db = getDB();
  const created_at = Date.now();
  const ins = db.prepare(
    `INSERT INTO example_prompt_runs (example_prompt_id, provider, model, actual_response_json, matches_expected, diff_summary, tokens_in, tokens_out, cost_usd, latency_ms, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  try {
    ins.run([
      args.example_prompt_id, args.provider, args.model, args.actual_response_json,
      args.matches_expected, args.diff_summary ?? null,
      args.tokens_in ?? null, args.tokens_out ?? null,
      args.cost_usd ?? null, args.latency_ms ?? null, created_at,
    ]);
  } finally { ins.free(); }
  const sel = db.prepare(`SELECT ${RCOLS} FROM example_prompt_runs WHERE id = last_insert_rowid()`);
  let row: ExamplePromptRunRow | null = null;
  try {
    if (sel.step()) row = sel.getAsObject() as unknown as ExamplePromptRunRow;
  } finally { sel.free(); }
  void persist();
  if (!row) throw new Error('[examplePrompts] insert succeeded but row not found');
  return row;
}

export function listExamplePromptRuns(example_prompt_id: number): ExamplePromptRunRow[] {
  const stmt = getDB().prepare(`SELECT ${RCOLS} FROM example_prompt_runs WHERE example_prompt_id = ? ORDER BY id ASC`);
  const rows: ExamplePromptRunRow[] = [];
  try {
    stmt.bind([example_prompt_id]);
    while (stmt.step()) rows.push(stmt.getAsObject() as unknown as ExamplePromptRunRow);
  } finally { stmt.free(); }
  return rows;
}
