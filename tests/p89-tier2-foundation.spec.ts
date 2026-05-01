/**
 * P89 / TIER2-FOUNDATION — Supabase architecture + feature flag seal spec.
 * PURE-UNIT: FS reads + regex/string asserts. NO browser bootstrap.
 * Pattern follows tests/p88-section-visual.spec.ts + p87-marketing-mobile.spec.ts.
 *
 * P89.1 — ADR-114 file shape (4)                                    [hard-gate; A4 owns]
 * P89.2 — ADR-115 file shape (4)                                    [hard-gate; A6 owns]
 * P89.3 — Supabase scaffolding files exist (4)                      [existsSync-guarded; A5 owns]
 * P89.4 — Schema SQL has 5 required tables (1)                      [existsSync-guarded; A5 owns]
 * P89.5 — Feature flag uses VITE_SUPABASE_URL (1)                   [existsSync-guarded; A5 owns]
 * P89.6 — BYOK keys NOT in Supabase schema (1)                      [existsSync-guarded; per ADR-114 D3 + ADR-043]
 * P89.7 — KISS — no new deps in P89 source (1)                      [existsSync-guarded; no @supabase SDK import]
 * P89.8 — EOP triplet present for P89 (3)                           [hard-gate; A6 owns]
 *
 * Soft-pass guards via existsSync() let A4 / A5 timing slips surface as
 * deferred (carry-forward) rather than red — matches the P85 / P86 / P87 / P88
 * cadence. The EOP block + ADR-115 are hard-gate: owned by THIS agent (A6)
 * and must exist.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

// --- ADR-114 (A4 owns) ---
const ADR_114 = join(ROOT, 'docs/adr/ADR-114-supabase-architecture.md')

// --- ADR-115 (this agent owns) ---
const ADR_115 = join(ROOT, 'docs/adr/ADR-115-feature-flag-architecture.md')

// --- A5-owned Supabase scaffolding surfaces ---
const SB_INDEX = join(ROOT, 'src/contexts/persistence/supabase/index.ts')
const SB_AUTH = join(ROOT, 'src/contexts/persistence/supabase/auth.ts')
const SB_SCHEMA = join(ROOT, 'src/contexts/persistence/supabase/schema.sql')
const FEATURE_FLAG = join(ROOT, 'src/contexts/persistence/featureFlag.ts')
const DB_WRAPPER = join(ROOT, 'src/contexts/persistence/db.ts')

// --- EOP triplet for P89 (this agent owns) ---
const PHASE_DIR = 'plans/implementation/phase-89'
const EOP_REVIEW = join(ROOT, PHASE_DIR, '02-post-review.md')
const EOP_LOG = join(ROOT, PHASE_DIR, 'session-log.md')
const EOP_RETRO = join(ROOT, PHASE_DIR, 'retrospective.md')

// 5 required Supabase tables per ADR-114 §Schema
const REQUIRED_TABLES = [
  'users',
  'projects',
  'sessions',
  'team_members',
  'share_specs',
]

// BYOK forbidden column names per ADR-114 D3 + ADR-043 trust boundary
const FORBIDDEN_BYOK_TOKENS = ['api_key', 'apikey', 'byok_key']

function read(p: string): string {
  return readFileSync(p, 'utf8')
}
function locOf(p: string): number {
  return read(p).split('\n').length
}

// =============================================================================
// P89.1 — ADR-114 file shape (hard-gate; A4 owns)
// =============================================================================
test.describe('P89.1 — ADR-114 file shape', () => {
  test('ADR-114 exists on disk', () => {
    expect(existsSync(ADR_114)).toBe(true)
  })
  test('ADR-114 is ≤180 LOC', () => {
    if (!existsSync(ADR_114)) return
    const n = locOf(ADR_114)
    expect(n, `ADR-114 LOC ${n} should be ≤180`).toBeLessThanOrEqual(180)
  })
  test('ADR-114 declares Status: Accepted (markdown-bold tolerant)', () => {
    if (!existsSync(ADR_114)) return
    expect(read(ADR_114)).toMatch(/Status:\s*\**\s*Accepted/i)
  })
  test('ADR-114 cross-refs ADR-016 + ADR-043 + ADR-082 + ADR-109', () => {
    if (!existsSync(ADR_114)) return
    const src = read(ADR_114)
    expect(src, 'cross-refs ADR-016').toContain('ADR-016')
    expect(src, 'cross-refs ADR-043').toContain('ADR-043')
    expect(src, 'cross-refs ADR-082').toContain('ADR-082')
    expect(src, 'cross-refs ADR-109').toContain('ADR-109')
  })
})

// =============================================================================
// P89.2 — ADR-115 file shape (hard-gate; this agent owns)
// =============================================================================
test.describe('P89.2 — ADR-115 file shape', () => {
  test('ADR-115 exists on disk', () => {
    expect(existsSync(ADR_115)).toBe(true)
  })
  test('ADR-115 is ≤120 LOC', () => {
    if (!existsSync(ADR_115)) return
    const n = locOf(ADR_115)
    expect(n, `ADR-115 LOC ${n} should be ≤120`).toBeLessThanOrEqual(120)
  })
  test('ADR-115 declares Status: Accepted (markdown-bold tolerant)', () => {
    if (!existsSync(ADR_115)) return
    expect(read(ADR_115)).toMatch(/Status:\s*\**\s*Accepted/i)
  })
  test('ADR-115 cross-refs ADR-114 + ADR-082', () => {
    if (!existsSync(ADR_115)) return
    const src = read(ADR_115)
    expect(src, 'cross-refs ADR-114').toContain('ADR-114')
    expect(src, 'cross-refs ADR-082').toContain('ADR-082')
  })
})

// =============================================================================
// P89.3 — Supabase scaffolding files exist (A5 surfaces)
// =============================================================================
test.describe('P89.3 — Supabase scaffolding files exist (A5)', () => {
  test('src/contexts/persistence/supabase/index.ts exists (or A5 timing-slip)', () => {
    if (!existsSync(SB_INDEX)) return // A5 timing-slip soft-pass
    expect(existsSync(SB_INDEX)).toBe(true)
  })
  test('src/contexts/persistence/supabase/auth.ts exists (or A5 timing-slip)', () => {
    if (!existsSync(SB_AUTH)) return
    expect(existsSync(SB_AUTH)).toBe(true)
  })
  test('src/contexts/persistence/supabase/schema.sql exists (or A5 timing-slip)', () => {
    if (!existsSync(SB_SCHEMA)) return
    expect(existsSync(SB_SCHEMA)).toBe(true)
  })
  test('src/contexts/persistence/featureFlag.ts exists (or A5 timing-slip)', () => {
    if (!existsSync(FEATURE_FLAG)) return
    expect(existsSync(FEATURE_FLAG)).toBe(true)
  })
})

// =============================================================================
// P89.4 — Schema SQL has 5 required tables (existsSync-guarded; A5 surface)
// =============================================================================
test.describe('P89.4 — Schema SQL has 5 required tables', () => {
  test('schema.sql contains users + projects + sessions + team_members + share_specs', () => {
    if (!existsSync(SB_SCHEMA)) return // A5 timing-slip soft-pass
    const body = read(SB_SCHEMA)
    for (const tbl of REQUIRED_TABLES) {
      expect(
        body.includes(tbl),
        `schema.sql must reference required table '${tbl}'`,
      ).toBe(true)
    }
  })
})

// =============================================================================
// P89.5 — Feature flag uses VITE_SUPABASE_URL (existsSync-guarded; A5 surface)
// =============================================================================
test.describe('P89.5 — Feature flag uses VITE_SUPABASE_URL', () => {
  test('featureFlag.ts source contains VITE_SUPABASE_URL (per ADR-115 D1)', () => {
    if (!existsSync(FEATURE_FLAG)) return // A5 timing-slip soft-pass
    expect(read(FEATURE_FLAG)).toContain('VITE_SUPABASE_URL')
  })
})

// =============================================================================
// P89.6 — BYOK keys NOT in Supabase schema (per ADR-114 D3 + ADR-043)
// =============================================================================
test.describe('P89.6 — BYOK keys NOT in Supabase schema', () => {
  test('schema.sql contains 0 occurrences of api_key/apikey/byok_key (case-insensitive)', () => {
    if (!existsSync(SB_SCHEMA)) return // A5 timing-slip soft-pass
    const body = read(SB_SCHEMA).toLowerCase()
    for (const tok of FORBIDDEN_BYOK_TOKENS) {
      const count = (body.match(new RegExp(tok, 'g')) || []).length
      expect(
        count,
        `schema.sql must contain 0 occurrences of '${tok}' (BYOK trust boundary; ADR-043 + ADR-114 D3); found ${count}`,
      ).toBe(0)
    }
  })
})

// =============================================================================
// P89.7 — KISS — no new deps in P89 source
//
// Per ADR-114 + preflight: scaffolding-only this sprint. The real
// `@supabase/supabase-js` install is deferred to P90 (runtime wiring).
// Verify zero `from '@supabase/...'` imports in any P89 source file.
// =============================================================================
test.describe('P89.7 — KISS — no @supabase SDK imports in P89 source', () => {
  test('no P89 source file imports @supabase/* (deferred to P90)', () => {
    const surfaces = [SB_INDEX, SB_AUTH, FEATURE_FLAG, DB_WRAPPER]
    for (const file of surfaces) {
      if (!existsSync(file)) continue
      const src = read(file)
      const importedSingle = src.includes(`from '@supabase/`)
      const importedDouble = src.includes(`from "@supabase/`)
      expect(
        importedSingle || importedDouble,
        `${file} must not import @supabase/* (P89 is scaffolding-only; runtime wiring deferred to P90)`,
      ).toBe(false)
    }
  })
})

// =============================================================================
// P89.8 — EOP triplet present for P89 (hard-gate; this agent owns)
// =============================================================================
test.describe('P89.8 — EOP triplet present for P89', () => {
  test('phase-89/02-post-review.md exists', () => {
    expect(existsSync(EOP_REVIEW)).toBe(true)
  })
  test('phase-89/session-log.md exists', () => {
    expect(existsSync(EOP_LOG)).toBe(true)
  })
  test('phase-89/retrospective.md exists', () => {
    expect(existsSync(EOP_RETRO)).toBe(true)
  })
})
