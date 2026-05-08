/**
 * P59 Test Library — typed CRUD over `prompt_library` + JSON-corpus seeder.
 * Source-of-truth corpus lives in `tests/prompts/` (Agent A1 owns it); this
 * repo mirrors entries into SQLite for runtime EXPERT-tab browsing.
 * Idempotent via ON CONFLICT(slug) DO UPDATE; malformed/missing JSON skipped.
 * `input` passes through `redactKeyShapes` at insert (defence-in-depth).
 * Migration: 004-prompt-library.sql.
 */
import { getDB, persist } from '../db'
import { redactKeyShapes } from '@/contexts/intelligence/llm/keys'

export type PromptFileSource = 'by-persona' | 'by-atom' | 'by-section' | 'edge-cases'
export type PromptExpectedAtom = 'PATCH' | 'INTENT' | 'SELECTION' | 'CONTENT' | 'ASSUMPTIONS' | 'FALLBACK'
export type PromptExpectedRoute = 'design' | 'content' | 'ambiguous'
export type PromptDifficulty = 'trivial' | 'easy' | 'medium' | 'hard' | 'adversarial'

export interface PromptRow {
  id: number
  slug: string
  file_source: PromptFileSource
  input: string
  expected_atom: PromptExpectedAtom
  expected_verb: string | null
  expected_target: string | null
  expected_route: PromptExpectedRoute | null
  persona: string
  difficulty: PromptDifficulty
  created_at: number
}

export interface PromptFilter {
  persona?: string
  atom?: PromptExpectedAtom
  difficulty?: PromptDifficulty
  file_source?: PromptFileSource
}

const COLS =
  'id, slug, file_source, input, expected_atom, expected_verb, expected_target, expected_route, persona, difficulty, created_at'

export function listPromptLibrary(filter?: PromptFilter, limit = 100): PromptRow[] {
  const clauses: string[] = []
  const binds: (string | number)[] = []
  if (filter?.persona) { clauses.push('persona = ?'); binds.push(filter.persona) }
  if (filter?.atom) { clauses.push('expected_atom = ?'); binds.push(filter.atom) }
  if (filter?.difficulty) { clauses.push('difficulty = ?'); binds.push(filter.difficulty) }
  if (filter?.file_source) { clauses.push('file_source = ?'); binds.push(filter.file_source) }
  const where = clauses.length ? ` WHERE ${clauses.join(' AND ')}` : ''
  const safeLimit = Math.max(1, Math.min(1000, Math.floor(limit)))
  const stmt = getDB().prepare(
    `SELECT ${COLS} FROM prompt_library${where} ORDER BY id ASC LIMIT ${safeLimit}`,
  )
  const rows: PromptRow[] = []
  try {
    if (binds.length) stmt.bind(binds)
    while (stmt.step()) rows.push(stmt.getAsObject() as unknown as PromptRow)
  } finally { stmt.free() }
  return rows
}

export function getPromptBySlug(slug: string): PromptRow | null {
  const stmt = getDB().prepare(`SELECT ${COLS} FROM prompt_library WHERE slug = ?`)
  try {
    stmt.bind([slug])
    return stmt.step() ? (stmt.getAsObject() as unknown as PromptRow) : null
  } finally { stmt.free() }
}

export function insertPromptRow(row: Omit<PromptRow, 'id' | 'created_at'>): void {
  // ON CONFLICT(slug) DO UPDATE keeps the seed idempotent on re-init.
  // created_at is preserved on update so re-seeding doesn't churn timestamps.
  const stmt = getDB().prepare(
    `INSERT INTO prompt_library
       (slug, file_source, input, expected_atom, expected_verb, expected_target, expected_route, persona, difficulty, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(slug) DO UPDATE SET
       file_source     = excluded.file_source,
       input           = excluded.input,
       expected_atom   = excluded.expected_atom,
       expected_verb   = excluded.expected_verb,
       expected_target = excluded.expected_target,
       expected_route  = excluded.expected_route,
       persona         = excluded.persona,
       difficulty      = excluded.difficulty`,
  )
  try {
    stmt.run([
      row.slug, row.file_source, redactKeyShapes(row.input),
      row.expected_atom, row.expected_verb, row.expected_target, row.expected_route,
      row.persona, row.difficulty, Date.now(),
    ])
  } finally { stmt.free() }
}

export function countPromptsByAtom(): Record<string, number> {
  const stmt = getDB().prepare(
    'SELECT expected_atom AS atom, COUNT(*) AS n FROM prompt_library GROUP BY expected_atom',
  )
  const out: Record<string, number> = {}
  try {
    while (stmt.step()) {
      const r = stmt.getAsObject() as { atom?: string; n?: number }
      if (typeof r.atom === 'string') out[r.atom] = typeof r.n === 'number' ? r.n : 0
    }
  } finally { stmt.free() }
  return out
}

// Vite resolves `/tests/...` from project root regardless of source file location.
const RAW_CORPUS = import.meta.glob('/tests/prompts/*.json', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>

interface CorpusEntry {
  id?: string; input?: string
  expectedAtom?: string; expectedVerb?: string | null
  expectedTarget?: string | null; expectedRoute?: string | null
  persona?: string; difficulty?: string
}

const ATOMS = new Set(['PATCH', 'INTENT', 'SELECTION', 'CONTENT', 'ASSUMPTIONS', 'FALLBACK'])
const ROUTES = new Set(['design', 'content', 'ambiguous'])
const DIFFS = new Set(['trivial', 'easy', 'medium', 'hard', 'adversarial'])
const FILE_SOURCES = new Set<PromptFileSource>(['by-persona', 'by-atom', 'by-section', 'edge-cases'])

function fileSourceFromPath(path: string): PromptFileSource | null {
  const m = path.match(/\/([^/]+)\.json$/)
  if (!m) return null
  return FILE_SOURCES.has(m[1] as PromptFileSource) ? (m[1] as PromptFileSource) : null
}

function parseEntries(raw: string): CorpusEntry[] {
  const parsed: unknown = JSON.parse(raw)
  if (Array.isArray(parsed)) return parsed as CorpusEntry[]
  if (parsed && typeof parsed === 'object' && Array.isArray((parsed as { entries?: unknown }).entries)) {
    return (parsed as { entries: CorpusEntry[] }).entries
  }
  return []
}

export async function seedPromptLibraryFromFiles(): Promise<{
  inserted: number; updated: number; skipped: number
}> {
  let inserted = 0, updated = 0, skipped = 0
  for (const [path, raw] of Object.entries(RAW_CORPUS)) {
    const fileSource = fileSourceFromPath(path)
    if (!fileSource) { skipped += 1; continue }
    let entries: CorpusEntry[] = []
    try { entries = parseEntries(raw) }
    catch (e) {
      if (import.meta.env.DEV) console.warn('[promptLibrary] malformed JSON', path, e)
      skipped += 1; continue
    }
    for (const e of entries) {
      if (!e?.id || !e?.input || !e?.expectedAtom || !e?.persona || !e?.difficulty) { skipped += 1; continue }
      if (!ATOMS.has(e.expectedAtom) || !DIFFS.has(e.difficulty)) { skipped += 1; continue }
      const route = e.expectedRoute && ROUTES.has(e.expectedRoute) ? (e.expectedRoute as PromptExpectedRoute) : null
      const existed = getPromptBySlug(e.id) !== null
      try {
        insertPromptRow({
          slug: e.id, file_source: fileSource, input: e.input,
          expected_atom: e.expectedAtom as PromptExpectedAtom,
          expected_verb: e.expectedVerb ?? null,
          expected_target: e.expectedTarget ?? null,
          expected_route: route,
          persona: e.persona, difficulty: e.difficulty as PromptDifficulty,
        })
        if (existed) updated += 1; else inserted += 1
      } catch (err) {
        if (import.meta.env.DEV) console.warn('[promptLibrary] insert failed', e.id, err)
        skipped += 1
      }
    }
  }
  if (inserted > 0 || updated > 0) void persist()
  return { inserted, updated, skipped }
}
