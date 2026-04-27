// llm_calls repository — typed CRUD over sql.js.
// Spec: plans/implementation/mvp-plan/02-phase-16-local-db.md §3.4 (llm_calls schema).
// Decision record: docs/adr/ADR-040-local-sqlite-persistence.md (LRU cap deferred).

import { getDB, persist } from '../db';

export type LLMCallStatus = 'ok' | 'error' | 'timeout' | 'validation_failed';

export interface LLMCallRow {
  id: number;
  session_id: string;
  provider: string;
  model: string;
  prompt_tokens: number | null;
  output_tokens: number | null;
  cost_usd: number | null;
  status: LLMCallStatus;
  patch_json: string | null;
  error_text: string | null;
  created_at: number;
}

const nn = (v: number | undefined): number | null => (v === undefined ? null : v);
const sn = (v: string | undefined): string | null => (v === undefined ? null : v);

export function recordLLMCall(c: {
  session_id: string;
  provider: string;
  model: string;
  prompt_tokens?: number;
  output_tokens?: number;
  cost_usd?: number;
  status: LLMCallStatus;
  patch_json?: string;
  error_text?: string;
}): LLMCallRow {
  const db = getDB();
  const created_at = Date.now();
  const ins = db.prepare(
    `INSERT INTO llm_calls (session_id, provider, model, prompt_tokens, output_tokens, cost_usd, status, patch_json, error_text, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  try {
    ins.run([
      c.session_id, c.provider, c.model,
      nn(c.prompt_tokens), nn(c.output_tokens), nn(c.cost_usd),
      c.status, sn(c.patch_json), sn(c.error_text), created_at,
    ]);
  } finally { ins.free(); }
  const idStmt = db.prepare('SELECT last_insert_rowid() AS id');
  let id = 0;
  try {
    if (idStmt.step()) id = (idStmt.getAsObject() as { id: number }).id;
  } finally { idStmt.free(); }
  void persist();
  return {
    id, session_id: c.session_id, provider: c.provider, model: c.model,
    prompt_tokens: nn(c.prompt_tokens), output_tokens: nn(c.output_tokens),
    cost_usd: nn(c.cost_usd), status: c.status,
    patch_json: sn(c.patch_json), error_text: sn(c.error_text), created_at,
  };
}

export function listLLMCalls(session_id: string, limit = 50): LLMCallRow[] {
  const stmt = getDB().prepare('SELECT * FROM llm_calls WHERE session_id = ? ORDER BY id ASC LIMIT ?');
  const out: LLMCallRow[] = [];
  try {
    stmt.bind([session_id, limit]);
    while (stmt.step()) out.push(stmt.getAsObject() as unknown as LLMCallRow);
  } finally { stmt.free(); }
  return out;
}

export function sumSessionCostUsd(session_id: string): number {
  const stmt = getDB().prepare(
    'SELECT COALESCE(SUM(cost_usd), 0) AS total FROM llm_calls WHERE session_id = ? AND cost_usd IS NOT NULL',
  );
  try {
    stmt.bind([session_id]);
    if (stmt.step()) return (stmt.getAsObject() as { total: number | null }).total ?? 0;
    return 0;
  } finally { stmt.free(); }
}

export function sumSessionTokens(session_id: string): { in: number; out: number } {
  const stmt = getDB().prepare(
    'SELECT COALESCE(SUM(prompt_tokens), 0) AS i, COALESCE(SUM(output_tokens), 0) AS o FROM llm_calls WHERE session_id = ?',
  );
  try {
    stmt.bind([session_id]);
    if (stmt.step()) {
      const r = stmt.getAsObject() as { i: number | null; o: number | null };
      return { in: r.i ?? 0, out: r.o ?? 0 };
    }
    return { in: 0, out: 0 };
  } finally { stmt.free(); }
}

export function pruneOldLLMCalls(beforeMs: number): number {
  const db = getDB();
  const stmt = db.prepare('DELETE FROM llm_calls WHERE created_at < ?');
  try { stmt.run([beforeMs]); } finally { stmt.free(); }
  const count = db.getRowsModified();
  void persist();
  return count;
}
