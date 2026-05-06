/**
 * P120.5 / UNDER-THE-HOOD — Closer follow-up spec.
 * Calibrates ADR-149 (no new ADR). Verifies:
 *   - Nav label rename: "For developers" → "Under the hood" (route /research unchanged)
 *   - "Real time, not rebuild" architecture-as-plain-English section on /research
 *   - Same section mirrored onto /for-teams (verbatim copy)
 *   - EOP addendum captured
 *
 * Pattern follows tests/p120-audience-routing.spec.ts.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const NAV = join(ROOT, 'src/components/MarketingNav.tsx')
const RESEARCH = join(ROOT, 'src/pages/Research.tsx')
const FOR_TEAMS = join(ROOT, 'src/pages/ForTeams.tsx')
const PHASE_120 = join(ROOT, 'plans/implementation/phase-120/retrospective.md')
const PHASE_120_5 = join(ROOT, 'plans/implementation/phase-120.5/retrospective.md')

test.describe('P120.5.1 — Nav label updated to "Under the hood"', () => {
  test('contains literal "Under the hood" + /research route + does NOT contain old "For developers"', () => {
    const t = readFileSync(NAV, 'utf8')
    expect(t).toContain('Under the hood')
    expect(t).toContain("'/research'")
    // Strip block + line + JSX comments before the negative match — comments
    // about the rename history are allowed to mention the old label.
    const stripped = t
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/[^\n]*/g, '')
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    expect(stripped).not.toContain('For developers')
  })
})

test.describe('P120.5.2 — Research has the "Real time, not rebuild" section', () => {
  test('contains H2 literal + verbatim copy phrase', () => {
    const t = readFileSync(RESEARCH, 'utf8')
    expect(t).toContain('Real time, not rebuild')
    expect(t).toContain('seconds, not minutes')
  })
})

test.describe('P120.5.3 — ForTeams has the "Real time, not rebuild" section', () => {
  test('contains H2 literal + verbatim copy phrase', () => {
    const t = readFileSync(FOR_TEAMS, 'utf8')
    expect(t).toContain('Real time, not rebuild')
    expect(t).toContain('seconds, not minutes')
  })
})

test.describe('P120.5.4 — EOP addendum exists', () => {
  test('phase-120 retrospective addendum OR phase-120.5 retrospective.md present', () => {
    const has120 =
      existsSync(PHASE_120) && /P120\.5/i.test(readFileSync(PHASE_120, 'utf8'))
    const has120_5 = existsSync(PHASE_120_5)
    expect(has120 || has120_5).toBe(true)
  })
})
