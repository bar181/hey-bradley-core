/**
 * P65b / OC-2.5 Wave 2 — Canonical Component Quality Standard.
 * PURE-UNIT: FS reads + regex/string asserts. NO browser bootstrap.
 * Pattern follows tests/p65-oc25-design-tokens.spec.ts.
 *
 * Asserts the CONTRACT for the 7 canonical section components
 * (4 Hero + 2 Feature + 1 Testimonial). A1 + A2 satisfy this contract.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const ADR_PATH = join(ROOT, 'docs/adr/ADR-091-canonical-component-quality.md')

const HERO_DIR = join(ROOT, 'src/templates/hero')
const FEATURES_DIR = join(ROOT, 'src/templates/features')
const TESTIMONIALS_DIR = join(ROOT, 'src/templates/testimonials')

const HERO_FILES = [
  join(HERO_DIR, 'HeroCentered.tsx'),
  join(HERO_DIR, 'HeroMinimal.tsx'),
  join(HERO_DIR, 'HeroOverlay.tsx'),
  join(HERO_DIR, 'HeroSplit.tsx'),
]
const FEATURE_FILES = [
  join(FEATURES_DIR, 'FeaturesCards.tsx'),
  join(FEATURES_DIR, 'FeaturesGrid.tsx'),
]
const TESTIMONIAL_FILES = [
  join(TESTIMONIALS_DIR, 'TestimonialsCards.tsx'),
]
const CARD_FILES = [...FEATURE_FILES, ...TESTIMONIAL_FILES]
const ALL_CANONICAL = [...HERO_FILES, ...FEATURE_FILES, ...TESTIMONIAL_FILES]

/**
 * Strip line + block comments and import statements from a TS/TSX source so
 * literal-deny-list checks don't trip on legitimate uses inside them.
 */
function stripImportsAndComments(src: string): string {
  // Remove block comments.
  let out = src.replace(/\/\*[\s\S]*?\*\//g, '')
  // Remove line comments.
  out = out.replace(/(^|[^:])\/\/.*$/gm, '$1')
  // Remove import statements (single + multi-line).
  out = out.replace(/^\s*import[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm, '')
  out = out.replace(/^\s*import\s+['"][^'"]+['"];?\s*$/gm, '')
  return out
}

test.describe('P65b.1 ADR-091 — exists, ≤120 LOC, Status Accepted, cross-refs', () => {
  test('ADR-091 file exists on disk', () => {
    expect(existsSync(ADR_PATH)).toBe(true)
  })
  test('ADR-091 is ≤120 LOC', () => {
    const src = readFileSync(ADR_PATH, 'utf8')
    const lines = src.split('\n').length
    expect(lines).toBeLessThanOrEqual(120)
  })
  test('ADR-091 declares Status: Accepted and cross-refs ADR-087 + ADR-079 + ADR-088', () => {
    const src = readFileSync(ADR_PATH, 'utf8')
    expect(src).toMatch(/Status:\*\*\s*Accepted/)
    expect(src).toContain('ADR-087')
    expect(src).toContain('ADR-079')
    expect(src).toContain('ADR-088')
  })
})

test.describe('P65b.2 Hero variants import design-tokens', () => {
  for (const file of HERO_FILES) {
    test(`${file.split('/').pop()} imports from @/styles/design-tokens`, () => {
      expect(existsSync(file)).toBe(true)
      const src = readFileSync(file, 'utf8')
      expect(src).toContain("from '@/styles/design-tokens'")
    })
  }
})

test.describe('P65b.3 Feature + Testimonial components import design-tokens', () => {
  for (const file of CARD_FILES) {
    test(`${file.split('/').pop()} imports from @/styles/design-tokens`, () => {
      expect(existsSync(file)).toBe(true)
      const src = readFileSync(file, 'utf8')
      expect(src).toContain("from '@/styles/design-tokens'")
    })
  }
})

test.describe('P65b.4 No hardcoded 24/48/96px spacing literals in canonical components', () => {
  for (const file of ALL_CANONICAL) {
    test(`${file.split('/').pop()} contains no '24px' / '48px' / '96px' string literals (outside imports + comments)`, () => {
      expect(existsSync(file)).toBe(true)
      const raw = readFileSync(file, 'utf8')
      const stripped = stripImportsAndComments(raw)
      expect(stripped).not.toMatch(/['"]24px['"]/)
      expect(stripped).not.toMatch(/['"]48px['"]/)
      expect(stripped).not.toMatch(/['"]96px['"]/)
    })
  }
})

test.describe('P65b.5 Hero variants implement scroll-reveal via IntersectionObserver', () => {
  for (const file of HERO_FILES) {
    test(`${file.split('/').pop()} contains an IntersectionObserver reference`, () => {
      expect(existsSync(file)).toBe(true)
      const src = readFileSync(file, 'utf8')
      expect(src).toContain('IntersectionObserver')
    })
  }
})

test.describe('P65b.6 Feature + Testimonial cards have hover-lift + shadow transition', () => {
  for (const file of CARD_FILES) {
    test(`${file.split('/').pop()} contains transition-all + hover:-translate-y + hover:shadow`, () => {
      expect(existsSync(file)).toBe(true)
      const src = readFileSync(file, 'utf8')
      expect(src).toContain('transition-all')
      expect(src).toMatch(/hover:-translate-y/)
      expect(src).toMatch(/hover:shadow/)
    })
  }
})

test.describe('P65b.7 KISS — no animation libs imported in canonical components', () => {
  for (const file of ALL_CANONICAL) {
    test(`${file.split('/').pop()} contains no framer-motion / gsap / lottie / @react-spring / animejs`, () => {
      expect(existsSync(file)).toBe(true)
      const src = readFileSync(file, 'utf8')
      expect(src).not.toMatch(/framer-motion/i)
      expect(src).not.toMatch(/\bgsap\b/i)
      expect(src).not.toMatch(/\blottie\b/i)
      expect(src).not.toMatch(/@react-spring/i)
      expect(src).not.toMatch(/animejs/i)
    })
  }
})
