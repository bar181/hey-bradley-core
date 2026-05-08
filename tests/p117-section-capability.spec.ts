/**
 * P117 / SECTION-CAPABILITY-AUDIT-FIX — Wave 3 / Closer.
 *
 * Verifies the Wave 1 audits (3 docs) + Wave 2 fixes (F1 render path + cue
 * coverage; F2 6 NEW vs-SOTA template variants) close the 18-of-18 render
 * completeness gap surfaced by `docs/audit/p117-section-inventory.md`:
 *   - F1 (case-study + contact-form RENDER PATH wired in RealityTab + SimpleTab)
 *   - F1 (SECTION_CUES + validateSectionType aliases for 6 unwired types)
 *   - F2 (NavbarSticky + NavbarMegaMenu + PricingCalculator + PricingEnterprise + TeamHoverBio + TeamWithSocial)
 *
 * Pattern follows tests/p116-final-polish.spec.ts. Hard-gate on ADR-145 file
 * shape + EOP triplet + KISS no-new-deps. existsSync soft-pass guards on
 * Wave-1/2 surfaces; HARD when present.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

const ADR_145 = join(ROOT, 'docs/adr/ADR-145-section-capability-standard.md')
const REALITY_TAB = join(ROOT, 'src/components/center-canvas/RealityTab.tsx')
const SIMPLE_TAB = join(ROOT, 'src/components/right-panel/SimpleTab.tsx')
const ASSUMPTIONS = join(ROOT, 'src/contexts/intelligence/aisp/assumptions.ts')
const SECTION_SCHEMA = join(ROOT, 'src/lib/schemas/section.ts')
const PHASE_DIR = join(ROOT, 'plans/implementation/phase-117')
const PACKAGE_JSON = join(ROOT, 'package.json')

const NEW_VARIANTS = [
  'src/templates/navbar/NavbarSticky.tsx',
  'src/templates/navbar/NavbarMegaMenu.tsx',
  'src/templates/pricing/PricingCalculator.tsx',
  'src/templates/pricing/PricingEnterprise.tsx',
  'src/templates/team/TeamHoverBio.tsx',
  'src/templates/team/TeamWithSocial.tsx',
].map((p) => join(ROOT, p))

const AUDIT_DOCS = [
  'docs/audit/p117-section-inventory.md',
  'docs/audit/p117-vs-sota.md',
  'docs/audit/p117-site-shapes.md',
].map((p) => join(ROOT, p))

test.describe('P117.1 — ADR-145 file shape', () => {
  test('ADR-145 exists with Status: Accepted', () => {
    expect(existsSync(ADR_145)).toBe(true)
    const txt = readFileSync(ADR_145, 'utf8')
    expect(/Status:\s*\*?\*?\s*Accepted/i.test(txt)).toBe(true)
  })

  test('ADR-145 ≤120 LOC', () => {
    const lines = readFileSync(ADR_145, 'utf8').split('\n').length
    expect(lines).toBeLessThanOrEqual(120)
  })

  test('ADR-145 cross-refs ADR-100 + ADR-091 + ADR-094 + ADR-143 + ADR-144', () => {
    const txt = readFileSync(ADR_145, 'utf8')
    expect(txt).toMatch(/ADR-100/)
    expect(txt).toMatch(/ADR-091/)
    expect(txt).toMatch(/ADR-094/)
    expect(txt).toMatch(/ADR-143/)
    expect(txt).toMatch(/ADR-144/)
  })
})

test.describe('P117.2 — Render completeness: case-study + contact-form in RealityTab', () => {
  test('RealityTab.tsx has case-study + contact-form render branches', () => {
    expect(existsSync(REALITY_TAB)).toBe(true)
    const txt = readFileSync(REALITY_TAB, 'utf8')
    expect(txt).toMatch(/section\.type === 'case-study'/)
    expect(txt).toMatch(/section\.type === 'contact-form'/)
  })

  test('RealityTab.tsx imports CaseStudyCards + ContactFormSimple', () => {
    const txt = readFileSync(REALITY_TAB, 'utf8')
    expect(txt).toMatch(/import \{ CaseStudyCards \}/)
    expect(txt).toMatch(/import \{ ContactFormSimple \}/)
  })
})

test.describe('P117.3 — SimpleTab routing: case-study + contact-form editors', () => {
  test('SimpleTab.tsx routes case-study + contact-form', () => {
    expect(existsSync(SIMPLE_TAB)).toBe(true)
    const txt = readFileSync(SIMPLE_TAB, 'utf8')
    expect(txt).toMatch(/case 'case-study'/)
    expect(txt).toMatch(/case 'contact-form'/)
  })

  test('SimpleTab.tsx imports CaseStudySectionSimple + ContactFormSectionSimple', () => {
    const txt = readFileSync(SIMPLE_TAB, 'utf8')
    expect(txt).toMatch(/CaseStudySectionSimple/)
    expect(txt).toMatch(/ContactFormSectionSimple/)
  })
})

test.describe('P117.4 — 6 NEW template variants exist', () => {
  for (const variant of NEW_VARIANTS) {
    test(`${variant.split('/').pop()} exists on disk`, () => {
      expect(existsSync(variant)).toBe(true)
      const txt = readFileSync(variant, 'utf8')
      // Must be a real React component, not a stub
      expect(txt).toMatch(/export\s+function\s+\w+/)
    })
  }
})

test.describe('P117.5 — 6 variants wired into RealityTab renderSection', () => {
  test('menu variants: sticky + mega-menu cases present', () => {
    const txt = readFileSync(REALITY_TAB, 'utf8')
    expect(txt).toMatch(/case 'sticky'/)
    expect(txt).toMatch(/case 'mega-menu'/)
    expect(txt).toMatch(/NavbarSticky/)
    expect(txt).toMatch(/NavbarMegaMenu/)
  })

  test('pricing variants: calculator + enterprise cases present', () => {
    const txt = readFileSync(REALITY_TAB, 'utf8')
    expect(txt).toMatch(/case 'calculator'/)
    expect(txt).toMatch(/case 'enterprise'/)
    expect(txt).toMatch(/PricingCalculator/)
    expect(txt).toMatch(/PricingEnterprise/)
  })

  test('team variants: hover-bio + with-social cases present', () => {
    const txt = readFileSync(REALITY_TAB, 'utf8')
    expect(txt).toMatch(/case 'hover-bio'/)
    expect(txt).toMatch(/case 'with-social'/)
    expect(txt).toMatch(/TeamHoverBio/)
    expect(txt).toMatch(/TeamWithSocial/)
  })
})

test.describe('P117.6 — SECTION_CUES coverage for 6 previously-uncovered types', () => {
  test('assumptions.ts SECTION_CUES has numbers + image + divider + logos + case-study + contact-form', () => {
    expect(existsSync(ASSUMPTIONS)).toBe(true)
    const txt = readFileSync(ASSUMPTIONS, 'utf8')
    // Find the SECTION_CUES block and verify entries inside it
    expect(txt).toMatch(/SECTION_CUES[\s\S]+?numbers:/)
    expect(txt).toMatch(/SECTION_CUES[\s\S]+?image:/)
    expect(txt).toMatch(/SECTION_CUES[\s\S]+?divider:/)
    expect(txt).toMatch(/SECTION_CUES[\s\S]+?logos:/)
    expect(txt).toMatch(/'case-study':/)
    expect(txt).toMatch(/'contact-form':/)
  })
})

test.describe('P117.7 — validateSectionType aliases for case study + contact form', () => {
  test('section.ts alias map includes case study + contact form', () => {
    expect(existsSync(SECTION_SCHEMA)).toBe(true)
    const txt = readFileSync(SECTION_SCHEMA, 'utf8')
    expect(txt).toMatch(/'case study'/)
    expect(txt).toMatch(/'contact form'/)
  })
})

test.describe('P117.8 — EOP triplet at phase-117', () => {
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

test.describe('P117.9 — 3 audit docs landed at docs/audit/', () => {
  for (const doc of AUDIT_DOCS) {
    test(`${doc.split('/').pop()} exists`, () => {
      expect(existsSync(doc)).toBe(true)
    })
  }
})

test.describe('P117.10 — KISS no-new-deps', () => {
  test('package.json forbids new animation/scaffolding deps', () => {
    const pkg = JSON.parse(readFileSync(PACKAGE_JSON, 'utf8'))
    const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) }
    // framer-motion + jszip are pre-existing baseline deps per P105.7 + P106.9
    // + P110.15 + P111.10 + P116.9 precedent (deps NOT pre-existing in baseline only).
    const denylist = [
      'gsap',
      'lottie-web',
      '@react-spring/parallax',
      'animejs',
      'archiver',
      'fs-extra',
      '@supabase/supabase-js',
    ]
    for (const dep of denylist) {
      expect(deps[dep]).toBeUndefined()
    }
  })
})
