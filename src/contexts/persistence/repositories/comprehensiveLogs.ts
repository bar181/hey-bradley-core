// comprehensiveLogs repository — typed CRUD over the P100 W2 forensic log
// surface (`log_events` + `edit_history`).
// Spec: P100 W2 / A1 — log-design.md §3 (categories) + §4 (linking) + §6.
// Cross-ref: docs/adr/ADR-126.
//
// * Fire-and-forget: every write is wrapped in try/catch and never throws.
// * Redaction: event_data + snapshots + user_prompt are JSON-stringified +
//   redactKeyShapes()-scrubbed at the boundary (defence-in-depth; ADR-043).
// * UUIDs: crypto.randomUUID() preferred; Math.random fallback for older harnesses.

import type { Database } from 'sql.js';

// ─── Types ────────────────────────────────────────────────────────────────

export type LogEventType =
  | 'input_event'
  | 'intent_classification'
  | 'decomposition'
  | 'template_match'
  | 'patch_validation'
  | 'personality_display'
  | 'listen_capture'
  | 'multi_page_scope'
  | 'process_atom_output'
  | 'ddd_atom_output'
  | 'error_event'
  | 'response_summary'
  | 'todo_execution';

export type InputType = 'chat' | 'listen';

export interface LogEventInsert {
  id: string;
  sessionId: string;
  requestId: string;
  projectId?: string;
  eventType: LogEventType;
  eventData: Record<string, unknown>;
  pageId?: string;
  pageIndex?: number;
  inputType?: InputType;
  latencyMs?: number;
}

export interface EditHistoryInsert {
  id: string;
  projectId: string;
  sessionId: string;
  requestId: string;
  patchApplied: unknown[];
  sectionAffected?: string;
  pageId?: string;
  beforeSnapshot: unknown;
  afterSnapshot: unknown;
  userPrompt: string;
}

interface LogEventRow {
  id: string;
  session_id: string;
  request_id: string;
  project_id: string | null;
  event_type: LogEventType;
  event_data: string;
  page_id: string | null;
  page_index: number | null;
  input_type: InputType | null;
  latency_ms: number | null;
  created_at: number;
}

interface EditHistoryRow {
  id: string;
  project_id: string;
  session_id: string;
  request_id: string;
  patch_applied: string;
  section_affected: string | null;
  page_id: string | null;
  before_snapshot: string;
  after_snapshot: string;
  user_prompt: string;
  created_at: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_EVENT_RETENTION_DAYS = 30;
const DEFAULT_EDIT_RETENTION_DAYS = 90;

// ─── Public helpers ───────────────────────────────────────────────────────

/** UUID v4 (browser crypto.randomUUID; Math.random fallback). Used as request_id / stage_id per §4. */
export function newRequestId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch { /* fall through */ }
  const b = [8, 4, 4, 4, 12].map((n) =>
    Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
  );
  return `${b[0]}-${b[1]}-4${b[2].slice(1)}-${b[3]}-${b[4]}`;
}

/** Strip BYOK key shapes from any string before persisting (mirrors llm/keys.ts; ADR-043). */
export function redactKeyShapes(s: string): string {
  if (!s) return s;
  return s
    .replace(/sk-ant-[A-Za-z0-9_-]{20,}/g, '[REDACTED]')
    .replace(/sk-proj-[A-Za-z0-9_-]{20,}/g, '[REDACTED]')
    .replace(/sk-or-[A-Za-z0-9_-]{20,}/g, '[REDACTED]')
    .replace(/sk-[A-Za-z0-9_-]{20,}/g, '[REDACTED]')
    .replace(/AIza[0-9A-Za-z_-]{35}/g, '[REDACTED]')
    .replace(/Bearer\s+\S+/g, '[REDACTED]');
}

/** JSON.stringify + redactKeyShapes; never throws. */
function safeStringifyRedacted(value: unknown): string {
  let out: string;
  try { out = JSON.stringify(value); } catch { out = '"[unstringifiable]"'; }
  return redactKeyShapes(out);
}

function warn(label: string, err: unknown): void {
  if (typeof console !== 'undefined') console.warn(`[comprehensiveLogs] ${label} failed`, err);
}

// ─── Writes ───────────────────────────────────────────────────────────────

/** Insert a log event. Fire-and-forget; never throws. */
export function writeLogEvent(db: Database, event: LogEventInsert): void {
  let stmt: ReturnType<Database['prepare']> | null = null;
  try {
    stmt = db.prepare(
      `INSERT INTO log_events (
         id, session_id, request_id, project_id, event_type, event_data,
         page_id, page_index, input_type, latency_ms, created_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    stmt.run([
      event.id,
      event.sessionId,
      event.requestId,
      event.projectId ?? null,
      event.eventType,
      safeStringifyRedacted(event.eventData),
      event.pageId ?? null,
      event.pageIndex ?? null,
      event.inputType ?? null,
      event.latencyMs ?? null,
      Date.now(),
    ]);
  } catch (err) {
    warn('writeLogEvent', err);
  } finally {
    if (stmt) try { stmt.free(); } catch { /* ignore */ }
  }
}

/** Insert an edit_history row. Fire-and-forget; never throws. */
export function writeEditHistory(db: Database, entry: EditHistoryInsert): void {
  let stmt: ReturnType<Database['prepare']> | null = null;
  try {
    stmt = db.prepare(
      `INSERT INTO edit_history (
         id, project_id, session_id, request_id, patch_applied,
         section_affected, page_id, before_snapshot, after_snapshot,
         user_prompt, created_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    stmt.run([
      entry.id,
      entry.projectId,
      entry.sessionId,
      entry.requestId,
      safeStringifyRedacted(entry.patchApplied),
      entry.sectionAffected ?? null,
      entry.pageId ?? null,
      safeStringifyRedacted(entry.beforeSnapshot),
      safeStringifyRedacted(entry.afterSnapshot),
      redactKeyShapes(entry.userPrompt),
      Date.now(),
    ]);
  } catch (err) {
    warn('writeEditHistory', err);
  } finally {
    if (stmt) try { stmt.free(); } catch { /* ignore */ }
  }
}

// ─── Pruning ──────────────────────────────────────────────────────────────

/** Prune log_events older than `retentionDays` (default 30). */
export function pruneOldLogs(db: Database, retentionDays: number = DEFAULT_EVENT_RETENTION_DAYS): void {
  const cutoff = Date.now() - retentionDays * DAY_MS;
  let stmt: ReturnType<Database['prepare']> | null = null;
  try {
    stmt = db.prepare('DELETE FROM log_events WHERE created_at < ?');
    stmt.run([cutoff]);
  } catch (err) {
    warn('pruneOldLogs', err);
  } finally {
    if (stmt) try { stmt.free(); } catch { /* ignore */ }
  }
}

/** Prune edit_history older than `retentionDays` (default 90). */
export function pruneOldEditHistory(db: Database, retentionDays: number = DEFAULT_EDIT_RETENTION_DAYS): void {
  const cutoff = Date.now() - retentionDays * DAY_MS;
  let stmt: ReturnType<Database['prepare']> | null = null;
  try {
    stmt = db.prepare('DELETE FROM edit_history WHERE created_at < ?');
    stmt.run([cutoff]);
  } catch (err) {
    warn('pruneOldEditHistory', err);
  } finally {
    if (stmt) try { stmt.free(); } catch { /* ignore */ }
  }
}

// ─── Reads ────────────────────────────────────────────────────────────────

/** All log_events for a request_id, ordered by created_at ASC. */
export function getEventsForRequest(db: Database, requestId: string): LogEventInsert[] {
  const out: LogEventInsert[] = [];
  let stmt: ReturnType<Database['prepare']> | null = null;
  try {
    stmt = db.prepare('SELECT * FROM log_events WHERE request_id = ? ORDER BY created_at ASC');
    stmt.bind([requestId]);
    while (stmt.step()) {
      out.push(rowToLogEventInsert(stmt.getAsObject() as unknown as LogEventRow));
    }
  } catch (err) {
    warn('getEventsForRequest', err);
  } finally {
    if (stmt) try { stmt.free(); } catch { /* ignore */ }
  }
  return out;
}

/** All edit_history rows for a project_id, ordered by created_at DESC. */
export function getEditHistoryForProject(db: Database, projectId: string): EditHistoryInsert[] {
  const out: EditHistoryInsert[] = [];
  let stmt: ReturnType<Database['prepare']> | null = null;
  try {
    stmt = db.prepare('SELECT * FROM edit_history WHERE project_id = ? ORDER BY created_at DESC');
    stmt.bind([projectId]);
    while (stmt.step()) {
      out.push(rowToEditHistoryInsert(stmt.getAsObject() as unknown as EditHistoryRow));
    }
  } catch (err) {
    warn('getEditHistoryForProject', err);
  } finally {
    if (stmt) try { stmt.free(); } catch { /* ignore */ }
  }
  return out;
}

// ─── Row mappers ──────────────────────────────────────────────────────────

function safeJsonParse(s: string): unknown {
  try { return JSON.parse(s); } catch { return null; }
}

function rowToLogEventInsert(row: LogEventRow): LogEventInsert {
  const parsed = safeJsonParse(row.event_data);
  const result: LogEventInsert = {
    id: row.id,
    sessionId: row.session_id,
    requestId: row.request_id,
    eventType: row.event_type,
    eventData: parsed && typeof parsed === 'object'
      ? (parsed as Record<string, unknown>)
      : { raw: row.event_data },
  };
  if (row.project_id != null) result.projectId = row.project_id;
  if (row.page_id != null) result.pageId = row.page_id;
  if (row.page_index != null) result.pageIndex = row.page_index;
  if (row.input_type != null) result.inputType = row.input_type;
  if (row.latency_ms != null) result.latencyMs = row.latency_ms;
  return result;
}

function rowToEditHistoryInsert(row: EditHistoryRow): EditHistoryInsert {
  const patchParsed = safeJsonParse(row.patch_applied);
  const result: EditHistoryInsert = {
    id: row.id,
    projectId: row.project_id,
    sessionId: row.session_id,
    requestId: row.request_id,
    patchApplied: Array.isArray(patchParsed) ? patchParsed : [],
    beforeSnapshot: safeJsonParse(row.before_snapshot),
    afterSnapshot: safeJsonParse(row.after_snapshot),
    userPrompt: row.user_prompt,
  };
  if (row.section_affected != null) result.sectionAffected = row.section_affected;
  if (row.page_id != null) result.pageId = row.page_id;
  return result;
}
