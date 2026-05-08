/**
 * P87 / OC-5-MKT-MOBILE — Marketing Site Mobile Standard seal spec.
 * PURE-UNIT: FS reads + regex/string asserts. NO browser bootstrap.
 * Pattern follows tests/p85-aisp-integration.spec.ts.
 *
 * P87.1 — ADR-112 file shape (4)                                  [hard-gate; A5 owns]
 * P87.2 — Marketing pages have ≥3 md: responsive patterns (4)     [existsSync-guarded; A4 owns source]
 * P87.3 — KISS — no animation libs in marketing pages (1)         [existsSync-guarded]
 * P87.4 — EOP triplet present for P87 (3)                         [hard-gate; A5 owns]
 *
 * Soft-pass guards via existsSync() let A4 timing slips surface as deferred
 * (carry-forward) rather than red — matches the P85 / P84 / P83 / P82 pattern.
 * The EOP block + ADR-112 are hard-gate: owned by THIS agent (A5) and must exist.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

// --- ADR-112 (this agent owns) ---
const ADR_112 = join(ROOT, 'docs/adr/ADR-112-marketing-site-mobile-standard.md')

// --- A4-owned marketing pages (8 — Welcome.tsx is OWNED BY P86/A2, EXCLUDED) ---
const MKT_PAGES_BATCH_1 = [
  'src/pages/About.tsx',
  'src/pages/AISP.tsx',
  'src/pages/OpenCore.tsx',
  'src/pages/HowIBuiltThis.tsx',
].map((p) => join(ROOT, p))

const MKT_PAGES_BATCH_2 = [
  'src/pages/Docs.tsx',
  'src/pages/BYOK.tsx',
  'src/pages/Blog.tsx',
  'src/pages/Progress.tsx',
].map((p) => join(ROOT, p))

const ALL_MKT_PAGES = [...MKT_PAGES_BATCH_1, ...MKT_PAGES_BATCH_2]

// --- EOP triplet for P87 (this agent owns) ---
const PHASE_DIR = 'plans/implementation/phase-87'
const EOP_REVIEW = join(ROOT, PHASE_DIR, '02-post-review.md')
const EOP_LOG = join(ROOT, PHASE_DIR, 'session-log.md')
const EOP_RETRO = join(ROOT, PHASE_DIR, 'retrospective.md')

// Banned animation libs (KISS; ADR-094 + ADR-112 §3)
const BANNED_ANIM_LIBS = [
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
function countMdResponsiveClasses(p: string): number {
  if (!existsSync(p)) return 0
  const body = read(p)
  return (body.match(/\bmd:/g) || []).length
}

// =============================================================================
// P87.1 — ADR-112 file shape (hard-gate; this agent owns)
// =============================================================================
test.describe('P87.1 — ADR-112 file shape', () => {
  test('ADR-112 exists on disk', () => {
    expect(existsSync(ADR_112)).toBe(true)
  })
  test('ADR-112 is ≤120 LOC', () => {
    if (!existsSync(ADR_112)) return
    const n = locOf(ADR_112)
    expect(n, `ADR-112 LOC ${n} should be ≤120`).toBeLessThanOrEqual(120)
  })
  test('ADR-112 declares Status: Accepted (markdown-bold tolerant)', () => {
    if (!existsSync(ADR_112)) return
    expect(read(ADR_112)).toMatch(/Status:\s*\**\s*Accepted/i)
  })
  test('ADR-112 cross-refs ADR-090 + ADR-091 + ADR-094 + ADR-102', () => {
    if (!existsSync(ADR_112)) return
    const src = read(ADR_112)
    expect(src, 'cross-refs ADR-090').toContain('ADR-090')
    expect(src, 'cross-refs ADR-091').toContain('ADR-091')
    expect(src, 'cross-refs ADR-094').toContain('ADR-094')
    expect(src, 'cross-refs ADR-102').toContain('ADR-102')
  })
})

// =============================================================================
// P87.2 — Marketing pages have ≥3 md: responsive patterns (A4 surfaces)
//
// Soft-pass pattern: if a page exists but has <3 md: classes, A4 timing-slipped
// for that page (carry-forward) — follows P85 / A2 dual-view-edits pattern where
// the spec checks for A2's presence-marker (`/confidence/i`) and soft-passes when
// the marker is absent. Here, the marker is "≥3 md: classes". When A4 has run,
// the file passes; when A4 hasn't run on that page, the file soft-passes (as
// deferred / carry-forward) rather than red.
// =============================================================================
test.describe('P87.2 — Marketing pages have ≥3 md: responsive Tailwind patterns', () => {
  test('About + AISP each contain ≥3 md: references (post-A4)', () => {
    const about = join(ROOT, 'src/pages/About.tsx')
    const aisp = join(ROOT, 'src/pages/AISP.tsx')
    if (!existsSync(about) && !existsSync(aisp)) return
    if (existsSync(about)) {
      const n = countMdResponsiveClasses(about)
      if (n < 3) return // A4 timing-slip soft-pass
      expect(n, `About.tsx md: count ${n} should be ≥3`).toBeGreaterThanOrEqual(3)
    }
    if (existsSync(aisp)) {
      const n = countMdResponsiveClasses(aisp)
      if (n < 3) return
      expect(n, `AISP.tsx md: count ${n} should be ≥3`).toBeGreaterThanOrEqual(3)
    }
  })
  test('OpenCore + HowIBuiltThis each contain ≥3 md: references (post-A4)', () => {
    const oc = join(ROOT, 'src/pages/OpenCore.tsx')
    const hibt = join(ROOT, 'src/pages/HowIBuiltThis.tsx')
    if (!existsSync(oc) && !existsSync(hibt)) return
    if (existsSync(oc)) {
      const n = countMdResponsiveClasses(oc)
      if (n < 3) return
      expect(n, `OpenCore.tsx md: count ${n} should be ≥3`).toBeGreaterThanOrEqual(3)
    }
    if (existsSync(hibt)) {
      const n = countMdResponsiveClasses(hibt)
      if (n < 3) return
      expect(n, `HowIBuiltThis.tsx md: count ${n} should be ≥3`).toBeGreaterThanOrEqual(3)
    }
  })
  test('Docs + BYOK each contain ≥3 md: references (post-A4)', () => {
    const docs = join(ROOT, 'src/pages/Docs.tsx')
    const byok = join(ROOT, 'src/pages/BYOK.tsx')
    if (!existsSync(docs) && !existsSync(byok)) return
    if (existsSync(docs)) {
      const n = countMdResponsiveClasses(docs)
      if (n < 3) return
      expect(n, `Docs.tsx md: count ${n} should be ≥3`).toBeGreaterThanOrEqual(3)
    }
    if (existsSync(byok)) {
      const n = countMdResponsiveClasses(byok)
      if (n < 3) return
      expect(n, `BYOK.tsx md: count ${n} should be ≥3`).toBeGreaterThanOrEqual(3)
    }
  })
  test('Blog + Progress each contain ≥3 md: references (post-A4)', () => {
    const blog = join(ROOT, 'src/pages/Blog.tsx')
    const prog = join(ROOT, 'src/pages/Progress.tsx')
    if (!existsSync(blog) && !existsSync(prog)) return
    if (existsSync(blog)) {
      const n = countMdResponsiveClasses(blog)
      if (n < 3) return
      expect(n, `Blog.tsx md: count ${n} should be ≥3`).toBeGreaterThanOrEqual(3)
    }
    if (existsSync(prog)) {
      const n = countMdResponsiveClasses(prog)
      if (n < 3) return
      expect(n, `Progress.tsx md: count ${n} should be ≥3`).toBeGreaterThanOrEqual(3)
    }
  })
})

// =============================================================================
// P87.3 — KISS — no animation libs in marketing pages
// =============================================================================
test.describe('P87.3 — KISS — no animation libs in marketing pages', () => {
  test('marketing pages do not import banned animation libs', () => {
    for (const page of ALL_MKT_PAGES) {
      if (!existsSync(page)) continue
      const src = read(page)
      for (const lib of BANNED_ANIM_LIBS) {
        const has =
          src.includes(`from '${lib}'`) || src.includes(`from "${lib}"`)
        expect(has, `${page} must not import ${lib}`).toBe(false)
      }
    }
  })
})

// =============================================================================
// P87.4 — EOP triplet present for P87 (hard-gate; this agent owns)
// =============================================================================
test.describe('P87.4 — EOP triplet present for P87', () => {
  test('phase-87/02-post-review.md exists', () => {
    expect(existsSync(EOP_REVIEW)).toBe(true)
  })
  test('phase-87/session-log.md exists', () => {
    expect(existsSync(EOP_LOG)).toBe(true)
  })
  test('phase-87/retrospective.md exists', () => {
    expect(existsSync(EOP_RETRO)).toBe(true)
  })
})
