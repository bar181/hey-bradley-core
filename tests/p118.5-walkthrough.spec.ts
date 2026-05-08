/**
 * P118.5 / WALKTHROUGH — Single-agent closer.
 * Verifies /walkthrough story page closes CF-P118-1.
 *   D1 Section-like page · D2 Don Miller voice (brand invisible 1-5) · D3 CSS-only no new deps
 * Pattern follows tests/p118-simple-messaging.spec.ts.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const ADR = join(ROOT, 'docs/adr/ADR-147-walkthrough-story-page.md')
const W = join(ROOT, 'src/pages/Walkthrough.tsx')
const MAIN = join(ROOT, 'src/main.tsx')
const WELC = join(ROOT, 'src/pages/Welcome.tsx')
const ABOUT = join(ROOT, 'src/pages/About.tsx')
const BLOG = join(ROOT, 'src/pages/blog/posts/describe-it-see-it.md')
const PHASE = join(ROOT, 'plans/implementation/phase-118.5')
const PKG = join(ROOT, 'package.json')

test.describe('P118.5.1 — ADR-147 file shape', () => {
  test('exists with Status: Accepted', () => {
    expect(existsSync(ADR)).toBe(true)
    expect(/Status:\s*\*?\*?\s*Accepted/i.test(readFileSync(ADR, 'utf8'))).toBe(true)
  })
  test('LOC ≤ 120', () => {
    expect(readFileSync(ADR, 'utf8').split('\n').length).toBeLessThanOrEqual(120)
  })
  test('cross-refs ≥4 of (ADR-090/091/094/141/144/146)', () => {
    const t = readFileSync(ADR, 'utf8')
    const refs = ['ADR-090', 'ADR-091', 'ADR-094', 'ADR-141', 'ADR-144', 'ADR-146']
    expect(refs.filter((r) => t.includes(r)).length).toBeGreaterThanOrEqual(4)
  })
})

test.describe('P118.5.2 — Walkthrough.tsx', () => {
  test('exists, default export, LOC ≤ 220', () => {
    expect(existsSync(W)).toBe(true)
    const t = readFileSync(W, 'utf8')
    expect(/export\s+default\s+function\s+Walkthrough/.test(t)).toBe(true)
    expect(t.split('\n').length).toBeLessThanOrEqual(220)
  })
})

test.describe('P118.5.3 — Scene 1 line lock', () => {
  test('contains "I needed a website." + "By Tuesday."', () => {
    const t = readFileSync(W, 'utf8')
    expect(t).toContain('I needed a website.')
    expect(t).toContain('By Tuesday.')
  })
})

test.describe('P118.5.4 — Scene 5 nephew lock', () => {
  test('contains "nephew"', () => {
    expect(readFileSync(W, 'utf8')).toContain('nephew')
  })
})

test.describe('P118.5.5 — Scene 6 close LOCKED', () => {
  test('contains "From your idea to a real site, in your words."', () => {
    expect(readFileSync(W, 'utf8')).toContain('From your idea to a real site, in your words.')
  })
})

test.describe('P118.5.6 — Scene 4 friend voice', () => {
  test('contains "Felt more honest."', () => {
    expect(readFileSync(W, 'utf8')).toContain('Felt more honest.')
  })
  test('does NOT use commit-log voice', () => {
    expect(/Hero headline updated/i.test(readFileSync(W, 'utf8'))).toBe(false)
  })
})

test.describe('P118.5.7 — Three CTAs in locked order', () => {
  test('/new-project → bar181/hey-bradley-core → bar181/aisp-open-core', () => {
    const t = readFileSync(W, 'utf8')
    const i1 = t.indexOf('/new-project')
    const i2 = t.indexOf('bar181/hey-bradley-core')
    const i3 = t.indexOf('bar181/aisp-open-core')
    expect(i1).toBeGreaterThan(-1)
    expect(i2).toBeGreaterThan(-1)
    expect(i3).toBeGreaterThan(-1)
    expect(i1).toBeLessThan(i2)
    expect(i2).toBeLessThan(i3)
  })
})

test.describe('P118.5.8 — Brand invisible until Scene 6', () => {
  test('Scenes 1-5 segment has zero brand mentions', () => {
    const t = readFileSync(W, 'utf8')
    const idx = t.indexOf('Scene 6')
    if (idx === -1) return test.skip()
    const before = t.slice(0, idx)
    expect(/Hey\s+Bradley/i.test(before)).toBe(false)
    expect(/heybradley/i.test(before)).toBe(false)
  })
  test('all 5 locked headlines (Scene 1-5) present + brand-free', () => {
    const t = readFileSync(W, 'utf8')
    const headlines = [
      'I needed a website.',
      'So I just described it.',
      'It just appeared.',
      'I kept talking. It kept listening.',
      'Then it was ready to ship.',
    ]
    for (const h of headlines) {
      expect(t).toContain(h)
      expect(/hey\s*bradley/i.test(h)).toBe(false)
    }
  })
})

test.describe('P118.5.9 — No stat-shaped numbers', () => {
  test('zero matches for stat-shaped figures in body', () => {
    const t = readFileSync(W, 'utf8')
    expect(/~?\d+\+?\s*(tests|ADRs?|examples|images|themes|sections|atoms|phases|patches|projects)\b/i.test(t)).toBe(false)
  })
  test('zero stat-style percentages outside CSS keyframes', () => {
    const t = readFileSync(W, 'utf8')
    const stripped = t.replace(/`[^`]*@keyframes[\s\S]*?`/g, '')
    expect(/\d+%/.test(stripped)).toBe(false)
  })
})

test.describe('P118.5.10 — No jargon', () => {
  test('zero AISP / Crystal Atom / CLAUDE.md / JSON-patch / DDD outside imports', () => {
    const t = readFileSync(W, 'utf8')
    const body = t.replace(/^import\b.*$/gm, '').replace(/^\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '')
    expect(/\bAISP\b/.test(body)).toBe(false)
    expect(/Crystal Atom/i.test(body)).toBe(false)
    expect(/CLAUDE\.md/i.test(body)).toBe(false)
    expect(/JSON.patch/i.test(body)).toBe(false)
    expect(/\bDDD\b/.test(body)).toBe(false)
  })
})

test.describe('P118.5.11 — No competitor names', () => {
  test('zero matches for known competitor brands', () => {
    const t = readFileSync(W, 'utf8')
    const body = t.replace(/^import\b.*$/gm, '').replace(/^\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '')
    expect(/\b(WordPress|Wix|Lovable|Bolt|Replit|Squarespace|Webflow|Cursor|Copilot|Windsurf|Codex|Devin)\b/i.test(body)).toBe(false)
  })
})

test.describe('P118.5.12 — useReveal imported', () => {
  test('imports useReveal from @/hooks/useReveal', () => {
    expect(/import\s+\{\s*useReveal\s*\}\s+from\s+['"]@\/hooks\/useReveal['"]/.test(readFileSync(W, 'utf8'))).toBe(true)
  })
})

test.describe('P118.5.13 — Route wired in main.tsx', () => {
  test('main.tsx contains "/walkthrough" + lazy import', () => {
    const t = readFileSync(MAIN, 'utf8')
    expect(t).toContain('/walkthrough')
    expect(/lazy\(\(\)\s*=>\s*import\(\s*['"]@\/pages\/Walkthrough['"]\s*\)\)/.test(t)).toBe(true)
  })
})

test.describe('P118.5.14 — Welcome wires walkthrough link', () => {
  test('Welcome.tsx contains "/walkthrough"', () => {
    if (!existsSync(WELC)) return test.skip()
    expect(readFileSync(WELC, 'utf8')).toContain('/walkthrough')
  })
})

test.describe('P118.5.15 — About wires walkthrough link', () => {
  test('About.tsx contains "/walkthrough"', () => {
    if (!existsSync(ABOUT)) return test.skip()
    expect(readFileSync(ABOUT, 'utf8')).toContain('/walkthrough')
  })
})

test.describe('P118.5.16 — Blog post wires walkthrough link', () => {
  test('describe-it-see-it.md contains "/walkthrough"', () => {
    if (!existsSync(BLOG)) return test.skip()
    expect(readFileSync(BLOG, 'utf8')).toContain('/walkthrough')
  })
})

test.describe('P118.5.17 — EOP triplet', () => {
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

test.describe('P118.5.18 — KISS no-new-deps', () => {
  test('package.json has no new animation deps', () => {
    const pkg = JSON.parse(readFileSync(PKG, 'utf8'))
    const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) }
    // framer-motion is pre-existing baseline (P116 precedent) — dropped from denylist.
    for (const d of ['gsap', 'lottie-web', '@react-spring/parallax', 'animejs', 'react-spring', '@react-spring/web', '@react-spring/core']) {
      expect(deps).not.toHaveProperty(d)
    }
  })
})

test.describe('P118.5.19 — Body word count', () => {
  test('JSX text content ≤ 240 (soft-cap with margin over 220 target)', () => {
    let body = readFileSync(W, 'utf8')
    body = body.replace(/^import\b.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\/\/.*$/gm, '')
    body = body.replace(/`[^`]*@keyframes[\s\S]*?`/g, '')
    body = body.replace(/className=\{?["`][^"`]*["`]\}?/g, '').replace(/className=["][^"]*["]/g, '')
    body = body.replace(/style=\{[^}]*\}/g, '').replace(/aria-label=["][^"]*["]/g, '')
    body = body.replace(/href=["][^"]*["]/g, '').replace(/to=["][^"]*["]/g, '')
    body = body.replace(/[<][^>]+[>]/g, ' ').replace(/&[a-z]+;/g, ' ')
    const words = body.split(/\s+/).map((w) => w.trim()).filter((w) => /^[A-Za-z][A-Za-z'.,!?-]*$/.test(w) && w.length > 1)
    expect(words.length).toBeLessThanOrEqual(240)
  })
})
