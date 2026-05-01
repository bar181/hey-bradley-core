/**
 * P68 / OC-4 Templates Round 2 — 11 new templates + ADR-096 + visual-style filter.
 * PURE-UNIT: FS reads + JSON.parse + key/regex asserts. NO browser bootstrap.
 * Pattern follows tests/p64-oc3-templates-round1.spec.ts.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const EXAMPLES_DIR = join(ROOT, 'src/data/examples')
const REGISTRY = join(EXAMPLES_DIR, 'index.ts')
const PICKER = join(ROOT, 'src/components/shell/TemplateBrowsePicker.tsx')
const ADR = join(ROOT, 'docs/adr/ADR-096-template-library-expansion.md')

// ── 11 new templates (slug → path) ──
const NEW_SLUGS = [
  // A1 — Healthcare/Wellness
  'clinic',
  'wellness-coach',
  'mental-health-practice',
  'telehealth',
  // A2 — Creator/Personal Brand
  'founder-story',
  'creator-youtuber',
  'speaker',
  'researcher-academic',
  // A3 — Dev Tools/OSS
  'cli-tool',
  'oss-library',
  'api-docs-landing',
] as const

const NEW_PATHS = NEW_SLUGS.map((s) => join(EXAMPLES_DIR, `${s}.json`))
const DEV_TOOLS_PATHS = [
  join(EXAMPLES_DIR, 'cli-tool.json'),
  join(EXAMPLES_DIR, 'oss-library.json'),
  join(EXAMPLES_DIR, 'api-docs-landing.json'),
]

const ALLOWED_FONTS = ['Inter', 'Fraunces', 'JetBrains Mono', 'Playfair Display', 'Inter Display']
const LOREM_PATTERNS = [/\blorem\b/i, /\bipsum\b/i, /\bdolor sit amet\b/i]

type Section = {
  type: string
  layout?: Record<string, unknown>
  style?: Record<string, unknown>
  copy?: Record<string, unknown>
  content?: Record<string, unknown>
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

// ─────────────────────────────────────────────────────────────────────────
// P68.1 — ADR-096 file shape
// ─────────────────────────────────────────────────────────────────────────
test.describe('P68.1 ADR-096 file shape', () => {
  test('ADR-096 file exists', () => {
    expect(existsSync(ADR)).toBe(true)
  })
  test('ADR-096 is Accepted, dated, P68/OC-4 phase', () => {
    const src = readFileSync(ADR, 'utf8')
    expect(src).toMatch(/\*\*Status:\*\*\s+Accepted/)
    expect(src).toMatch(/\*\*Phase:\*\*\s+P68/)
    expect(src).toMatch(/OC-4/)
  })
  test('ADR-096 ≤120 LOC', () => {
    const lines = readFileSync(ADR, 'utf8').split(/\r?\n/).length
    expect(lines).toBeLessThanOrEqual(120)
  })
  test('ADR-096 cross-refs ADR-079 + ADR-091 + ADR-087 + ADR-095', () => {
    const src = readFileSync(ADR, 'utf8')
    expect(src).toMatch(/ADR-079/)
    expect(src).toMatch(/ADR-091/)
    expect(src).toMatch(/ADR-087/)
    expect(src).toMatch(/ADR-095/)
  })
})

// ─────────────────────────────────────────────────────────────────────────
// P68.2 — All 11 new template files exist
// ─────────────────────────────────────────────────────────────────────────
test.describe('P68.2 all 11 new template files exist on disk', () => {
  for (const p of NEW_PATHS) {
    test(`${p.split('/').pop()} exists`, () => {
      expect(existsSync(p)).toBe(true)
    })
  }
})

// ─────────────────────────────────────────────────────────────────────────
// P68.3 — Registry imports + EXAMPLE_SITES entries for all 11
// ─────────────────────────────────────────────────────────────────────────
test.describe('P68.3 registry — 11 imports + 11 EXAMPLE_SITES entries', () => {
  test('index.ts imports all 11 new JSON files', () => {
    const src = readFileSync(REGISTRY, 'utf8')
    expect(src).toMatch(/from\s+['"]\.\/clinic\.json['"]/)
    expect(src).toMatch(/from\s+['"]\.\/wellness-coach\.json['"]/)
    expect(src).toMatch(/from\s+['"]\.\/mental-health-practice\.json['"]/)
    expect(src).toMatch(/from\s+['"]\.\/telehealth\.json['"]/)
    expect(src).toMatch(/from\s+['"]\.\/founder-story\.json['"]/)
    expect(src).toMatch(/from\s+['"]\.\/creator-youtuber\.json['"]/)
    expect(src).toMatch(/from\s+['"]\.\/speaker\.json['"]/)
    expect(src).toMatch(/from\s+['"]\.\/researcher-academic\.json['"]/)
    expect(src).toMatch(/from\s+['"]\.\/cli-tool\.json['"]/)
    expect(src).toMatch(/from\s+['"]\.\/oss-library\.json['"]/)
    expect(src).toMatch(/from\s+['"]\.\/api-docs-landing\.json['"]/)
  })
  test('index.ts EXAMPLE_SITES references all 11 imported configs', () => {
    const src = readFileSync(REGISTRY, 'utf8')
    expect(src).toMatch(/config:\s*clinic\b/)
    expect(src).toMatch(/config:\s*wellnessCoach\b/)
    expect(src).toMatch(/config:\s*mentalHealthPractice\b/)
    expect(src).toMatch(/config:\s*telehealth\b/)
    expect(src).toMatch(/config:\s*founderStory\b/)
    expect(src).toMatch(/config:\s*creatorYoutuber\b/)
    expect(src).toMatch(/config:\s*speaker\b/)
    expect(src).toMatch(/config:\s*researcherAcademic\b/)
    expect(src).toMatch(/config:\s*cliTool\b/)
    expect(src).toMatch(/config:\s*ossLibrary\b/)
    expect(src).toMatch(/config:\s*apiDocsLanding\b/)
  })
})

// ─────────────────────────────────────────────────────────────────────────
// P68.4 — Hero padding 80px 24px for all 11
// ─────────────────────────────────────────────────────────────────────────
test.describe('P68.4 hero padding 80px 24px (per OC-1 / ADR-096 §2)', () => {
  for (const p of NEW_PATHS) {
    test(`${p.split('/').pop()} hero layout.padding === "80px 24px"`, () => {
      const cfg = loadConfig(p)
      const hero = getHero(cfg)
      expect(hero, `hero section missing in ${p}`).toBeDefined()
      expect(hero?.layout?.padding).toBe('80px 24px')
    })
  }
})

// ─────────────────────────────────────────────────────────────────────────
// P68.5 — Hero style ONLY background + color (no extras)
// ─────────────────────────────────────────────────────────────────────────
test.describe('P68.5 hero style block restricted to background + color', () => {
  for (const p of NEW_PATHS) {
    test(`${p.split('/').pop()} hero style has only allowed keys`, () => {
      const cfg = loadConfig(p)
      const hero = getHero(cfg)
      expect(hero).toBeDefined()
      const style = hero?.style ?? {}
      const keys = Object.keys(style).sort()
      // Allow either {background,color} or a subset thereof; never extras.
      const allowed = new Set(['background', 'color'])
      for (const k of keys) {
        expect(allowed.has(k), `unexpected hero.style key "${k}" in ${p}`).toBe(true)
      }
      // Must not contain forbidden overrides that bypass theme contract.
      expect(style).not.toHaveProperty('fontFamily')
      expect(style).not.toHaveProperty('borderRadius')
    })
  }
})

// ─────────────────────────────────────────────────────────────────────────
// P68.6 — No system-ui anywhere
// ─────────────────────────────────────────────────────────────────────────
test.describe('P68.6 no system-ui references', () => {
  for (const p of NEW_PATHS) {
    test(`${p.split('/').pop()} contains no system-ui`, () => {
      const src = readFileSync(p, 'utf8')
      expect(src).not.toMatch(/system-ui/)
    })
  }
})

// ─────────────────────────────────────────────────────────────────────────
// P68.7 — Established font families only
// ─────────────────────────────────────────────────────────────────────────
test.describe('P68.7 established font families only (Inter / Fraunces / JetBrains Mono / Playfair Display)', () => {
  for (const p of NEW_PATHS) {
    test(`${p.split('/').pop()} uses an allowed fontFamily + headingFamily`, () => {
      const cfg = loadConfig(p)
      const fontFamily = cfg.theme?.typography?.fontFamily ?? ''
      const headingFamily = cfg.theme?.typography?.headingFamily ?? ''
      expect(ALLOWED_FONTS).toContain(fontFamily)
      expect(ALLOWED_FONTS).toContain(headingFamily)
    })
  }
})

// ─────────────────────────────────────────────────────────────────────────
// P68.8 — Distinct primary backgrounds across the 11
// ─────────────────────────────────────────────────────────────────────────
test.describe('P68.8 distinct primary background colors across the 11 new templates', () => {
  test('≥10 unique bgPrimary values (allows at most one accidental dupe)', () => {
    const bgs = NEW_PATHS.map((p) => loadConfig(p).theme?.palette?.bgPrimary ?? '')
    expect(bgs.every((b) => b.length > 0), 'every template must declare bgPrimary').toBe(true)
    const unique = new Set(bgs)
    expect(unique.size).toBeGreaterThanOrEqual(10)
  })
  test('no Lorem placeholder copy in any of the 11 new templates', () => {
    for (const p of NEW_PATHS) {
      const src = readFileSync(p, 'utf8')
      for (const re of LOREM_PATTERNS) {
        expect(src, `${p} contains Lorem placeholder copy`).not.toMatch(re)
      }
    }
  })
})

// ─────────────────────────────────────────────────────────────────────────
// P68.9 — Dev-tools subset references AISP / spec-driven / ambiguity
// ─────────────────────────────────────────────────────────────────────────
test.describe('P68.9 dev-tools subset (cli-tool / oss-library / api-docs-landing) references AISP / spec-driven / ambiguity', () => {
  for (const p of DEV_TOOLS_PATHS) {
    test(`${p.split('/').pop()} mentions AISP or spec-driven or ambiguity`, () => {
      const src = readFileSync(p, 'utf8').toLowerCase()
      const hasAISP = src.includes('aisp')
      const hasSpec = src.includes('spec-driven') || src.includes('spec driven') || src.includes('spec-first') || src.includes('spec first')
      const hasAmbiguity = src.includes('ambiguity') || src.includes('ambiguous')
      expect(hasAISP || hasSpec || hasAmbiguity, `${p} should reference AISP, spec-driven, or ambiguity`).toBe(true)
    })
  }
})

// ─────────────────────────────────────────────────────────────────────────
// P68.10 — TemplateBrowsePicker visual-style filter shipped
// ─────────────────────────────────────────────────────────────────────────
test.describe('P68.10 TemplateBrowsePicker visual-style filter', () => {
  test('picker file contains data-testid="filter-visual-style-"', () => {
    const src = readFileSync(PICKER, 'utf8')
    expect(src).toContain('data-testid={`filter-visual-style-${opt}`}')
  })
  test('picker exposes Warm/serif + Tech/dark + Modern/Inter visual-style options', () => {
    const src = readFileSync(PICKER, 'utf8')
    expect(src).toContain("'Warm/serif'")
    expect(src).toContain("'Tech/dark'")
    expect(src).toContain("'Modern/Inter'")
  })
  test('clearFilters resets visualStyle alongside persona/industry/complexity', () => {
    const src = readFileSync(PICKER, 'utf8')
    expect(src).toMatch(/setVisualStyle\(['"]All['"]\)/)
  })
})

// ─────────────────────────────────────────────────────────────────────────
// P68.11 — Library count ≥37
// ─────────────────────────────────────────────────────────────────────────
test.describe('P68.11 library count', () => {
  test('EXAMPLE_SITES contains ≥37 template entries', () => {
    const src = readFileSync(REGISTRY, 'utf8')
    // Count "config:" occurrences inside EXAMPLE_SITES — one per registered entry.
    const matches = src.match(/^\s*config:\s/gm) ?? []
    expect(matches.length).toBeGreaterThanOrEqual(37)
  })
})
