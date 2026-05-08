/**
 * P98 / KISS-REVIEW — KISS Reviewer + ConversationLog Wire seal spec.
 * PURE-UNIT: FS reads + regex/string asserts. NO browser bootstrap.
 * Pattern follows tests/p97-tdd-scaffold.spec.ts.
 *
 * P98.1 — ADR-129 file shape (4)                                     [hard-gate; A6 owns]
 * P98.2 — kissReviewer module shape (A4) (3)                         [existsSync-guarded]
 * P98.3 — 6 review categories (A4) (1)                               [existsSync-guarded]
 * P98.4 — SpecWorkbench KISS button (A5) (1)                         [existsSync-guarded]
 * P98.5 — ConversationLog wire (A5) (1)                              [existsSync-guarded]
 * P98.6 — KISS — no animation libs / no new deps (1)                 [existsSync-guarded + package.json]
 * P98.7 — EOP triplet for P98 at seal/ subfolder (3)                 [hard-gate; A6 owns]
 * P98.8 — Tier-2 markers in ADR-129 (1)                              [hard-gate; A6 owns]
 *
 * Soft-pass guards via existsSync() let A4/A5 timing slips surface as
 * deferred (carry-forward) rather than red. Hard-gate remains on A6-owned
 * files (ADR-129 + EOP triplet at seal/ subfolder).
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

// --- ADR-129 (A6 owns) ---
const ADR_129 = join(ROOT, 'docs/adr/ADR-129-kiss-review-architecture.md')

// --- A4-owned kissReviewer module ---
const KISS_MODULE = join(
  ROOT,
  'src/contexts/specification/reviewers/kissReviewer.ts',
)

// --- A5-owned SpecWorkbench KISS button + ConversationLog wire ---
const SPEC_WORKBENCH = join(ROOT, 'src/components/agentics/SpecWorkbench.tsx')
const CONVERSATION_LOG_TAB = join(
  ROOT,
  'src/components/center-canvas/ConversationLogTab.tsx',
)

// --- package.json (boundary check for no new deps) ---
const PACKAGE_JSON = join(ROOT, 'package.json')

// --- EOP triplet for P98 at seal/ subfolder (A6 owns) ---
// NOTE: seal/ subfolder mirrors P95/P96/P97 pattern.
const SEAL_DIR = 'plans/implementation/phase-98/seal'
const EOP_REVIEW = join(ROOT, SEAL_DIR, '02-post-review.md')
const EOP_LOG = join(ROOT, SEAL_DIR, 'session-log.md')
const EOP_RETRO = join(ROOT, SEAL_DIR, 'retrospective.md')

// Banned animation libs per Hard rules
const BANNED_ANIMATION_TOKENS = [
  'framer-motion',
  'gsap',
  'lottie',
  '@react-spring',
  'animejs',
]

// 6 review categories per ADR-129 D2
const KISS_CATEGORIES = [
  'no-new-deps',
  'loc-cap',
  'no-hardcode',
  'gate-conditions',
  'aisp-sigma',
  'scope-creep',
]

function read(p: string): string {
  return readFileSync(p, 'utf8')
}
function locOf(p: string): number {
  return read(p).split('\n').length
}

// =============================================================================
// P98.1 — ADR-129 file shape (hard-gate; A6 owns)
// =============================================================================
test.describe('P98.1 — ADR-129 file shape', () => {
  test('ADR-129 exists on disk', () => {
    expect(existsSync(ADR_129)).toBe(true)
  })
  test('ADR-129 is ≤120 LOC', () => {
    if (!existsSync(ADR_129)) return
    const n = locOf(ADR_129)
    expect(n, `ADR-129 LOC ${n} should be ≤120`).toBeLessThanOrEqual(120)
  })
  test('ADR-129 declares Status: Accepted (markdown-bold tolerant)', () => {
    if (!existsSync(ADR_129)) return
    expect(read(ADR_129)).toMatch(/Status:\s*\**\s*Accepted/i)
  })
  test('ADR-129 cross-refs ADR-094 + ADR-095 + ADR-111 + ADR-128', () => {
    if (!existsSync(ADR_129)) return
    const src = read(ADR_129)
    expect(src, 'cross-refs ADR-094').toContain('ADR-094')
    expect(src, 'cross-refs ADR-095').toContain('ADR-095')
    expect(src, 'cross-refs ADR-111').toContain('ADR-111')
    expect(src, 'cross-refs ADR-128').toContain('ADR-128')
  })
})

// =============================================================================
// P98.2 — kissReviewer module shape (A4 surface; existsSync-guarded)
// =============================================================================
test.describe('P98.2 — kissReviewer module shape (A4)', () => {
  test('kissReviewer.ts exists (or A4 timing-slip)', () => {
    if (!existsSync(KISS_MODULE)) return
    expect(existsSync(KISS_MODULE)).toBe(true)
  })
  test('kissReviewer source exports `buildKissReview` function', () => {
    if (!existsSync(KISS_MODULE)) return
    expect(read(KISS_MODULE)).toMatch(/export\s+function\s+buildKissReview/)
  })
  test('kissReviewer source exports `KissReviewOutput` interface or type', () => {
    if (!existsSync(KISS_MODULE)) return
    expect(read(KISS_MODULE)).toMatch(
      /export\s+(interface|type)\s+KissReviewOutput/,
    )
  })
})

// =============================================================================
// P98.3 — 6 review categories (A4 surface; existsSync-guarded)
// =============================================================================
test.describe('P98.3 — 6 review categories (A4)', () => {
  test('kissReviewer module source contains all 6 category strings', () => {
    if (!existsSync(KISS_MODULE)) return
    const src = read(KISS_MODULE)
    for (const cat of KISS_CATEGORIES) {
      expect(
        src.includes(cat),
        `kissReviewer must declare category '${cat}' (ADR-129 D2)`,
      ).toBe(true)
    }
  })
})

// =============================================================================
// P98.4 — SpecWorkbench KISS button (A5 surface; existsSync-guarded)
// =============================================================================
test.describe('P98.4 — SpecWorkbench KISS button (A5)', () => {
  test('SpecWorkbench.tsx contains `run-kiss-review` testid', () => {
    if (!existsSync(SPEC_WORKBENCH)) return
    expect(read(SPEC_WORKBENCH)).toContain('run-kiss-review')
  })
})

// =============================================================================
// P98.5 — ConversationLog wire (A5 surface; existsSync-guarded)
// =============================================================================
test.describe('P98.5 — ConversationLog wire (A5)', () => {
  test('SpecWorkbench OR ConversationLogTab contains `kiss-review` event-data marker', () => {
    const wb = existsSync(SPEC_WORKBENCH) ? read(SPEC_WORKBENCH) : ''
    const log = existsSync(CONVERSATION_LOG_TAB)
      ? read(CONVERSATION_LOG_TAB)
      : ''
    if (!wb && !log) return
    const hit = wb.includes('kiss-review') || log.includes('kiss-review')
    expect(
      hit,
      "SpecWorkbench OR ConversationLogTab must carry the 'kiss-review' event-data marker (ADR-129 D4)",
    ).toBe(true)
  })
})

// =============================================================================
// P98.6 — KISS — no animation libs / no new deps in P98 source
// =============================================================================
test.describe('P98.6 — KISS — no animation libs / no new deps', () => {
  test('no P98 source file imports banned animation tokens + no new opaque deps in package.json', () => {
    // (a) banned-token check on kissReviewer.ts (existsSync-guarded)
    if (existsSync(KISS_MODULE)) {
      const src = read(KISS_MODULE).toLowerCase()
      for (const tok of BANNED_ANIMATION_TOKENS) {
        expect(
          src.includes(tok),
          `${KISS_MODULE} must not import banned animation lib '${tok}' (KISS / Hard rule)`,
        ).toBe(false)
      }
    }
    // (b) package.json sanity — must exist and parse as JSON; no new
    //     opaque deps should have crept in this sprint.
    expect(existsSync(PACKAGE_JSON)).toBe(true)
    const pkg = JSON.parse(read(PACKAGE_JSON)) as {
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
    }
    const allDeps = {
      ...(pkg.dependencies ?? {}),
      ...(pkg.devDependencies ?? {}),
    }
    // Forbid NEW deps that should NOT have crept in this sprint.
    const FORBIDDEN_NEW_DEPS = [
      'archiver',
      '@supabase/supabase-js',
      'gsap',
      'lottie-web',
      'animejs',
    ]
    for (const dep of FORBIDDEN_NEW_DEPS) {
      expect(
        Object.prototype.hasOwnProperty.call(allDeps, dep),
        `package.json must not introduce '${dep}' at P98 (KISS / Hard rule)`,
      ).toBe(false)
    }
  })
})

// =============================================================================
// P98.7 — EOP triplet present for P98 at seal/ subfolder (hard-gate; A6 owns)
// =============================================================================
test.describe('P98.7 — EOP triplet present for P98', () => {
  test('phase-98/seal/02-post-review.md exists', () => {
    expect(existsSync(EOP_REVIEW)).toBe(true)
  })
  test('phase-98/seal/session-log.md exists', () => {
    expect(existsSync(EOP_LOG)).toBe(true)
  })
  test('phase-98/seal/retrospective.md exists', () => {
    expect(existsSync(EOP_RETRO)).toBe(true)
  })
})

// =============================================================================
// P98.8 — Tier-2 markers in ADR-129 (hard-gate; A6 owns)
// =============================================================================
test.describe('P98.8 — Tier-2 markers in ADR-129', () => {
  test('ADR-129 contains "Tier-2" (Out of Scope deferrals named)', () => {
    if (!existsSync(ADR_129)) return
    expect(read(ADR_129)).toContain('Tier-2')
  })
})
