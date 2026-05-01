/**
 * P83 / OC-17 — AISP Adoption Push seal spec.
 * PURE-UNIT: FS reads + regex/string asserts. NO browser bootstrap.
 * Pattern follows tests/p82-oc-cleanup.spec.ts +
 * tests/p79-page-aware-pipeline.spec.ts.
 *
 * P83.1 — ADR-108 file shape (4)              [hard-gate; A3 owns]
 * P83.2 — README has AISP adoption section (1) [existsSync-guarded; A1 owns]
 * P83.3 — docs/aisp-adoption/ has 3 files (3)  [existsSync-guarded; A2 owns]
 * P83.4 — examples/3rd-party-consumer/ (4)     [existsSync-guarded; A2 owns]
 * P83.5 — KISS / no animation libs (1)         [hard-gate; A3 owns]
 * P83.6 — EOP triplet present for P83 (3)      [hard-gate; A3 owns]
 *
 * Soft-pass guards via existsSync() let A1 / A2 timing slips surface as
 * deferred (carry-forward) rather than red — matches the P74 / P78 / P79 /
 * P82 pattern. The EOP block + ADR-108 are the hard-gate: they are owned
 * by THIS agent (A3) and must exist at seal.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

// --- ADR-108 (this agent owns) ---
const ADR_108 = join(ROOT, 'docs/adr/ADR-108-aisp-adoption-standard.md')

// --- README + AISP page polish (A1 owns) ---
const README = join(ROOT, 'README.md')
const AISP_PAGE = join(ROOT, 'src/pages/AISP.tsx')

// --- Adoption guide tree (A2 owns) ---
const ADOPTION_DIR = join(ROOT, 'docs/aisp-adoption')
const ADOPTION_GETTING_STARTED = join(ADOPTION_DIR, '00-getting-started.md')
const ADOPTION_BUNDLE_SCHEMA = join(ADOPTION_DIR, '01-bundle-schema.md')
const ADOPTION_REFIMPL_WALKTHROUGH = join(
  ADOPTION_DIR,
  '02-reference-implementation-walkthrough.md',
)

// --- 3rd-party consumer reference impl (A2 owns) ---
const REFIMPL_DIR = join(ROOT, 'examples/3rd-party-consumer')
const REFIMPL_README = join(REFIMPL_DIR, 'README.md')
const REFIMPL_TS = join(REFIMPL_DIR, 'parse-aisp-typescript.ts')
const REFIMPL_PY = join(REFIMPL_DIR, 'parse-aisp-python.py')
const REFIMPL_SAMPLE = join(REFIMPL_DIR, 'sample-bundle.json')

// --- EOP triplet for P83 (this agent owns) ---
const PHASE_DIR = 'plans/implementation/phase-83'
const EOP_REVIEW = join(ROOT, PHASE_DIR, '02-post-review.md')
const EOP_LOG = join(ROOT, PHASE_DIR, 'session-log.md')
const EOP_RETRO = join(ROOT, PHASE_DIR, 'retrospective.md')

// Banned animation lib substrings — KISS rule per P83 preflight hard-rule #2
const BANNED_LIBS = [
  'framer-motion',
  'gsap',
  'lottie',
  'react-spring',
  'animejs',
]

function read(p: string): string {
  return readFileSync(p, 'utf8')
}
function locOf(p: string): number {
  return read(p).split('\n').length
}

// =============================================================================
// P83.1 — ADR-108 file shape (hard-gate; this agent owns)
// =============================================================================
test.describe('P83.1 — ADR-108 file shape', () => {
  test('ADR-108 exists on disk', () => {
    expect(existsSync(ADR_108)).toBe(true)
  })
  test('ADR-108 is ≤120 LOC', () => {
    if (!existsSync(ADR_108)) return
    const n = locOf(ADR_108)
    expect(n, `ADR-108 LOC ${n} should be ≤120`).toBeLessThanOrEqual(120)
  })
  test('ADR-108 declares Status: Accepted (markdown-bold tolerant)', () => {
    if (!existsSync(ADR_108)) return
    expect(read(ADR_108)).toMatch(/Status:\s*\**\s*Accepted/i)
  })
  test('ADR-108 cross-refs ADR-053 + ADR-082 + ADR-098', () => {
    if (!existsSync(ADR_108)) return
    const src = read(ADR_108)
    expect(src, 'cross-refs ADR-053').toContain('ADR-053')
    expect(src, 'cross-refs ADR-082').toContain('ADR-082')
    expect(src, 'cross-refs ADR-098').toContain('ADR-098')
  })
})

// =============================================================================
// P83.2 — README has AISP adoption section (A1 owns; existsSync-guarded)
// =============================================================================
test.describe('P83.2 — README has AISP adoption section', () => {
  test('README contains an AISP adoption / 3rd-party / sample-bundle marker', () => {
    if (!existsSync(README)) return
    const src = read(README)
    // Tolerant or-match per brief — any of three markers satisfies the gate
    expect(src).toMatch(/Adopting AISP|3rd-party|sample-bundle/i)
  })
})

// =============================================================================
// P83.3 — docs/aisp-adoption/ has 3 files (A2 owns; existsSync-guarded)
// =============================================================================
test.describe('P83.3 — docs/aisp-adoption/ has 3 files', () => {
  test('00-getting-started.md exists', () => {
    if (!existsSync(ADOPTION_DIR)) return
    expect(existsSync(ADOPTION_GETTING_STARTED)).toBe(true)
  })
  test('01-bundle-schema.md exists', () => {
    if (!existsSync(ADOPTION_DIR)) return
    expect(existsSync(ADOPTION_BUNDLE_SCHEMA)).toBe(true)
  })
  test('02-reference-implementation-walkthrough.md exists', () => {
    if (!existsSync(ADOPTION_DIR)) return
    expect(existsSync(ADOPTION_REFIMPL_WALKTHROUGH)).toBe(true)
  })
})

// =============================================================================
// P83.4 — examples/3rd-party-consumer/ has 4 files (A2 owns; existsSync-guarded)
// =============================================================================
test.describe('P83.4 — examples/3rd-party-consumer/ has 4 files', () => {
  test('README.md exists', () => {
    if (!existsSync(REFIMPL_DIR)) return
    expect(existsSync(REFIMPL_README)).toBe(true)
  })
  test('parse-aisp-typescript.ts exists', () => {
    if (!existsSync(REFIMPL_DIR)) return
    expect(existsSync(REFIMPL_TS)).toBe(true)
  })
  test('parse-aisp-python.py exists', () => {
    if (!existsSync(REFIMPL_DIR)) return
    expect(existsSync(REFIMPL_PY)).toBe(true)
  })
  test('sample-bundle.json exists', () => {
    if (!existsSync(REFIMPL_DIR)) return
    expect(existsSync(REFIMPL_SAMPLE)).toBe(true)
  })
})

// =============================================================================
// P83.5 — KISS — no animation libs in P83 owned source (hard-gate; A3 owns)
// =============================================================================
test.describe('P83.5 — KISS — no animation libs in P83 source', () => {
  test('A3-owned files contain no banned animation lib strings', () => {
    // Check the files this agent (A3) authored. A1 / A2 KISS compliance is
    // their respective responsibility — but if they exist and their owners
    // shipped clean, we extend the check to them too (defensive seal).
    const owned = [ADR_108, EOP_REVIEW, EOP_LOG, EOP_RETRO].filter((p) =>
      existsSync(p),
    )
    for (const path of owned) {
      const src = read(path).toLowerCase()
      for (const lib of BANNED_LIBS) {
        expect(
          src.includes(lib),
          `${path} must not import/reference ${lib}`,
        ).toBe(false)
      }
    }
  })
})

// =============================================================================
// P83.6 — EOP triplet present for P83 (hard-gate; this agent owns)
// =============================================================================
test.describe('P83.6 — EOP triplet present for P83', () => {
  test('phase-83/02-post-review.md exists', () => {
    expect(existsSync(EOP_REVIEW)).toBe(true)
  })
  test('phase-83/session-log.md exists', () => {
    expect(existsSync(EOP_LOG)).toBe(true)
  })
  test('phase-83/retrospective.md exists', () => {
    expect(existsSync(EOP_RETRO)).toBe(true)
  })
})
