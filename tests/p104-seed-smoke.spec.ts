/**
 * P104 / SCHEMA-GUARDS — seed smoke test (PURE-UNIT; FS + regex; no browser).
 * Loads tests/fixtures/e2e2-seed.json (35 rows from E2E-TEST-2) and validates
 * every row against migration 005 CHECK enum (post-remap allowed). Asserts
 * validateEventType (in comprehensiveLogs.ts) + validateSectionType (in
 * src/lib/schemas/section.ts) exist at canonical placement sites.
 * 7 describe blocks / 12 cases.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

const SEED_FIXTURE = join(ROOT, 'tests/fixtures/e2e2-seed.json')
const COMPREHENSIVE_LOGS = join(
  ROOT,
  'src/contexts/persistence/repositories/comprehensiveLogs.ts',
)
const SECTION_SCHEMA = join(ROOT, 'src/lib/schemas/section.ts')

// CHECK enum from migration 005-comprehensive-logs.sql §38-50 (15 values).
const ALLOWED_EVENT_TYPES = new Set([
  'input_event',
  'intent_classification',
  'decomposition',
  'template_match',
  'patch_validation',
  'personality_display',
  'listen_capture',
  'multi_page_scope',
  'process_atom_output',
  'ddd_atom_output',
  'error_event',
  'response_summary',
  'todo_execution',
  'decomp_split',
  'export_emit',
])

// Defensive remap mirrors validateEventType in comprehensiveLogs.ts.
const REMAP: Record<string, string> = { patch_applied: 'patch_validation' }

interface SeedRow {
  session_id: string
  request_id: string
  event_type: string
  event_data: Record<string, unknown>
  latency_ms?: number
  created_at: number
}

function read(p: string): string {
  return readFileSync(p, 'utf8')
}

function parseSeed(p: string): SeedRow[] {
  const raw = JSON.parse(read(p)) as unknown
  if (Array.isArray(raw)) return raw as SeedRow[]
  if (
    raw &&
    typeof raw === 'object' &&
    Array.isArray((raw as { rows?: unknown }).rows)
  ) {
    return (raw as { rows: SeedRow[] }).rows
  }
  return []
}

// P104.1 — fixture exists + parses (1)
test.describe('P104.1 — fixture exists + parses', () => {
  test('e2e2-seed.json exists, parses to array, length > 0', () => {
    expect(existsSync(SEED_FIXTURE)).toBe(true)
    const rows = parseSeed(SEED_FIXTURE)
    expect(Array.isArray(rows)).toBe(true)
    expect(rows.length).toBeGreaterThan(0)
  })
})

// P104.2 — every row has required fields (1)
test.describe('P104.2 — every row has required fields', () => {
  test('all rows have session_id/request_id/event_type/event_data/created_at', () => {
    const rows = parseSeed(SEED_FIXTURE)
    for (const row of rows) {
      expect(typeof row.session_id).toBe('string')
      expect(row.session_id.length).toBeGreaterThan(0)
      expect(typeof row.request_id).toBe('string')
      expect(row.request_id.length).toBeGreaterThan(0)
      expect(typeof row.event_type).toBe('string')
      expect(row.event_type.length).toBeGreaterThan(0)
      expect(typeof row.event_data).toBe('object')
      expect(row.event_data).not.toBeNull()
      // latency_ms optional but if present must be number ≥ 0
      if (row.latency_ms !== undefined) {
        expect(typeof row.latency_ms).toBe('number')
        expect(row.latency_ms).toBeGreaterThanOrEqual(0)
      }
      // created_at is unix-ms; sanity floor 1700000000000 (~2023-11)
      expect(typeof row.created_at).toBe('number')
      expect(row.created_at).toBeGreaterThan(1700000000000)
    }
  })
})

// P104.3 — every row's event_type is valid OR has known alias remap (2)
test.describe('P104.3 — event_type CHECK enum compliance (post-remap)', () => {
  test('all rows pass CHECK enum after defensive remap', () => {
    const rows = parseSeed(SEED_FIXTURE)
    for (const row of rows) {
      const original = String(row.event_type)
      const remapped = REMAP[original] ?? original
      expect(ALLOWED_EVENT_TYPES.has(remapped)).toBe(true)
    }
  })

  test('REMAP table includes patch_applied → patch_validation', () => {
    expect(REMAP['patch_applied']).toBe('patch_validation')
    expect(ALLOWED_EVENT_TYPES.has(REMAP['patch_applied'])).toBe(true)
  })
})

// P104.4 — BYOK boundary check (no key shapes anywhere) (1)
test.describe('P104.4 — BYOK trust boundary', () => {
  test('no sk-/AIza/Bearer key shapes anywhere in seed', () => {
    const raw = read(SEED_FIXTURE)
    // Per ADR-043 / ADR-126 — keys must NEVER be persisted in fixtures.
    expect(raw).not.toMatch(/sk-ant-[A-Za-z0-9_-]{20,}/)
    expect(raw).not.toMatch(/sk-proj-[A-Za-z0-9_-]{20,}/)
    expect(raw).not.toMatch(/sk-or-[A-Za-z0-9_-]{20,}/)
    expect(raw).not.toMatch(/AIza[0-9A-Za-z_-]{35}/)
    expect(raw).not.toMatch(/Bearer\s+\S+/)
  })
})

// P104.5 — validateEventType helper exists in comprehensiveLogs.ts (2)
test.describe('P104.5 — validateEventType helper exported', () => {
  test('comprehensiveLogs.ts exports VALID_LOG_EVENT_TYPES + validateEventType', () => {
    expect(existsSync(COMPREHENSIVE_LOGS)).toBe(true)
    const src = read(COMPREHENSIVE_LOGS)
    expect(src).toMatch(/export\s+const\s+VALID_LOG_EVENT_TYPES\s*=/)
    expect(src).toMatch(/export\s+function\s+validateEventType\s*\(/)
    expect(src).toMatch(/export\s+type\s+ValidLogEventType/)
  })

  test('validateEventType remaps patch_applied → patch_validation + writeLogEvent integrates it', () => {
    const src = read(COMPREHENSIVE_LOGS)
    // Alias remap branch present
    expect(src).toMatch(/patch_applied/)
    expect(src).toMatch(/patch_validation/)
    // writeLogEvent calls validateEventType (drop invalid rows path).
    expect(src).toMatch(/validateEventType\s*\(\s*event\.eventType\s*\)/)
  })
})

// P104.6 — validateSectionType helper exists in section.ts (2)
test.describe('P104.6 — validateSectionType helper exported', () => {
  test('section.ts exports VALID_SECTION_TYPES + validateSectionType', () => {
    expect(existsSync(SECTION_SCHEMA)).toBe(true)
    const src = read(SECTION_SCHEMA)
    expect(src).toMatch(/export\s+const\s+VALID_SECTION_TYPES\s*=/)
    expect(src).toMatch(/export\s+function\s+validateSectionType\s*\(/)
    expect(src).toMatch(/export\s+type\s+ValidSectionType/)
  })

  test('aliases include article→text + testimonial→quotes + pull-quote→quotes', () => {
    const src = read(SECTION_SCHEMA)
    expect(src).toMatch(/article:\s*['"]text['"]/)
    expect(src).toMatch(/testimonial:\s*['"]quotes['"]/)
    expect(src).toMatch(/['"]pull-quote['"]\s*:\s*['"]quotes['"]/)
  })
})

// P104.7 — counts: 35 rows / 3 unique session_ids / event_type histogram (3)
test.describe('P104.7 — seed counts + histogram', () => {
  test('exactly 35 rows', () => {
    const rows = parseSeed(SEED_FIXTURE)
    expect(rows.length).toBe(35)
  })

  test('exactly 3 unique session_ids', () => {
    const rows = parseSeed(SEED_FIXTURE)
    const sessions = new Set(rows.map((r) => r.session_id))
    expect(sessions.size).toBe(3)
  })

  test('event_type histogram covers ≥4 distinct kinds (post-remap)', () => {
    const rows = parseSeed(SEED_FIXTURE)
    const kinds = new Set(
      rows.map((r) => REMAP[String(r.event_type)] ?? String(r.event_type)),
    )
    expect(kinds.size).toBeGreaterThanOrEqual(4)
    // Required headline kinds present
    expect(kinds.has('intent_classification')).toBe(true)
    expect(kinds.has('patch_validation')).toBe(true)
  })
})
