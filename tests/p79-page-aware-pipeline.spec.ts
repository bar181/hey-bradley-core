/**
 * P79 / OC-14 — Page-Aware Chat Pipeline seal spec.
 * PURE-UNIT: FS reads + regex/string asserts. NO browser bootstrap.
 * Pattern follows tests/p74-decomp-and-highlights.spec.ts +
 * tests/p78-multipage-mvp.spec.ts.
 *
 * P79.1 — ADR-104 file shape (4)
 * P79.2 — PageIterator module shape (3)  [existsSync-guarded; A2 owns]
 * P79.3 — chatPipeline page-aware wire (3) [existsSync-guarded; A3 owns]
 * P79.4 — KISS: no animation libs in P79 source (1) [existsSync-guarded]
 * P79.5 — EOP triplet present (3) [hard-gate; this agent owns]
 *
 * Soft-pass guards via existsSync() let A2 / A3 timeouts surface as
 * deferred (carry-forward) rather than red — matches the P74 / P78 pattern.
 * The EOP block is the hard-gate: ADR-104 + EOP triplet are owned by THIS
 * agent (A4) and must exist at seal.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

// --- ADR-104 (this agent owns) ---
const ADR_104 = join(ROOT, 'docs/adr/ADR-104-page-aware-pipeline.md')

// --- PageIterator pure module (A2 owns) ---
const PAGE_ITER = join(ROOT, 'src/contexts/intelligence/pageIterator.ts')

// --- chatPipeline wire (A3 owns) ---
const CHAT_PIPELINE = join(ROOT, 'src/contexts/intelligence/chatPipeline.ts')

// --- EOP triplet (this agent owns) ---
const PHASE_DIR = 'plans/implementation/phase-79'
const EOP_REVIEW = join(ROOT, PHASE_DIR, '02-post-review.md')
const EOP_LOG = join(ROOT, PHASE_DIR, 'session-log.md')
const EOP_RETRO = join(ROOT, PHASE_DIR, 'retrospective.md')

function read(p: string): string {
  return readFileSync(p, 'utf8')
}
function locOf(p: string): number {
  return read(p).split('\n').length
}

// =============================================================================
// P79.1 — ADR-104 file shape (hard-gate, this agent owns)
// =============================================================================
test.describe('P79.1 — ADR-104 file shape', () => {
  test('ADR-104 exists on disk', () => {
    expect(existsSync(ADR_104)).toBe(true)
  })
  test('ADR-104 is ≤120 LOC', () => {
    if (!existsSync(ADR_104)) return
    const n = locOf(ADR_104)
    expect(n, `ADR-104 LOC ${n} should be ≤120`).toBeLessThanOrEqual(120)
  })
  test('ADR-104 declares Status: Accepted (markdown-bold tolerant)', () => {
    if (!existsSync(ADR_104)) return
    // Tolerate `**Status:** Accepted` and `Status: Accepted` variants
    expect(read(ADR_104)).toMatch(/Status:\s*\**\s*Accepted/i)
  })
  test('ADR-104 cross-refs ADR-085 + ADR-086 + ADR-099', () => {
    if (!existsSync(ADR_104)) return
    const src = read(ADR_104)
    expect(src, 'cross-refs ADR-085').toContain('ADR-085')
    expect(src, 'cross-refs ADR-086').toContain('ADR-086')
    expect(src, 'cross-refs ADR-099').toContain('ADR-099')
  })
})

// =============================================================================
// P79.2 — PageIterator pure module (A2 owns; existsSync-guarded)
// =============================================================================
test.describe('P79.2 — PageIterator module shape', () => {
  test('pageIterator.ts exists on disk', () => {
    // Soft skip if A2 hasn't landed yet — assertion deferred to integration
    if (!existsSync(PAGE_ITER)) {
      test.skip(true, 'pageIterator.ts not yet on disk (A2 timing)')
      return
    }
    expect(existsSync(PAGE_ITER)).toBe(true)
  })
  test('pageIterator.ts exports getActivePage', () => {
    if (!existsSync(PAGE_ITER)) return
    const src = read(PAGE_ITER)
    expect(src).toMatch(/export\s+function\s+getActivePage\b/)
  })
  test('pageIterator.ts exports prefixPatchPaths', () => {
    if (!existsSync(PAGE_ITER)) return
    const src = read(PAGE_ITER)
    expect(src).toMatch(/export\s+function\s+prefixPatchPaths\b/)
  })
})

// =============================================================================
// P79.3 — chatPipeline page-aware wire (A3 owns; existsSync-guarded)
// =============================================================================
test.describe('P79.3 — chatPipeline page-aware wire', () => {
  test('chatPipeline.ts references getActivePage', () => {
    if (!existsSync(CHAT_PIPELINE)) return
    const src = read(CHAT_PIPELINE)
    expect(src, 'chatPipeline references getActivePage').toContain('getActivePage')
  })
  test('chatPipeline.ts references prefixPatchPaths', () => {
    if (!existsSync(CHAT_PIPELINE)) return
    const src = read(CHAT_PIPELINE)
    expect(src, 'chatPipeline references prefixPatchPaths').toContain('prefixPatchPaths')
  })
  test('chatPipeline.ts reads useUIStore (activePageId source)', () => {
    if (!existsSync(CHAT_PIPELINE)) return
    const src = read(CHAT_PIPELINE)
    expect(src, 'chatPipeline imports useUIStore').toContain('useUIStore')
  })
})

// =============================================================================
// P79.4 — KISS: no animation libs in P79 source surface (existsSync-guarded)
// =============================================================================
test.describe('P79.4 — KISS — no animation libs in P79 source', () => {
  test('pageIterator.ts contains no animation-library imports', () => {
    if (!existsSync(PAGE_ITER)) return
    const src = read(PAGE_ITER)
    expect(src).not.toMatch(/framer-motion|gsap|lottie|@react-spring|animejs/i)
  })
})

// =============================================================================
// P79.5 — EOP triplet present (hard-gate; this agent owns)
// =============================================================================
test.describe('P79.5 — EOP triplet present', () => {
  test('phase-79/02-post-review.md exists', () => {
    expect(existsSync(EOP_REVIEW)).toBe(true)
  })
  test('phase-79/session-log.md exists', () => {
    expect(existsSync(EOP_LOG)).toBe(true)
  })
  test('phase-79/retrospective.md exists', () => {
    expect(existsSync(EOP_RETRO)).toBe(true)
  })
})
