/**
 * P56 Sprint M Wave 1 — Premium Templates.
 *
 * Pure-unit (FS-level reads). Mirrors P54/P55 spec docstring style.
 * NO browser bootstrap. NO aisp barrel imports. Each assertion body ≤6 lines.
 *
 * Some cases may fail until A1 (saas-founder), A2 (indie-portfolio),
 * A3 (b2b-agency), and A4 (design reference) land — those are
 * expected-failures by design and GREEN-flip on Wave 1 seal.
 *
 * ADR-079.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const SAAS = join(ROOT, 'src/data/examples/saas-founder/index.ts')
const INDIE = join(ROOT, 'src/data/examples/indie-portfolio/index.ts')
const B2B = join(ROOT, 'src/data/examples/b2b-agency/index.ts')
const REGISTRY = join(ROOT, 'src/data/examples/index.ts')
const ADR = join(ROOT, 'docs/adr/ADR-079-premium-templates.md')
const DESIGN_REF = join(ROOT, 'plans/strategic-reviews/template-design-reference-2026.md')

const HEX_RE = /#[0-9a-fA-F]{6}\b/g
// Real placeholders only. "Lorem ipsum dolor" matches the canonical filler;
// the bare phrase is permissible inside intentional prose (e.g. "allergic to
// Lorem ipsum"). Other four phrases are unambiguous templating defaults.
const PLACEHOLDER_RE = /Lorem ipsum dolor|Welcome to Your Website|Your Tagline Here|Click here|Describe what makes your business special/i
// Section IDs follow the kebab-NN convention (hero-01, features-01, navbar-01)
// which block IDs (logo, eyebrow, f1, tier-1) do NOT match.
const SECTION_ID_RE = /id:\s*['"]([a-z]+-\d+)['"]/g

test.describe('P56.1 saas-founder — file exists + exports + ≤300 LOC', () => {
  test('saas-founder/index.ts ships as a TS module under 300 LOC with an export', () => {
    expect(existsSync(SAAS)).toBe(true)
    const src = readFileSync(SAAS, 'utf8')
    expect(src.split('\n').length).toBeLessThanOrEqual(300)
    expect(/export\s+(default|const|\{)/.test(src)).toBe(true)
  })
})

test.describe('P56.2 indie-portfolio — file exists + exports + ≤300 LOC', () => {
  test('indie-portfolio/index.ts ships as a TS module under 300 LOC with an export', () => {
    expect(existsSync(INDIE)).toBe(true)
    const src = readFileSync(INDIE, 'utf8')
    expect(src.split('\n').length).toBeLessThanOrEqual(300)
    expect(/export\s+(default|const|\{)/.test(src)).toBe(true)
  })
})

test.describe('P56.3 b2b-agency — file exists + exports + ≤300 LOC', () => {
  test('b2b-agency/index.ts ships as a TS module under 300 LOC with an export', () => {
    expect(existsSync(B2B)).toBe(true)
    const src = readFileSync(B2B, 'utf8')
    expect(src.split('\n').length).toBeLessThanOrEqual(300)
    expect(/export\s+(default|const|\{)/.test(src)).toBe(true)
  })
})

test.describe('P56.4 registry — all 3 premium templates registered', () => {
  test('src/data/examples/index.ts imports + lists saas-founder, indie-portfolio, b2b-agency', () => {
    const src = readFileSync(REGISTRY, 'utf8')
    expect(src.includes('saas-founder')).toBe(true)
    expect(src.includes('indie-portfolio')).toBe(true)
    expect(src.includes('b2b-agency')).toBe(true)
  })
})

test.describe('P56.5 distinct hero color anchors — no shared primary hex', () => {
  test('first hex in each template differs across all 3', () => {
    const firstHex = (p: string) => (readFileSync(p, 'utf8').match(HEX_RE) || ['#000000'])[0].toLowerCase()
    const a = firstHex(SAAS), b = firstHex(INDIE), c = firstHex(B2B)
    expect(new Set([a, b, c]).size).toBe(3)
  })
})

test.describe('P56.6 NO placeholder copy — all 3 templates real-copy', () => {
  test('none of the placeholder strings appear in any template file', () => {
    const all = [SAAS, INDIE, B2B].map((p) => readFileSync(p, 'utf8')).join('\n')
    expect(PLACEHOLDER_RE.test(all)).toBe(false)
  })
})

test.describe('P56.7 each template has ≥6 sections', () => {
  test('every template file declares at least 6 section ids', () => {
    for (const p of [SAAS, INDIE, B2B]) {
      const ids = (readFileSync(p, 'utf8').match(SECTION_ID_RE) || [])
      expect(ids.length).toBeGreaterThanOrEqual(6)
    }
  })
})

test.describe('P56.8 unique section IDs per template', () => {
  test('Set size === array length for section ids in each file', () => {
    for (const p of [SAAS, INDIE, B2B]) {
      const ids = [...readFileSync(p, 'utf8').matchAll(SECTION_ID_RE)].map((m) => m[1])
      expect(new Set(ids).size).toBe(ids.length)
    }
  })
})

test.describe('P56.9 ADR-079 — file shape + cross-refs', () => {
  test('exists, Status: Accepted, ≤120 LOC, refs ADR-058 + ADR-073 + ADR-077', () => {
    expect(existsSync(ADR)).toBe(true)
    const src = readFileSync(ADR, 'utf8')
    expect(src).toContain('Status:** Accepted')
    expect(src.split('\n').length).toBeLessThanOrEqual(120)
    expect(src.includes('ADR-058') && src.includes('ADR-073') && src.includes('ADR-077')).toBe(true)
  })
})

test.describe('P56.10 design reference doc exists at expected path', () => {
  test('plans/strategic-reviews/template-design-reference-2026.md present', () => {
    expect(existsSync(DESIGN_REF)).toBe(true)
  })
})
