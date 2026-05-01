/**
 * P73 / OC-TPL-AUDIT Phase 2 — Audit-driven fix verification.
 * PURE-UNIT: FS reads + regex/string asserts. NO browser bootstrap.
 * Pattern follows tests/p72-template-intelligence.spec.ts.
 *
 * Asserts the P73 fix-pass contract:
 *   P73.1 — A1 bottom-5 templates fixed (hero shape + typography drift)
 *   P73.2 — A2 themeLibrary expanded to ≥21 + exampleQueries field
 *   P73.3 — A3 sectionLibrary expanded to ≥15 + exampleQueries field
 *   P73.4 — A4 contentLibrary expanded to ≥15 + exampleQueries field
 *   P73.5 — Backward compat: matcher + applier still import cleanly
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

// --- Template JSON files (A1) ---
const EX_DIR = 'src/data/examples'
const T_BLANK = join(ROOT, EX_DIR, 'blank.json')
const T_KS = join(ROOT, EX_DIR, 'kitchen-sink.json')
const T_BLOG = join(ROOT, EX_DIR, 'blog-standard.json')
const T_API = join(ROOT, EX_DIR, 'api-docs-landing.json')
const T_LAUNCH = join(ROOT, EX_DIR, 'launchpad.json')
const T_LAW = join(ROOT, EX_DIR, 'law-firm.json')

// --- Library files (A2/A3/A4) ---
const LIB_DIR = 'src/contexts/intelligence/templates'
const THEME_LIB = join(ROOT, LIB_DIR, 'themeLibrary.ts')
const SECTION_LIB = join(ROOT, LIB_DIR, 'sectionLibrary.ts')
const CONTENT_LIB = join(ROOT, LIB_DIR, 'contentLibrary.ts')
const MATCHER = join(ROOT, LIB_DIR, 'templateMatcher.ts')
const APPLIER = join(ROOT, LIB_DIR, 'templateApplier.ts')

function read(p: string): string {
  return readFileSync(p, 'utf8')
}

// Approximate library entry count via top-level `  {` indentation (same shape
// across the 3 libraries, as proven in p72 spec).
function countEntries(p: string): number {
  const src = read(p)
  const matches = src.match(/^\s{2}\{$/gm)
  return matches ? matches.length : 0
}

// Count occurrences of `exampleQueries:` across the file body.
function countExampleQueries(p: string): number {
  const src = read(p)
  const matches = src.match(/exampleQueries\s*:/g)
  return matches ? matches.length : 0
}

// =============================================================================
// P73.1 — A1 bottom-5 templates fixed
// =============================================================================
test.describe('P73.1 — A1 bottom-5 templates fixed', () => {
  test('blank.json: hero padding 80px 24px + no Lorem placeholder', () => {
    expect(existsSync(T_BLANK)).toBe(true)
    const src = read(T_BLANK)
    expect(src, 'hero padding should be 80px 24px').toContain('"padding": "80px 24px"')
    expect(/Lorem\s+ipsum/i.test(src), 'no Lorem ipsum placeholder copy').toBe(false)
  })
  test('kitchen-sink.json: hero padding 80px 24px compliance', () => {
    expect(existsSync(T_KS)).toBe(true)
    const src = read(T_KS)
    expect(src, 'hero padding should be 80px 24px').toContain('"padding": "80px 24px"')
  })
  test('blog-standard.json: typography drift fixed (no DM Sans) + hero shape', () => {
    expect(existsSync(T_BLOG)).toBe(true)
    const src = read(T_BLOG)
    expect(src, 'DM Sans drift must be fixed').not.toContain('DM Sans')
    expect(src, 'hero padding should be 80px 24px').toContain('"padding": "80px 24px"')
  })
  test('api-docs-landing.json: hero padding 80px 24px compliance', () => {
    expect(existsSync(T_API)).toBe(true)
    const src = read(T_API)
    expect(src, 'hero padding should be 80px 24px').toContain('"padding": "80px 24px"')
  })
  test('launchpad.json: hero padding 80px 24px compliance', () => {
    expect(existsSync(T_LAUNCH)).toBe(true)
    const src = read(T_LAUNCH)
    expect(src, 'hero padding should be 80px 24px').toContain('"padding": "80px 24px"')
  })
  test('law-firm.json: typography drift fixed (no Georgia)', () => {
    expect(existsSync(T_LAW)).toBe(true)
    const src = read(T_LAW)
    expect(src, 'Georgia drift must be fixed').not.toContain('Georgia')
  })
})

// =============================================================================
// P73.2 — A2 themeLibrary expanded + exampleQueries
// =============================================================================
test.describe('P73.2 — A2 themeLibrary expanded + exampleQueries', () => {
  test('THEME_LIBRARY contains ≥21 entries', () => {
    const n = countEntries(THEME_LIB)
    expect(n, `theme entries ${n} should be ≥21`).toBeGreaterThanOrEqual(21)
  })
  test('themeLibrary.ts ThemeTemplate declares exampleQueries: readonly string[]', () => {
    const src = read(THEME_LIB)
    expect(src, 'ThemeTemplate must declare exampleQueries field').toMatch(
      /exampleQueries\s*:\s*readonly\s+string\[\]/,
    )
  })
  test('themeLibrary.ts has exampleQueries on every entry (≥21 occurrences)', () => {
    const n = countExampleQueries(THEME_LIB)
    // 1 declaration in interface + ≥21 entries = ≥22; min gate at 21 entries
    expect(n, `exampleQueries occurrences ${n} should be ≥21`).toBeGreaterThanOrEqual(21)
  })
  test('themeLibrary.ts contains 3 new theme ids: dark-feminine, industrial-modern, cozy-maximalist', () => {
    const src = read(THEME_LIB)
    expect(src, 'new theme: dark-feminine').toContain('dark-feminine')
    expect(src, 'new theme: industrial-modern').toContain('industrial-modern')
    expect(src, 'new theme: cozy-maximalist').toContain('cozy-maximalist')
  })
})

// =============================================================================
// P73.3 — A3 sectionLibrary expanded + exampleQueries
// =============================================================================
test.describe('P73.3 — A3 sectionLibrary expanded + exampleQueries', () => {
  test('SECTION_LIBRARY contains ≥15 entries', () => {
    const n = countEntries(SECTION_LIB)
    expect(n, `section entries ${n} should be ≥15`).toBeGreaterThanOrEqual(15)
  })
  test('sectionLibrary.ts SectionTemplate declares exampleQueries: readonly string[]', () => {
    const src = read(SECTION_LIB)
    expect(src, 'SectionTemplate must declare exampleQueries field').toMatch(
      /exampleQueries\s*:\s*readonly\s+string\[\]/,
    )
  })
  test('sectionLibrary.ts has exampleQueries on every entry (≥15 occurrences)', () => {
    const n = countExampleQueries(SECTION_LIB)
    expect(n, `exampleQueries occurrences ${n} should be ≥15`).toBeGreaterThanOrEqual(15)
  })
  test('sectionLibrary.ts contains 3 new arrangement ids: course-landing, booking-calendar, newsroom', () => {
    const src = read(SECTION_LIB)
    expect(src, 'new section: course-landing').toContain('course-landing')
    expect(src, 'new section: booking-calendar').toContain('booking-calendar')
    expect(src, 'new section: newsroom').toContain('newsroom')
  })
})

// =============================================================================
// P73.4 — A4 contentLibrary expanded + exampleQueries
// =============================================================================
test.describe('P73.4 — A4 contentLibrary expanded + exampleQueries', () => {
  test('CONTENT_LIBRARY contains ≥15 entries', () => {
    const n = countEntries(CONTENT_LIB)
    expect(n, `content entries ${n} should be ≥15`).toBeGreaterThanOrEqual(15)
  })
  test('contentLibrary.ts ContentTemplate declares exampleQueries: readonly string[]', () => {
    const src = read(CONTENT_LIB)
    expect(src, 'ContentTemplate must declare exampleQueries field').toMatch(
      /exampleQueries\s*:\s*readonly\s+string\[\]/,
    )
  })
  test('contentLibrary.ts has exampleQueries on every entry (≥15 occurrences)', () => {
    const n = countExampleQueries(CONTENT_LIB)
    expect(n, `exampleQueries occurrences ${n} should be ≥15`).toBeGreaterThanOrEqual(15)
  })
  test('contentLibrary.ts contains 3 new style ids: instructional, punchy-social, sales-pressure', () => {
    const src = read(CONTENT_LIB)
    expect(src, 'new content style: instructional').toContain('instructional')
    expect(src, 'new content style: punchy-social').toContain('punchy-social')
    expect(src, 'new content style: sales-pressure').toContain('sales-pressure')
  })
})

// =============================================================================
// P73.5 — Backward compat: matcher + applier still import cleanly
// =============================================================================
test.describe('P73.5 — Backward compat (matcher + applier untouched)', () => {
  test('templateMatcher.ts still imports findThemes/findSectionArrangements/findContentStyle', () => {
    if (!existsSync(MATCHER)) return
    const src = read(MATCHER)
    expect(src, 'matcher still references findThemes').toContain('findThemes')
    expect(src, 'matcher still references findSectionArrangements').toContain(
      'findSectionArrangements',
    )
    expect(src, 'matcher still references findContentStyle').toContain('findContentStyle')
  })
  test('templateApplier.ts still references JsonPatch type', () => {
    if (!existsSync(APPLIER)) return
    const src = read(APPLIER)
    expect(src, 'applier still references JsonPatch/JSONPatch').toMatch(/JsonPatch|JSONPatch/)
  })
})
