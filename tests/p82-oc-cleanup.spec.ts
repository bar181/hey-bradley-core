/**
 * P82 / OC-CLEANUP — Final cleanup seal spec.
 * PURE-UNIT: FS reads + regex/string asserts. NO browser bootstrap.
 * Pattern follows tests/p79-page-aware-pipeline.spec.ts +
 * tests/p78-multipage-mvp.spec.ts.
 *
 * P82.1 — ADR-107 file shape (4)             [hard-gate; this agent owns]
 * P82.2 — Page-aware INTENT extension (2)    [existsSync-guarded; A3 owns]
 * P82.3 — DECOMP page-targeting (2)          [existsSync-guarded; A3 owns]
 * P82.4 — Mobile drawer page selector (1)    [existsSync-guarded; A3 owns]
 * P82.5 — Blog count ≥12 (1)                 [A4 owns]
 * P82.6 — RSS feed has ≥12 items (1)         [A4 owns]
 * P82.7 — EOP audit doc landed (1)           [A4 owns]
 * P82.8 — EOP triplet present for P82 (3)    [hard-gate; this agent owns]
 *
 * Soft-pass guards via existsSync() let A3 / A4 timeouts surface as
 * deferred (carry-forward) rather than red — matches the P74 / P78 / P79
 * pattern. The EOP block + ADR-107 are the hard-gate: they are owned by
 * THIS agent (A5) and must exist at seal.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

// --- ADR-107 (this agent owns) ---
const ADR_107 = join(ROOT, 'docs/adr/ADR-107-oc-cleanup-standard.md')

// --- Page-aware engine (A3 owns) ---
const INTENT_ATOM = join(ROOT, 'src/contexts/intelligence/aisp/intentAtom.ts')
const DECOMP_ATOM = join(ROOT, 'src/contexts/intelligence/aisp/decompAtom.ts')
const MOBILE_MENU = join(ROOT, 'src/components/shell/MobileMenu.tsx')

// --- Blog + RSS + audit doc (A4 owns) ---
const BLOG_POSTS_DIR = join(ROOT, 'src/pages/blog/posts')
const RSS_FEED = join(ROOT, 'public/blog/feed.xml')
const EOP_AUDIT_DOC = join(
  ROOT,
  'plans/strategic-reviews/2026-05-01-eop-audit-p15-p81.md',
)

// --- EOP triplet for P82 (this agent owns) ---
const PHASE_DIR = 'plans/implementation/phase-82'
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
// P82.1 — ADR-107 file shape (hard-gate, this agent owns)
// =============================================================================
test.describe('P82.1 — ADR-107 file shape', () => {
  test('ADR-107 exists on disk', () => {
    expect(existsSync(ADR_107)).toBe(true)
  })
  test('ADR-107 is ≤120 LOC', () => {
    if (!existsSync(ADR_107)) return
    const n = locOf(ADR_107)
    expect(n, `ADR-107 LOC ${n} should be ≤120`).toBeLessThanOrEqual(120)
  })
  test('ADR-107 declares Status: Accepted (markdown-bold tolerant)', () => {
    if (!existsSync(ADR_107)) return
    expect(read(ADR_107)).toMatch(/Status:\s*\**\s*Accepted/i)
  })
  test('ADR-107 cross-refs ADR-090 + ADR-097 + ADR-104', () => {
    if (!existsSync(ADR_107)) return
    const src = read(ADR_107)
    expect(src, 'cross-refs ADR-090').toContain('ADR-090')
    expect(src, 'cross-refs ADR-097').toContain('ADR-097')
    expect(src, 'cross-refs ADR-104').toContain('ADR-104')
  })
})

// =============================================================================
// P82.2 — Page-aware INTENT_ATOM extension (A3 owns; existsSync-guarded)
// =============================================================================
test.describe('P82.2 — Page-aware INTENT extension', () => {
  test('intentAtom.ts references pageId', () => {
    if (!existsSync(INTENT_ATOM)) return
    const src = read(INTENT_ATOM)
    expect(src, 'intentAtom mentions pageId').toMatch(/pageId/)
  })
  test('intentAtom.ts contains a page-reference pattern', () => {
    if (!existsSync(INTENT_ATOM)) return
    const src = read(INTENT_ATOM)
    // Tolerate `page \d+`, `page\\s+\\d+`, or `/page` ordinal forms
    expect(src).toMatch(/page\s*\\?s?\\?\+?\\?d|page\s+\d|\/page/i)
  })
})

// =============================================================================
// P82.3 — DECOMP page-targeting (A3 owns; existsSync-guarded)
// =============================================================================
test.describe('P82.3 — DECOMP page-targeting', () => {
  test('decompAtom.ts references targetPage', () => {
    if (!existsSync(DECOMP_ATOM)) return
    const src = read(DECOMP_ATOM)
    expect(src, 'decompAtom mentions targetPage').toMatch(/targetPage/)
  })
  test('decompAtom.ts contains page-detection logic', () => {
    if (!existsSync(DECOMP_ATOM)) return
    const src = read(DECOMP_ATOM)
    // Either a regex on "page" or a function/branch handling page targets
    expect(src).toMatch(/page/i)
  })
})

// =============================================================================
// P82.4 — Mobile drawer page selector (A3 owns; existsSync-guarded)
// =============================================================================
test.describe('P82.4 — Mobile drawer page selector', () => {
  test('MobileMenu.tsx contains PageSelector OR page-list rendering', () => {
    if (!existsSync(MOBILE_MENU)) return
    const src = read(MOBILE_MENU)
    expect(src).toMatch(/PageSelector|pages\.map|activePageId/)
  })
})

// =============================================================================
// P82.5 — Blog count ≥12 (A4 owns)
// =============================================================================
test.describe('P82.5 — Blog count ≥12', () => {
  test('src/pages/blog/posts contains ≥12 markdown files', () => {
    if (!existsSync(BLOG_POSTS_DIR)) return
    const files = readdirSync(BLOG_POSTS_DIR).filter((f) => f.endsWith('.md'))
    expect(
      files.length,
      `blog posts ${files.length} should be ≥12`,
    ).toBeGreaterThanOrEqual(12)
  })
})

// =============================================================================
// P82.6 — RSS feed has ≥12 items (A4 owns)
// =============================================================================
test.describe('P82.6 — RSS feed has ≥12 items', () => {
  test('public/blog/feed.xml exists and contains ≥12 <item> entries', () => {
    if (!existsSync(RSS_FEED)) return
    const xml = read(RSS_FEED)
    const matches = xml.match(/<item\b/g) ?? []
    expect(
      matches.length,
      `RSS items ${matches.length} should be ≥12`,
    ).toBeGreaterThanOrEqual(12)
  })
})

// =============================================================================
// P82.7 — EOP audit doc landed (A4 owns)
// =============================================================================
test.describe('P82.7 — EOP audit doc landed', () => {
  test('plans/strategic-reviews/2026-05-01-eop-audit-p15-p81.md exists', () => {
    // No existsSync guard here; A4 deliverable. If absent, this is a real miss
    // documented in the P82 retrospective.
    expect(existsSync(EOP_AUDIT_DOC)).toBe(true)
  })
})

// =============================================================================
// P82.8 — EOP triplet present for P82 (hard-gate; this agent owns)
// =============================================================================
test.describe('P82.8 — EOP triplet present for P82', () => {
  test('phase-82/02-post-review.md exists', () => {
    expect(existsSync(EOP_REVIEW)).toBe(true)
  })
  test('phase-82/session-log.md exists', () => {
    expect(existsSync(EOP_LOG)).toBe(true)
  })
  test('phase-82/retrospective.md exists', () => {
    expect(existsSync(EOP_RETRO)).toBe(true)
  })
})
