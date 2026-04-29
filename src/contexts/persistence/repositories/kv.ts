// Typed CRUD for the `kv` table + pre-migration snapshot helpers (1-deep backup).
// Spec: plans/implementation/mvp-plan/02-phase-16-local-db.md §3.4 (schema), §4 (refinement).
// Decision record: docs/adr/ADR-041-schema-versioning.md (pre-migration snapshot strategy).

import type { Database } from 'sql.js';
import { getDB, persist } from '../db';
import { PERSONALITY_IDS, type PersonalityId } from '@/contexts/intelligence/personality/personalityEngine';

const BACKUP_KEY = 'pre_migration_backup';
const PERSONALITY_KEY = 'personality_id';
const B64_CHUNK = 0x8000;

export function kvGet(k: string): string | undefined {
  const stmt = getDB().prepare('SELECT v FROM kv WHERE k = ?');
  try {
    stmt.bind([k]);
    return stmt.step() ? String(stmt.getAsObject().v) : undefined;
  } finally {
    stmt.free();
  }
}

export function kvSet(k: string, v: string): void {
  const stmt = getDB().prepare('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)');
  try {
    stmt.run([k, v]);
  } finally {
    stmt.free();
  }
  void persist();
}

export function kvDelete(k: string): void {
  const stmt = getDB().prepare('DELETE FROM kv WHERE k = ?');
  try {
    stmt.run([k]);
  } finally {
    stmt.free();
  }
  void persist();
}

export function kvHas(k: string): boolean {
  const stmt = getDB().prepare('SELECT 1 FROM kv WHERE k = ?');
  try {
    stmt.bind([k]);
    return stmt.step();
  } finally {
    stmt.free();
  }
}

function bytesToB64(bytes: Uint8Array): string {
  let out = '';
  for (let i = 0; i < bytes.length; i += B64_CHUNK) {
    const slice = bytes.subarray(i, i + B64_CHUNK);
    out += String.fromCharCode(...slice);
  }
  return btoa(out);
}

function b64ToBytes(s: string): Uint8Array {
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
}

function tableExists(db: Database, name: string): boolean {
  try {
    const stmt = db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name = ?");
    try {
      stmt.bind([name]);
      return stmt.step();
    } finally {
      stmt.free();
    }
  } catch {
    return false;
  }
}

/**
 * Snapshot the current DB bytes into kv['pre_migration_backup'] BEFORE a
 * migration runs. Accepts an optional Database so it can be invoked from
 * `runMigrations` (which runs before `getDB()` is wired). When `kv` does
 * not yet exist (very first init), this is a no-op.
 */
export async function snapshotPreMigration(db?: Database): Promise<void> {
  const target = db ?? getDB();
  if (!tableExists(target, 'kv')) return;
  const bytes = target.export();
  const encoded = bytesToB64(bytes);
  const stmt = target.prepare('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)');
  try {
    stmt.run([BACKUP_KEY, encoded]);
  } finally {
    stmt.free();
  }
  // Only flush to IndexedDB when running through the singleton; raw-db calls
  // come from initDB before dbInstance is set, where persist() would throw.
  if (!db) await persist();
}

export async function restorePreMigration(): Promise<Uint8Array | null> {
  const encoded = kvGet(BACKUP_KEY);
  return encoded ? b64ToBytes(encoded) : null;
}

/**
 * Sprint J P50 (A1) — personality persistence helpers.
 * `kv['personality_id']` is NOT sensitive — ships in .heybradley exports
 * per ADR-067 export discipline (no key shapes, no secrets).
 */
export function getPersonalityId(): PersonalityId | null {
  try {
    const raw = kvGet(PERSONALITY_KEY);
    if (!raw) return null;
    return (PERSONALITY_IDS as readonly string[]).includes(raw) ? (raw as PersonalityId) : null;
  } catch {
    return null;
  }
}

export function setPersonalityId(id: PersonalityId): void {
  if (!(PERSONALITY_IDS as readonly string[]).includes(id)) return;
  kvSet(PERSONALITY_KEY, id);
}

export function clearPreMigration(db?: Database): void {
  if (db) {
    if (!tableExists(db, 'kv')) return;
    const stmt = db.prepare('DELETE FROM kv WHERE k = ?');
    try {
      stmt.run([BACKUP_KEY]);
    } finally {
      stmt.free();
    }
    return;
  }
  kvDelete(BACKUP_KEY);
}
