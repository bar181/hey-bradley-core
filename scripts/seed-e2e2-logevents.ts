// scripts/seed-e2e2-logevents.ts — E2E-TEST-2 / C4 — log_events seed for the
// 3 multi-scenario sites (coffee-essay / north-light-agency / indie-coffee-roaster).
//
// Run via:  npx tsx scripts/seed-e2e2-logevents.ts
//
// Reads 3 fixture JSONs from tests/fixtures/e2e2-*-logevents.json, normalizes
// the `event_type` enum, deduplicates rows by (session_id, request_id, event_type),
// and emits a merged seed file at tests/fixtures/e2e2-seed.json suitable for
// ConversationLogTab drill-down (per request_id).
//
// SCHEMA NOTE: writeLogEvent() in src/contexts/persistence/repositories/
// comprehensiveLogs.ts requires a sql.js Database instance (browser-only via
// WASM). This Node script writes a JSON seed file that the browser-side
// bootstrap (or test harness) can consume via repeated writeLogEvent() calls.
// Stdlib-only Node. No new deps. Defensive-remap: `patch_applied` is NOT in
// migration 005 CHECK enum — we remap to `patch_validation` at write time.
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'

interface FixtureRow {
  id?: string
  session_id: string
  request_id: string
  project_id?: string
  event_type: string
  event_data: Record<string, unknown>
  page_id?: string
  page_index?: number
  input_type?: 'chat' | 'listen'
  latency_ms?: number
  created_at?: number
}

interface FixtureFile {
  rows?: FixtureRow[]
  _meta?: Record<string, unknown>
}

const ALLOWED_EVENT_TYPES = new Set([
  'input_event', 'intent_classification', 'decomposition', 'template_match',
  'patch_validation', 'personality_display', 'listen_capture', 'multi_page_scope',
  'process_atom_output', 'ddd_atom_output', 'error_event', 'response_summary',
  'todo_execution', 'decomp_split', 'export_emit',
])

const REMAP: Record<string, string> = {
  patch_applied: 'patch_validation', // defensive: not in CHECK enum
}

const ROOT = process.cwd()
const FIXTURES = [
  'tests/fixtures/e2e2-coffee-essay-logevents.json',
  'tests/fixtures/e2e2-north-light-agency-logevents.json',
  'tests/fixtures/e2e2-indie-coffee-roaster-logevents.json',
]
const OUT_PATH = join(ROOT, 'tests/fixtures/e2e2-seed.json')

function loadRows(rel: string): FixtureRow[] {
  const abs = join(ROOT, rel)
  if (!existsSync(abs)) {
    console.warn(`[seed-e2e2] fixture missing: ${rel}`)
    return []
  }
  const raw = readFileSync(abs, 'utf8')
  const parsed: FixtureRow[] | FixtureFile = JSON.parse(raw)
  if (Array.isArray(parsed)) return parsed
  if (parsed && Array.isArray((parsed as FixtureFile).rows)) {
    return (parsed as FixtureFile).rows as FixtureRow[]
  }
  console.warn(`[seed-e2e2] unrecognized shape: ${rel}`)
  return []
}

function normalize(row: FixtureRow): FixtureRow {
  const original = row.event_type
  const remapped = REMAP[original] ?? original
  if (remapped !== original) {
    console.warn(`[seed-e2e2] remap event_type ${original} -> ${remapped} for ${row.request_id}`)
  }
  if (!ALLOWED_EVENT_TYPES.has(remapped)) {
    console.warn(`[seed-e2e2] WARNING: ${remapped} not in CHECK enum; row dropped (${row.request_id})`)
  }
  return { ...row, event_type: remapped }
}

const seen = new Set<string>()
const merged: FixtureRow[] = []
const byType: Record<string, number> = {}
const bySession: Record<string, number> = {}

for (const rel of FIXTURES) {
  const rows = loadRows(rel)
  for (const raw of rows) {
    const row = normalize(raw)
    if (!ALLOWED_EVENT_TYPES.has(row.event_type)) continue
    const dedupKey = `${row.session_id}|${row.request_id}|${row.event_type}|${row.id ?? ''}`
    if (seen.has(dedupKey)) continue
    seen.add(dedupKey)
    merged.push(row)
    byType[row.event_type] = (byType[row.event_type] ?? 0) + 1
    bySession[row.session_id] = (bySession[row.session_id] ?? 0) + 1
  }
}

mkdirSync(dirname(OUT_PATH), { recursive: true })
writeFileSync(OUT_PATH, JSON.stringify(merged, null, 2) + '\n')

console.log(`Seeded ${merged.length} log_events rows -> ${OUT_PATH}`)
console.log('  by event_type:')
for (const [t, n] of Object.entries(byType).sort()) console.log(`    ${t.padEnd(24)} ${n}`)
console.log('  by session_id:')
for (const [s, n] of Object.entries(bySession).sort()) console.log(`    ${s.padEnd(40)} ${n}`)

// Marker for test harness: writeLogEvent is the canonical write path
// (see src/contexts/persistence/repositories/comprehensiveLogs.ts).
// To replay these rows into a live sql.js DB, iterate merged[] and call
// writeLogEvent(db, rowAsLogEventInsert) inside a browser context.
// writeLogEvent
