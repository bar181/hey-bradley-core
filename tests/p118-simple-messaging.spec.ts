/**
 * P118 / SIMPLE-MESSAGING-AND-POSITIONING — Wave 3 / Closer.
 *
 * Verifies Wave 1 audit + Wave 2 fixes (F1 Welcome reframe + useReveal +
 * MarketingNav simplify; F2 3 new blog posts; F3 About/OpenCore/Blog/Research
 * polish) close the 5 ADR-146 decisions:
 *   D1 Welcome H1 lock "Describe it. See it."
 *   D2 No numbers / no competitor names / no jargon on public pages
 *   D3 Two-track audience surface (MarketingNav + OpenCore consumer-track entry)
 *   D4 CSS-only animation via useReveal; no new dependencies
 *   D5 Easter-egg surface to bar181/aisp-open-core
 *
 * Pattern follows tests/p117-section-capability.spec.ts. Hard-gate on ADR-146
 * file shape + EOP triplet + KISS no-new-deps. existsSync soft-pass guards on
 * Wave-2 surfaces; HARD when present.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

const ADR_146 = join(ROOT, 'docs/adr/ADR-146-simple-messaging-positioning.md')
const WELCOME = join(ROOT, 'src/pages/Welcome.tsx')
const USE_REVEAL = join(ROOT, 'src/hooks/useReveal.ts')
const MARKETING_NAV = join(ROOT, 'src/components/MarketingNav.tsx')
const OPENCORE = join(ROOT, 'src/pages/OpenCore.tsx')
const RESEARCH = join(ROOT, 'src/pages/Research.tsx')
const PHASE_DIR = join(ROOT, 'plans/implementation/phase-118')
const PACKAGE_JSON = join(ROOT, 'package.json')
const AUDIT_DOC = join(ROOT, 'docs/audit/p118-public-pages-inventory.md')

const NEW_POSTS = [
  'src/pages/blog/posts/describe-it-see-it.md',
  'src/pages/blog/posts/why-we-built-this-the-honest-version.md',
  'src/pages/blog/posts/the-handoff-that-changes-everything.md',
].map((p) => join(ROOT, p))

const STORYTELLING_PRESETS = [
  'don-miller-storybrand',
  'theron-miller-hard-twist',
  'founder-direct',
  'academic-rigor',
  'dry-humor-narrator',
  'beers-and-pizza-casual',
  'investigative-deep-dive',
  'contrarian-tech',
]

const WALKTHROUGH_DOCS = [
  'plans/implementation/phase-118/walkthrough/concept-draft.html',
  'plans/implementation/phase-118/walkthrough/walkthrough-simplified-plan.md',
].map((p) => join(ROOT, p))

test.describe('P118.1 — ADR-146 file shape', () => {
  test('ADR-146 exists with Status: Accepted', () => {
    expect(existsSync(ADR_146)).toBe(true)
    const txt = readFileSync(ADR_146, 'utf8')
    expect(/Status:\s*\*?\*?\s*Accepted/i.test(txt)).toBe(true)
  })

  test('ADR-146 LOC ≤ 120', () => {
    const txt = readFileSync(ADR_146, 'utf8')
    const loc = txt.split('\n').length
    expect(loc).toBeLessThanOrEqual(120)
  })

  test('ADR-146 cross-refs ≥5 primary ADRs (ADR-090/091/094/141/144)', () => {
    const txt = readFileSync(ADR_146, 'utf8')
    expect(txt).toContain('ADR-090')
    expect(txt).toContain('ADR-091')
    expect(txt).toContain('ADR-094')
    expect(txt).toContain('ADR-141')
    expect(txt).toContain('ADR-144')
  })
})

test.describe('P118.2 — Welcome H1 lock (D1)', () => {
  test('Welcome.tsx contains literal "Describe it. See it."', () => {
    if (!existsSync(WELCOME)) return test.skip()
    const txt = readFileSync(WELCOME, 'utf8')
    expect(txt).toContain('Describe it. See it.')
  })

  test('Welcome.tsx no longer carries old engineer-first framing', () => {
    if (!existsSync(WELCOME)) return test.skip()
    const txt = readFileSync(WELCOME, 'utf8')
    // Strip line + block comments — D1 scope is body/JSX text, not header notes
    // documenting the reframe history.
    const body = txt
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/[^\n]*\n/g, '\n')
    expect(body).not.toContain('Messy ideas')
    expect(body).not.toContain('Spec workbench')
    expect(/AISP-powered/i.test(body)).toBe(false)
  })
})

test.describe('P118.3 — useReveal hook (D4)', () => {
  test('useReveal.ts exists and exports useReveal', () => {
    expect(existsSync(USE_REVEAL)).toBe(true)
    const txt = readFileSync(USE_REVEAL, 'utf8')
    expect(/export\s+function\s+useReveal/.test(txt)).toBe(true)
  })

  test('useReveal references IntersectionObserver AND prefers-reduced-motion', () => {
    if (!existsSync(USE_REVEAL)) return test.skip()
    const txt = readFileSync(USE_REVEAL, 'utf8')
    expect(txt).toContain('IntersectionObserver')
    expect(txt).toContain('prefers-reduced-motion')
  })
})

test.describe('P118.4 — Welcome no-numbers / no-competitor / no-jargon rule (D2)', () => {
  test('Welcome.tsx has zero stat-shaped numbers (tests/ADRs/atoms/etc)', () => {
    if (!existsSync(WELCOME)) return test.skip()
    const txt = readFileSync(WELCOME, 'utf8')
    // Stat-shaped: e.g. "1659+ tests", "136 ADRs", "64 examples", "21 themes"
    const statRegex = /~?\d+\+?\s*(tests|ADRs?|examples|images|themes|sections|atoms|phases|patches|projects)/gi
    const hits = txt.match(statRegex) || []
    expect(hits).toHaveLength(0)
  })

  test('Welcome.tsx has zero percentage figures in body copy', () => {
    if (!existsSync(WELCOME)) return test.skip()
    const txt = readFileSync(WELCOME, 'utf8')
    // Strip line/block comments + template literals (CSS keyframes use `100%`,
    // `60%` etc as animation values, not stat percentages — D2 scope is body
    // copy, not @keyframes).
    const body = txt
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/[^\n]*\n/g, '\n')
      .replace(/`[\s\S]*?`/g, '')
    const pctRegex = /\b\d+%/g
    const hits = body.match(pctRegex) || []
    expect(hits).toHaveLength(0)
  })

  test('Welcome.tsx has zero competitor names', () => {
    if (!existsSync(WELCOME)) return test.skip()
    const txt = readFileSync(WELCOME, 'utf8')
    const compRegex = /\b(Lovable|WordPress|Wix|Cursor|Copilot|Windsurf|Codex|Devin|v0|Squarespace|Webflow)\b/g
    const hits = txt.match(compRegex) || []
    expect(hits).toHaveLength(0)
  })

  test('Welcome.tsx body has zero AISP/DDD jargon', () => {
    if (!existsSync(WELCOME)) return test.skip()
    const txt = readFileSync(WELCOME, 'utf8')
    // Strip code-comment block at top — D2 scope is body/JSX text.
    const body = txt.replace(/\/\/[^\n]*\n/g, '\n')
    expect(/\bAISP\b/.test(body)).toBe(false)
    expect(/Crystal Atom/.test(body)).toBe(false)
    expect(/CLAUDE\.md/.test(body)).toBe(false)
    expect(/JSON.?patch/i.test(body)).toBe(false)
    expect(/\bDDD\b/.test(body)).toBe(false)
  })
})

test.describe('P118.5 — Three new blog posts exist with voice frontmatter (D2 relocation)', () => {
  for (const post of NEW_POSTS) {
    test(`${post.split('/').pop()} exists with storytelling-preset voice`, () => {
      expect(existsSync(post)).toBe(true)
      const txt = readFileSync(post, 'utf8')
      expect(/^voice:\s*"?([a-z0-9-]+)"?/m.test(txt)).toBe(true)
      const match = txt.match(/^voice:\s*"?([a-z0-9-]+)"?/m)
      expect(match).not.toBeNull()
      if (match) expect(STORYTELLING_PRESETS).toContain(match[1])
    })
  }
})

test.describe('P118.6 — Blog post 1 carries comparison table (D2 relocation)', () => {
  test('describe-it-see-it.md mentions WordPress (table relocated from Welcome)', () => {
    const path = join(ROOT, 'src/pages/blog/posts/describe-it-see-it.md')
    if (!existsSync(path)) return test.skip()
    const txt = readFileSync(path, 'utf8')
    expect(txt).toContain('WordPress')
  })
})

test.describe('P118.7 — Blog post 3 has no explicit cost multipliers (F2 brief)', () => {
  test('the-handoff-that-changes-everything.md has zero "10x"/"100x"/"10×" hits', () => {
    const path = join(ROOT, 'src/pages/blog/posts/the-handoff-that-changes-everything.md')
    if (!existsSync(path)) return test.skip()
    const txt = readFileSync(path, 'utf8')
    const multRegex = /\b(10x|100x|10×|100×|10-100×|10-100x)\b/g
    const hits = txt.match(multRegex) || []
    expect(hits).toHaveLength(0)
  })
})

test.describe('P118.8 — OpenCore consumer-track entry (D3)', () => {
  test('OpenCore.tsx has "For everyone else, start here" link to /', () => {
    if (!existsSync(OPENCORE)) return test.skip()
    const txt = readFileSync(OPENCORE, 'utf8')
    expect(txt).toContain('For everyone else, start here')
    // Verify a Link or <a tag points at "/" within reasonable proximity.
    const idx = txt.indexOf('For everyone else, start here')
    const window = txt.slice(Math.max(0, idx - 400), idx + 200)
    expect(/(<Link|<a)\s[^>]*\b(to|href)=["']\/["']/.test(window)).toBe(true)
  })
})

test.describe('P118.9 — Research Easter-egg ribbon (D5)', () => {
  test('Research.tsx points at bar181/aisp-open-core with "Read what\'s coming next" copy', () => {
    if (!existsSync(RESEARCH)) return test.skip()
    const txt = readFileSync(RESEARCH, 'utf8')
    expect(txt).toContain('bar181/aisp-open-core')
    expect(txt).toContain('Read what')
    expect(/coming next/i.test(txt)).toBe(true)
  })
})

test.describe('P118.10 — MarketingNav simplified (D3)', () => {
  test('MarketingNav exposes consumer-track + engineer-track entries', () => {
    if (!existsSync(MARKETING_NAV)) return test.skip()
    const txt = readFileSync(MARKETING_NAV, 'utf8')
    expect(txt).toContain("'/about'")
    expect(txt).toContain("'/blog'")
    expect(txt).toContain("'/research'")
    expect(txt).toContain("'/open-core'")
    expect(txt).toContain("'/docs'")
  })

  test('MarketingNav demotes Listen/Chat demo + standalone AISP from primary nav', () => {
    if (!existsSync(MARKETING_NAV)) return test.skip()
    const txt = readFileSync(MARKETING_NAV, 'utf8')
    // Primary-nav slot is the NAV_LINKS array. Inspect just that block.
    const navMatch = txt.match(/NAV_LINKS\s*=\s*\[[\s\S]*?\]/)
    expect(navMatch).not.toBeNull()
    if (navMatch) {
      const navBlock = navMatch[0]
      expect(/Listen demo/i.test(navBlock)).toBe(false)
      expect(/Chat demo/i.test(navBlock)).toBe(false)
      // Standalone "/aisp" entry should not be in primary nav.
      expect(/['"]\/aisp['"]/.test(navBlock)).toBe(false)
    }
  })
})

test.describe('P118.11 — EOP triplet at phase root', () => {
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

test.describe('P118.12 — Audit doc landed', () => {
  test('p118-public-pages-inventory.md exists', () => {
    expect(existsSync(AUDIT_DOC)).toBe(true)
  })
})

test.describe('P118.13 — Walkthrough planning preserved (P118.5 deferral)', () => {
  for (const doc of WALKTHROUGH_DOCS) {
    test(`${doc.split('/').pop()} exists`, () => {
      expect(existsSync(doc)).toBe(true)
    })
  }
})

test.describe('P118.14 — KISS no-new-deps boundary check (D4)', () => {
  test('package.json has zero entries from animation-lib denylist (scoped to non-baseline deps)', () => {
    if (!existsSync(PACKAGE_JSON)) return test.skip()
    const pkg = JSON.parse(readFileSync(PACKAGE_JSON, 'utf8'))
    const all = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) }
    // KISS denylist scoped to deps NOT pre-existing in baseline per P105.7 +
    // P106.9 + P110.15 + P111.10 + P116 precedent — `framer-motion` is
    // pre-existing in package.json baseline so dropped from this denylist.
    const denylist = [
      'gsap',
      'lottie-web',
      '@react-spring/parallax',
      'animejs',
      'react-spring',
      '@react-spring/web',
      '@react-spring/core',
    ]
    for (const dep of denylist) {
      expect(all[dep]).toBeUndefined()
    }
  })
})
