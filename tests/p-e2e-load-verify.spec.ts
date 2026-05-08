/**
 * E2E Test Sprint / A4 — Load & verify spec.
 * PURE-UNIT: FS reads + JSON.parse + regex/string asserts. NO browser bootstrap.
 *
 * E2E.1 — Both site JSONs exist + parse (4)
 * E2E.2 — EXAMPLE_SITES wired (2)
 * E2E.3 — Schema-shape sanity (4)
 * E2E.4 — Build logs landed (2)
 * E2E.5 — Brutal review doc landed (1)
 * E2E.6 — EOP triplet at seal/ (3)                                  [hard-gate; A4 owns]
 *
 * Soft-pass guards via existsSync() let A2/A3 surface slips degrade
 * to deferred (carry-forward) rather than red. Hard-gate on A4-owned
 * files (brutal-review + EOP triplet at seal/).
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

// --- A2 / A3-owned site JSONs ---
const SITE_1_JSON = join(ROOT, 'src/data/examples/aisp-executive.json')
const SITE_2_JSON = join(ROOT, 'src/data/examples/aisp-developer-retro.json')

// --- A4-owned wire ---
const EXAMPLES_INDEX = join(ROOT, 'src/data/examples/index.ts')

// --- A2 / A3-owned build logs ---
const SITE_1_LOG = join(ROOT, 'plans/implementation/phase-e2e-test/02-site-1-build-log.md')
const SITE_2_LOG = join(ROOT, 'plans/implementation/phase-e2e-test/03-site-2-build-log.md')

// --- A4-owned brutal review + EOP triplet at seal/ ---
const SEAL_DIR = 'plans/implementation/phase-e2e-test/seal'
const BRUTAL_REVIEW = join(ROOT, SEAL_DIR, '04-brutal-review.md')
const EOP_REVIEW = join(ROOT, SEAL_DIR, '02-post-review.md')
const EOP_LOG = join(ROOT, SEAL_DIR, 'session-log.md')
const EOP_RETRO = join(ROOT, SEAL_DIR, 'retrospective.md')

function read(p: string): string {
  return readFileSync(p, 'utf8')
}
function locOf(p: string): number {
  return read(p).split('\n').length
}

// ------------------------------------------------------------------
// E2E.1 — Both site JSONs exist + parse (4)
// ------------------------------------------------------------------
test.describe('E2E.1 — Both site JSONs exist + parse', () => {
  test('aisp-executive.json exists', () => {
    expect(existsSync(SITE_1_JSON)).toBe(true)
  })

  test('aisp-executive.json parses cleanly via JSON.parse', () => {
    if (!existsSync(SITE_1_JSON)) {
      test.skip(true, 'A2 surface deferred — soft-pass')
      return
    }
    const raw = read(SITE_1_JSON)
    expect(() => JSON.parse(raw)).not.toThrow()
  })

  test('aisp-developer-retro.json exists', () => {
    expect(existsSync(SITE_2_JSON)).toBe(true)
  })

  test('aisp-developer-retro.json parses cleanly via JSON.parse', () => {
    if (!existsSync(SITE_2_JSON)) {
      test.skip(true, 'A3 surface deferred — soft-pass')
      return
    }
    const raw = read(SITE_2_JSON)
    expect(() => JSON.parse(raw)).not.toThrow()
  })
})

// ------------------------------------------------------------------
// E2E.2 — EXAMPLE_SITES wired (2)
// ------------------------------------------------------------------
test.describe('E2E.2 — EXAMPLE_SITES wired', () => {
  test('index.ts source contains both aispExecutive + aispDeveloperRetro imports', () => {
    expect(existsSync(EXAMPLES_INDEX)).toBe(true)
    const src = read(EXAMPLES_INDEX)
    expect(src).toMatch(/import\s+aispExecutive\s+from\s+['"]\.\/aisp-executive\.json['"]/)
    expect(src).toMatch(/import\s+aispDeveloperRetro\s+from\s+['"]\.\/aisp-developer-retro\.json['"]/)
  })

  test('index.ts source contains both site name strings', () => {
    expect(existsSync(EXAMPLES_INDEX)).toBe(true)
    const src = read(EXAMPLES_INDEX)
    expect(src).toContain('AISP Executive Overview')
    expect(src).toContain('AISP Developer Retro')
  })
})

// ------------------------------------------------------------------
// E2E.3 — Schema-shape sanity (4)
// ------------------------------------------------------------------
test.describe('E2E.3 — Schema-shape sanity', () => {
  test('both JSONs have site, theme, sections (top-level keys present)', () => {
    if (!existsSync(SITE_1_JSON) || !existsSync(SITE_2_JSON)) {
      test.skip(true, 'A2/A3 surface deferred — soft-pass')
      return
    }
    const a = JSON.parse(read(SITE_1_JSON))
    const b = JSON.parse(read(SITE_2_JSON))
    for (const cfg of [a, b]) {
      expect(cfg).toHaveProperty('site')
      expect(cfg).toHaveProperty('theme')
      expect(cfg).toHaveProperty('sections')
      expect(Array.isArray(cfg.sections)).toBe(true)
    }
  })

  test('both JSONs have ≥6 sections in sections array', () => {
    if (!existsSync(SITE_1_JSON) || !existsSync(SITE_2_JSON)) {
      test.skip(true, 'A2/A3 surface deferred — soft-pass')
      return
    }
    const a = JSON.parse(read(SITE_1_JSON))
    const b = JSON.parse(read(SITE_2_JSON))
    expect(a.sections.length).toBeGreaterThanOrEqual(6)
    expect(b.sections.length).toBeGreaterThanOrEqual(6)
  })

  test('aisp-executive has pages array with ≥1 entry (page 2 added per prompt 6)', () => {
    if (!existsSync(SITE_1_JSON)) {
      test.skip(true, 'A2 surface deferred — soft-pass')
      return
    }
    const a = JSON.parse(read(SITE_1_JSON))
    expect(Array.isArray(a.pages)).toBe(true)
    expect(a.pages.length).toBeGreaterThanOrEqual(1)
  })

  test('aisp-developer-retro has pages array with ≥1 entry (page 2 added per prompt 5)', () => {
    if (!existsSync(SITE_2_JSON)) {
      test.skip(true, 'A3 surface deferred — soft-pass')
      return
    }
    const b = JSON.parse(read(SITE_2_JSON))
    expect(Array.isArray(b.pages)).toBe(true)
    expect(b.pages.length).toBeGreaterThanOrEqual(1)
  })
})

// ------------------------------------------------------------------
// E2E.4 — Build logs landed (2)
// ------------------------------------------------------------------
test.describe('E2E.4 — Build logs landed', () => {
  test('02-site-1-build-log.md exists; ≥80 LOC', () => {
    expect(existsSync(SITE_1_LOG)).toBe(true)
    expect(locOf(SITE_1_LOG)).toBeGreaterThanOrEqual(80)
  })

  test('03-site-2-build-log.md exists; ≥80 LOC', () => {
    expect(existsSync(SITE_2_LOG)).toBe(true)
    expect(locOf(SITE_2_LOG)).toBeGreaterThanOrEqual(80)
  })
})

// ------------------------------------------------------------------
// E2E.5 — Brutal review doc landed (1)
// ------------------------------------------------------------------
test.describe('E2E.5 — Brutal review doc landed', () => {
  test('seal/04-brutal-review.md exists', () => {
    expect(existsSync(BRUTAL_REVIEW)).toBe(true)
  })
})

// ------------------------------------------------------------------
// E2E.6 — EOP triplet at seal/ (3) [hard-gate]
// ------------------------------------------------------------------
test.describe('E2E.6 — EOP triplet at seal/', () => {
  test('02-post-review.md exists', () => {
    expect(existsSync(EOP_REVIEW)).toBe(true)
  })
  test('session-log.md exists', () => {
    expect(existsSync(EOP_LOG)).toBe(true)
  })
  test('retrospective.md exists', () => {
    expect(existsSync(EOP_RETRO)).toBe(true)
  })
})
