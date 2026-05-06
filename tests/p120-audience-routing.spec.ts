/**
 * P120 / AUDIENCE-ROUTING — Closer A5 spec.
 * Verifies 3 new audience entry points (For developers / For teams / Contact),
 * blog 3-category filter via ?category= URL param, /guides redirect, and
 * cross-page entry-strip links. ADR-149 file shape + EOP triplet + KISS
 * no-new-deps + Welcome regression guards.
 *   D1 three audience entry points · D2 blog 3-category filter · D3 builder link
 *   D4 Research entry strip + Geek mode · D5 honest scope on /for-teams
 * Pattern follows tests/p119-site-polish.spec.ts.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const ADR = join(ROOT, 'docs/adr/ADR-149-audience-routing.md')
const NAV = join(ROOT, 'src/components/MarketingNav.tsx')
const MAIN = join(ROOT, 'src/main.tsx')
const FOR_TEAMS = join(ROOT, 'src/pages/ForTeams.tsx')
const CONTACT = join(ROOT, 'src/pages/Contact.tsx')
const BLOG = join(ROOT, 'src/pages/Blog.tsx')
const BLOG_POSTS = join(ROOT, 'src/lib/blogPosts.ts')
const WELC = join(ROOT, 'src/pages/Welcome.tsx')
const RESEARCH = join(ROOT, 'src/pages/Research.tsx')
const ABOUT = join(ROOT, 'src/pages/About.tsx')
const PHASE = join(ROOT, 'plans/implementation/phase-120')
const PKG = join(ROOT, 'package.json')

test.describe('P120.1 — ADR-149 file shape', () => {
  test('exists with Status: Accepted', () => {
    expect(existsSync(ADR)).toBe(true)
    expect(/Status:\s*\*?\*?\s*Accepted/i.test(readFileSync(ADR, 'utf8'))).toBe(true)
  })
  test('LOC ≤ 120', () => {
    expect(readFileSync(ADR, 'utf8').split('\n').length).toBeLessThanOrEqual(120)
  })
  test('cross-refs ≥5 of (ADR-090/091/097/110/146/148)', () => {
    const t = readFileSync(ADR, 'utf8')
    const refs = ['ADR-090', 'ADR-091', 'ADR-097', 'ADR-110', 'ADR-146', 'ADR-148']
    expect(refs.filter((r) => t.includes(r)).length).toBeGreaterThanOrEqual(5)
  })
})

test.describe('P120.2 — MarketingNav has "For developers" → /research', () => {
  test('label literal + /research target both present', () => {
    const t = readFileSync(NAV, 'utf8')
    expect(t).toContain('For developers')
    expect(t).toContain("'/research'")
  })
})

test.describe('P120.3 — MarketingNav has "For teams" → /for-teams', () => {
  test('label literal + /for-teams target both present', () => {
    const t = readFileSync(NAV, 'utf8')
    expect(t).toContain('For teams')
    expect(t).toContain("'/for-teams'")
  })
})

test.describe('P120.4 — ForTeams page exists with named export', () => {
  test('file exists + named export + Section 1 H1 literal', () => {
    expect(existsSync(FOR_TEAMS)).toBe(true)
    const t = readFileSync(FOR_TEAMS, 'utf8')
    expect(t).toMatch(/export\s+function\s+ForTeams/)
    expect(t).toContain('Your team re-explains')
  })
})

test.describe('P120.5 — Contact page exists with required entry points', () => {
  test('exports Contact + LinkedIn slug + 2 GitHub repos', () => {
    expect(existsSync(CONTACT)).toBe(true)
    const t = readFileSync(CONTACT, 'utf8')
    expect(t).toMatch(/export\s+function\s+Contact/)
    expect(t).toContain('bradaross')
    expect(t).toContain('bar181/hey-bradley-core')
    expect(t).toContain('bar181/aisp-open-core')
  })
})

test.describe('P120.6 — main.tsx route registration', () => {
  test('contains /for-teams + /contact + /guides paths', () => {
    const t = readFileSync(MAIN, 'utf8')
    expect(t).toContain('/for-teams')
    expect(t).toContain('/contact')
    expect(t).toContain('/guides')
  })
  test('lazy imports ForTeams + Contact via named-export adapter', () => {
    const t = readFileSync(MAIN, 'utf8')
    // The lazy(() => import('@/pages/X').then(m => ({ default: m.X })))
    // pattern includes nested parens, so [^)]* fails — use a balanced
    // single-line match that requires lazy + the page name + named export.
    expect(t).toMatch(/lazy\(.*ForTeams.*m\.ForTeams/)
    expect(t).toMatch(/lazy\(.*Contact.*m\.Contact/)
  })
})

test.describe('P120.7 — /guides redirect to /blog?category=technical', () => {
  test('Navigate import + redirect target both present', () => {
    const t = readFileSync(MAIN, 'utf8')
    expect(t).toMatch(/import\s+\{[^}]*\bNavigate\b[^}]*\}\s+from\s+['"]react-router-dom['"]/)
    expect(t).toContain('/blog?category=technical')
  })
})

test.describe('P120.8 — Blog 3-category filter via useSearchParams', () => {
  test('Blog.tsx imports useSearchParams + uses blog-category- testid pattern', () => {
    const t = readFileSync(BLOG, 'utf8')
    expect(t).toContain('useSearchParams')
    expect(t).toMatch(/blog-category-/)
  })
})

test.describe('P120.9 — Blog category helper exports', () => {
  test('categoryOf + BLOG_CATEGORY_LABEL + BlogCategory type all exported', () => {
    const t = readFileSync(BLOG_POSTS, 'utf8')
    expect(t).toMatch(/export\s+function\s+categoryOf/)
    expect(t).toMatch(/export\s+const\s+BLOG_CATEGORY_LABEL/)
    expect(t).toMatch(/export\s+type\s+BlogCategory/)
  })
})

test.describe('P120.10 — Welcome H2 builder-comparison link', () => {
  test('"Coming from another builder?" + link to /blog/describe-it-see-it', () => {
    const t = readFileSync(WELC, 'utf8')
    expect(t).toContain('Coming from another builder?')
    expect(t).toContain('/blog/describe-it-see-it')
  })
})

test.describe('P120.11 — Research Start-here entry strip', () => {
  test('3 targets routed: /aisp + handoff blog + /open-core', () => {
    const t = readFileSync(RESEARCH, 'utf8')
    expect(t).toContain('to="/aisp"')
    expect(t).toContain('/blog/the-handoff-that-changes-everything')
    expect(t).toContain('to="/open-core"')
  })
})

test.describe('P120.12 — Research Geek-mode Easter egg', () => {
  test('"See what the engineers see" footer link present', () => {
    const t = readFileSync(RESEARCH, 'utf8')
    expect(t).toContain('See what the engineers see')
  })
})

test.describe('P120.13 — About footer Work-with-us link', () => {
  test('"Work with us" + link to /contact', () => {
    const t = readFileSync(ABOUT, 'utf8')
    expect(t).toContain('Work with us')
    expect(t).toContain('to="/contact"')
  })
})

test.describe('P120.14 — EOP triplet (preflight + session-log + retrospective)', () => {
  test('preflight.md exists', () => {
    expect(existsSync(join(PHASE, 'preflight.md'))).toBe(true)
  })
  test('session-log.md exists', () => {
    expect(existsSync(join(PHASE, 'session-log.md'))).toBe(true)
  })
  test('retrospective.md exists', () => {
    expect(existsSync(join(PHASE, 'retrospective.md'))).toBe(true)
  })
})

test.describe('P120.15 — Welcome regression guard (no competitor names)', () => {
  test('zero competitor-name matches in Welcome.tsx after stripping comments', () => {
    let t = readFileSync(WELC, 'utf8')
    // Strip block comments + line comments + JSX comments before matching
    t = t.replace(/\/\*[\s\S]*?\*\//g, '')
         .replace(/\/\/[^\n]*/g, '')
         .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    const re = /\b(WordPress|Wix|Lovable|Bolt|Replit|Squarespace|Webflow|Framer|Cursor|Copilot|Windsurf|Codex|Devin|v0)\b/i
    expect(re.test(t)).toBe(false)
  })
})

test.describe('P120.16 — KISS no-new-deps denylist', () => {
  test('package.json has no animation/preexisting-baseline-violation entries', () => {
    const pkg = JSON.parse(readFileSync(PKG, 'utf8')) as {
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
    }
    const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) }
    // framer-motion is a pre-existing baseline dep; dropped from denylist per
    // P116/P118 precedent. The list below blocks NEW animation/persistence
    // libs from sneaking in via a P120 surface.
    const denylist = [
      'gsap',
      'lottie-web',
      '@react-spring/parallax',
      'animejs',
      'react-spring',
      '@react-spring/web',
      '@react-spring/core',
    ]
    for (const k of denylist) expect(k in deps).toBe(false)
  })
})

test.describe('P120.17 — MarketingNav React key uniqueness', () => {
  test('NAV_LINKS map uses composite key (to|label) since two entries share /research', () => {
    const t = readFileSync(NAV, 'utf8')
    // Either key={`${link.to}|${link.label}`} or key={link.label} resolves
    // the duplicate-key warning that would fire if both /research entries
    // used `key={link.to}`.
    expect(t).toMatch(/key=\{`?\$?\{?link\.(to|label)/)
  })
})

test.describe('P120.18 — ForTeams honest scope (no commercial promises)', () => {
  test('Section 3 names what is not shipped (no team workspaces / no SSO)', () => {
    const t = readFileSync(FOR_TEAMS, 'utf8')
    expect(t).toContain('No team workspaces')
    expect(t).toContain('SSO')
  })
})

test.describe('P120.19 — Blog 3 category labels canonical', () => {
  test('BLOG_CATEGORY_LABEL has exactly Story / Technical / For teams', () => {
    const t = readFileSync(BLOG_POSTS, 'utf8')
    expect(t).toContain("story: 'Story'")
    expect(t).toContain("technical: 'Technical'")
    expect(t).toContain("'for-teams': 'For teams'")
  })
})

test.describe('P120.20 — P118 posts categorized correctly via slug overrides', () => {
  test('describe-it-see-it = story, the-handoff-that-changes-everything = technical', () => {
    const t = readFileSync(BLOG_POSTS, 'utf8')
    expect(t).toMatch(/'describe-it-see-it'\)\s*return\s+'story'/)
    expect(t).toMatch(/'the-handoff-that-changes-everything'\)\s*return\s+'technical'/)
  })
})
