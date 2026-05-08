// Typed CRUD repository for the `projects` table.
// Spec: plans/implementation/mvp-plan/02-phase-16-local-db.md §3.4 (schema), §3.6 (adapter shape).
// Decision record: docs/adr/ADR-040-local-sqlite-persistence.md.

import type { Statement } from 'sql.js';
import { getDB, persist } from '../db';

export interface ProjectRow {
  id: string;
  name: string;
  config_json: string;
  created_at: number;
  updated_at: number;
}

function readRow(stmt: Statement): ProjectRow {
  const o = stmt.getAsObject();
  return {
    id: String(o.id),
    name: String(o.name),
    config_json: String(o.config_json),
    created_at: Number(o.created_at),
    updated_at: Number(o.updated_at),
  };
}

export function listProjects(): ProjectRow[] {
  const stmt = getDB().prepare('SELECT id, name, config_json, created_at, updated_at FROM projects ORDER BY updated_at DESC');
  const rows: ProjectRow[] = [];
  try {
    while (stmt.step()) rows.push(readRow(stmt));
  } finally {
    stmt.free();
  }
  return rows;
}

export function getProject(id: string): ProjectRow | undefined {
  const stmt = getDB().prepare('SELECT id, name, config_json, created_at, updated_at FROM projects WHERE id = ?');
  try {
    stmt.bind([id]);
    return stmt.step() ? readRow(stmt) : undefined;
  } finally {
    stmt.free();
  }
}

export function upsertProject(p: { id: string; name: string; config: unknown }): ProjectRow {
  const existing = getProject(p.id);
  const now = Date.now();
  const created_at = existing ? existing.created_at : now;
  const config_json = JSON.stringify(p.config);
  const stmt = getDB().prepare('INSERT OR REPLACE INTO projects (id, name, config_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?)');
  try {
    stmt.run([p.id, p.name, config_json, created_at, now]);
  } finally {
    stmt.free();
  }
  void persist();
  return { id: p.id, name: p.name, config_json, created_at, updated_at: now };
}

export function deleteProject(id: string): void {
  const stmt = getDB().prepare('DELETE FROM projects WHERE id = ?');
  try {
    stmt.run([id]);
  } finally {
    stmt.free();
  }
  void persist();
}

export function projectCount(): number {
  const stmt = getDB().prepare('SELECT COUNT(*) AS n FROM projects');
  try {
    stmt.step();
    return Number(stmt.getAsObject().n);
  } finally {
    stmt.free();
  }
}
