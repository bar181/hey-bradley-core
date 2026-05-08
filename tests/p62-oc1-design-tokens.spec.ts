/**
 * P62 / OC-1 Visual Polish Floor — design-token discipline spec.
 * PURE-UNIT: FS reads + JSON.parse + regex/string asserts. NO browser bootstrap.
 * Pattern follows tests/p60-flagship.spec.ts.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const AUDIT = join(ROOT, 'plans/implementation/phase-62/02-visual-polish-audit.md')
const EXAMPLES_DIR = join(ROOT, 'src/data/examples')
const CAPSTONE = join(EXAMPLES_DIR, 'capstone.json')
const ENTERPRISE = join(EXAMPLES_DIR, 'enterprise-saas.json')
const REAL_ESTATE = join(EXAMPLES_DIR, 'real-estate.json')

type Section = {
  type: string
  layout?: Record<string, unknown>
  style?: Record<string, unknown>
}
type Config = { sections: Section[] }

function loadConfig(p: string): Config {
  return JSON.parse(readFileSync(p, 'utf8')) as Config
}

function getHero(cfg: Config): Section | undefined {
  return cfg.sections.find((s) => s.type === 'hero')
}

test.describe('P62.1 audit doc — file shape + required section headings', () => {
  test('audit doc exists and is ≤120 LOC', () => {
    expect(existsSync(AUDIT)).toBe(true)
    const src = readFileSync(AUDIT, 'utf8')
    const loc = src.split('\n').length
    expect(loc).toBeLessThanOrEqual(120)
  })
  test('audit doc enumerates color / typography / spacing sections + top 3', () => {
    const src = readFileSync(AUDIT, 'utf8')
    expect(src).toMatch(/##\s+Color discipline/i)
    expect(src).toMatch(/##\s+Typography discipline/i)
    expect(src).toMatch(/##\s+Spacing rhythm/i)
    expect(src).toMatch(/##\s+Top 3 visually-weakest templates/i)
    // Top 3 names must appear in the targets section
    expect(src).toContain('capstone.json')
    expect(src).toContain('enterprise-saas.json')
    expect(src).toContain('real-estate.json')
  })
})

test.describe('P62.2 capstone.json — hero padding standardized to 80px 24px', () => {
  test('hero padding is 80px 24px (was 100px 24px)', () => {
    const hero = getHero(loadConfig(CAPSTONE))
    expect(hero).toBeDefined()
    expect(hero?.layout?.padding).toBe('80px 24px')
  })
  test('hero style no longer carries redundant fontFamily / borderRadius', () => {
    const hero = getHero(loadConfig(CAPSTONE))
    expect(hero?.style).toBeDefined()
    expect(hero?.style?.fontFamily).toBeUndefined()
    expect(hero?.style?.borderRadius).toBeUndefined()
  })
})

test.describe('P62.3 enterprise-saas.json — hero padding standardized to 80px 24px', () => {
  test('hero padding is 80px 24px (was 96px 24px)', () => {
    const hero = getHero(loadConfig(ENTERPRISE))
    expect(hero).toBeDefined()
    expect(hero?.layout?.padding).toBe('80px 24px')
  })
  test('hero style no longer carries redundant fontFamily / borderRadius', () => {
    const hero = getHero(loadConfig(ENTERPRISE))
    expect(hero?.style).toBeDefined()
    expect(hero?.style?.fontFamily).toBeUndefined()
    expect(hero?.style?.borderRadius).toBeUndefined()
  })
})

test.describe('P62.4 real-estate.json — typography discipline pass', () => {
  test('hero padding remains at 80px 24px (was already aligned)', () => {
    const hero = getHero(loadConfig(REAL_ESTATE))
    expect(hero).toBeDefined()
    expect(hero?.layout?.padding).toBe('80px 24px')
  })
  test('hero style no longer carries redundant fontFamily / borderRadius', () => {
    const hero = getHero(loadConfig(REAL_ESTATE))
    expect(hero?.style).toBeDefined()
    expect(hero?.style?.fontFamily).toBeUndefined()
    expect(hero?.style?.borderRadius).toBeUndefined()
  })
})

test.describe('P62.5 library-wide — no JSON template uses system-ui as primary font', () => {
  test('no JSON template references system-ui anywhere (no fallback chain leaks either)', () => {
    const jsonFiles = readdirSync(EXAMPLES_DIR).filter((f) => f.endsWith('.json'))
    expect(jsonFiles.length).toBeGreaterThan(0)
    const offenders: string[] = []
    for (const f of jsonFiles) {
      const src = readFileSync(join(EXAMPLES_DIR, f), 'utf8')
      // Match "system-ui" appearing as a string value (any context — primary or fallback).
      // Library has zero current uses; this asserts that floor stays in place.
      if (/"[^"]*system-ui[^"]*"/.test(src)) {
        offenders.push(f)
      }
    }
    expect(offenders).toEqual([])
  })
})

test.describe('P62.6 library-wide — improved templates have no hex drift in hero style beyond bg+color', () => {
  test('all three improved hero style blocks contain ONLY background + color keys', () => {
    for (const p of [CAPSTONE, ENTERPRISE, REAL_ESTATE]) {
      const hero = getHero(loadConfig(p))
      expect(hero?.style).toBeDefined()
      const keys = Object.keys(hero?.style ?? {}).sort()
      expect(keys).toEqual(['background', 'color'])
    }
  })
})
