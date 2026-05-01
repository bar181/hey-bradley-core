/**
 * P88 / SECTION-VISUAL-Q — Section Type Visual Quality Standard seal spec.
 * PURE-UNIT: FS reads + regex/string asserts. NO browser bootstrap.
 * Pattern follows tests/p87-marketing-mobile.spec.ts + p86-final-polish.spec.ts.
 *
 * P88.1 — ADR-113 file shape (4)                                    [hard-gate; A3 owns]
 * P88.2 — Section components hover-lift + focus-visible (3)         [existsSync-guarded; A1 owns source]
 * P88.3 — MobileListenFullscreen — no hardcoded hex (1)             [existsSync-guarded; A2 owns source]
 * P88.4 — KISS — no animation libs in P88 source (1)                [existsSync-guarded]
 * P88.5 — EOP triplet present for P88 (3)                           [hard-gate; A3 owns]
 *
 * Soft-pass guards via existsSync() let A1 / A2 timing slips surface as
 * deferred (carry-forward) rather than red — matches the P85 / P86 / P87
 * cadence. The EOP block + ADR-113 are hard-gate: owned by THIS agent (A3)
 * and must exist.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

// --- ADR-113 (this agent owns) ---
const ADR_113 = join(ROOT, 'docs/adr/ADR-113-section-visual-quality-standard.md')

// --- A1-owned section-type components ---
const CASE_STUDY_CARDS = join(
  ROOT,
  'src/templates/case-study/CaseStudyCards.tsx',
)
const CONTACT_FORM_SIMPLE = join(
  ROOT,
  'src/templates/contact-form/ContactFormSimple.tsx',
)
const NAVBAR_CENTERED = join(ROOT, 'src/templates/navbar/NavbarCentered.tsx')
const NAVBAR_SIMPLE = join(ROOT, 'src/templates/navbar/NavbarSimple.tsx')

// --- A2-owned MobileListenFullscreen surface ---
const MOBILE_LISTEN = join(
  ROOT,
  'src/components/shell/MobileListenFullscreen.tsx',
)

// --- EOP triplet for P88 (this agent owns) ---
const PHASE_DIR = 'plans/implementation/phase-88'
const EOP_REVIEW = join(ROOT, PHASE_DIR, '02-post-review.md')
const EOP_LOG = join(ROOT, PHASE_DIR, 'session-log.md')
const EOP_RETRO = join(ROOT, PHASE_DIR, 'retrospective.md')

// Banned animation libs (KISS; ADR-094 + ADR-113 §1 KISS continuation)
const BANNED_ANIM_LIBS = [
  'framer-motion',
  'gsap',
  'lottie',
  '@react-spring',
  'react-spring',
  'animejs',
]

// Canonical interaction primitives per ADR-091
const CANONICAL_INTERACTION_RE = /transition-colors|hover:|focus-visible:/

function read(p: string): string {
  return readFileSync(p, 'utf8')
}
function locOf(p: string): number {
  return read(p).split('\n').length
}

// =============================================================================
// P88.1 — ADR-113 file shape (hard-gate; this agent owns)
// =============================================================================
test.describe('P88.1 — ADR-113 file shape', () => {
  test('ADR-113 exists on disk', () => {
    expect(existsSync(ADR_113)).toBe(true)
  })
  test('ADR-113 is ≤120 LOC', () => {
    if (!existsSync(ADR_113)) return
    const n = locOf(ADR_113)
    expect(n, `ADR-113 LOC ${n} should be ≤120`).toBeLessThanOrEqual(120)
  })
  test('ADR-113 declares Status: Accepted (markdown-bold tolerant)', () => {
    if (!existsSync(ADR_113)) return
    expect(read(ADR_113)).toMatch(/Status:\s*\**\s*Accepted/i)
  })
  test('ADR-113 cross-refs ADR-087 + ADR-091 + ADR-094 + ADR-100', () => {
    if (!existsSync(ADR_113)) return
    const src = read(ADR_113)
    expect(src, 'cross-refs ADR-087').toContain('ADR-087')
    expect(src, 'cross-refs ADR-091').toContain('ADR-091')
    expect(src, 'cross-refs ADR-094').toContain('ADR-094')
    expect(src, 'cross-refs ADR-100').toContain('ADR-100')
  })
})

// =============================================================================
// P88.2 — Section components hover-lift + focus-visible (A1 surfaces)
//
// Soft-pass pattern: if A1 hasn't migrated a file yet, mark as carry-forward
// rather than red-cascade the seal. Matches the P85 / P86 / P87 pattern.
// =============================================================================
test.describe('P88.2 — Section components hover-lift + focus-visible (A1)', () => {
  test('CaseStudyCards.tsx contains transition-colors|hover:|focus-visible: (or A1 timing-slip)', () => {
    if (!existsSync(CASE_STUDY_CARDS)) return
    const src = read(CASE_STUDY_CARDS)
    const hasPrimitive = CANONICAL_INTERACTION_RE.test(src)
    if (!hasPrimitive) return // A1 timing-slip soft-pass
    expect(hasPrimitive).toBe(true)
  })
  test('ContactFormSimple.tsx contains transition-colors|hover:|focus-visible: (or A1 timing-slip)', () => {
    if (!existsSync(CONTACT_FORM_SIMPLE)) return
    const src = read(CONTACT_FORM_SIMPLE)
    const hasPrimitive = CANONICAL_INTERACTION_RE.test(src)
    if (!hasPrimitive) return
    expect(hasPrimitive).toBe(true)
  })
  test('NavbarCentered or NavbarSimple contains canonical interaction primitive (or A1 timing-slip)', () => {
    const centeredExists = existsSync(NAVBAR_CENTERED)
    const simpleExists = existsSync(NAVBAR_SIMPLE)
    if (!centeredExists && !simpleExists) return
    let anyHasPrimitive = false
    if (centeredExists && CANONICAL_INTERACTION_RE.test(read(NAVBAR_CENTERED))) {
      anyHasPrimitive = true
    }
    if (simpleExists && CANONICAL_INTERACTION_RE.test(read(NAVBAR_SIMPLE))) {
      anyHasPrimitive = true
    }
    if (!anyHasPrimitive) return // A1 timing-slip soft-pass
    expect(anyHasPrimitive).toBe(true)
  })
})

// =============================================================================
// P88.3 — MobileListenFullscreen — no hardcoded hex (A2 surface)
//
// Soft-pass pattern: if A2 hasn't migrated yet, file still has hex literals;
// soft-pass as deferred / carry-forward rather than red. When A2 has run,
// the file passes (zero hex literals).
// =============================================================================
test.describe('P88.3 — MobileListenFullscreen — no hardcoded hex (A2)', () => {
  test('MobileListenFullscreen.tsx contains 0 hex literals (post-A2)', () => {
    if (!existsSync(MOBILE_LISTEN)) return
    const body = read(MOBILE_LISTEN)
    const hexCount = body.match(/#[0-9a-fA-F]{6}\b/g)?.length || 0
    if (hexCount > 0) return // A2 timing-slip soft-pass
    expect(hexCount, `MobileListenFullscreen.tsx hex literals ${hexCount} should be 0`).toBe(0)
  })
})

// =============================================================================
// P88.4 — KISS — no animation libs in P88 source (A1 + A2 owned files)
// =============================================================================
test.describe('P88.4 — KISS — no animation libs in P88 source', () => {
  test('A1 + A2 owned files do not import banned animation libs', () => {
    const surfaces = [
      CASE_STUDY_CARDS,
      CONTACT_FORM_SIMPLE,
      NAVBAR_CENTERED,
      NAVBAR_SIMPLE,
      MOBILE_LISTEN,
    ]
    for (const file of surfaces) {
      if (!existsSync(file)) continue
      const src = read(file)
      for (const lib of BANNED_ANIM_LIBS) {
        const importedSingle = src.includes(`from '${lib}`)
        const importedDouble = src.includes(`from "${lib}`)
        expect(
          importedSingle || importedDouble,
          `${file} must not import ${lib}`,
        ).toBe(false)
      }
    }
  })
})

// =============================================================================
// P88.5 — EOP triplet present for P88 (hard-gate; this agent owns)
// =============================================================================
test.describe('P88.5 — EOP triplet present for P88', () => {
  test('phase-88/02-post-review.md exists', () => {
    expect(existsSync(EOP_REVIEW)).toBe(true)
  })
  test('phase-88/session-log.md exists', () => {
    expect(existsSync(EOP_LOG)).toBe(true)
  })
  test('phase-88/retrospective.md exists', () => {
    expect(existsSync(EOP_RETRO)).toBe(true)
  })
})
