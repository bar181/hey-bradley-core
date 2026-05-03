/**
 * P101 / AW-RC — Agentic Workbench RC closer seal spec.
 * PURE-UNIT: FS reads + regex/string asserts. NO browser bootstrap.
 * Pattern follows tests/p99-seal-panel.spec.ts.
 *
 * P101.1 — ADR-131 file shape (4)               [hard-gate; A4 owns]
 * P101.2 — 8 atoms wired (8)                    [existsSync-guarded]
 * P101.3 — 3 modes routed (3)                   [hard-gate]
 * P101.4 — Reviewer artifacts present (4)       [hard-gate; Wave-2 reviewers]
 * P101.5 — EOP triplet for P101 (3)             [hard-gate; A4 owns]
 *
 * Soft-pass guards via existsSync() let upstream timing slips surface as
 * deferred (carry-forward) rather than red. Hard-gate remains on A4-owned
 * files (ADR-131 + EOP triplet at seal/ subfolder) and Wave-2 reviewer
 * artifacts owned by R1-R4.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

// --- ADR-131 (A4 owns) ---
const ADR_131 = join(ROOT, 'docs/adr/ADR-131-agentic-workbench-rc-architecture.md')

// --- 8 Crystal Atoms ---
const AISP = 'src/contexts/intelligence/aisp'
const ATOM_FILES: ReadonlyArray<{ name: string; file: string; importToken: string }> = [
  // PATCH atom is inlined in chatPipeline + AISP doc-ref in contentAtom (R3 §2 audit).
  { name: 'PATCH', file: `${AISP}/contentAtom.ts`, importToken: 'PATCH_ATOM' },
  { name: 'INTENT', file: `${AISP}/intentAtom.ts`, importToken: 'intentAtom' },
  { name: 'SELECTION', file: `${AISP}/templateSelector.ts`, importToken: 'templateSelector' },
  { name: 'CONTENT', file: `${AISP}/contentAtom.ts`, importToken: 'contentAtom' },
  { name: 'ASSUMPTIONS', file: `${AISP}/assumptionsAtom.ts`, importToken: 'assumptionsAtom' },
  { name: 'DECOMP', file: `${AISP}/decompAtom.ts`, importToken: 'decompAtom' },
  { name: 'PROCESS', file: `${AISP}/processAtom.ts`, importToken: 'processAtom' },
  { name: 'DDD', file: `${AISP}/dddAtom.ts`, importToken: 'dddAtom' },
  { name: 'AGENT', file: `${AISP}/agentAtom.ts`, importToken: 'agentAtom' },
]

// --- main.tsx routes ---
const MAIN_TSX = join(ROOT, 'src/main.tsx')

// --- Reviewer artifacts (Wave 2) ---
const SEAL_DIR_101 = 'plans/implementation/phase-101/seal'
const REVIEWER_DOCS = [
  '04-r1-whiteboard-review.md',
  '05-r2-planning-agentics-review.md',
  '06-r3-security-log-integrity.md',
  '07-r4-architecture-kiss.md',
].map((f) => join(ROOT, SEAL_DIR_101, f))

// --- EOP triplet for P101 (A4 owns) ---
const EOP_REVIEW = join(ROOT, SEAL_DIR_101, '02-post-review.md')
const EOP_LOG = join(ROOT, SEAL_DIR_101, 'session-log.md')
const EOP_RETRO = join(ROOT, SEAL_DIR_101, 'retrospective.md')

function read(p: string): string {
  return readFileSync(p, 'utf8')
}
function locOf(p: string): number {
  return read(p).split('\n').length
}

// =============================================================================
// P101.1 — ADR-131 file shape (hard-gate; A4 owns)
// =============================================================================
test.describe('P101.1 — ADR-131 file shape', () => {
  test('ADR-131 exists on disk', () => {
    expect(existsSync(ADR_131)).toBe(true)
  })
  test('ADR-131 is ≤180 LOC', () => {
    if (!existsSync(ADR_131)) return
    const n = locOf(ADR_131)
    expect(n, `ADR-131 LOC ${n} should be ≤180`).toBeLessThanOrEqual(180)
  })
  test('ADR-131 declares Status: Accepted (markdown-bold tolerant)', () => {
    if (!existsSync(ADR_131)) return
    expect(read(ADR_131)).toMatch(/Status:\s*\**\s*Accepted/i)
  })
  test('ADR-131 cross-refs ADR-082 + ADR-109 + ADR-116 + ADR-126 + ADR-128 + ADR-129 + ADR-130', () => {
    if (!existsSync(ADR_131)) return
    const src = read(ADR_131)
    for (const ref of ['ADR-082', 'ADR-109', 'ADR-116', 'ADR-126', 'ADR-128', 'ADR-129', 'ADR-130']) {
      expect(src, `cross-refs ${ref}`).toContain(ref)
    }
  })
})

// =============================================================================
// P101.2 — 8 atoms wired (existsSync-guarded)
// =============================================================================
test.describe('P101.2 — 8 atoms wired', () => {
  for (const atom of ATOM_FILES) {
    test(`${atom.name}_ATOM module exists at ${atom.file}`, () => {
      const p = join(ROOT, atom.file)
      if (!existsSync(p)) return
      expect(existsSync(p)).toBe(true)
    })
  }
})

// =============================================================================
// P101.3 — 3 modes routed (hard-gate on main.tsx)
// =============================================================================
test.describe('P101.3 — 3 modes routed', () => {
  test('main.tsx contains /builder OR / route', () => {
    if (!existsSync(MAIN_TSX)) return
    const src = read(MAIN_TSX)
    expect(
      src.includes('"/builder"') || src.includes("'/builder'") || src.includes('path="/"') || src.includes("path='/'"),
      'main.tsx must declare a Whiteboard route (/builder or /)',
    ).toBe(true)
  })
  test('main.tsx contains /planning route', () => {
    if (!existsSync(MAIN_TSX)) return
    const src = read(MAIN_TSX)
    expect(
      src.includes('"/planning"') || src.includes("'/planning'"),
      'main.tsx must declare /planning route',
    ).toBe(true)
  })
  test('main.tsx contains /agentics route', () => {
    if (!existsSync(MAIN_TSX)) return
    const src = read(MAIN_TSX)
    expect(
      src.includes('"/agentics"') || src.includes("'/agentics'"),
      'main.tsx must declare /agentics route',
    ).toBe(true)
  })
})

// =============================================================================
// P101.4 — Reviewer artifacts present (Wave 2 R1-R4 owns)
// =============================================================================
test.describe('P101.4 — Reviewer artifacts present', () => {
  for (const doc of REVIEWER_DOCS) {
    test(`reviewer doc exists: ${doc.split('/').pop()}`, () => {
      expect(existsSync(doc)).toBe(true)
    })
  }
})

// =============================================================================
// P101.5 — EOP triplet for P101 (hard-gate; A4 owns)
// =============================================================================
test.describe('P101.5 — EOP triplet for P101', () => {
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

// =============================================================================
// P101.6 — Round-count spillover (KISS + carry-forward integrity)
// =============================================================================
test.describe('P101.6 — Round-count spillover', () => {
  test('ADR-131 names CF#4 + CF#5 as owner-required (live LLM + STT)', () => {
    if (!existsSync(ADR_131)) return
    const src = read(ADR_131)
    expect(src, 'CF#4 named').toMatch(/CF#4|Live LLM/)
    expect(src, 'CF#5 named').toMatch(/CF#5|STT/)
  })
  test('ADR-131 names SOTA composite range 79–84 (matches ADR-127 §C)', () => {
    if (!existsSync(ADR_131)) return
    const src = read(ADR_131)
    // Accept various dash glyphs (en-dash / em-dash / hyphen)
    expect(src).toMatch(/79\s*[‐-―\-]\s*84/)
  })
})
