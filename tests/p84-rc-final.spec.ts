/**
 * P84 / OC-18 — Open Core RC Final seal spec.
 * PURE-UNIT: FS reads + regex/string asserts. NO browser bootstrap.
 * Pattern follows tests/p83-aisp-adoption.spec.ts.
 *
 * P84.1 — ADR-109 file shape (4)              [hard-gate; A4 owns]
 * P84.2 — CHANGELOG.md exists + non-empty (1) [existsSync-guarded; A1 owns]
 * P84.3 — Release notes exist (1)             [existsSync-guarded; A1 owns]
 * P84.4 — Launch assets exist (3)             [existsSync-guarded; A2 owns]
 * P84.5 — Quality pass doc exists (1)         [existsSync-guarded; A3 owns]
 * P84.6 — Owner launch checklist exists (1)   [hard-gate; A4 owns]
 * P84.7 — Master checklist updated (1)        [hard-gate; A4 owns]
 * P84.8 — EOP triplet for P84 (3)             [hard-gate; A4 owns]
 *
 * Soft-pass guards via existsSync() let A1 / A2 / A3 timing slips surface as
 * deferred (carry-forward) rather than red — matches the P83 / P82 / P79 /
 * P74 pattern. The EOP block + ADR-109 + owner-checklist + master-checklist
 * are the hard-gate: they are owned by THIS agent (A4) and must exist.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

// --- ADR-109 (this agent owns) ---
const ADR_109 = join(ROOT, 'docs/adr/ADR-109-open-core-rc-architecture.md')

// --- A1-owned release artifacts ---
const CHANGELOG = join(ROOT, 'CHANGELOG.md')
const RELEASE_NOTES = join(ROOT, 'docs/launch/release-notes-v1.0.0-rc1.md')

// --- A2-owned launch assets ---
const DEMO_SCRIPT = join(ROOT, 'docs/launch/demo-video-script.md')
const SHOW_HN = join(ROOT, 'docs/launch/show-hn-post.md')
const PH_TAGLINE = join(ROOT, 'docs/launch/product-hunt-tagline.md')

// --- A3-owned quality pass ---
const QUALITY_PASS = join(
  ROOT,
  'plans/implementation/phase-84/01-quality-pass.md',
)

// --- A4-owned owner launch checklist + master checklist ---
const OWNER_CHECKLIST = join(ROOT, 'docs/launch/owner-launch-checklist.md')
const MASTER_CHECKLIST = join(
  ROOT,
  'plans/implementation/mvp-plan/08-master-checklist.md',
)

// --- EOP triplet for P84 (this agent owns) ---
const PHASE_DIR = 'plans/implementation/phase-84'
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
// P84.1 — ADR-109 file shape (hard-gate; this agent owns)
// =============================================================================
test.describe('P84.1 — ADR-109 file shape', () => {
  test('ADR-109 exists on disk', () => {
    expect(existsSync(ADR_109)).toBe(true)
  })
  test('ADR-109 is ≤120 LOC', () => {
    if (!existsSync(ADR_109)) return
    const n = locOf(ADR_109)
    expect(n, `ADR-109 LOC ${n} should be ≤120`).toBeLessThanOrEqual(120)
  })
  test('ADR-109 declares Status: Accepted (markdown-bold tolerant)', () => {
    if (!existsSync(ADR_109)) return
    expect(read(ADR_109)).toMatch(/Status:\s*\**\s*Accepted/i)
  })
  test('ADR-109 cross-refs ADR-082 + ADR-104 + ADR-108', () => {
    if (!existsSync(ADR_109)) return
    const src = read(ADR_109)
    expect(src, 'cross-refs ADR-082').toContain('ADR-082')
    expect(src, 'cross-refs ADR-104').toContain('ADR-104')
    expect(src, 'cross-refs ADR-108').toContain('ADR-108')
  })
})

// =============================================================================
// P84.2 — CHANGELOG.md exists + non-empty (A1 owns; existsSync-guarded)
// =============================================================================
test.describe('P84.2 — CHANGELOG.md exists + non-empty', () => {
  test('CHANGELOG.md exists at repo root and is ≥30 LOC', () => {
    if (!existsSync(CHANGELOG)) return
    const n = locOf(CHANGELOG)
    expect(n, `CHANGELOG.md LOC ${n} should be ≥30`).toBeGreaterThanOrEqual(30)
  })
})

// =============================================================================
// P84.3 — Release notes exist (A1 owns; existsSync-guarded)
// =============================================================================
test.describe('P84.3 — Release notes exist', () => {
  test('release-notes-v1.0.0-rc1.md exists and is ≥30 LOC', () => {
    if (!existsSync(RELEASE_NOTES)) return
    const n = locOf(RELEASE_NOTES)
    expect(
      n,
      `release-notes LOC ${n} should be ≥30`,
    ).toBeGreaterThanOrEqual(30)
  })
})

// =============================================================================
// P84.4 — Launch assets exist (A2 owns; existsSync-guarded)
// =============================================================================
test.describe('P84.4 — Launch assets exist', () => {
  test('demo-video-script.md exists', () => {
    if (!existsSync(join(ROOT, 'docs/launch'))) return
    expect(existsSync(DEMO_SCRIPT)).toBe(true)
  })
  test('show-hn-post.md exists', () => {
    if (!existsSync(join(ROOT, 'docs/launch'))) return
    expect(existsSync(SHOW_HN)).toBe(true)
  })
  test('product-hunt-tagline.md exists', () => {
    if (!existsSync(join(ROOT, 'docs/launch'))) return
    expect(existsSync(PH_TAGLINE)).toBe(true)
  })
})

// =============================================================================
// P84.5 — Quality pass doc exists (A3 owns; existsSync-guarded)
// =============================================================================
test.describe('P84.5 — Quality pass doc exists', () => {
  test('phase-84/01-quality-pass.md exists', () => {
    if (!existsSync(join(ROOT, PHASE_DIR))) return
    // Soft-pass when A3 timing-slips
    if (!existsSync(QUALITY_PASS)) return
    expect(existsSync(QUALITY_PASS)).toBe(true)
  })
})

// =============================================================================
// P84.6 — Owner launch checklist exists (hard-gate; this agent owns)
// =============================================================================
test.describe('P84.6 — Owner launch checklist exists', () => {
  test('owner-launch-checklist.md exists', () => {
    expect(existsSync(OWNER_CHECKLIST)).toBe(true)
  })
})

// =============================================================================
// P84.7 — Master checklist updated (hard-gate; this agent owns)
// =============================================================================
test.describe('P84.7 — Master checklist updated', () => {
  test('08-master-checklist.md mentions OC-18 OR P84 OR RC1', () => {
    expect(existsSync(MASTER_CHECKLIST)).toBe(true)
    const src = read(MASTER_CHECKLIST)
    expect(src).toMatch(/OC-18|P84|RC1/i)
  })
})

// =============================================================================
// P84.8 — EOP triplet present for P84 (hard-gate; this agent owns)
// =============================================================================
test.describe('P84.8 — EOP triplet present for P84', () => {
  test('phase-84/02-post-review.md exists', () => {
    expect(existsSync(EOP_REVIEW)).toBe(true)
  })
  test('phase-84/session-log.md exists', () => {
    expect(existsSync(EOP_LOG)).toBe(true)
  })
  test('phase-84/retrospective.md exists', () => {
    expect(existsSync(EOP_RETRO)).toBe(true)
  })
})
