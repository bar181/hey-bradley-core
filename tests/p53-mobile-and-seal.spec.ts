/**
 * P53 Sprint J Wave 4 — Mobile UX overhaul + Sprint J seal tests.
 *
 * Pure-unit (FS-level reads). Mirrors P50/P51/P52 spec docstring style.
 * NO browser bootstrap. NO aisp barrel imports.
 *
 * ADR-076.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const MOBILE_LAYOUT = join(process.cwd(), 'src/components/shell/MobileLayout.tsx')
const MOBILE_MENU = join(process.cwd(), 'src/components/shell/MobileMenu.tsx')
const BUILDER = join(process.cwd(), 'src/pages/Builder.tsx')
const REALITY = join(process.cwd(), 'src/components/center-canvas/RealityTab.tsx')
const LISTEN_TAB = join(process.cwd(), 'src/components/left-panel/ListenTab.tsx')
const LISTEN_CTRL = join(process.cwd(), 'src/components/left-panel/listen/ListenControls.tsx')
const ADR = join(process.cwd(), 'docs/adr/ADR-076-mobile-ux-overhaul.md')
const WIKI = join(process.cwd(), 'docs/wiki/llm-call-process-flow.md')
const GROUNDING = join(process.cwd(), 'docs/GROUNDING.md')
const PKG = join(process.cwd(), 'package.json')
const REVIEW = join(process.cwd(), 'plans/implementation/phase-53/deep-dive/01-sprint-j-review.md')
const SESSION_LOG = join(process.cwd(), 'plans/implementation/phase-53/session-log.md')
const RETRO = join(process.cwd(), 'plans/implementation/phase-53/retrospective.md')

test.describe('P53.1 MobileLayout — file shape', () => {
  test('exists + exports MobileLayout + ≤280 LOC + md:hidden', () => {
    expect(existsSync(MOBILE_LAYOUT)).toBe(true)
    const src = readFileSync(MOBILE_LAYOUT, 'utf8')
    expect(src).toMatch(/export function MobileLayout/)
    expect(src.split('\n').length).toBeLessThanOrEqual(280)
    expect(src).toContain('md:hidden')
  })
})

test.describe('P53.2 MobileLayout — 3 tab testids', () => {
  test('source contains chat / listen / view testids', () => {
    const src = readFileSync(MOBILE_LAYOUT, 'utf8')
    expect(src).toContain('mobile-tab-chat')
    expect(src).toContain('mobile-tab-listen')
    expect(src).toContain('mobile-tab-view')
  })
})

test.describe('P53.3 MobileLayout — a11y tablist', () => {
  test('source contains role="tablist" AND role="tab"', () => {
    const src = readFileSync(MOBILE_LAYOUT, 'utf8')
    expect(src).toMatch(/role="tablist"/)
    expect(src).toMatch(/role="tab"/)
  })
})

test.describe('P53.4 MobileMenu — file shape', () => {
  test('exists + exports MobileMenu + ≤220 LOC', () => {
    expect(existsSync(MOBILE_MENU)).toBe(true)
    const src = readFileSync(MOBILE_MENU, 'utf8')
    expect(src).toMatch(/export function MobileMenu/)
    expect(src.split('\n').length).toBeLessThanOrEqual(220)
  })
})

test.describe('P53.5 MobileMenu — mounts the 6 documented surfaces', () => {
  test('source imports the 5 widgets + Conversation Log link', () => {
    const src = readFileSync(MOBILE_MENU, 'utf8')
    expect(src).toMatch(/PersonalityPicker/)
    expect(src).toMatch(/ReferenceManagement/)
    expect(src).toMatch(/BrandContextUpload/)
    expect(src).toMatch(/CodebaseContextUpload/)
    expect(src).toMatch(/ShareSpecButton/)
    expect(src).toMatch(/setActiveTab\(['"]CONVERSATION_LOG['"]\)/)
  })
})

test.describe('P53.6 MobileMenu — a11y dialog', () => {
  test('source contains role="dialog" AND aria-modal', () => {
    const src = readFileSync(MOBILE_MENU, 'utf8')
    expect(src).toMatch(/role="dialog"/)
    expect(src).toMatch(/aria-modal/)
  })
})

test.describe('P53.7 Builder.tsx — responsive switch', () => {
  test('source contains hidden md:flex AND <MobileLayout', () => {
    const src = readFileSync(BUILDER, 'utf8')
    expect(src).toMatch(/hidden md:flex/)
    expect(src).toMatch(/<MobileLayout/)
  })
})

test.describe('P53.8 RealityTab — mobile sticky preview nav', () => {
  test('source contains mobile-preview-stickynav testid', () => {
    const src = readFileSync(REALITY, 'utf8')
    expect(src).toContain('mobile-preview-stickynav')
  })
})

test.describe('P53.9 ListenTab/PTT — mobile polish present', () => {
  test('PTT control source has max-md / md:hidden / active:scale near button', () => {
    const tab = existsSync(LISTEN_TAB) ? readFileSync(LISTEN_TAB, 'utf8') : ''
    const ctrl = existsSync(LISTEN_CTRL) ? readFileSync(LISTEN_CTRL, 'utf8') : ''
    const combined = tab + '\n' + ctrl
    expect(/max-md:|md:hidden|active:scale/.test(combined)).toBe(true)
  })
})

test.describe('P53.10 ADR-076 — file shape + cross-refs', () => {
  test('exists, Status: Accepted, references ADR-072+073+074+075, ≤120 LOC, mentions X8 + mobile', () => {
    expect(existsSync(ADR)).toBe(true)
    const src = readFileSync(ADR, 'utf8')
    expect(src).toContain('Status:** Accepted')
    expect(src).toContain('ADR-072')
    expect(src).toContain('ADR-073')
    expect(src).toContain('ADR-074')
    expect(src).toContain('ADR-075')
    expect(src.split('\n').length).toBeLessThanOrEqual(120)
    expect(src).toMatch(/X8|north-star/i)
    expect(src.toLowerCase()).toContain('mobile')
  })
})

test.describe('P53.11 Wiki — phase pin ≥ P53', () => {
  test('Last verified against code header is P53 or later', () => {
    const src = readFileSync(WIKI, 'utf8')
    const m = src.match(/Last verified against code:\*\*\s*P(\d{2,})/)
    expect(m).not.toBeNull()
    expect(Number(m![1])).toBeGreaterThanOrEqual(53)
  })
})

test.describe('P53.12 GROUNDING — Sprint J reflected', () => {
  test('mentions P50 + P51 + P52 + P53 + ADR-076', () => {
    const src = readFileSync(GROUNDING, 'utf8')
    expect(src).toContain('P50')
    expect(src).toContain('P51')
    expect(src).toContain('P52')
    expect(src).toContain('P53')
    expect(src).toContain('ADR-076')
  })
})

test.describe('P53.13 KISS dep guard', () => {
  test('package.json deps remain clean (no router-mobile, no swiper)', () => {
    const pkg = JSON.parse(readFileSync(PKG, 'utf8'))
    const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) }
    expect(deps['react-router-dom-mobile']).toBeUndefined()
    expect(Object.keys(deps).some((k) => k.startsWith('swiper'))).toBe(false)
  })
})

test.describe('P53.14 Brutal review file exists', () => {
  test('≤200 LOC + composite + Grandma + Framer + Capstone', () => {
    expect(existsSync(REVIEW)).toBe(true)
    const src = readFileSync(REVIEW, 'utf8')
    expect(src.split('\n').length).toBeLessThanOrEqual(200)
    expect(src).toMatch(/\d{2,3}\s*\/\s*100|composite[\s:]*\d{2,3}/i)
    expect(src).toContain('Grandma')
    expect(src).toContain('Framer')
    expect(src).toContain('Capstone')
  })
})

test.describe('P53.15 EOP artifacts present', () => {
  test('session-log.md AND retrospective.md exist', () => {
    expect(existsSync(SESSION_LOG)).toBe(true)
    expect(existsSync(RETRO)).toBe(true)
  })
})
