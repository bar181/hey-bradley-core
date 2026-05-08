// Sessions repository — typed CRUD over the `sessions` table.
// Spec: plans/implementation/mvp-plan/02-phase-16-local-db.md §3.4 (schema).
// Decision record: docs/adr/ADR-040-local-sqlite-persistence.md.

import { getDB, persist } from '../db';

export interface SessionRow {
  id: string;
  project_id: string;
  started_at: number;
  ended_at: number | null;
}

function rowFromObject(o: Record<string, unknown>): SessionRow {
  return {
    id: String(o.id),
    project_id: String(o.project_id),
    started_at: Number(o.started_at),
    ended_at: o.ended_at == null ? null : Number(o.ended_at),
  };
}

export function startSession(projectId: string): SessionRow {
  const db = getDB();
  const row: SessionRow = {
    id: crypto.randomUUID(),
    project_id: projectId,
    started_at: Date.now(),
    ended_at: null,
  };
  const stmt = db.prepare(
    'INSERT INTO sessions (id, project_id, started_at, ended_at) VALUES (?, ?, ?, ?)',
  );
  try {
    stmt.run([row.id, row.project_id, row.started_at, null]);
  } finally {
    stmt.free();
  }
  void persist();
  return row;
}

export function endSession(id: string): void {
  const db = getDB();
  const stmt = db.prepare('UPDATE sessions SET ended_at = ? WHERE id = ?');
  try {
    stmt.run([Date.now(), id]);
  } finally {
    stmt.free();
  }
  void persist();
}

export function getSession(id: string): SessionRow | undefined {
  const db = getDB();
  const stmt = db.prepare('SELECT id, project_id, started_at, ended_at FROM sessions WHERE id = ?');
  try {
    stmt.bind([id]);
    if (!stmt.step()) return undefined;
    return rowFromObject(stmt.getAsObject());
  } finally {
    stmt.free();
  }
}

export function listSessions(projectId: string, limit = 20): SessionRow[] {
  const db = getDB();
  const stmt = db.prepare(
    'SELECT id, project_id, started_at, ended_at FROM sessions WHERE project_id = ? ORDER BY started_at DESC LIMIT ?',
  );
  const rows: SessionRow[] = [];
  try {
    stmt.bind([projectId, limit]);
    while (stmt.step()) rows.push(rowFromObject(stmt.getAsObject()));
  } finally {
    stmt.free();
  }
  return rows;
}

export function activeSession(projectId: string): SessionRow | undefined {
  const db = getDB();
  const stmt = db.prepare(
    'SELECT id, project_id, started_at, ended_at FROM sessions WHERE project_id = ? AND ended_at IS NULL ORDER BY started_at DESC LIMIT 1',
  );
  try {
    stmt.bind([projectId]);
    if (!stmt.step()) return undefined;
    return rowFromObject(stmt.getAsObject());
  } finally {
    stmt.free();
  }
}
