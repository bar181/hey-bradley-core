/**
 * P119 / SITE-POLISH — Single-agent closer.
 * Verifies 5 surgical UX fixes + dark-mode token overrides + AISP research
 * Harvard ALM Capstone citation at 3 surfaces (About + Research + AISP).
 *   D1 5 surgical fixes · D2 .dark token overrides · D3 academic-citation exemption · D4 hex→token migration
 * Pattern follows tests/p118.5-walkthrough.spec.ts.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const ADR = join(ROOT, 'docs/adr/ADR-148-site-polish-darkmode-research-citation.md')
const CSS = join(ROOT, 'src/index.css')
const ABOUT = join(ROOT, 'src/pages/About.tsx')
const RESEARCH = join(ROOT, 'src/pages/Research.tsx')
const AISP = join(ROOT, 'src/pages/AISP.tsx')
const OPENCORE = join(ROOT, 'src/pages/OpenCore.tsx')
const WELC = join(ROOT, 'src/pages/Welcome.tsx')
const WALK = join(ROOT, 'src/pages/Walkthrough.tsx')
const NAV = join(ROOT, 'src/components/MarketingNav.tsx')
const PHASE = join(ROOT, 'plans/implementation/phase-119')
const PKG = join(ROOT, 'package.json')

test.describe('P119.1 — ADR-148 file shape', () => {
  test('exists with Status: Accepted', () => {
    expect(existsSync(ADR)).toBe(true)
    expect(/Status:\s*\*?\*?\s*Accepted/i.test(readFileSync(ADR, 'utf8'))).toBe(true)
  })
  test('LOC ≤ 120', () => {
    expect(readFileSync(ADR, 'utf8').split('\n').length).toBeLessThanOrEqual(120)
  })
  test('cross-refs ≥6 of (ADR-087/091/094/141/146/147)', () => {
    const t = readFileSync(ADR, 'utf8')
    const refs = ['ADR-087', 'ADR-091', 'ADR-094', 'ADR-141', 'ADR-146', 'ADR-147']
    expect(refs.filter((r) => t.includes(r)).length).toBeGreaterThanOrEqual(6)
  })
})

test.describe('P119.2 — Dark-mode token overrides exist', () => {
  test('.dark { ... } block contains --hb-paper / --hb-ink / --hb-paper-soft', () => {
    const t = readFileSync(CSS, 'utf8')
    expect(t).toContain('.dark {')
    // Extract block from `.dark {` until the matching `}` at the same brace level.
    const start = t.indexOf('.dark {')
    const block = t.slice(start, start + 2000)
    expect(block).toMatch(/--hb-paper:\s*#1a1a1a/i)
    expect(block).toMatch(/--hb-ink:\s*#f3f3f1/i)
    expect(block).toMatch(/--hb-paper-soft:\s*#242424/i)
  })
})

test.describe('P119.3 — About AISP research finding', () => {
  test('contains Harvard ALM citation + ~40% + over 90% intent preserved', () => {
    const t = readFileSync(ABOUT, 'utf8')
    expect(t).toContain('Capstone research at Harvard ALM')
    expect(t).toContain('40% ambiguity per step')
    expect(t).toContain('over 90% intent preserved')
  })
})

test.describe('P119.4 — About walkthrough CTA replaces AISP', () => {
  test('Watch the walkthrough → /walkthrough; "Explore AISP" gone', () => {
    const t = readFileSync(ABOUT, 'utf8')
    expect(t).toContain('Watch the walkthrough')
    expect(t).toContain('to="/walkthrough"')
    // The phrase "Explore AISP" should no longer be present in About.tsx
    expect(t.includes('Explore AISP')).toBe(false)
  })
})

test.describe('P119.5 — Research math section', () => {
  test('contains 0.60⁵ + 0.98⁵ + Harvard ALM', () => {
    const t = readFileSync(RESEARCH, 'utf8')
    expect(t).toContain('0.60⁵')
    expect(t).toContain('0.98⁵')
    expect(t).toContain('Harvard ALM')
  })
})

test.describe('P119.6 — AISP page compounding math', () => {
  test('contains "Across five handoffs" + "Capstone research, Harvard ALM 2026"', () => {
    const t = readFileSync(AISP, 'utf8')
    expect(t).toContain('Across five handoffs')
    expect(t).toContain('Capstone research, Harvard ALM 2026')
  })
})

test.describe('P119.7 — MarketingNav token-based', () => {
  test('no #1a1a1a hardcoded; uses var(--hb-paper) and var(--hb-ink)', () => {
    const t = readFileSync(NAV, 'utf8')
    expect(t.includes('#1a1a1a')).toBe(false)
    expect(t).toMatch(/var\(--hb-paper\)/)
    expect(t).toMatch(/var\(--hb-ink\)/)
  })
})

test.describe('P119.8 — About hex→token migration', () => {
  test('zero [#faf8f5] / [#2d1f12] / [#e8772e] / [#6b5e4f] / [#f1ece4] (intentional dark-band hex on CTA may remain)', () => {
    const t = readFileSync(ABOUT, 'utf8')
    expect(t.match(/\[#faf8f5\]/g)).toBeNull()
    expect(t.match(/\[#2d1f12\]/g)).toBeNull()
    expect(t.match(/\[#e8772e\]/g)).toBeNull()
    expect(t.match(/\[#6b5e4f\]/g)).toBeNull()
    expect(t.match(/\[#f1ece4\]/g)).toBeNull()
  })
})

test.describe('P119.9 — OpenCore hex→token migration', () => {
  test('zero [#faf8f5] / [#2d1f12] / [#e8772e] / [#6b5e4f] / [#f1ece4]', () => {
    const t = readFileSync(OPENCORE, 'utf8')
    expect(t.match(/\[#faf8f5\]/g)).toBeNull()
    expect(t.match(/\[#2d1f12\]/g)).toBeNull()
    expect(t.match(/\[#e8772e\]/g)).toBeNull()
    expect(t.match(/\[#6b5e4f\]/g)).toBeNull()
    expect(t.match(/\[#f1ece4\]/g)).toBeNull()
  })
})

test.describe('P119.10 — Welcome animation timing tightened', () => {
  test('typewriter 1.6s steps(34) (was 2.4s)', () => {
    const t = readFileSync(WELC, 'utf8')
    expect(t).toContain('1.6s steps(34')
    // The pre-P119 timing 2.4s should not survive in the typing animation
    expect(t.match(/hb-hero-type 2\.4s/)).toBeNull()
  })
})

test.describe('P119.11 — Walkthrough Scene 1 placeholder', () => {
  test('contains "what would you like to build?"', () => {
    expect(readFileSync(WALK, 'utf8')).toContain('what would you like to build?')
  })
})

test.describe('P119.12 — EOP triplet', () => {
  test('preflight + session-log + retrospective at phase root', () => {
    expect(existsSync(join(PHASE, 'preflight.md'))).toBe(true)
    expect(existsSync(join(PHASE, 'session-log.md'))).toBe(true)
    expect(existsSync(join(PHASE, 'retrospective.md'))).toBe(true)
  })
})

test.describe('P119.13 — KISS no-new-deps boundary', () => {
  test('package.json has no new entries from denylist', () => {
    const pkg = JSON.parse(readFileSync(PKG, 'utf8'))
    const all = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) }
    const denyP119 = ['gsap', 'lottie-web', '@react-spring/parallax', 'animejs', 'next-themes', 'theme-change']
    for (const d of denyP119) {
      expect(d in all).toBe(false)
    }
  })
})

test.describe('P119.14 — Welcome no-jargon regression guard (P118)', () => {
  test('Welcome.tsx body has zero AISP/Crystal Atom/CLAUDE.md/JSON-patch/DDD jargon', () => {
    const t = readFileSync(WELC, 'utf8')
    // Strip JSX comments + inline keyframe defs to compare body copy only
    const stripped = t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
    expect(stripped.match(/\bAISP\b/)).toBeNull()
    expect(stripped.match(/Crystal Atom/i)).toBeNull()
    expect(stripped.match(/CLAUDE\.md/)).toBeNull()
    expect(stripped.match(/JSON.?patch/i)).toBeNull()
    expect(stripped.match(/\bDDD\b/)).toBeNull()
  })
})

test.describe('P119.15 — Welcome no-stat-numbers regression guard (P118)', () => {
  test('Welcome.tsx body has zero stat-shaped numbers (e.g. ~1681 tests, 137 ADRs, 64 examples, %)', () => {
    const t = readFileSync(WELC, 'utf8')
    // Strip CSS template literal (keyframes contain `100%` / `60%` which are not stats)
    const noKeyframes = t.replace(/HERO_KEYFRAMES\s*=\s*`[\s\S]*?`/, '')
    // Strip JSX comments + line comments
    const stripped = noKeyframes.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
    // Stat-shaped: digit-cluster followed by feature-noun
    const statNoun = /~?\d+\+?\s*(tests|ADRs?|examples|images|themes|sections|atoms|phases|patches|projects)/i
    expect(stripped.match(statNoun)).toBeNull()
    // Percentage figures in body copy
    const pct = /\d+%/
    expect(stripped.match(pct)).toBeNull()
  })
})

test.describe('P119.16 — Walkthrough brand-invisible scenes 1-5 regression guard (P118.5)', () => {
  test('Walkthrough.tsx scenes 1-5 region contains zero "Hey Bradley"', () => {
    const t = readFileSync(WALK, 'utf8')
    // Find scene boundaries: from start to "Scene 6 — Close" comment marker
    const scene6Marker = t.indexOf('Scene 6')
    expect(scene6Marker).toBeGreaterThan(0)
    const scenes1to5 = t.slice(0, scene6Marker)
    expect(scenes1to5.match(/Hey Bradley/)).toBeNull()
  })
})

test.describe('P119.17 — ADR-148 D3 academic-citation exemption documented', () => {
  test('ADR body names the Harvard ALM Capstone exemption', () => {
    const t = readFileSync(ADR, 'utf8')
    expect(t).toContain('Harvard ALM Capstone')
    expect(t).toContain('ADR-146')
  })
})

test.describe('P119.18 — Five surgical fixes verified at named files', () => {
  test('Fix 3 MarketingNav uses var(--hb-paper) and var(--hb-warm)', () => {
    const t = readFileSync(NAV, 'utf8')
    expect(t).toMatch(/var\(--hb-paper\)/)
    expect(t).toMatch(/var\(--hb-warm\)/)
  })
  test('Fix 4 Welcome morph delay 1.2s (was 2.2s)', () => {
    const t = readFileSync(WELC, 'utf8')
    expect(t).toContain('hb-hero-morph 1.2s ease-out 1.2s forwards')
  })
})
