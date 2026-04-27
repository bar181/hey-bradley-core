import type { Database } from 'sql.js';
import { snapshotPreMigration, clearPreMigration } from '../repositories/kv';

// IMPORTANT: Migration .sql files MUST NOT include their own BEGIN/COMMIT —
// the runner wraps each migration in its own transaction below. Files that
// emit BEGIN/COMMIT will cause "cannot start a transaction within a
// transaction" errors. The runner is also responsible for bumping
// schema_version after a successful apply; SQL files MUST NOT update it.
const migrationFiles = import.meta.glob('./*.sql', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export function knownMigrationCount(): number {
  return Object.keys(migrationFiles).length;
}

function readSchemaVersion(db: Database): number {
  try {
    const res = db.exec('SELECT version FROM schema_version LIMIT 1');
    if (!res.length || !res[0].values.length) return 0;
    const v = res[0].values[0][0];
    return typeof v === 'number' ? v : 0;
  } catch {
    return 0;
  }
}

function migrationNumber(path: string): number {
  const m = path.match(/(\d+)-/);
  return m ? parseInt(m[1], 10) : -1;
}

export async function runMigrations(db: Database): Promise<number> {
  const entries = Object.entries(migrationFiles)
    .map(([path, sql]) => ({ path, sql, num: migrationNumber(path) }))
    .sort((a, b) => a.path.localeCompare(b.path));

  // Determine pending migrations BEFORE we start so we know whether to snapshot.
  const startVersion = readSchemaVersion(db);
  const pendingMigrations = entries.filter((e) => startVersion <= e.num);

  if (pendingMigrations.length > 0) {
    // Snapshot before any migration runs. On failure, we leave the snapshot
    // in place so callers can restore via restorePreMigration().
    // Pass the db directly because runMigrations runs before the getDB()
    // singleton is wired up.
    try {
      await snapshotPreMigration(db);
    } catch {
      // If snapshot fails (e.g. fresh DB without kv yet), proceed — the
      // 000-init migration creates the kv table and is itself the baseline.
    }
  }

  for (const { path, sql, num } of entries) {
    const current = readSchemaVersion(db);
    if (current > num) continue;
    try {
      db.exec('BEGIN');
      db.exec(sql);
      // Bump schema_version inside the same txn so it commits atomically.
      // 000-init.sql seeds version=1; subsequent migrations must move it
      // forward by themselves. We use WHERE 1=1 to gracefully overwrite
      // multi-row corruption (e.g. from buggy past inserts).
      const stmt = db.prepare('UPDATE schema_version SET version = ? WHERE 1=1');
      try {
        stmt.run([num + 1]);
      } finally {
        stmt.free();
      }
      db.exec('COMMIT');
    } catch (err) {
      try { db.exec('ROLLBACK'); } catch { /* ignore */ }
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Migration ${num} (${path}) failed: ${msg}`);
    }
  }

  // All migrations succeeded — clear the snapshot.
  if (pendingMigrations.length > 0) {
    try {
      clearPreMigration(db);
    } catch {
      // Non-fatal; snapshot is just stale data at this point.
    }
  }

  return readSchemaVersion(db);
}
