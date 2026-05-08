/**
 * P64 / OC-3 Templates Round 1 — coffee-roaster + dev-conference + podcast-show.
 * PURE-UNIT: FS reads + JSON.parse + key/regex asserts. NO browser bootstrap.
 * Pattern follows tests/p62-oc1-design-tokens.spec.ts.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const EXAMPLES_DIR = join(ROOT, 'src/data/examples')
const COFFEE = join(EXAMPLES_DIR, 'coffee-roaster.json')
const CONF = join(EXAMPLES_DIR, 'dev-conference.json')
const PODCAST = join(EXAMPLES_DIR, 'podcast-show.json')
const REGISTRY = join(EXAMPLES_DIR, 'index.ts')

type Section = {
  type: string
  layout?: Record<string, unknown>
  style?: Record<string, unknown>
}
type Config = {
  site?: Record<string, unknown>
  theme?: { typography?: { fontFamily?: string; headingFamily?: string }; palette?: { bgPrimary?: string } }
  sections: Section[]
}

function loadConfig(p: string): Config {
  return JSON.parse(readFileSync(p, 'utf8')) as Config
}

function getHero(cfg: Config): Section | undefined {
  return cfg.sections.find((s) => s.type === 'hero')
}

const ALLOWED_FONTS = ['Inter', 'Fraunces', 'JetBrains Mono', 'Playfair Display', 'Inter Display']
const LOREM_PATTERNS = [/\blorem\b/i, /\bipsum\b/i, /\bdolor sit amet\b/i]

function assertNoLorem(p: string) {
  const src = readFileSync(p, 'utf8')
  for (const re of LOREM_PATTERNS) {
    expect(src).not.toMatch(re)
  }
}

function assertTemplateShape(p: string) {
  expect(existsSync(p)).toBe(true)
  const cfg = loadConfig(p)
  expect(cfg.site).toBeDefined()
  expect(cfg.theme).toBeDefined()
  expect(Array.isArray(cfg.sections)).toBe(true)
  expect(cfg.sections.length).toBeGreaterThanOrEqual(6)
  const hero = getHero(cfg)
  expect(hero).toBeDefined()
  expect(hero?.layout?.padding).toBe('80px 24px')
}

test.describe('P64.1 coffee-roaster.json — shape, sections, hero discipline, real copy', () => {
  test('file exists with site/theme/sections, hero padding 80px 24px, ≥6 sections', () => {
    assertTemplateShape(COFFEE)
  })
  test('no Lorem placeholder copy anywhere in coffee-roaster.json', () => {
    assertNoLorem(COFFEE)
  })
  test('coffee-roaster uses Fraunces serif and warm earth bg #3e2723', () => {
    const cfg = loadConfig(COFFEE)
    expect(cfg.theme?.typography?.fontFamily).toBe('Fraunces')
    expect(cfg.theme?.palette?.bgPrimary).toBe('#3e2723')
  })
})

test.describe('P64.2 dev-conference.json — shape, sections, hero discipline, real copy', () => {
  test('file exists with site/theme/sections, hero padding 80px 24px, ≥6 sections', () => {
    assertTemplateShape(CONF)
  })
  test('no Lorem placeholder copy anywhere in dev-conference.json', () => {
    assertNoLorem(CONF)
  })
  test('dev-conference uses JetBrains Mono headings and dark bg #09090b', () => {
    const cfg = loadConfig(CONF)
    expect(cfg.theme?.typography?.headingFamily).toBe('JetBrains Mono')
    expect(cfg.theme?.palette?.bgPrimary).toBe('#09090b')
  })
})

test.describe('P64.3 podcast-show.json — shape, sections, hero discipline, real copy', () => {
  test('file exists with site/theme/sections, hero padding 80px 24px, ≥6 sections', () => {
    assertTemplateShape(PODCAST)
  })
  test('no Lorem placeholder copy anywhere in podcast-show.json', () => {
    assertNoLorem(PODCAST)
  })
  test('podcast-show uses Inter family and deep purple bg #1e1b4b', () => {
    const cfg = loadConfig(PODCAST)
    expect(cfg.theme?.typography?.fontFamily).toBe('Inter')
    expect(cfg.theme?.palette?.bgPrimary).toBe('#1e1b4b')
  })
})

test.describe('P64.4 registry — all 3 new templates imported and registered', () => {
  test('index.ts imports the three new JSON files', () => {
    const src = readFileSync(REGISTRY, 'utf8')
    expect(src).toMatch(/import\s+coffeeRoaster\s+from\s+['"]\.\/coffee-roaster\.json['"]/)
    expect(src).toMatch(/import\s+devConference\s+from\s+['"]\.\/dev-conference\.json['"]/)
    expect(src).toMatch(/import\s+podcastShow\s+from\s+['"]\.\/podcast-show\.json['"]/)
  })
  test('index.ts EXAMPLE_SITES contains entries for all three templates', () => {
    const src = readFileSync(REGISTRY, 'utf8')
    expect(src).toContain('Beanstalk Coffee Co.')
    expect(src).toContain('ShipFast Conf 2026')
    expect(src).toContain('Build Mode')
    expect(src).toMatch(/config:\s*coffeeRoaster\b/)
    expect(src).toMatch(/config:\s*devConference\b/)
    expect(src).toMatch(/config:\s*podcastShow\b/)
  })
})

test.describe('P64.5 design discipline — no system-ui, established font families only', () => {
  test('none of the three templates reference system-ui anywhere', () => {
    for (const p of [COFFEE, CONF, PODCAST]) {
      const src = readFileSync(p, 'utf8')
      expect(src).not.toMatch(/system-ui/)
    }
  })
  test('each template uses one of the established font families for fontFamily and headingFamily', () => {
    for (const p of [COFFEE, CONF, PODCAST]) {
      const cfg = loadConfig(p)
      const fontFamily = cfg.theme?.typography?.fontFamily ?? ''
      const headingFamily = cfg.theme?.typography?.headingFamily ?? ''
      expect(ALLOWED_FONTS).toContain(fontFamily)
      expect(ALLOWED_FONTS).toContain(headingFamily)
    }
  })
})

test.describe('P64.6 vertical distinctness — three distinct primary background colors', () => {
  test('coffee/conference/podcast all use distinct bgPrimary palette colors', () => {
    const coffee = loadConfig(COFFEE).theme?.palette?.bgPrimary
    const conf = loadConfig(CONF).theme?.palette?.bgPrimary
    const podcast = loadConfig(PODCAST).theme?.palette?.bgPrimary
    const set = new Set([coffee, conf, podcast])
    expect(set.size).toBe(3)
  })
})
