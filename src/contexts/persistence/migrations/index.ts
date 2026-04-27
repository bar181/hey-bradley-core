import type { Database } from 'sql.js';

const migrationFiles = import.meta.glob('./*.sql', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

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

  for (const { path, sql, num } of entries) {
    const current = readSchemaVersion(db);
    if (current > num) continue;
    try {
      db.exec('BEGIN');
      db.exec(sql);
      db.exec('COMMIT');
    } catch (err) {
      try { db.exec('ROLLBACK'); } catch { /* ignore */ }
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Migration ${num} (${path}) failed: ${msg}`);
    }
  }

  return readSchemaVersion(db);
}
