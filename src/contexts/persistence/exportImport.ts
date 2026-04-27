// Zip-based `.heybradley` export/import for project + full DB snapshot.
// Spec: plans/implementation/mvp-plan/02-phase-16-local-db.md §1.1 (export/import requirement).
// Decision record: docs/adr/ADR-040-local-sqlite-persistence.md.

import JSZip from 'jszip';
import { set as idbSet } from 'idb-keyval';
import { closeBroadcastChannel, getDB, initDB } from './db';
import { runMigrations } from './migrations';
import { getProject, listProjects, upsertProject, type ProjectRow } from './repositories/projects';

const IDB_KEY = 'hb-db';
const ZIP_TYPE = 'application/zip';
const SQLITE_HEADER = [0x53, 0x51, 0x4c, 0x69, 0x74, 0x65, 0x20, 0x66, 0x6f, 0x72, 0x6d, 0x61, 0x74, 0x20, 0x33, 0x00];

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

async function buildZip(projectPayload: ProjectJsonSingle | ProjectJsonMany): Promise<Blob> {
  const zip = new JSZip();
  zip.file('project.json', JSON.stringify(projectPayload, null, 2));
  zip.file('db.sqlite', getDB().export());
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
    closeBroadcastChannel();
    await idbSet(IDB_KEY, bytes);
    const db = await initDB();
    await runMigrations(db);
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
