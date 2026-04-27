// sql.js + IndexedDB bootstrap for the Persistence bounded context.
// Spec: plans/implementation/mvp-plan/02-phase-16-local-db.md §3.5 (Bootstrap shape).
// Decision record: docs/adr/ADR-040-local-sqlite-persistence.md.

import { get as idbGet, set as idbSet } from 'idb-keyval';
import type { Database, SqlJsStatic } from 'sql.js';

const IDB_KEY = 'hb-db';
const WASM_DIR = '/sqljs';
const LOCK_NAME = 'hb-db-write';
const CHANNEL_NAME = 'hb-db';
const INVALIDATE_MSG = 'hb-db-invalidate';

let dbInstance: Database | null = null;
let SQL: SqlJsStatic | null = null;
let initPromise: Promise<Database> | null = null;
let isStale = false;
let warnedNoLocks = false;

// CROSS-TAB: Two tabs sharing this app must not corrupt each other's writes.
// 1. `persist()` flushes are serialized across tabs via Web Locks (exclusive
//    'hb-db-write'). The wasm DB itself is per-tab/in-memory; the lock guards
//    only the IndexedDB write step.
// 2. After a successful flush we broadcast `hb-db-invalidate` on
//    BroadcastChannel('hb-db'). Peers mark their singleton stale; the NEXT
//    `getDB()` re-hydrates from IndexedDB. The current call is never blocked.
// 3. Browsers without `navigator.locks` skip the lock with a one-time DEV warn.
const channel: BroadcastChannel | null =
  typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(CHANNEL_NAME) : null;
if (channel) {
  channel.onmessage = (e: MessageEvent<{ type?: string }>) => {
    if (e.data?.type === INVALIDATE_MSG) isStale = true;
  };
}

/**
 * Initialize (or return cached) sql.js Database backed by IndexedDB.
 * Idempotent: concurrent callers share one promise, repeat callers get the singleton.
 */
export async function initDB(): Promise<Database> {
  if (dbInstance) return dbInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    // sql.js is published as CommonJS; Vite's CJS-interop differs between
    // dev and prod builds, so we tolerate either shape.
    const sqljsModule = (await import('sql.js')) as unknown as {
      default?: (cfg?: { locateFile?: (file: string) => string }) => Promise<SqlJsStatic>;
    };
    const initSqlJs = sqljsModule.default ?? (sqljsModule as unknown as NonNullable<typeof sqljsModule.default>);
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
  // CROSS-TAB: peer flush flagged us stale; kick off background re-hydrate and
  // return the current handle so the call never blocks.
  if (isStale) {
    isStale = false;
    const stale = dbInstance;
    dbInstance = null;
    void initDB().then(() => stale.close()).catch(() => { dbInstance = stale; });
    return stale;
  }
  return dbInstance;
}

/**
 * Persist current DB bytes to IndexedDB. Throws if DB not initialized.
 * Serialized across tabs via Web Lock; peers are notified via BroadcastChannel.
 */
export async function persist(): Promise<void> {
  if (!dbInstance) {
    throw new Error('[persistence] persist() called before initDB() resolved');
  }
  const flush = async (): Promise<void> => {
    const bytes = dbInstance!.export();
    await idbSet(IDB_KEY, bytes);
    channel?.postMessage({ type: INVALIDATE_MSG });
  };
  if ('locks' in navigator) {
    await navigator.locks.request(LOCK_NAME, { mode: 'exclusive' }, flush);
  } else {
    if (import.meta.env.DEV && !warnedNoLocks) {
      warnedNoLocks = true;
      console.warn('[persistence] navigator.locks unavailable; cross-tab writes unguarded');
    }
    await flush();
  }
}

/** Close the BroadcastChannel; call from unload paths or test teardown. */
export function closeBroadcastChannel(): void {
  channel?.close();
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
  closeBroadcastChannel();
}
