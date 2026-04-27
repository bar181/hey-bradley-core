// Typed CRUD for the `kv` table + pre-migration snapshot helpers (1-deep backup).
// Spec: plans/implementation/mvp-plan/02-phase-16-local-db.md §3.4 (schema), §4 (refinement).
// Decision record: docs/adr/ADR-041-schema-versioning.md (pre-migration snapshot strategy).

import { getDB, persist } from '../db';

const BACKUP_KEY = 'pre_migration_backup';
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

export async function snapshotPreMigration(): Promise<void> {
  const bytes = getDB().export();
  const encoded = bytesToB64(bytes);
  const stmt = getDB().prepare('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)');
  try {
    stmt.run([BACKUP_KEY, encoded]);
  } finally {
    stmt.free();
  }
  await persist();
}

export async function restorePreMigration(): Promise<Uint8Array | null> {
  const encoded = kvGet(BACKUP_KEY);
  return encoded ? b64ToBytes(encoded) : null;
}

export function clearPreMigration(): void {
  kvDelete(BACKUP_KEY);
}
