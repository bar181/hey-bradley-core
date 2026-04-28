// Zip-based `.heybradley` export/import for project + full DB snapshot.
// Spec: plans/implementation/mvp-plan/02-phase-16-local-db.md §1.1 (export/import requirement).
// Decision record: docs/adr/ADR-040-local-sqlite-persistence.md.

import JSZip from 'jszip';
import { set as idbSet } from 'idb-keyval';
import { cloneDBForExport, closeDB, initDB, loadDBFromBytes } from './db';
import { knownMigrationCount, runMigrations } from './migrations';
import { getProject, listProjects, upsertProject, type ProjectRow } from './repositories/projects';

// Re-export the JSZip ctor so test/dev code can reach it without re-resolving
// the bare specifier (Vite pre-bundles only modules referenced from source).
export { default as JSZip } from 'jszip';

const IDB_KEY = 'hb-db';
const ZIP_TYPE = 'application/zip';
const SQLITE_HEADER = [0x53, 0x51, 0x4c, 0x69, 0x74, 0x65, 0x20, 0x66, 0x6f, 0x72, 0x6d, 0x61, 0x74, 0x20, 0x33, 0x00];

// kv keys that must NEVER ship inside an exported bundle.
// Use the predicate (or the SQL LIKE in exportSanitizedDBBytes) for runtime
// checks; the array form is kept only for back-compat with the existing
// persistence test fixture.
export function isSensitiveKvKey(k: string): boolean {
  // P44 — brand_context_* keys hold uploaded brand-voice documents (user
  // content); strip from exports symmetrically with byok_* per ADR-040.
  return k.startsWith('byok_') || k === 'pre_migration_backup' || k.startsWith('brand_context_');
}
export const SENSITIVE_KV_KEYS: readonly string[] = [
  'byok_key',
  'byok_provider',
  'pre_migration_backup',
  'brand_context_manifest',
];

export class ImportBundleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImportBundleError';
  }
}

interface ProjectJsonSingle {
  id: string;
  name: string;
  config: unknown;
  created_at: number;
  updated_at: number;
}
interface ProjectJsonMany { projects: ProjectJsonSingle[] }

function rowToJson(r: ProjectRow): ProjectJsonSingle {
  let config: unknown;
  try { config = JSON.parse(r.config_json); } catch { config = r.config_json; }
  return { id: r.id, name: r.name, config, created_at: r.created_at, updated_at: r.updated_at };
}

/**
 * FIX 1 + FIX 8 (Phase 18b): registry-driven sanitization. Each entry below
 * declares one privacy-sensitive table and how to scrub it on export. Future
 * sensitive tables become opt-in by adding a row here (regression-resistant —
 * a developer can't accidentally ship a new prompt-bearing table by forgetting
 * to add a DELETE call).
 *
 * - llm_logs                (ADR-047): raw system/user prompts + response_raw.
 * - example_prompt_runs     (ADR-047, symmetric to llm_logs strip): accumulates
 *                           real-LLM responses joined to user prompts; same
 *                           privacy class as llm_logs.
 * - llm_calls.error_text    (ADR-043 belt-and-suspenders): raw error strings
 *                           even after redactKeyShapes() may leak BYOK shapes.
 */
const SENSITIVE_TABLE_OPS: ReadonlyArray<
  | { table: string; op: 'truncate' }
  | { table: string; op: 'null_column'; column: string }
> = [
  { table: 'llm_logs',           op: 'truncate' },
  { table: 'example_prompt_runs', op: 'truncate' },
  { table: 'llm_calls',          op: 'null_column', column: 'error_text' },
];

/**
 * Produce sanitized DB bytes for export. Strips any byok_* kv row plus the
 * legacy pre_migration_backup, then iterates SENSITIVE_TABLE_OPS to truncate
 * privacy-bearing tables / null privacy-bearing columns.
 */
async function exportSanitizedDBBytes(): Promise<Uint8Array> {
  const clone = await cloneDBForExport();
  try {
    // Prefix sweep: covers byok_key, byok_provider, brand_context_manifest,
    // brand_context_chunk_*, and the legacy pre_migration_backup row.
    clone.exec("DELETE FROM kv WHERE k LIKE 'byok_%' OR k LIKE 'brand_context_%' OR k = 'pre_migration_backup'");
    for (const entry of SENSITIVE_TABLE_OPS) {
      if (entry.op === 'truncate') {
        clone.exec(`DELETE FROM ${entry.table}`);
      } else {
        clone.exec(`UPDATE ${entry.table} SET ${entry.column} = NULL WHERE ${entry.column} IS NOT NULL`);
      }
    }
    return clone.export();
  } finally {
    clone.close();
  }
}

async function buildZip(projectPayload: ProjectJsonSingle | ProjectJsonMany): Promise<Blob> {
  const zip = new JSZip();
  zip.file('project.json', JSON.stringify(projectPayload, null, 2));
  zip.file('db.sqlite', await exportSanitizedDBBytes());
  const ab = await zip.generateAsync({ type: 'arraybuffer' });
  return new Blob([ab], { type: ZIP_TYPE });
}

export async function exportProject(projectId: string): Promise<Blob> {
  const row = getProject(projectId);
  if (!row) throw new ImportBundleError(`Project not found: ${projectId}`);
  return buildZip(rowToJson(row));
}

export async function exportAllProjects(): Promise<Blob> {
  const rows = listProjects().map(rowToJson);
  return buildZip({ projects: rows });
}

function isSqliteFile(bytes: Uint8Array): boolean {
  if (bytes.length < SQLITE_HEADER.length) return false;
  for (let i = 0; i < SQLITE_HEADER.length; i++) {
    if (bytes[i] !== SQLITE_HEADER[i]) return false;
  }
  return true;
}

async function readSchemaVersionFromBytes(bytes: Uint8Array): Promise<number> {
  const db = await loadDBFromBytes(bytes);
  try {
    const res = db.exec('SELECT version FROM schema_version LIMIT 1');
    if (!res.length || !res[0].values.length) return 0;
    const v = res[0].values[0][0];
    return typeof v === 'number' ? v : 0;
  } finally {
    db.close();
  }
}

function isProjectJsonMany(v: unknown): v is ProjectJsonMany {
  return typeof v === 'object' && v !== null && Array.isArray((v as { projects?: unknown }).projects);
}
function isProjectJsonSingle(v: unknown): v is ProjectJsonSingle {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return typeof o.id === 'string' && typeof o.name === 'string' && 'config' in o;
}

export async function importBundle(file: File | Blob): Promise<{ projectsImported: number; dbReplaced: boolean }> {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(await file.arrayBuffer());
  } catch (err) {
    throw new ImportBundleError(`Not a valid zip: ${err instanceof Error ? err.message : String(err)}`);
  }
  const dbEntry = zip.file('db.sqlite');
  const projEntry = zip.file('project.json');
  if (!dbEntry && !projEntry) throw new ImportBundleError('Bundle missing both db.sqlite and project.json');

  if (dbEntry) {
    const bytes = new Uint8Array(await dbEntry.async('arraybuffer'));
    if (!isSqliteFile(bytes)) throw new ImportBundleError('db.sqlite has invalid SQLite header');

    // Reject bundles whose schema version is newer than what this build knows.
    const importedVersion = await readSchemaVersionFromBytes(bytes);
    const maxKnown = knownMigrationCount();
    if (importedVersion > maxKnown) {
      throw new ImportBundleError('Imported DB schema is newer than this build');
    }

    // Drop the singleton (and its BroadcastChannel) so initDB() will re-load
    // from the freshly-written IDB bytes instead of returning the stale cache.
    await closeDB();
    await idbSet(IDB_KEY, bytes);
    const db = await initDB();
    await runMigrations(db);

    // P28 C15 — Import lock: re-seed example_prompts from canonical migration
    // 001 to prevent malicious bundles from overriding the corpus that
    // AgentProxyAdapter consumes. Migration 001 is repo-controlled; this
    // delete-and-re-run is idempotent (INSERT OR REPLACE in 001-example-prompts.sql).
    // P37+ Sprint F R2 F1 fix-pass — DROP-before-recreate so an OLD bundle's
    // 6-category CHECK constraint is replaced with the current 9-category one.
    // Without this, importing a pre-P37 bundle into a P37+ build would fail
    // the new INSERT OR REPLACE rows that use `command` / `voice_only` /
    // `ambiguous` categories. Idempotent on same-schema imports.
    try {
      db.exec('DROP TABLE IF EXISTS example_prompts');
      db.exec('DROP TABLE IF EXISTS example_prompt_runs');
      const sqlModule = await import('./migrations/001-example-prompts.sql?raw');
      db.exec(sqlModule.default);
    } catch (e) {
      if (import.meta.env.DEV) console.warn('[importBundle] example_prompts re-seed failed (acceptable; migration runs on next initDB)', e);
    }

    // P33+ R3 fix-pass-3 (F1) — Import lock for user_templates.
    // user_templates is intentionally opt-in for export (ADR-059) but importing
    // a foreign bundle MUST NOT trust foreign user-authored templates. Truncate
    // on import; users author their own going forward. Symmetric with the
    // example_prompts re-seed lock above.
    try {
      db.exec('DELETE FROM user_templates');
    } catch (e) {
      if (import.meta.env.DEV) console.warn('[importBundle] user_templates truncate failed (table may not exist yet)', e);
    }
    return { projectsImported: 0, dbReplaced: true };
  }

  // project.json only
  let parsed: unknown;
  try {
    parsed = JSON.parse(await projEntry!.async('string'));
  } catch (err) {
    throw new ImportBundleError(`Malformed project.json: ${err instanceof Error ? err.message : String(err)}`);
  }
  const list: ProjectJsonSingle[] = isProjectJsonMany(parsed)
    ? parsed.projects.filter(isProjectJsonSingle)
    : isProjectJsonSingle(parsed) ? [parsed] : [];
  if (!list.length) throw new ImportBundleError('project.json contained no valid projects');
  for (const p of list) upsertProject({ id: p.id, name: p.name, config: p.config });
  return { projectsImported: list.length, dbReplaced: false };
}

export async function downloadBundle(blob: Blob, filename: string): Promise<void> {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
