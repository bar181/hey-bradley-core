/**
 * P72 / OC-TI Template Intelligence — ADR-098 contract enforcement.
 * PURE-UNIT: FS reads + regex/string asserts. NO browser bootstrap.
 * Pattern follows tests/p67c-library-polish.spec.ts and
 * tests/p71-blog-expansion.spec.ts.
 *
 * Asserts the P72 contract:
 *   1. themeLibrary.ts exports + ≥15 entries
 *   2. sectionLibrary.ts exports + ≥10 entries
 *   3. contentLibrary.ts exports + ≥10 entries
 *   4. templateMatcher.ts exports + threshold 0.8 + cross-library refs
 *   5. templateApplier.ts exports + JSON-patch path coverage
 *   6. chatPipeline wire-up (full wire OR documented deferral)
 *   7. Theme tag-search keywords present
 *   8. Section tag-search keywords present
 *   9. Content tag-search keywords present
 *  10. KISS — no animation libs, no novel package imports
 *  11. ADR-098 file shape
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

// --- Library files ---
const TEMPLATES_DIR = 'src/contexts/intelligence/templates'
const THEME_LIB = join(ROOT, TEMPLATES_DIR, 'themeLibrary.ts')
const SECTION_LIB = join(ROOT, TEMPLATES_DIR, 'sectionLibrary.ts')
const CONTENT_LIB = join(ROOT, TEMPLATES_DIR, 'contentLibrary.ts')
const MATCHER = join(ROOT, TEMPLATES_DIR, 'templateMatcher.ts')
const APPLIER = join(ROOT, TEMPLATES_DIR, 'templateApplier.ts')
const CHAT_PIPELINE = join(ROOT, 'src/contexts/intelligence/chatPipeline.ts')

// --- ADR ---
const ADR_PATH = join(ROOT, 'docs/adr/ADR-098-template-intelligence-architecture.md')

// --- Banned animation / new-dep libs (none of these may appear in the 5 new files) ---
const BANNED_ANIM = [
  'framer-motion',
  'gsap',
  'lottie',
  '@react-spring',
  'animejs',
]

// --- Required tag presence per layer ---
const THEME_TAGS = ['fun', 'corporate', 'minimal', 'dark', 'developer', 'warm'] as const
const SECTION_TAGS = ['saas', 'portfolio', 'blog', 'startup', 'developer', 'restaurant'] as const
const CONTENT_TAGS = ['pitch', 'article', 'fun', 'professional', 'technical', 'minimal'] as const

function read(p: string): string {
  return readFileSync(p, 'utf8')
}

function locOf(p: string): number {
  return read(p).split('\n').length
}

// Approximate entry count by counting top-level object literal openers
// inside a `[ ... ]` array body. The libraries use the same `  {` / `  },`
// indentation pattern across all 3 files.
function countEntries(p: string): number {
  const src = read(p)
  const matches = src.match(/^\s{2}\{$/gm)
  return matches ? matches.length : 0
}

// =============================================================================
// P72.1 — themeLibrary file shape
// =============================================================================
test.describe('P72.1 — themeLibrary file shape', () => {
  test('themeLibrary.ts exists on disk', () => {
    expect(existsSync(THEME_LIB)).toBe(true)
  })
  test('themeLibrary.ts exports THEME_LIBRARY const', () => {
    const src = read(THEME_LIB)
    expect(src).toMatch(/export\s+const\s+THEME_LIBRARY/)
  })
  test('themeLibrary.ts exports findThemes function', () => {
    const src = read(THEME_LIB)
    const exportsFn =
      /export\s+function\s+findThemes/.test(src) ||
      /export\s+const\s+findThemes\s*[:=]/.test(src) ||
      /export\s*\{\s*[^}]*\bfindThemes\b[^}]*\}/.test(src)
    expect(exportsFn).toBe(true)
  })
  test('themeLibrary.ts exports ThemeTemplate interface or type', () => {
    const src = read(THEME_LIB)
    expect(src).toMatch(/export\s+(interface|type)\s+ThemeTemplate/)
  })
  test('themeLibrary.ts contains ≥15 entries', () => {
    const n = countEntries(THEME_LIB)
    expect(n, `theme entries ${n} should be ≥15`).toBeGreaterThanOrEqual(15)
  })
})

// =============================================================================
// P72.2 — sectionLibrary file shape
// =============================================================================
test.describe('P72.2 — sectionLibrary file shape', () => {
  test('sectionLibrary.ts exists on disk', () => {
    expect(existsSync(SECTION_LIB)).toBe(true)
  })
  test('sectionLibrary.ts exports SECTION_LIBRARY + findSectionArrangements', () => {
    const src = read(SECTION_LIB)
    expect(src).toMatch(/export\s+const\s+SECTION_LIBRARY/)
    const exportsFn =
      /export\s+function\s+findSectionArrangements/.test(src) ||
      /export\s+const\s+findSectionArrangements\s*[:=]/.test(src) ||
      /export\s*\{\s*[^}]*\bfindSectionArrangements\b[^}]*\}/.test(src)
    expect(exportsFn).toBe(true)
  })
  test('sectionLibrary.ts exports SectionTemplate interface or type', () => {
    const src = read(SECTION_LIB)
    expect(src).toMatch(/export\s+(interface|type)\s+SectionTemplate/)
  })
  test('sectionLibrary.ts contains ≥10 entries', () => {
    const n = countEntries(SECTION_LIB)
    expect(n, `section entries ${n} should be ≥10`).toBeGreaterThanOrEqual(10)
  })
})

// =============================================================================
// P72.3 — contentLibrary file shape
// =============================================================================
test.describe('P72.3 — contentLibrary file shape', () => {
  test('contentLibrary.ts exists on disk', () => {
    expect(existsSync(CONTENT_LIB)).toBe(true)
  })
  test('contentLibrary.ts exports CONTENT_LIBRARY + findContentStyle', () => {
    const src = read(CONTENT_LIB)
    expect(src).toMatch(/export\s+const\s+CONTENT_LIBRARY/)
    const exportsFn =
      /export\s+function\s+findContentStyle/.test(src) ||
      /export\s+const\s+findContentStyle\s*[:=]/.test(src) ||
      /export\s*\{\s*[^}]*\bfindContentStyle\b[^}]*\}/.test(src)
    expect(exportsFn).toBe(true)
  })
  test('contentLibrary.ts exports ContentTemplate interface or type', () => {
    const src = read(CONTENT_LIB)
    expect(src).toMatch(/export\s+(interface|type)\s+ContentTemplate/)
  })
  test('contentLibrary.ts contains ≥10 entries', () => {
    const n = countEntries(CONTENT_LIB)
    expect(n, `content entries ${n} should be ≥10`).toBeGreaterThanOrEqual(10)
  })
})

// =============================================================================
// P72.4 — templateMatcher file shape
// =============================================================================
test.describe('P72.4 — templateMatcher file shape', () => {
  test('templateMatcher.ts exists on disk', () => {
    // A4 deferral tolerance: surface the gap explicitly so seal-runner sees it
    expect(existsSync(MATCHER), 'templateMatcher.ts missing — A4 carry-forward').toBe(true)
  })
  test('templateMatcher.ts exports matchTemplates + TEMPLATE_CONFIDENCE_THRESHOLD + TemplateMatch + TemplateMatcher', () => {
    if (!existsSync(MATCHER)) {
      expect(existsSync(MATCHER), 'templateMatcher.ts missing — A4 carry-forward').toBe(true)
      return
    }
    const src = read(MATCHER)
    const exportsMatch =
      /export\s+function\s+matchTemplates/.test(src) ||
      /export\s+const\s+matchTemplates\s*[:=]/.test(src) ||
      /export\s*\{\s*[^}]*\bmatchTemplates\b[^}]*\}/.test(src)
    expect(exportsMatch, 'matchTemplates export').toBe(true)
    expect(src).toMatch(/export\s+const\s+TEMPLATE_CONFIDENCE_THRESHOLD/)
    expect(src).toMatch(/export\s+(interface|type)\s+TemplateMatch\b/)
    expect(src).toMatch(/export\s+(interface|type|class|const)\s+TemplateMatcher\b/)
  })
  test('templateMatcher.ts contains the 0.8 confidence threshold literal', () => {
    if (!existsSync(MATCHER)) return
    const src = read(MATCHER)
    expect(src).toContain('0.8')
  })
  test('templateMatcher.ts references findThemes + findSectionArrangements + findContentStyle', () => {
    if (!existsSync(MATCHER)) return
    const src = read(MATCHER)
    expect(src, 'should reference findThemes').toContain('findThemes')
    expect(src, 'should reference findSectionArrangements').toContain('findSectionArrangements')
    expect(src, 'should reference findContentStyle').toContain('findContentStyle')
  })
})

// =============================================================================
// P72.5 — templateApplier file shape
// =============================================================================
test.describe('P72.5 — templateApplier file shape', () => {
  test('templateApplier.ts exists on disk', () => {
    expect(existsSync(APPLIER), 'templateApplier.ts missing — A4 carry-forward').toBe(true)
  })
  test('templateApplier.ts exports applyTemplateMatch', () => {
    if (!existsSync(APPLIER)) return
    const src = read(APPLIER)
    const exportsFn =
      /export\s+function\s+applyTemplateMatch/.test(src) ||
      /export\s+const\s+applyTemplateMatch\s*[:=]/.test(src) ||
      /export\s*\{\s*[^}]*\bapplyTemplateMatch\b[^}]*\}/.test(src)
    expect(exportsFn).toBe(true)
  })
  test('templateApplier.ts references JsonPatch + theme primary path + content-style staging path', () => {
    if (!existsSync(APPLIER)) return
    const src = read(APPLIER)
    expect(src, 'JsonPatch/JSONPatch reference').toMatch(/JsonPatch|JSONPatch/)
    expect(src, 'theme primary color path').toContain('/theme/colors/primary')
    expect(src, 'pending content style path').toContain('/_pendingContentStyle')
  })
})

// =============================================================================
// P72.6 — chatPipeline wire (CONDITIONAL — A4 may have deferred)
// =============================================================================
test.describe('P72.6 — chatPipeline wire (conditional)', () => {
  test('chatPipeline.ts either imports matchTemplates+applyTemplateMatch, OR carries P72/OC-TI deferral comment', () => {
    expect(existsSync(CHAT_PIPELINE)).toBe(true)
    const src = read(CHAT_PIPELINE)
    const hasFullWire = src.includes('matchTemplates') && src.includes('applyTemplateMatch')
    const hasDeferralNote = /P72|OC-TI/i.test(src)
    expect(
      hasFullWire || hasDeferralNote,
      'expected either full wire (matchTemplates + applyTemplateMatch imports) OR a P72 / OC-TI deferral comment'
    ).toBe(true)
  })
})

// =============================================================================
// P72.7 — Theme tag-search keywords present (one test per tag)
// =============================================================================
test.describe('P72.7 — Theme tag-search keywords present', () => {
  for (const tag of THEME_TAGS) {
    test(`themeLibrary.ts contains '${tag}' tag at least once`, () => {
      const src = read(THEME_LIB)
      const re = new RegExp(`['"]${tag}['"]`)
      expect(src, `theme library should carry the '${tag}' tag`).toMatch(re)
    })
  }
})

// =============================================================================
// P72.8 — Section tag-search keywords present (one test per tag)
// =============================================================================
test.describe('P72.8 — Section tag-search keywords present', () => {
  for (const tag of SECTION_TAGS) {
    test(`sectionLibrary.ts contains '${tag}' tag at least once`, () => {
      const src = read(SECTION_LIB)
      const re = new RegExp(`['"]${tag}['"]`)
      expect(src, `section library should carry the '${tag}' tag`).toMatch(re)
    })
  }
})

// =============================================================================
// P72.9 — Content tag-search keywords present (one test per tag)
// =============================================================================
test.describe('P72.9 — Content tag-search keywords present', () => {
  test(`contentLibrary.ts contains 'don-miller' OR 'don miller' tag`, () => {
    const src = read(CONTENT_LIB)
    expect(/['"]don[- ]miller['"]/.test(src), `content library should reference Don Miller`).toBe(true)
  })
  for (const tag of CONTENT_TAGS) {
    test(`contentLibrary.ts contains '${tag}' tag at least once`, () => {
      const src = read(CONTENT_LIB)
      const re = new RegExp(`['"]${tag}['"]`)
      expect(src, `content library should carry the '${tag}' tag`).toMatch(re)
    })
  }
})

// =============================================================================
// P72.10 — KISS: no animation libs, no novel deps
// =============================================================================
test.describe('P72.10 — KISS: no animation libs, no novel deps', () => {
  const FILES_TO_AUDIT = [THEME_LIB, SECTION_LIB, CONTENT_LIB, MATCHER, APPLIER]
  for (const file of FILES_TO_AUDIT) {
    test(`${file.split('/').slice(-1)[0]} imports zero banned animation libs`, () => {
      if (!existsSync(file)) return // tolerate A4 deferral
      const src = read(file)
      for (const dep of BANNED_ANIM) {
        expect(src, `${file} should not import ${dep}`).not.toContain(dep)
      }
    })
  }
})

// =============================================================================
// P72.11 — ADR-098 file shape
// =============================================================================
test.describe('P72.11 — ADR-098 file shape', () => {
  test('ADR-098 exists on disk', () => {
    expect(existsSync(ADR_PATH)).toBe(true)
  })
  test('ADR-098 is ≤140 LOC', () => {
    expect(locOf(ADR_PATH)).toBeLessThanOrEqual(140)
  })
  test('ADR-098 declares Status: Accepted', () => {
    const src = read(ADR_PATH)
    expect(src).toMatch(/Status:\*\*\s*Accepted/)
  })
  test('ADR-098 cross-refs ADR-053 + ADR-057 + ADR-060 + ADR-064 + ADR-079 + ADR-091 + ADR-096', () => {
    const src = read(ADR_PATH)
    for (const ref of ['ADR-053', 'ADR-057', 'ADR-060', 'ADR-064', 'ADR-079', 'ADR-091', 'ADR-096']) {
      expect(src, `ADR-098 should cross-ref ${ref}`).toContain(ref)
    }
  })
})
