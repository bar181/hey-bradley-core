// llm_logs repository — typed CRUD over sql.js.
// Spec: 18b mandate Wave 2 Agent A4 (per-call observability log).
// Cross-ref: plans/implementation/phase-18b/ruvector-research.md (Deltas D1-D3).
// Cross-ref: docs/adr/ADR-047-llm-logging-observability.md (privacy / export exclusion).
//
// Supplementary to llm_calls — does NOT replace it. llm_calls remains the
// source of truth for cost-cap math (P17 audit log). llm_logs adds dual-id,
// retry-chain correlation, split tokens, and prompt hashing for forensics.

import { getDB, persist } from '../db';

export type LLMLogStatus =
  | 'ok'
  | 'error'
  | 'timeout'
  | 'validation_failed'
  | 'cost_cap'
  | 'rate_limit';

export interface LLMLogRow {
  id: number;
  request_id: string;
  parent_request_id: string | null;
  session_id: string;
  project_id: string;
  provider: string;
  model: string;
  prompt_hash: string;
  system_prompt: string | null;
  user_prompt: string | null;
  response_raw: string | null;
  patch_count: number;
  input_tokens: number | null;
  output_tokens: number | null;
  cost_usd: number | null;
  latency_ms: number | null;
  status: LLMLogStatus;
  error_kind: string | null;
  started_at: number;
  created_at: number;
}

type SqlBindable = string | number | null;
const sn = (v: string | null | undefined): string | null => (v == null ? null : v);
const nn = (v: number | null | undefined): number | null => (v == null ? null : v);

export function recordLLMLog(args: Omit<LLMLogRow, 'id' | 'created_at'>): LLMLogRow {
  const db = getDB();
  const created_at = Date.now();
  const ins = db.prepare(
    `INSERT INTO llm_logs (
       request_id, parent_request_id, session_id, project_id, provider, model,
       prompt_hash, system_prompt, user_prompt, response_raw, patch_count,
       input_tokens, output_tokens, cost_usd, latency_ms, status, error_kind,
       started_at, created_at
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  try {
    ins.run([
      args.request_id, sn(args.parent_request_id), args.session_id, args.project_id,
      args.provider, args.model, args.prompt_hash,
      sn(args.system_prompt), sn(args.user_prompt), sn(args.response_raw),
      args.patch_count,
      nn(args.input_tokens), nn(args.output_tokens), nn(args.cost_usd), nn(args.latency_ms),
      args.status, sn(args.error_kind),
      args.started_at, created_at,
    ]);
  } finally { ins.free(); }
  const idStmt = db.prepare('SELECT last_insert_rowid() AS id');
  let id = 0;
  try {
    if (idStmt.step()) id = (idStmt.getAsObject() as { id: number }).id;
  } finally { idStmt.free(); }
  void persist();
  return { id, ...args, created_at };
}

export function updateLLMLog(
  id: number,
  fields: Partial<Pick<LLMLogRow,
    'status' | 'error_kind' | 'patch_count' | 'response_raw' | 'output_tokens' | 'latency_ms' | 'cost_usd'
  >>,
): void {
  const sets: string[] = [];
  const args: SqlBindable[] = [];
  if (fields.status !== undefined)        { sets.push('status = ?');        args.push(fields.status); }
  if (fields.error_kind !== undefined)    { sets.push('error_kind = ?');    args.push(fields.error_kind); }
  if (fields.patch_count !== undefined)   { sets.push('patch_count = ?');   args.push(fields.patch_count); }
  if (fields.response_raw !== undefined)  { sets.push('response_raw = ?');  args.push(fields.response_raw); }
  if (fields.output_tokens !== undefined) { sets.push('output_tokens = ?'); args.push(fields.output_tokens); }
  if (fields.latency_ms !== undefined)    { sets.push('latency_ms = ?');    args.push(fields.latency_ms); }
  if (fields.cost_usd !== undefined)      { sets.push('cost_usd = ?');      args.push(fields.cost_usd); }
  if (sets.length === 0) return;
  args.push(id);
  const stmt = getDB().prepare(`UPDATE llm_logs SET ${sets.join(', ')} WHERE id = ?`);
  try { stmt.run(args); } finally { stmt.free(); }
  void persist();
}

export function listLLMLogs(session_id: string, limit = 50): LLMLogRow[] {
  const stmt = getDB().prepare('SELECT * FROM llm_logs WHERE session_id = ? ORDER BY id ASC LIMIT ?');
  const out: LLMLogRow[] = [];
  try {
    stmt.bind([session_id, limit]);
    while (stmt.step()) out.push(stmt.getAsObject() as unknown as LLMLogRow);
  } finally { stmt.free(); }
  return out;
}

export function getLLMLogByRequestId(request_id: string): LLMLogRow | null {
  const stmt = getDB().prepare('SELECT * FROM llm_logs WHERE request_id = ? LIMIT 1');
  try {
    stmt.bind([request_id]);
    if (stmt.step()) return stmt.getAsObject() as unknown as LLMLogRow;
    return null;
  } finally { stmt.free(); }
}

export function pruneOldLLMLogs(beforeMs: number): number {
  const db = getDB();
  const stmt = db.prepare('DELETE FROM llm_logs WHERE created_at < ?');
  try { stmt.run([beforeMs]); } finally { stmt.free(); }
  const count = db.getRowsModified();
  void persist();
  return count;
}
