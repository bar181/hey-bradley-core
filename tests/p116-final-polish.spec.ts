/**
 * P116 / FINAL-POLISH — Wave 2 / Closer.
 *
 * Verifies the 3 Wave 1 outputs shipped at df4bb84 (3 parallel disjoint-scope
 * agents B1-B3) close the corpus skew + builder in-place editing gap surfaced
 * by the P115 honest audit:
 *   - B1 (5 NEW non-SaaS demos) — wedding / food-truck / non-profit / therapist / events-venue; voiceAttributes ≥3 each; EXAMPLE_SITES 59 → 64
 *   - B2 (Bottom-N enum truth-up + 90% floor) — 15 invalid enum values fixed; 98.4% of 64 templates ≥7
 *   - B3 (Builder fixes) — F1 inline edit (HeroSplit + HeroCentered + shared InlineEditable); F2 section-type swap (text/quotes/numbers/image)
 *
 * Pattern follows tests/p115-visual-quality.spec.ts. Hard-gate on ADR-144 file
 * shape + EOP triplet + KISS no-new-deps. existsSync soft-pass guards on
 * Wave-1 surfaces; HARD when present.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

const ADR_144 = join(ROOT, 'docs/adr/ADR-144-final-visual-quality.md')
const HERO_SPLIT = join(ROOT, 'src/templates/hero/HeroSplit.tsx')
const HERO_CENTERED = join(ROOT, 'src/templates/hero/HeroCentered.tsx')
const SECTIONS_SECTION = join(ROOT, 'src/components/left-panel/SectionsSection.tsx')
const SECTION_TYPE_SWAP = join(ROOT, 'src/lib/sectionTypeSwap.ts')
const INLINE_EDITABLE = join(ROOT, 'src/components/shared/InlineEditable.tsx')
const EXAMPLES_INDEX = join(ROOT, 'src/data/examples/index.ts')
const NEW_DEMOS = [
  'wedding-planner.json',
  'food-truck-restaurant.json',
  'non-profit-community.json',
  'freelance-therapist.json',
  'local-events-venue.json',
].map((f) => join(ROOT, 'src/data/examples', f))
const PHASE_DIR = join(ROOT, 'plans/implementation/phase-116')
const PACKAGE_JSON = join(ROOT, 'package.json')

test.describe('P116.1 — ADR-144 file shape', () => {
  test('ADR-144 exists with Status: Accepted', () => {
    expect(existsSync(ADR_144)).toBe(true)
    const txt = readFileSync(ADR_144, 'utf8')
    expect(/Status:\s*\*?\*?\s*Accepted/i.test(txt)).toBe(true)
  })

  test('ADR-144 ≤120 LOC', () => {
    const lines = readFileSync(ADR_144, 'utf8').split('\n').length
    expect(lines).toBeLessThanOrEqual(120)
  })

  test('ADR-144 cross-refs ADR-091 + ADR-094 + ADR-100 + ADR-141 + ADR-143', () => {
    const txt = readFileSync(ADR_144, 'utf8')
    expect(txt).toMatch(/ADR-091/)
    expect(txt).toMatch(/ADR-094/)
    expect(txt).toMatch(/ADR-100/)
    expect(txt).toMatch(/ADR-141/)
    expect(txt).toMatch(/ADR-143/)
  })
})

test.describe('P116.2 — 5 new demos: parse + Zod-shaped', () => {
  for (const demo of NEW_DEMOS) {
    test(`${demo.split('/').pop()} parses + has site object`, () => {
      expect(existsSync(demo)).toBe(true)
      const txt = readFileSync(demo, 'utf8')
      const json = JSON.parse(txt) as Record<string, unknown>
      // Either wrapped under .site or top-level shape.
      const site = (json.site ?? json) as Record<string, unknown>
      expect(typeof site).toBe('object')
      expect(site.brandName).toBeTruthy()
    })
  }
})

test.describe('P116.3 — EXAMPLE_SITES count ≥64', () => {
  test('index.ts wires ≥64 example sites', () => {
    expect(existsSync(EXAMPLES_INDEX)).toBe(true)
    const txt = readFileSync(EXAMPLES_INDEX, 'utf8')
    // Match either "config: foo as unknown as MasterConfig" OR direct "config: foo,"
    const asUnknown = (txt.match(/config:\s+\w+\s+as unknown as MasterConfig/g) ?? []).length
    const direct = (txt.match(/^\s+config:\s+\w+,$/gm) ?? []).length
    expect(asUnknown + direct).toBeGreaterThanOrEqual(64)
    // 5 P116 imports present
    expect(txt).toMatch(/wedding-planner/)
    expect(txt).toMatch(/food-truck-restaurant/)
    expect(txt).toMatch(/non-profit-community/)
    expect(txt).toMatch(/freelance-therapist/)
    expect(txt).toMatch(/local-events-venue/)
  })
})

test.describe('P116.4 — Inline edit: HeroSplit + HeroCentered import InlineEditable', () => {
  test('HeroSplit.tsx imports InlineEditable from shared module', () => {
    expect(existsSync(HERO_SPLIT)).toBe(true)
    const txt = readFileSync(HERO_SPLIT, 'utf8')
    expect(txt).toMatch(/InlineEditable/)
    expect(txt).toMatch(/from ['"]@\/components\/shared\/InlineEditable['"]/)
  })

  test('HeroCentered.tsx imports InlineEditable from shared module', () => {
    expect(existsSync(HERO_CENTERED)).toBe(true)
    const txt = readFileSync(HERO_CENTERED, 'utf8')
    expect(txt).toMatch(/InlineEditable/)
    expect(txt).toMatch(/from ['"]@\/components\/shared\/InlineEditable['"]/)
  })
})

test.describe('P116.5 — Section-type swap: SectionsSection wires helpers + Shuffle icon', () => {
  test('SectionsSection.tsx imports sectionTypeSwap helpers + has Shuffle icon', () => {
    expect(existsSync(SECTIONS_SECTION)).toBe(true)
    const txt = readFileSync(SECTIONS_SECTION, 'utf8')
    // Imports sectionTypeSwap helpers
    expect(txt).toMatch(/from ['"]@\/lib\/sectionTypeSwap['"]/)
    expect(txt).toMatch(/isSwappable|swapCandidates|SWAP_LABEL/)
    // Has Shuffle icon import + render reference
    expect(txt).toMatch(/Shuffle/)
  })
})

test.describe('P116.6 — sectionTypeSwap.ts exports SWAPPABLE_TYPES', () => {
  test('SWAPPABLE_TYPES contains text + quotes + numbers + image', () => {
    expect(existsSync(SECTION_TYPE_SWAP)).toBe(true)
    const txt = readFileSync(SECTION_TYPE_SWAP, 'utf8')
    expect(txt).toMatch(/export\s+const\s+SWAPPABLE_TYPES/)
    expect(txt).toMatch(/'text'/)
    expect(txt).toMatch(/'quotes'/)
    expect(txt).toMatch(/'numbers'/)
    expect(txt).toMatch(/'image'/)
  })

  test('exports isSwappable + swapCandidates + defaultComponentsFor + SWAP_LABEL', () => {
    const txt = readFileSync(SECTION_TYPE_SWAP, 'utf8')
    expect(txt).toMatch(/export\s+function\s+isSwappable/)
    expect(txt).toMatch(/export\s+function\s+swapCandidates/)
    expect(txt).toMatch(/export\s+function\s+defaultComponentsFor/)
    expect(txt).toMatch(/export\s+const\s+SWAP_LABEL/)
  })
})

test.describe('P116.7 — InlineEditable exports component + useHeroInlineCommit hook', () => {
  test('exports InlineEditable component + useHeroInlineCommit', () => {
    expect(existsSync(INLINE_EDITABLE)).toBe(true)
    const txt = readFileSync(INLINE_EDITABLE, 'utf8')
    expect(/export\s+(default\s+)?function\s+InlineEditable|export\s+const\s+InlineEditable/.test(txt)).toBe(true)
    expect(/export\s+(default\s+)?function\s+useHeroInlineCommit|export\s+const\s+useHeroInlineCommit/.test(txt)).toBe(true)
  })

  test('uses contentEditable + commits via setSectionConfig', () => {
    const txt = readFileSync(INLINE_EDITABLE, 'utf8')
    expect(txt).toMatch(/contentEditable/)
    expect(txt).toMatch(/setSectionConfig/)
  })
})

test.describe('P116.8 — EOP triplet at phase-116', () => {
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

test.describe('P116.9 — KISS no-new-deps', () => {
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
      'remark',
      'unified',
    ]
    for (const dep of denylist) {
      expect(deps[dep]).toBeUndefined()
    }
  })
})

test.describe('P116.10 — voiceAttributes ≥3 on all 5 B1 demos', () => {
  for (const demo of NEW_DEMOS) {
    test(`${demo.split('/').pop()} has voiceAttributes ≥3`, () => {
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
