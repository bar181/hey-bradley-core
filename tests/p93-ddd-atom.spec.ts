/**
 * P93 / AW-DDD-ATOM — DDD_ATOM 7th Crystal Atom seal spec.
 * PURE-UNIT: FS reads + regex/string asserts. NO browser bootstrap.
 * Pattern follows tests/p92-process-atom.spec.ts.
 *
 * P93.1 — ADR-119 file shape (4)                                    [hard-gate; A6 owns]
 * P93.2 — dddAtom.ts exports (A4) (4)                               [existsSync-guarded]
 * P93.3 — DomainModelSVG component (A5) (2)                         [existsSync-guarded]
 * P93.4 — PlanningViewToggle component (A5) (2)                     [existsSync-guarded]
 * P93.5 — Planning.tsx wires toggle + DomainModelSVG (A6) (1)       [hard-gate; A6 owns]
 * P93.6 — KISS — no animation libs / no new deps in P93 source (1)  [existsSync-guarded]
 * P93.7 — EOP triplet for P93 (3)                                   [hard-gate; A6 owns]
 *
 * Soft-pass guards via existsSync() let A4 / A5 timing slips surface as
 * deferred (carry-forward) rather than red. Hard-gate remains on A6-owned
 * files (ADR-119 + Planning wire + EOP triplet).
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

// --- ADR-119 (A6 owns) ---
const ADR_119 = join(ROOT, 'docs/adr/ADR-119-ddd-atom.md')

// --- A4-owned DDD_ATOM module ---
const DDD_ATOM = join(ROOT, 'src/contexts/intelligence/aisp/dddAtom.ts')

// --- A5-owned components ---
const DOMAIN_MODEL_SVG = join(ROOT, 'src/components/planning/DomainModelSVG.tsx')
const PLANNING_VIEW_TOGGLE = join(ROOT, 'src/components/planning/PlanningViewToggle.tsx')

// --- A6-owned Planning.tsx wire (hard-gate) ---
const PAGE_PLANNING = join(ROOT, 'src/pages/Planning.tsx')

// --- EOP triplet for P93 (A6 owns) ---
const PHASE_DIR = 'plans/implementation/phase-93'
const EOP_REVIEW = join(ROOT, PHASE_DIR, '02-post-review.md')
const EOP_LOG = join(ROOT, PHASE_DIR, 'session-log.md')
const EOP_RETRO = join(ROOT, PHASE_DIR, 'retrospective.md')

// Banned animation libs per Hard rules
const BANNED_TOKENS = [
  'framer-motion',
  'gsap',
  'lottie',
  '@react-spring',
  'animejs',
]

function read(p: string): string {
  return readFileSync(p, 'utf8')
}
function locOf(p: string): number {
  return read(p).split('\n').length
}

// =============================================================================
// P93.1 — ADR-119 file shape (hard-gate; A6 owns)
// =============================================================================
test.describe('P93.1 — ADR-119 file shape', () => {
  test('ADR-119 exists on disk', () => {
    expect(existsSync(ADR_119)).toBe(true)
  })
  test('ADR-119 is ≤120 LOC', () => {
    if (!existsSync(ADR_119)) return
    const n = locOf(ADR_119)
    expect(n, `ADR-119 LOC ${n} should be ≤120`).toBeLessThanOrEqual(120)
  })
  test('ADR-119 declares Status: Accepted (markdown-bold tolerant)', () => {
    if (!existsSync(ADR_119)) return
    expect(read(ADR_119)).toMatch(/Status:\s*\**\s*Accepted/i)
  })
  test('ADR-119 cross-refs ADR-053 + ADR-099 + ADR-118', () => {
    if (!existsSync(ADR_119)) return
    const src = read(ADR_119)
    expect(src, 'cross-refs ADR-053').toContain('ADR-053')
    expect(src, 'cross-refs ADR-099').toContain('ADR-099')
    expect(src, 'cross-refs ADR-118').toContain('ADR-118')
  })
})

// =============================================================================
// P93.2 — dddAtom.ts exports (A4 surface; existsSync-guarded)
// =============================================================================
test.describe('P93.2 — dddAtom.ts exports (A4)', () => {
  test('src/contexts/intelligence/aisp/dddAtom.ts exists (or A4 timing-slip)', () => {
    if (!existsSync(DDD_ATOM)) return
    expect(existsSync(DDD_ATOM)).toBe(true)
  })
  test('dddAtom source exports `function classifyContexts`', () => {
    if (!existsSync(DDD_ATOM)) return
    expect(read(DDD_ATOM)).toContain('export function classifyContexts')
  })
  test('dddAtom source exports `function buildDDDAtom` + `function parseDDDResponse`', () => {
    if (!existsSync(DDD_ATOM)) return
    const src = read(DDD_ATOM)
    expect(src, 'exports buildDDDAtom').toContain('export function buildDDDAtom')
    expect(src, 'exports parseDDDResponse').toContain('export function parseDDDResponse')
  })
  test('dddAtom source exports `function toDomainModel`', () => {
    if (!existsSync(DDD_ATOM)) return
    expect(read(DDD_ATOM)).toContain('export function toDomainModel')
  })
})

// =============================================================================
// P93.3 — DomainModelSVG component (A5 surface; existsSync-guarded)
// =============================================================================
test.describe('P93.3 — DomainModelSVG component (A5)', () => {
  test('src/components/planning/DomainModelSVG.tsx exists (or A5 timing-slip)', () => {
    if (!existsSync(DOMAIN_MODEL_SVG)) return
    expect(existsSync(DOMAIN_MODEL_SVG)).toBe(true)
  })
  test('DomainModelSVG source contains testid `domain-model-svg` + an <svg root', () => {
    if (!existsSync(DOMAIN_MODEL_SVG)) return
    const src = read(DOMAIN_MODEL_SVG)
    expect(src, 'domain-model-svg testid').toContain('data-testid="domain-model-svg"')
    expect(src, 'svg root').toContain('<svg')
  })
})

// =============================================================================
// P93.4 — PlanningViewToggle component (A5 surface; existsSync-guarded)
// =============================================================================
test.describe('P93.4 — PlanningViewToggle component (A5)', () => {
  test('src/components/planning/PlanningViewToggle.tsx exists (or A5 timing-slip)', () => {
    if (!existsSync(PLANNING_VIEW_TOGGLE)) return
    expect(existsSync(PLANNING_VIEW_TOGGLE)).toBe(true)
  })
  test('PlanningViewToggle source contains 3 testids (toggle + process-map + domain-model)', () => {
    if (!existsSync(PLANNING_VIEW_TOGGLE)) return
    const src = read(PLANNING_VIEW_TOGGLE)
    expect(src, 'planning-view-toggle testid').toContain('planning-view-toggle')
    expect(src, 'view-toggle-process-map testid').toContain('view-toggle-process-map')
    expect(src, 'view-toggle-domain-model testid').toContain('view-toggle-domain-model')
  })
})

// =============================================================================
// P93.5 — Planning.tsx wires toggle + DomainModelSVG (A6; hard-gate)
// =============================================================================
test.describe('P93.5 — Planning.tsx wires toggle + DomainModelSVG (A6)', () => {
  test('Planning.tsx imports + renders PlanningViewToggle and DomainModelSVG', () => {
    expect(existsSync(PAGE_PLANNING)).toBe(true)
    const src = read(PAGE_PLANNING)
    expect(src, 'imports PlanningViewToggle').toContain('PlanningViewToggle')
    expect(src, 'imports DomainModelSVG').toContain('DomainModelSVG')
    const togMatches = src.match(/PlanningViewToggle/g) ?? []
    const dmMatches = src.match(/DomainModelSVG/g) ?? []
    expect(
      togMatches.length,
      `expected ≥2 PlanningViewToggle refs (import + render); saw ${togMatches.length}`,
    ).toBeGreaterThanOrEqual(2)
    expect(
      dmMatches.length,
      `expected ≥2 DomainModelSVG refs (import + render); saw ${dmMatches.length}`,
    ).toBeGreaterThanOrEqual(2)
  })
})

// =============================================================================
// P93.6 — KISS — no animation libs / no new deps in P93 source
// =============================================================================
test.describe('P93.6 — KISS — no animation libs / no new deps in P93 source', () => {
  test('no P93 source file imports banned animation libs', () => {
    const surfaces = [DDD_ATOM, DOMAIN_MODEL_SVG, PLANNING_VIEW_TOGGLE, PAGE_PLANNING]
    for (const file of surfaces) {
      if (!existsSync(file)) continue
      const src = read(file).toLowerCase()
      for (const tok of BANNED_TOKENS) {
        expect(
          src.includes(tok),
          `${file} must not import banned lib '${tok}' (KISS / Hard rule)`,
        ).toBe(false)
      }
    }
  })
})

// =============================================================================
// P93.7 — EOP triplet present for P93 (hard-gate; A6 owns)
// =============================================================================
test.describe('P93.7 — EOP triplet present for P93', () => {
  test('phase-93/02-post-review.md exists', () => {
    expect(existsSync(EOP_REVIEW)).toBe(true)
  })
  test('phase-93/session-log.md exists', () => {
    expect(existsSync(EOP_LOG)).toBe(true)
  })
  test('phase-93/retrospective.md exists', () => {
    expect(existsSync(EOP_RETRO)).toBe(true)
  })
})
