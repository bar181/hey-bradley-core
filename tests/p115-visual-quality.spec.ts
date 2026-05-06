/**
 * P115 / VISUAL-QUALITY-BUILDER-POLISH — Wave 2 / Closer.
 *
 * Verifies the 5 Wave 1 fixes shipped at 2488da6 (5 parallel agents A1-A5)
 * close the website-eval audit's visible-quality gaps:
 *   - A1 (Builder UX) — chevron rotate + drag-handle hover-reveal
 *   - A2 (Article/Blog/Case-study) — 68ch + drop-cap + metadata strip + metric callout
 *   - A3 (Image handling) — lightbox + animate-scale-in + ImageFallback + useImageError + hover-scale-105
 *   - A4 (3 NEW demos) — editorial-magazine / indie-game-studio / research-lab; voiceAttributes ≥3
 *   - A5 (Bottom-15 lift) — EXAMPLE_SITES ≥59 (verified via index.ts wire)
 *
 * Pattern follows tests/p113-quality-push.spec.ts and tests/p114-feature-audit-fix.spec.ts.
 * Hard-gate on ADR-143 file shape + EOP triplet + KISS no-new-deps.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

const ADR_143 = join(ROOT, 'docs/adr/ADR-143-visual-quality-builder-polish.md')
const SECTION_SIMPLE = join(ROOT, 'src/components/right-panel/simple/SectionSimple.tsx')
const SECTIONS_SECTION = join(ROOT, 'src/components/left-panel/SectionsSection.tsx')
const TEXT_SINGLE = join(ROOT, 'src/templates/text/TextSingle.tsx')
const BLOG_CARD_GRID = join(ROOT, 'src/templates/blog/BlogCardGrid.tsx')
const CASE_STUDY_CARDS = join(ROOT, 'src/templates/case-study/CaseStudyCards.tsx')
const LIGHTBOX_MODAL = join(ROOT, 'src/components/ui/LightboxModal.tsx')
const IMAGE_FALLBACK = join(ROOT, 'src/components/ui/ImageFallback.tsx')
const USE_IMAGE_ERROR = join(ROOT, 'src/hooks/useImageError.ts')
const EXAMPLES_INDEX = join(ROOT, 'src/data/examples/index.ts')
const NEW_DEMOS = [
  'editorial-magazine.json',
  'indie-game-studio.json',
  'research-lab.json',
].map((f) => join(ROOT, 'src/data/examples', f))
const PHASE_DIR = join(ROOT, 'plans/implementation/phase-115')
const PACKAGE_JSON = join(ROOT, 'package.json')

const IMAGE_TEMPLATES = [
  'src/templates/image/ImageFullWidth.tsx',
  'src/templates/image/ImageOverlay.tsx',
  'src/templates/image/ImageWithText.tsx',
  'src/templates/gallery/GalleryGrid.tsx',
  'src/templates/gallery/GalleryFullWidth.tsx',
  'src/templates/gallery/GalleryCarousel.tsx',
  'src/templates/gallery/GalleryMasonry.tsx',
  'src/templates/hero/HeroCentered.tsx',
  'src/templates/hero/HeroSplit.tsx',
].map((f) => join(ROOT, f))

test.describe('P115.1 — ADR-143 file shape', () => {
  test('ADR-143 exists with Status: Accepted', () => {
    expect(existsSync(ADR_143)).toBe(true)
    const txt = readFileSync(ADR_143, 'utf8')
    expect(/Status:\s*\*?\*?\s*Accepted/i.test(txt)).toBe(true)
  })

  test('ADR-143 ≤120 LOC', () => {
    const lines = readFileSync(ADR_143, 'utf8').split('\n').length
    expect(lines).toBeLessThanOrEqual(120)
  })

  test('ADR-143 cross-refs ADR-090 + ADR-091 + ADR-094 + ADR-100 + ADR-102 + ADR-141', () => {
    const txt = readFileSync(ADR_143, 'utf8')
    expect(txt).toMatch(/ADR-090/)
    expect(txt).toMatch(/ADR-091/)
    expect(txt).toMatch(/ADR-094/)
    expect(txt).toMatch(/ADR-100/)
    expect(txt).toMatch(/ADR-102/)
    expect(txt).toMatch(/ADR-141/)
  })
})

test.describe('P115.2 — Builder UX: chevron rotation', () => {
  test('SectionSimple.tsx uses transition-transform + rotate-90 (single icon)', () => {
    expect(existsSync(SECTION_SIMPLE)).toBe(true)
    const txt = readFileSync(SECTION_SIMPLE, 'utf8')
    expect(txt).toMatch(/transition-transform/)
    expect(txt).toMatch(/rotate-90/)
  })
})

test.describe('P115.3 — Builder UX: drag handle hover-reveal', () => {
  test('SectionsSection.tsx uses opacity-0 group-hover:opacity-100', () => {
    expect(existsSync(SECTIONS_SECTION)).toBe(true)
    const txt = readFileSync(SECTIONS_SECTION, 'utf8')
    expect(txt).toMatch(/opacity-0/)
    expect(txt).toMatch(/group-hover:opacity-100/)
  })
})

test.describe('P115.4 — Article: line-length cap (68ch / prose)', () => {
  test('TextSingle.tsx caps line length at 68ch or prose', () => {
    expect(existsSync(TEXT_SINGLE)).toBe(true)
    const txt = readFileSync(TEXT_SINGLE, 'utf8')
    expect(/max-w-\[68ch\]|max-w-prose/.test(txt)).toBe(true)
  })
})

test.describe('P115.5 — Article: drop-cap on first paragraph', () => {
  test('TextSingle.tsx applies first-letter drop-cap', () => {
    const txt = readFileSync(TEXT_SINGLE, 'utf8')
    expect(/first-letter:(float-left|text-)/.test(txt)).toBe(true)
  })
})

test.describe('P115.6 — Blog: readTime + category metadata', () => {
  test('BlogCardGrid.tsx surfaces readTime AND category', () => {
    expect(existsSync(BLOG_CARD_GRID)).toBe(true)
    const txt = readFileSync(BLOG_CARD_GRID, 'utf8')
    expect((txt.match(/readTime/g) ?? []).length).toBeGreaterThanOrEqual(1)
    expect((txt.match(/category/g) ?? []).length).toBeGreaterThanOrEqual(1)
  })
})

test.describe('P115.7 — Case-study: metric callout + before/after', () => {
  test('CaseStudyCards.tsx renders text-3xl/4xl metric callout', () => {
    expect(existsSync(CASE_STUDY_CARDS)).toBe(true)
    const txt = readFileSync(CASE_STUDY_CARDS, 'utf8')
    expect(/text-3xl|text-4xl/.test(txt)).toBe(true)
  })

  test('CaseStudyCards.tsx surfaces before/after structure', () => {
    const txt = readFileSync(CASE_STUDY_CARDS, 'utf8')
    expect(/before|after|problem|solution|metricLabel/i.test(txt)).toBe(true)
  })
})

test.describe('P115.8 — Image: LightboxModal scale-in animation', () => {
  test('LightboxModal.tsx has animate-lightbox-scale-in', () => {
    expect(existsSync(LIGHTBOX_MODAL)).toBe(true)
    const txt = readFileSync(LIGHTBOX_MODAL, 'utf8')
    expect(txt).toMatch(/animate-lightbox-scale-in/)
  })
})

test.describe('P115.9 — Image: ImageFallback module exists', () => {
  test('src/components/ui/ImageFallback.tsx exists', () => {
    expect(existsSync(IMAGE_FALLBACK)).toBe(true)
    const txt = readFileSync(IMAGE_FALLBACK, 'utf8')
    expect(/export\s+(default\s+)?function\s+ImageFallback|export\s+const\s+ImageFallback/.test(txt)).toBe(true)
  })
})

test.describe('P115.10 — Image: useImageError hook exists', () => {
  test('src/hooks/useImageError.ts exists + exports useImageError', () => {
    expect(existsSync(USE_IMAGE_ERROR)).toBe(true)
    const txt = readFileSync(USE_IMAGE_ERROR, 'utf8')
    expect(/export\s+(default\s+)?function\s+useImageError|export\s+const\s+useImageError/.test(txt)).toBe(true)
  })
})

test.describe('P115.11 — Image: hover scale-105 in ≥3 templates', () => {
  test('At least 3 image templates have hover:scale-105 + transition-transform', () => {
    let hits = 0
    for (const file of IMAGE_TEMPLATES) {
      if (!existsSync(file)) continue
      const txt = readFileSync(file, 'utf8')
      if (/(hover:scale-105|group-hover:scale-105)/.test(txt) && /transition-transform/.test(txt)) {
        hits += 1
      }
    }
    expect(hits).toBeGreaterThanOrEqual(3)
  })
})

test.describe('P115.12 — 3 new demos: parse + voiceAttributes ≥3', () => {
  for (const demo of NEW_DEMOS) {
    test(`${demo.split('/').pop()} parses and has voiceAttributes ≥3`, () => {
      expect(existsSync(demo)).toBe(true)
      const txt = readFileSync(demo, 'utf8')
      const json = JSON.parse(txt) as Record<string, unknown>
      const site = (json.site ?? json) as Record<string, unknown>
      const voice = site.voiceAttributes as unknown[] | undefined
      expect(Array.isArray(voice)).toBe(true)
      expect((voice ?? []).length).toBeGreaterThanOrEqual(3)
    })
  }
})

test.describe('P115.13 — EXAMPLE_SITES ≥59', () => {
  test('index.ts wires ≥59 example sites', () => {
    expect(existsSync(EXAMPLES_INDEX)).toBe(true)
    const txt = readFileSync(EXAMPLES_INDEX, 'utf8')
    // Match either "config: foo as unknown as MasterConfig" OR direct "config: foo,"
    const asUnknown = (txt.match(/config:\s+\w+\s+as unknown as MasterConfig/g) ?? []).length
    const direct = (txt.match(/^\s+config:\s+\w+,$/gm) ?? []).length
    expect(asUnknown + direct).toBeGreaterThanOrEqual(59)
    // And the 3 P115 imports are present
    expect(txt).toMatch(/editorial-magazine/)
    expect(txt).toMatch(/indie-game-studio/)
    expect(txt).toMatch(/research-lab/)
  })
})

test.describe('P115.14 — EOP triplet at phase-115', () => {
  test('preflight.md exists', () => {
    expect(existsSync(join(PHASE_DIR, 'preflight.md'))).toBe(true)
  })
  test('session-log.md exists', () => {
    expect(existsSync(join(PHASE_DIR, 'session-log.md'))).toBe(true)
  })
  test('retrospective.md exists', () => {
    expect(existsSync(join(PHASE_DIR, 'retrospective.md'))).toBe(true)
  })
})

test.describe('P115.15 — KISS no-new-deps', () => {
  test('package.json forbids new animation/scaffolding deps', () => {
    const pkg = JSON.parse(readFileSync(PACKAGE_JSON, 'utf8'))
    const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) }
    // framer-motion + jszip are pre-existing baseline deps per P105.7 + P106.9
    // + P110.15 + P111.10 precedent (deps NOT pre-existing in baseline only).
    const denylist = [
      'gsap',
      'lottie-web',
      '@react-spring/web',
      'animejs',
      'archiver',
      'fs-extra',
      'commander',
      'yargs',
      'chalk',
      '@supabase/supabase-js',
    ]
    for (const dep of denylist) {
      expect(deps[dep]).toBeUndefined()
    }
  })
})
