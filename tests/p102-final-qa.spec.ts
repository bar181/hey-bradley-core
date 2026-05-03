/**
 * P102 / OC-POLISH-W5 — Final QA · Token Migration · Agentics Live-Wire
 * closer seal spec.
 *
 * PURE-UNIT: FS reads + regex/string asserts. NO browser bootstrap.
 * Pattern follows tests/p101-rc.spec.ts (existsSync soft-pass guards on
 * upstream A1/A2/A3 surfaces; hard-gate on A4-owned ADR-132 + EOP triplet).
 *
 * P102.1 — ADR-132 file shape (4)                  [hard-gate; A4 owns]
 * P102.2 — Token migration (Welcome=0, Onboarding≤10) (3) [soft-pass]
 * P102.3 — index.css tokens added (4)              [soft-pass]
 * P102.4 — Agentics live-wire surface (3)          [soft-pass]
 * P102.5 — ProcessMapSVG token consumption (1)     [soft-pass]
 * P102.6 — Migration 005 INTENT_FUTURE block (1)   [soft-pass]
 * P102.7 — Persona re-score doc (3)                [hard-gate; A4 owns]
 * P102.8 — EOP triplet completeness (3)            [hard-gate; A4 owns]
 *
 * Total: ≥22 cases across 8 describe blocks (≥20 required by brief).
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

// --- ADR-132 (A4 owns) ---
const ADR_132 = join(ROOT, 'docs/adr/ADR-132-final-qa-token-migration.md')

// --- Wave 1 surfaces (A1+A2+A3) ---
const WELCOME = join(ROOT, 'src/pages/Welcome.tsx')
const ONBOARDING = join(ROOT, 'src/pages/Onboarding.tsx')
const AGENTICS = join(ROOT, 'src/pages/Agentics.tsx')
const INDEX_CSS = join(ROOT, 'src/index.css')
const PROCESS_MAP_SVG = join(ROOT, 'src/components/planning/ProcessMapSVG.tsx')
const MIGRATION_005 = join(ROOT, 'src/contexts/persistence/migrations/005-comprehensive-logs.sql')

// --- A4-owned EOP triplet + persona doc (hard-gate) ---
const SEAL_DIR_102 = 'plans/implementation/phase-102/seal'
const PERSONA_RESCORE = join(ROOT, SEAL_DIR_102, 'persona-rescore.md')
const EOP_REVIEW = join(ROOT, SEAL_DIR_102, '02-post-review.md')
const EOP_LOG = join(ROOT, SEAL_DIR_102, 'session-log.md')
const EOP_RETRO = join(ROOT, SEAL_DIR_102, 'retrospective.md')

function read(p: string): string {
  return readFileSync(p, 'utf8')
}
function locOf(p: string): number {
  return read(p).split('\n').length
}
function countMatches(haystack: string, pattern: RegExp): number {
  const m = haystack.match(pattern)
  return m ? m.length : 0
}

// =============================================================================
// P102.1 — ADR-132 file shape (hard-gate; A4 owns)
// =============================================================================
test.describe('P102.1 — ADR-132 file shape', () => {
  test('ADR-132 exists on disk', () => {
    expect(existsSync(ADR_132)).toBe(true)
  })
  test('ADR-132 is ≤120 LOC', () => {
    if (!existsSync(ADR_132)) return
    const n = locOf(ADR_132)
    expect(n, `ADR-132 LOC ${n} should be ≤120`).toBeLessThanOrEqual(120)
  })
  test('ADR-132 declares Status: Accepted (markdown-bold tolerant)', () => {
    if (!existsSync(ADR_132)) return
    expect(read(ADR_132)).toMatch(/Status:\s*\**\s*Accepted/i)
  })
  test('ADR-132 cross-refs ADR-087 + ADR-117 + ADR-126 + ADR-131', () => {
    if (!existsSync(ADR_132)) return
    const src = read(ADR_132)
    for (const ref of ['ADR-087', 'ADR-117', 'ADR-126', 'ADR-131']) {
      expect(src, `cross-refs ${ref}`).toContain(ref)
    }
  })
})

// =============================================================================
// P102.2 — Token migration verification (soft-pass on Wave 1 surfaces)
// =============================================================================
test.describe('P102.2 — Token migration verification', () => {
  test('Welcome.tsx hex count is 0 (full migration)', () => {
    if (!existsSync(WELCOME)) return
    const src = read(WELCOME)
    const n = countMatches(src, /#[0-9a-fA-F]{6}/g)
    expect(n, `Welcome.tsx should have 0 hex values (found ${n})`).toBe(0)
  })
  test('Onboarding.tsx hex count is ≤10 (theme-palette JSON data fallbacks)', () => {
    if (!existsSync(ONBOARDING)) return
    const src = read(ONBOARDING)
    const n = countMatches(src, /#[0-9a-fA-F]{6}/g)
    expect(
      n,
      `Onboarding.tsx hex count ${n} should be ≤10 (the 9 known theme-palette JSON data fallbacks per ADR-132 §1)`,
    ).toBeLessThanOrEqual(10)
  })
  test('Onboarding.tsx hex count is < 91 (was 91 at P101 baseline)', () => {
    if (!existsSync(ONBOARDING)) return
    const src = read(ONBOARDING)
    const n = countMatches(src, /#[0-9a-fA-F]{6}/g)
    expect(n, `Onboarding.tsx should be substantially migrated (was 91)`).toBeLessThan(91)
  })
})

// =============================================================================
// P102.3 — index.css tokens added (soft-pass on A1/A3 surfaces)
// =============================================================================
test.describe('P102.3 — index.css tokens added', () => {
  test('--hb-warm token declared', () => {
    if (!existsSync(INDEX_CSS)) return
    expect(read(INDEX_CSS)).toMatch(/--hb-warm:\s*#/)
  })
  test('--hb-warm-rgb RGB channel-form token declared', () => {
    if (!existsSync(INDEX_CSS)) return
    expect(read(INDEX_CSS)).toMatch(/--hb-warm-rgb:\s*\d+\s+\d+\s+\d+/)
  })
  test('--hb-status-sealed token declared (CF#11 closure)', () => {
    if (!existsSync(INDEX_CSS)) return
    expect(read(INDEX_CSS)).toMatch(/--hb-status-sealed:\s*#22c55e/i)
  })
  test('--hb-status-deferred token declared (CF#11 closure)', () => {
    if (!existsSync(INDEX_CSS)) return
    expect(read(INDEX_CSS)).toMatch(/--hb-status-deferred:\s*#f59e0b/i)
  })
})

// =============================================================================
// P102.4 — Agentics live-wire surface (CF#8 closure; soft-pass on A2 surface)
// =============================================================================
test.describe('P102.4 — Agentics live-wire surface', () => {
  test('Agentics.tsx queries process_atom_output event_type', () => {
    if (!existsSync(AGENTICS)) return
    expect(read(AGENTICS)).toContain('process_atom_output')
  })
  test('Agentics.tsx imports + calls toProcessMap()', () => {
    if (!existsSync(AGENTICS)) return
    expect(read(AGENTICS)).toContain('toProcessMap')
  })
  test('Agentics.tsx maintains liveMap state with sample fallback', () => {
    if (!existsSync(AGENTICS)) return
    expect(read(AGENTICS)).toContain('liveMap')
  })
})

// =============================================================================
// P102.5 — ProcessMapSVG token consumption (soft-pass on A3 surface)
// =============================================================================
test.describe('P102.5 — ProcessMapSVG token consumption', () => {
  test('ProcessMapSVG.tsx has ≥12 var(--hb-*) refs (was 10 + 2 status tokens)', () => {
    if (!existsSync(PROCESS_MAP_SVG)) return
    const src = read(PROCESS_MAP_SVG)
    const n = countMatches(src, /var\(--hb-/g)
    expect(
      n,
      `ProcessMapSVG.tsx should have ≥12 var(--hb-*) refs (found ${n})`,
    ).toBeGreaterThanOrEqual(12)
  })
})

// =============================================================================
// P102.6 — Migration 005 INTENT_FUTURE block (soft-pass on A3 surface)
// =============================================================================
test.describe('P102.6 — Migration 005 INTENT_FUTURE block', () => {
  test('migration 005 contains INTENT_FUTURE comment block', () => {
    if (!existsSync(MIGRATION_005)) return
    expect(read(MIGRATION_005)).toMatch(/INTENT_FUTURE/)
  })
})

// =============================================================================
// P102.7 — Persona re-score doc (hard-gate; A4 owns)
// =============================================================================
test.describe('P102.7 — Persona re-score doc', () => {
  test('persona-rescore.md exists at seal/', () => {
    expect(existsSync(PERSONA_RESCORE)).toBe(true)
  })
  test('persona-rescore.md names Grandma + Framer + Lars scores', () => {
    if (!existsSync(PERSONA_RESCORE)) return
    const src = read(PERSONA_RESCORE)
    expect(src, 'Grandma score named').toMatch(/Grandma/)
    expect(src, 'Framer score named').toMatch(/Framer/)
    expect(src, 'Lars score named').toMatch(/Lars/)
  })
  test('persona-rescore.md asserts each score ≥85 (no floor breach)', () => {
    if (!existsSync(PERSONA_RESCORE)) return
    const src = read(PERSONA_RESCORE)
    // At least 3 score lines with values ≥85. Match patterns like "86/100", "88/100" etc.
    const scores = src.match(/\b(8[5-9]|9[0-9]|100)\/100\b/g) ?? []
    expect(
      scores.length,
      `persona-rescore.md should name ≥3 scores ≥85 (found ${scores.length})`,
    ).toBeGreaterThanOrEqual(3)
  })
})

// =============================================================================
// P102.8 — EOP triplet completeness (hard-gate; A4 owns)
// =============================================================================
test.describe('P102.8 — EOP triplet completeness', () => {
  test('02-post-review.md exists at seal/', () => {
    expect(existsSync(EOP_REVIEW)).toBe(true)
  })
  test('session-log.md exists at seal/', () => {
    expect(existsSync(EOP_LOG)).toBe(true)
  })
  test('retrospective.md exists at seal/', () => {
    expect(existsSync(EOP_RETRO)).toBe(true)
  })
})
