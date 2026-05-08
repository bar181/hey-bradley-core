// Messages repository — typed CRUD for chat_messages and listen_transcripts.
// Spec: plans/implementation/mvp-plan/02-phase-16-local-db.md §3.4 (schema).
// Decision record: docs/adr/ADR-040-local-sqlite-persistence.md.

import type { Database, Statement } from 'sql.js';
import { getDB, persist } from '../db';

export interface ChatMessageRow {
  id: number;
  session_id: string;
  role: 'user' | 'bradley' | 'system';
  text: string;
  created_at: number;
}

export interface ListenTranscriptRow {
  id: number;
  session_id: string;
  text: string;
  created_at: number;
}

type ChatRole = ChatMessageRow['role'];
const ROLES: readonly ChatRole[] = ['user', 'bradley', 'system'];

function lastInsertId(db: Database): number {
  const s = db.prepare('SELECT last_insert_rowid() AS id');
  try { return s.step() ? Number(s.getAsObject().id) : 0; } finally { s.free(); }
}

function collect<T>(stmt: Statement, map: (o: Record<string, unknown>) => T): T[] {
  const rows: T[] = [];
  try { while (stmt.step()) rows.push(map(stmt.getAsObject())); } finally { stmt.free(); }
  return rows;
}

function toChat(o: Record<string, unknown>): ChatMessageRow {
  const role = String(o.role) as ChatRole;
  if (!ROLES.includes(role)) throw new Error(`[messages] invalid role: ${role}`);
  return {
    id: Number(o.id),
    session_id: String(o.session_id),
    role,
    text: String(o.text),
    created_at: Number(o.created_at),
  };
}

export function appendChatMessage(m: { session_id: string; role: ChatRole; text: string }): ChatMessageRow {
  const db = getDB();
  const created_at = Date.now();
  const stmt = db.prepare('INSERT INTO chat_messages (session_id, role, text, created_at) VALUES (?, ?, ?, ?)');
  try { stmt.run([m.session_id, m.role, m.text, created_at]); } finally { stmt.free(); }
  const id = lastInsertId(db);
  void persist();
  return { id, session_id: m.session_id, role: m.role, text: m.text, created_at };
}

export function listChatMessages(session_id: string, limit = 100): ChatMessageRow[] {
  const stmt = getDB().prepare(
    'SELECT id, session_id, role, text, created_at FROM (SELECT * FROM chat_messages WHERE session_id = ? ORDER BY id DESC LIMIT ?) ORDER BY id ASC',
  );
  stmt.bind([session_id, limit]);
  return collect(stmt, toChat);
}

export function appendListenTranscript(t: { session_id: string; text: string }): ListenTranscriptRow {
  const db = getDB();
  const created_at = Date.now();
  const stmt = db.prepare('INSERT INTO listen_transcripts (session_id, text, created_at) VALUES (?, ?, ?)');
  try { stmt.run([t.session_id, t.text, created_at]); } finally { stmt.free(); }
  const id = lastInsertId(db);
  void persist();
  return { id, session_id: t.session_id, text: t.text, created_at };
}

export function listListenTranscripts(session_id: string, limit = 100): ListenTranscriptRow[] {
  const stmt = getDB().prepare(
    'SELECT id, session_id, text, created_at FROM (SELECT * FROM listen_transcripts WHERE session_id = ? ORDER BY id DESC LIMIT ?) ORDER BY id ASC',
  );
  stmt.bind([session_id, limit]);
  return collect(stmt, (o) => ({
    id: Number(o.id),
    session_id: String(o.session_id),
    text: String(o.text),
    created_at: Number(o.created_at),
  }));
}
