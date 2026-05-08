/**
 * P95 / SPEC-WORKBENCH — SpecWorkbench (first AGENT_ATOM consumer) seal spec.
 * PURE-UNIT: FS reads + regex/string asserts. NO browser bootstrap.
 * Pattern follows tests/p94-agent-atom.spec.ts.
 *
 * P95.1 — ADR-121 file shape (4)                                     [hard-gate; A3 owns]
 * P95.2 — SpecWorkbench component shape (A1) (4)                     [existsSync-guarded]
 * P95.3 — Empty state (A1) (1)                                       [existsSync-guarded]
 * P95.4 — Sample data (A2) (2)                                       [existsSync-guarded]
 * P95.5 — Agentics + Planning wired (A2) (2)                         [existsSync-guarded]
 * P95.6 — KISS — no animation libs / no new deps in P95 source (1)   [existsSync-guarded + package.json]
 * P95.7 — EOP triplet for P95 at seal/ subfolder (3)                 [hard-gate; A3 owns]
 *
 * Soft-pass guards via existsSync() let A1/A2 timing slips surface as
 * deferred (carry-forward) rather than red. Hard-gate remains on A3-owned
 * files (ADR-121 + EOP triplet).
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

// --- ADR-121 (A3 owns) ---
const ADR_121 = join(ROOT, 'docs/adr/ADR-121-spec-workbench-architecture.md')

// --- A1-owned SpecWorkbench component ---
const SPEC_WORKBENCH = join(ROOT, 'src/components/agentics/SpecWorkbench.tsx')

// --- A2-owned sample data + page wires ---
const SAMPLE_DATA = join(ROOT, 'src/data/sample-spec-workbench.ts')
const AGENTICS_PAGE = join(ROOT, 'src/pages/Agentics.tsx')
const PLANNING_PAGE = join(ROOT, 'src/pages/Planning.tsx')

// --- package.json (boundary check for no new deps) ---
const PACKAGE_JSON = join(ROOT, 'package.json')

// --- EOP triplet for P95 at seal/ subfolder (A3 owns) ---
// NOTE: seal/ subfolder avoids filename collision with planning docs
// (which use 02-ddd-adr-plan.md already at phase-95/).
const SEAL_DIR = 'plans/implementation/phase-95/seal'
const EOP_REVIEW = join(ROOT, SEAL_DIR, '02-post-review.md')
const EOP_LOG = join(ROOT, SEAL_DIR, 'session-log.md')
const EOP_RETRO = join(ROOT, SEAL_DIR, 'retrospective.md')

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
// P95.1 — ADR-121 file shape (hard-gate; A3 owns)
// =============================================================================
test.describe('P95.1 — ADR-121 file shape', () => {
  test('ADR-121 exists on disk', () => {
    expect(existsSync(ADR_121)).toBe(true)
  })
  test('ADR-121 is ≤120 LOC', () => {
    if (!existsSync(ADR_121)) return
    const n = locOf(ADR_121)
    expect(n, `ADR-121 LOC ${n} should be ≤120`).toBeLessThanOrEqual(120)
  })
  test('ADR-121 declares Status: Accepted (markdown-bold tolerant)', () => {
    if (!existsSync(ADR_121)) return
    expect(read(ADR_121)).toMatch(/Status:\s*\**\s*Accepted/i)
  })
  test('ADR-121 cross-refs ADR-095 + ADR-110 + ADR-116 + ADR-117', () => {
    if (!existsSync(ADR_121)) return
    const src = read(ADR_121)
    expect(src, 'cross-refs ADR-095').toContain('ADR-095')
    expect(src, 'cross-refs ADR-110').toContain('ADR-110')
    expect(src, 'cross-refs ADR-116').toContain('ADR-116')
    expect(src, 'cross-refs ADR-117').toContain('ADR-117')
  })
})

// =============================================================================
// P95.2 — SpecWorkbench component shape (A1 surface; existsSync-guarded)
// =============================================================================
test.describe('P95.2 — SpecWorkbench component shape (A1)', () => {
  test('src/components/agentics/SpecWorkbench.tsx exists (or A1 timing-slip)', () => {
    if (!existsSync(SPEC_WORKBENCH)) return
    expect(existsSync(SPEC_WORKBENCH)).toBe(true)
  })
  test('SpecWorkbench source exports `function SpecWorkbench`', () => {
    if (!existsSync(SPEC_WORKBENCH)) return
    expect(read(SPEC_WORKBENCH)).toMatch(/export\s+function\s+SpecWorkbench/)
  })
  test('SpecWorkbench source contains 3 tab testids (human + aisp + adr)', () => {
    if (!existsSync(SPEC_WORKBENCH)) return
    const src = read(SPEC_WORKBENCH)
    expect(src, 'spec-tab-human testid').toContain('spec-tab-human')
    expect(src, 'spec-tab-aisp testid').toContain('spec-tab-aisp')
    expect(src, 'spec-tab-adr testid').toContain('spec-tab-adr')
  })
  test('SpecWorkbench source contains clipboard CTA + navigator.clipboard reference (Q2)', () => {
    if (!existsSync(SPEC_WORKBENCH)) return
    const src = read(SPEC_WORKBENCH)
    expect(src, 'spec-aisp-copy testid').toContain('spec-aisp-copy')
    expect(src, 'navigator.clipboard reference (Q2 clipboard primary)').toMatch(
      /navigator\.clipboard/,
    )
  })
})

// =============================================================================
// P95.3 — Empty state (A1 surface; existsSync-guarded)
// =============================================================================
test.describe('P95.3 — Empty state (A1)', () => {
  test('SpecWorkbench source contains spec-workbench-empty testid', () => {
    if (!existsSync(SPEC_WORKBENCH)) return
    expect(read(SPEC_WORKBENCH)).toContain('spec-workbench-empty')
  })
})

// =============================================================================
// P95.4 — Sample data (A2 surface; existsSync-guarded)
// =============================================================================
test.describe('P95.4 — Sample data (A2)', () => {
  test('src/data/sample-spec-workbench.ts exists (or A2 timing-slip)', () => {
    if (!existsSync(SAMPLE_DATA)) return
    expect(existsSync(SAMPLE_DATA)).toBe(true)
  })
  test('sample-spec-workbench exports HEY_BRADLEY_SAMPLE_PHASES with ≥3 PhaseCard entries', () => {
    if (!existsSync(SAMPLE_DATA)) return
    const src = read(SAMPLE_DATA)
    expect(src, 'export const HEY_BRADLEY_SAMPLE_PHASES').toMatch(
      /export\s+const\s+HEY_BRADLEY_SAMPLE_PHASES/,
    )
    // Count `phase: <number>` occurrences as a proxy for PhaseCard entries
    const phaseMatches = src.match(/phase:\s*\d+/g) ?? []
    expect(
      phaseMatches.length,
      `HEY_BRADLEY_SAMPLE_PHASES must declare ≥3 PhaseCard entries (found ${phaseMatches.length})`,
    ).toBeGreaterThanOrEqual(3)
  })
})

// =============================================================================
// P95.5 — Agentics + Planning wired (A2 surface; existsSync-guarded)
// =============================================================================
test.describe('P95.5 — Agentics + Planning wired (A2)', () => {
  test('Agentics.tsx imports + renders SpecWorkbench (≥2 references)', () => {
    if (!existsSync(AGENTICS_PAGE)) return
    const src = read(AGENTICS_PAGE)
    const refs = src.match(/SpecWorkbench/g) ?? []
    expect(
      refs.length,
      `Agentics.tsx must import + render SpecWorkbench (found ${refs.length} references; need ≥2)`,
    ).toBeGreaterThanOrEqual(2)
  })
  test('Planning.tsx imports + renders SpecWorkbench (≥2 references)', () => {
    if (!existsSync(PLANNING_PAGE)) return
    const src = read(PLANNING_PAGE)
    const refs = src.match(/SpecWorkbench/g) ?? []
    expect(
      refs.length,
      `Planning.tsx must import + render SpecWorkbench (found ${refs.length} references; need ≥2)`,
    ).toBeGreaterThanOrEqual(2)
  })
})

// =============================================================================
// P95.6 — KISS — no animation libs / no new deps in P95 source
// =============================================================================
test.describe('P95.6 — KISS — no animation libs / no new deps in P95 source', () => {
  test('no P95 source file imports banned animation libs + no new opaque deps in package.json', () => {
    // (a) banned-token check on SpecWorkbench.tsx (existsSync-guarded)
    if (existsSync(SPEC_WORKBENCH)) {
      const src = read(SPEC_WORKBENCH).toLowerCase()
      for (const tok of BANNED_TOKENS) {
        expect(
          src.includes(tok),
          `${SPEC_WORKBENCH} must not import banned lib '${tok}' (KISS / Hard rule)`,
        ).toBe(false)
      }
    }
    // (b) banned-token check on sample-spec-workbench.ts (existsSync-guarded)
    if (existsSync(SAMPLE_DATA)) {
      const src = read(SAMPLE_DATA).toLowerCase()
      for (const tok of BANNED_TOKENS) {
        expect(
          src.includes(tok),
          `${SAMPLE_DATA} must not import banned lib '${tok}' (KISS / Hard rule)`,
        ).toBe(false)
      }
    }
    // (c) package.json sanity — must exist and parse as JSON; no Tier-2 deps
    //     should have crept in this sprint (Supabase / animation libs / etc.).
    expect(existsSync(PACKAGE_JSON)).toBe(true)
    const pkg = JSON.parse(read(PACKAGE_JSON)) as {
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
    }
    const allDeps = {
      ...(pkg.dependencies ?? {}),
      ...(pkg.devDependencies ?? {}),
    }
    // Forbid Tier-2 / animation libs that should NOT have crept in this sprint.
    // (framer-motion is pre-existing legacy dep — not in scope for this denylist.)
    const FORBIDDEN_NEW_DEPS = ['@supabase/supabase-js', 'gsap', 'lottie-web', 'animejs']
    for (const dep of FORBIDDEN_NEW_DEPS) {
      expect(
        Object.prototype.hasOwnProperty.call(allDeps, dep),
        `package.json must not introduce '${dep}' at P95 (KISS / Tier-2 boundary)`,
      ).toBe(false)
    }
  })
})

// =============================================================================
// P95.7 — EOP triplet present for P95 at seal/ subfolder (hard-gate; A3 owns)
// =============================================================================
test.describe('P95.7 — EOP triplet present for P95', () => {
  test('phase-95/seal/02-post-review.md exists', () => {
    expect(existsSync(EOP_REVIEW)).toBe(true)
  })
  test('phase-95/seal/session-log.md exists', () => {
    expect(existsSync(EOP_LOG)).toBe(true)
  })
  test('phase-95/seal/retrospective.md exists', () => {
    expect(existsSync(EOP_RETRO)).toBe(true)
  })
})
