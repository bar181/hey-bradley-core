// One-time migration of legacy localStorage project data into the SQLite DB.
// Spec: plans/implementation/mvp-plan/02-phase-16-local-db.md §5 (DoD: legacy
// migration reads, copies, then deletes legacy keys).
// Decision record: docs/adr/ADR-040-local-sqlite-persistence.md.
//
// Legacy shapes (see src/store/projectStore.ts + src/lib/persistence.ts):
//   - 'hb-project-list'           : ProjectMeta[]
//   - 'hb-project-<slug>'         : MasterConfig
//   - 'hey-bradley-project'       : MasterConfig (singleton fallback)
//
// Never delete keys starting with 'hb-byok' or the exact key 'selectedExampleId'.

import { kvHas, kvSet } from './repositories/kv';
import { upsertProject } from './repositories/projects';

const FLAG_KEY = 'legacy_migration_complete';
const SINGLETON_KEY = 'hey-bradley-project';
const LIST_KEY = 'hb-project-list';
const PROJECT_PREFIX = 'hb-project-';

interface LegacyMeta { slug?: unknown; name?: unknown }

function isLegacyKey(k: string): boolean {
  if (k.startsWith('hb-byok') || k === 'selectedExampleId') return false;
  return k === LIST_KEY || k === SINGLETON_KEY || k.startsWith(PROJECT_PREFIX);
}

function tryParse(raw: string | null): unknown | null {
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function tryUpsert(id: string, name: string, config: unknown): boolean {
  try { upsertProject({ id, name, config }); return true; } catch { return false; }
}

export function migrateLegacyLocalStorage(): { migrated: number; bytes: number } {
  if (typeof localStorage === 'undefined') return { migrated: 0, bytes: 0 };
  if (kvHas(FLAG_KEY)) return { migrated: 0, bytes: 0 };

  let migrated = 0;
  let bytes = 0;
  const toRemove: string[] = [];
  const seen = new Set<string>();

  // Pass 1: meta list-driven projects (gives us the user-facing name).
  const listRaw = localStorage.getItem(LIST_KEY);
  const list = tryParse(listRaw);
  if (Array.isArray(list)) {
    for (const entry of list as LegacyMeta[]) {
      const slug = typeof entry?.slug === 'string' ? entry.slug : null;
      const name = typeof entry?.name === 'string' ? entry.name : slug;
      if (!slug || !name) continue;
      const key = `${PROJECT_PREFIX}${slug}`;
      const raw = localStorage.getItem(key);
      const config = tryParse(raw);
      if (!config || !tryUpsert(slug, name, config)) continue;
      migrated += 1; bytes += raw?.length ?? 0; seen.add(slug); toRemove.push(key);
    }
    if (listRaw) toRemove.push(LIST_KEY);
  }

  // Pass 2: orphaned 'hb-project-<slug>' rows not in the meta list.
  for (let i = 0; i < localStorage.length; i += 1) {
    const k = localStorage.key(i);
    if (!k || k === LIST_KEY || !k.startsWith(PROJECT_PREFIX)) continue;
    const slug = k.slice(PROJECT_PREFIX.length);
    if (!slug || seen.has(slug)) continue;
    const raw = localStorage.getItem(k);
    const config = tryParse(raw);
    if (!config || !tryUpsert(slug, slug, config)) continue;
    migrated += 1; bytes += raw?.length ?? 0; toRemove.push(k);
  }

  // Pass 3: singleton 'hey-bradley-project'.
  const singletonRaw = localStorage.getItem(SINGLETON_KEY);
  const singleton = tryParse(singletonRaw);
  if (singleton && tryUpsert('legacy-default', 'My Project', singleton)) {
    migrated += 1; bytes += singletonRaw?.length ?? 0; toRemove.push(SINGLETON_KEY);
  }

  // Defense in depth: only remove keys that match the legacy allow-list.
  for (const k of toRemove) if (isLegacyKey(k)) localStorage.removeItem(k);

  kvSet(FLAG_KEY, '1');
  return { migrated, bytes };
}
