// sql.js + IndexedDB bootstrap for the Persistence bounded context.
// Spec: plans/implementation/mvp-plan/02-phase-16-local-db.md §3.5 (Bootstrap shape).
// Decision record: docs/adr/ADR-040-local-sqlite-persistence.md.

import { get as idbGet, set as idbSet } from 'idb-keyval';
import type { Database, SqlJsStatic } from 'sql.js';

const IDB_KEY = 'hb-db';
const WASM_DIR = '/sqljs';

let dbInstance: Database | null = null;
let SQL: SqlJsStatic | null = null;
let initPromise: Promise<Database> | null = null;

/**
 * Initialize (or return cached) sql.js Database backed by IndexedDB.
 * Idempotent: concurrent callers share one promise, repeat callers get the singleton.
 */
export async function initDB(): Promise<Database> {
  if (dbInstance) return dbInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const initSqlJs = (await import('sql.js')).default;
    SQL = await initSqlJs({ locateFile: (file: string) => `${WASM_DIR}/${file}` });

    const buf = await idbGet<ArrayBuffer | Uint8Array>(IDB_KEY);
    const db: Database = buf
      ? new SQL.Database(new Uint8Array(buf instanceof Uint8Array ? buf : new Uint8Array(buf)))
      : new SQL.Database();

    // TODO(Wave 1 A2): wire migration runner from './migrations' once it lands.
    // import { runMigrations } from './migrations';
    // await runMigrations(db);

    dbInstance = db;
    return db;
  })();

  try {
    return await initPromise;
  } finally {
    initPromise = null;
  }
}

/**
 * Synchronous accessor for an already-initialized DB.
 * Throws if `initDB()` has not yet been awaited.
 */
export function getDB(): Database {
  if (!dbInstance) {
    throw new Error('[persistence] getDB() called before initDB() resolved');
  }
  return dbInstance;
}

/**
 * Persist current DB bytes to IndexedDB. Throws if DB not initialized.
 */
export async function persist(): Promise<void> {
  if (!dbInstance) {
    throw new Error('[persistence] persist() called before initDB() resolved');
  }
  const bytes = dbInstance.export();
  await idbSet(IDB_KEY, bytes);
}

/**
 * Test-only teardown: persist, close, and clear the singleton.
 */
export async function closeDB(): Promise<void> {
  if (!dbInstance) return;
  await persist();
  dbInstance.close();
  dbInstance = null;
  SQL = null;
}
