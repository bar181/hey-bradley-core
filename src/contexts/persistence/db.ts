// sql.js + IndexedDB bootstrap for the Persistence bounded context.
// Spec: plans/implementation/mvp-plan/02-phase-16-local-db.md §3.5 (Bootstrap shape).
// Decision record: docs/adr/ADR-040-local-sqlite-persistence.md.

import { get as idbGet, set as idbSet } from 'idb-keyval';
import type { Database, SqlJsStatic } from 'sql.js';
import { runMigrations } from './migrations';
import { pruneOldLLMLogs, pruneLLMLogsByCount } from './repositories/llmLogs';

// FIX 7 (Phase 18b): default 30-day retention for llm_logs forensic table.
// ADR-047 §Retention now states this is enforced (was "documented for future
// ratification"). example_prompt_runs is intentionally NOT pruned — that
// table is fixture-bound (one baseline row per prompt × provider) and does
// not grow with chat volume.
const DEFAULT_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;

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

let channelInstance: BroadcastChannel | null = null;

/**
 * Lazily create (or return) the BroadcastChannel. After `closeDB()` /
 * `closeBroadcastChannel()` clears it, the next call rebuilds it so cross-tab
 * invalidation continues to work post-import.
 */
function getChannel(): BroadcastChannel | null {
  if (channelInstance) return channelInstance;
  if (typeof BroadcastChannel === 'undefined') return null;
  const ch = new BroadcastChannel(CHANNEL_NAME);
  ch.onmessage = (e: MessageEvent<{ type?: string }>) => {
    if (e.data?.type === INVALIDATE_MSG) isStale = true;
  };
  channelInstance = ch;
  return ch;
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
    // dev and prod builds, so we tolerate every observed shape:
    //   prod ESM:  { default: initSqlJs }
    //   dev CJS:   { default: { default: initSqlJs } }
    //   plain:     initSqlJs (callable namespace)
    type InitFn = (cfg?: { locateFile?: (file: string) => string }) => Promise<SqlJsStatic>;
    const sqljsModule = (await import('sql.js')) as unknown as { default?: InitFn | { default?: InitFn } };
    const fromDefault = sqljsModule.default;
    const initSqlJs: InitFn = typeof fromDefault === 'function'
      ? fromDefault
      : (typeof (fromDefault as { default?: InitFn } | undefined)?.default === 'function'
          ? (fromDefault as { default: InitFn }).default
          : (sqljsModule as unknown as InitFn));
    SQL = await initSqlJs({ locateFile: (file: string) => `${WASM_DIR}/${file}` });

    const buf = await idbGet<ArrayBuffer | Uint8Array>(IDB_KEY);
    const db: Database = buf
      ? new SQL.Database(new Uint8Array(buf instanceof Uint8Array ? buf : new Uint8Array(buf)))
      : new SQL.Database();

    await runMigrations(db);

    dbInstance = db;
    // FIX 7 (Phase 18b): post-migration retention sweep. Runs once per session
    // (idempotent — pruneOldLLMLogs is a single DELETE) so forensic logs older
    // than DEFAULT_RETENTION_MS are evicted. Failures are non-fatal: the log
    // table is observability-only, never load-bearing for cap math.
    try {
      pruneOldLLMLogs(Date.now() - DEFAULT_RETENTION_MS);
      // P23 carryforward C18 — LRU bound (10K rows max) alongside time-based prune.
      pruneLLMLogsByCount(10_000);
    } catch (e) {
      if (import.meta.env.DEV) console.warn('[persistence] llm_logs prune failed', e);
    }
    // Re-register the BroadcastChannel listener on every fresh init so peers
    // continue to invalidate this tab after closeDB() / import flows.
    getChannel();
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
    getChannel()?.postMessage({ type: INVALIDATE_MSG });
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
  channelInstance?.close();
  channelInstance = null;
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

/**
 * Build a sanitized clone of the live DB for export.
 * Caller is responsible for closing the returned Database.
 */
export async function cloneDBForExport(): Promise<Database> {
  if (!dbInstance) {
    throw new Error('[persistence] cloneDBForExport() called before initDB() resolved');
  }
  if (!SQL) {
    throw new Error('[persistence] cloneDBForExport() called without SQL runtime');
  }
  const bytes = dbInstance.export();
  return new SQL.Database(bytes);
}

/**
 * Load arbitrary bytes into a throwaway sql.js Database (e.g. to inspect
 * an imported bundle's schema_version). Caller must close().
 */
export async function loadDBFromBytes(bytes: Uint8Array): Promise<Database> {
  if (!SQL) {
    // SQL is initialized as a side-effect of initDB(); fall back to a fresh
    // load when called outside that flow.
    await initDB();
  }
  if (!SQL) throw new Error('[persistence] sql.js runtime unavailable');
  return new SQL.Database(bytes);
}
