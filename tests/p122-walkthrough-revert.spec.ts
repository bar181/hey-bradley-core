import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * P122 / W9 — Walkthrough revert to the original 3-pane design.
 *
 * Verifies the new src/pages/Walkthrough.tsx replaces the P118.5 6-scene
 * scroll-snap with the owner-locked 3-pane layout: prompts (left, red pulsing
 * glow on active) + typewriter (center) + mobile preview (right).
 *
 * - File-shape tests (read-only on disk) — fast, deterministic, no dev server.
 * - Source-grep KISS denylist — no framer-motion / gsap / @react-spring / lottie / animejs.
 * - Asserts orb-pulse keyframe reuse (W3 confirmed reusable).
 *
 * Cross-refs: ADR-144 D5 (KISS denylist), ADR-087 (token discipline),
 * `plans/hitl/phase-122/preflight.md` §4-I items 31-34.
 *
 * P123 fix-pass — CF-P122-W9-1 ESM `__dirname` defect: replace with
 * `fileURLToPath(import.meta.url)` so the spec runs under Playwright's ESM loader.
 */

const __filename = fileURLToPath(import.meta.url)
const REPO_ROOT = resolve(dirname(__filename), '..')
const WALKTHROUGH = resolve(REPO_ROOT, 'src/pages/Walkthrough.tsx')
const SOURCE_DOC = resolve(REPO_ROOT, 'plans/hitl/phase-122/walkthrough-revert-source.md')
const INDEX_CSS = resolve(REPO_ROOT, 'src/index.css')

function readWalkthrough(): string {
  return readFileSync(WALKTHROUGH, 'utf-8')
}

test.describe('P122.W9.1 — Walkthrough.tsx file shape', () => {
  test('file exists and is non-trivial', () => {
    expect(existsSync(WALKTHROUGH)).toBe(true)
    const src = readWalkthrough()
    expect(src.length).toBeGreaterThan(500)
  })

  test('file is ≤ 300 LOC per preflight cap', () => {
    const lines = readWalkthrough().split('\n').length
    expect(lines).toBeLessThanOrEqual(300)
  })

  test('default-exports the Walkthrough component', () => {
    const src = readWalkthrough()
    expect(src).toMatch(/export default function Walkthrough/)
  })
})

test.describe('P122.W9.2 — 3-pane testids exist in source', () => {
  test('walkthrough-pane-prompts testid present', () => {
    const src = readWalkthrough()
    expect(src).toContain('data-testid="walkthrough-pane-prompts"')
  })

  test('walkthrough-pane-typewriter testid present', () => {
    const src = readWalkthrough()
    expect(src).toContain('data-testid="walkthrough-pane-typewriter"')
  })

  test('walkthrough-pane-preview testid present', () => {
    const src = readWalkthrough()
    expect(src).toContain('data-testid="walkthrough-pane-preview"')
  })

  test('walkthrough-active-prompt testid present (assigned dynamically to current step)', () => {
    const src = readWalkthrough()
    expect(src).toContain("'walkthrough-active-prompt'")
  })
})

test.describe('P122.W9.3 — orb-pulse keyframe reuse (per W3 / preflight item 32)', () => {
  test('Walkthrough.tsx references the global orb-pulse animation', () => {
    const src = readWalkthrough()
    expect(src).toMatch(/orb-pulse/)
  })

  test('orb-pulse keyframe exists in src/index.css (source-of-truth)', () => {
    const css = readFileSync(INDEX_CSS, 'utf-8')
    expect(css).toMatch(/@keyframes\s+orb-pulse/)
  })
})

test.describe('P122.W9.4 — prefers-reduced-motion gate honored', () => {
  test('Walkthrough.tsx checks prefers-reduced-motion: reduce', () => {
    const src = readWalkthrough()
    expect(src).toContain("'(prefers-reduced-motion: reduce)'")
  })

  test('keyframes block has @media reduced-motion override', () => {
    const src = readWalkthrough()
    expect(src).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/)
  })
})

test.describe('P122.W9.5 — KISS denylist (ADR-144 D5)', () => {
  test('no framer-motion import', () => {
    const src = readWalkthrough()
    expect(src).not.toMatch(/from\s+['"]framer-motion['"]/)
  })

  test('no gsap import', () => {
    const src = readWalkthrough()
    expect(src).not.toMatch(/from\s+['"]gsap['"]/)
  })

  test('no @react-spring import', () => {
    const src = readWalkthrough()
    expect(src).not.toMatch(/from\s+['"]@react-spring/)
  })

  test('no lottie-web or react-lottie import', () => {
    const src = readWalkthrough()
    expect(src).not.toMatch(/from\s+['"]lottie-web['"]/)
    expect(src).not.toMatch(/from\s+['"]react-lottie['"]/)
  })

  test('no animejs import', () => {
    const src = readWalkthrough()
    expect(src).not.toMatch(/from\s+['"]animejs['"]/)
  })
})

test.describe('P122.W9.6 — Bottom note links to /blog/describe-it-see-it', () => {
  test('Walkthrough.tsx contains link to the longer narrative blog post', () => {
    const src = readWalkthrough()
    expect(src).toContain('/blog/describe-it-see-it')
  })
})

test.describe('P122.W9.7 — phase-1-15 source reference doc landed', () => {
  test('walkthrough-revert-source.md exists in plans/hitl/phase-122/', () => {
    expect(existsSync(SOURCE_DOC)).toBe(true)
  })

  test('source doc names the phase-1-15 archive files searched', () => {
    const doc = readFileSync(SOURCE_DOC, 'utf-8')
    expect(doc).toMatch(/phase-1\/archive\/human-feedback/)
  })
})

test.describe('P122.W9.8 — token discipline (ADR-087)', () => {
  test('Walkthrough.tsx uses CSS custom properties via var(--hb-*)', () => {
    const src = readWalkthrough()
    const matches = src.match(/var\(--hb-[a-z-]+\)/g)
    expect(matches).not.toBeNull()
    expect((matches ?? []).length).toBeGreaterThanOrEqual(5)
  })
})
