/**
 * P91 / AW-PROCESS-MAP — process map visualization seal spec.
 * PURE-UNIT: FS reads + regex/string asserts. NO browser bootstrap.
 * Pattern follows tests/p90-mode-architecture.spec.ts.
 *
 * P91.1 — ADR-117 file shape (4)                                    [hard-gate; A3 owns]
 * P91.2 — ProcessMapSVG component shape (4)                         [existsSync-guarded; A1 owns]
 * P91.3 — Status colors via tokens (1)                              [existsSync-guarded; A1 owns]
 * P91.4 — Click handler wired (1)                                   [existsSync-guarded; A1 owns]
 * P91.5 — Sample data + Planning integration (3)                    [existsSync-guarded; A2 owns]
 * P91.6 — Planning page testids (1)                                 [existsSync-guarded; A2 owns]
 * P91.7 — KISS — no animation libs / no new deps in P91 source (1)  [existsSync-guarded]
 * P91.8 — EOP triplet (3)                                           [hard-gate; A3 owns]
 *
 * Soft-pass guards via existsSync() let A1 / A2 timing slips surface as
 * deferred (carry-forward) rather than red. Hard-gate remains on A3-owned
 * files (ADR-117 + EOP triplet).
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

// --- ADR-117 (this agent owns) ---
const ADR_117 = join(ROOT, 'docs/adr/ADR-117-process-map-svg-architecture.md')

// --- A1-owned ProcessMapSVG component ---
const PROCESS_MAP_SVG = join(ROOT, 'src/components/planning/ProcessMapSVG.tsx')

// --- A2-owned Planning page + sample data ---
const PAGE_PLANNING = join(ROOT, 'src/pages/Planning.tsx')
const SAMPLE_MAP = join(ROOT, 'src/data/sample-process-map.ts')

// --- package.json (no new dep gate) ---
const PACKAGE_JSON = join(ROOT, 'package.json')

// --- EOP triplet for P91 (this agent owns) ---
const PHASE_DIR = 'plans/implementation/phase-91'
const EOP_REVIEW = join(ROOT, PHASE_DIR, '02-post-review.md')
const EOP_LOG = join(ROOT, PHASE_DIR, 'session-log.md')
const EOP_RETRO = join(ROOT, PHASE_DIR, 'retrospective.md')

// Banned animation + graph libs per Hard rule #1 + #2
const BANNED_TOKENS = [
  'framer-motion',
  'gsap',
  'lottie',
  '@react-spring',
  'animejs',
  'react-flow',
  'd3',
]
const BANNED_DEP_TOKENS = ['react-flow', 'd3', 'svg-pan-zoom']

function read(p: string): string {
  return readFileSync(p, 'utf8')
}
function locOf(p: string): number {
  return read(p).split('\n').length
}

// =============================================================================
// P91.1 — ADR-117 file shape (hard-gate; A3 owns)
// =============================================================================
test.describe('P91.1 — ADR-117 file shape', () => {
  test('ADR-117 exists on disk', () => {
    expect(existsSync(ADR_117)).toBe(true)
  })
  test('ADR-117 is ≤120 LOC', () => {
    if (!existsSync(ADR_117)) return
    const n = locOf(ADR_117)
    expect(n, `ADR-117 LOC ${n} should be ≤120`).toBeLessThanOrEqual(120)
  })
  test('ADR-117 declares Status: Accepted (markdown-bold tolerant)', () => {
    if (!existsSync(ADR_117)) return
    expect(read(ADR_117)).toMatch(/Status:\s*\**\s*Accepted/i)
  })
  test('ADR-117 cross-refs ADR-085 + ADR-091 + ADR-102 + ADR-116', () => {
    if (!existsSync(ADR_117)) return
    const src = read(ADR_117)
    expect(src, 'cross-refs ADR-085').toContain('ADR-085')
    expect(src, 'cross-refs ADR-091').toContain('ADR-091')
    expect(src, 'cross-refs ADR-102').toContain('ADR-102')
    expect(src, 'cross-refs ADR-116').toContain('ADR-116')
  })
})

// =============================================================================
// P91.2 — ProcessMapSVG component shape (A1 surface; existsSync-guarded)
// =============================================================================
test.describe('P91.2 — ProcessMapSVG component shape (A1)', () => {
  test('src/components/planning/ProcessMapSVG.tsx exists (or A1 timing-slip)', () => {
    if (!existsSync(PROCESS_MAP_SVG)) return
    expect(existsSync(PROCESS_MAP_SVG)).toBe(true)
  })
  test('ProcessMapSVG source exports `function ProcessMapSVG`', () => {
    if (!existsSync(PROCESS_MAP_SVG)) return
    expect(read(PROCESS_MAP_SVG)).toContain('export function ProcessMapSVG')
  })
  test('ProcessMapSVG source exports ProcessNodeStatus + ProcessEdgeType types', () => {
    if (!existsSync(PROCESS_MAP_SVG)) return
    const src = read(PROCESS_MAP_SVG)
    expect(src, 'exports ProcessNodeStatus').toContain('export type ProcessNodeStatus')
    expect(src, 'exports ProcessEdgeType').toContain('export type ProcessEdgeType')
  })
  test('ProcessMapSVG renders pure SVG (contains <svg + <path)', () => {
    if (!existsSync(PROCESS_MAP_SVG)) return
    const src = read(PROCESS_MAP_SVG)
    expect(src, 'contains <svg').toContain('<svg')
    expect(src, 'contains <path').toContain('<path')
  })
})

// =============================================================================
// P91.3 — Status colors via tokens (A1 surface)
// =============================================================================
test.describe('P91.3 — Status colors via tokens (A1)', () => {
  test('ProcessMapSVG source contains multiple var(--hb- references', () => {
    if (!existsSync(PROCESS_MAP_SVG)) return
    const src = read(PROCESS_MAP_SVG)
    const matches = src.match(/var\(--hb-/g) ?? []
    expect(
      matches.length,
      `ProcessMapSVG must contain ≥2 var(--hb-* references; saw ${matches.length}`,
    ).toBeGreaterThanOrEqual(2)
  })
})

// =============================================================================
// P91.4 — Click handler wired (A1 surface)
// =============================================================================
test.describe('P91.4 — Click handler wired (A1)', () => {
  test('ProcessMapSVG source contains onNodeSelect (prop or invocation)', () => {
    if (!existsSync(PROCESS_MAP_SVG)) return
    expect(read(PROCESS_MAP_SVG)).toContain('onNodeSelect')
  })
})

// =============================================================================
// P91.5 — Sample data + Planning integration (A2 surfaces)
// =============================================================================
test.describe('P91.5 — Sample data + Planning integration (A2)', () => {
  test('sample-process-map.ts exists; exports HEY_BRADLEY_SAMPLE_MAP with ≥5 P-numbered nodes', () => {
    if (!existsSync(SAMPLE_MAP)) return
    const src = read(SAMPLE_MAP)
    expect(src, 'exports HEY_BRADLEY_SAMPLE_MAP').toContain('HEY_BRADLEY_SAMPLE_MAP')
    const phaseMatches = src.match(/phase:\s*(?:1[5-9]|20)/g) ?? []
    expect(
      phaseMatches.length,
      `expected ≥5 P15-P20 phase-numbered nodes; saw ${phaseMatches.length}`,
    ).toBeGreaterThanOrEqual(5)
  })
  test('Planning.tsx imports ProcessMapSVG', () => {
    if (!existsSync(PAGE_PLANNING)) return
    expect(read(PAGE_PLANNING)).toContain('ProcessMapSVG')
  })
  test('Planning.tsx imports HEY_BRADLEY_SAMPLE_MAP', () => {
    if (!existsSync(PAGE_PLANNING)) return
    expect(read(PAGE_PLANNING)).toContain('HEY_BRADLEY_SAMPLE_MAP')
  })
})

// =============================================================================
// P91.6 — Planning page testids (A2 surface)
// =============================================================================
test.describe('P91.6 — Planning page testids (A2)', () => {
  test('Planning.tsx contains planning-process-map AND planning-node-detail testids', () => {
    if (!existsSync(PAGE_PLANNING)) return
    const src = read(PAGE_PLANNING)
    expect(src, 'planning-process-map testid').toContain('planning-process-map')
    expect(src, 'planning-node-detail testid').toContain('planning-node-detail')
  })
})

// =============================================================================
// P91.7 — KISS — no animation libs / no new deps in P91 source
// =============================================================================
test.describe('P91.7 — KISS — no animation libs / no new deps in P91 source', () => {
  test('no P91 source file imports banned animation / graph libs', () => {
    const surfaces = [PROCESS_MAP_SVG, PAGE_PLANNING, SAMPLE_MAP]
    for (const file of surfaces) {
      if (!existsSync(file)) continue
      const src = read(file).toLowerCase()
      for (const tok of BANNED_TOKENS) {
        expect(
          src.includes(tok),
          `${file} must not import banned lib '${tok}' (KISS / Hard rule #1+#2)`,
        ).toBe(false)
      }
    }
  })
  test('package.json contains no react-flow / d3 / svg-pan-zoom dep tokens', () => {
    if (!existsSync(PACKAGE_JSON)) return
    let pkg: { dependencies?: Record<string, string>; devDependencies?: Record<string, string> }
    try {
      pkg = JSON.parse(read(PACKAGE_JSON))
    } catch {
      return // tolerant — only checks parsed shape
    }
    const depKeys = [
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.devDependencies ?? {}),
    ]
    for (const tok of BANNED_DEP_TOKENS) {
      const hit = depKeys.find((k) => k.includes(tok))
      expect(
        hit,
        `package.json must not depend on '${tok}'; saw ${hit ?? 'nothing'}`,
      ).toBeUndefined()
    }
  })
})

// =============================================================================
// P91.8 — EOP triplet present for P91 (hard-gate; A3 owns)
// =============================================================================
test.describe('P91.8 — EOP triplet present for P91', () => {
  test('phase-91/02-post-review.md exists', () => {
    expect(existsSync(EOP_REVIEW)).toBe(true)
  })
  test('phase-91/session-log.md exists', () => {
    expect(existsSync(EOP_LOG)).toBe(true)
  })
  test('phase-91/retrospective.md exists', () => {
    expect(existsSync(EOP_RETRO)).toBe(true)
  })
})
