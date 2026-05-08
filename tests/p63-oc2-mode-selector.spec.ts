/**
 * P63 / OC-2 — 3-card Mode Selector + ADR-088 + ADR-089 + uiStore patch.
 * PURE-UNIT: FS reads + JSON.parse + regex/string asserts. NO browser bootstrap.
 * Pattern follows tests/p62-oc1-design-tokens.spec.ts.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const ADR_088 = join(ROOT, 'docs/adr/ADR-088-mode-architecture.md')
const ADR_089 = join(ROOT, 'docs/adr/ADR-089-agentics-data-model.md')
const MODE_CARD = join(ROOT, 'src/components/onboarding/ModeSelectorCard.tsx')
const UI_STORE = join(ROOT, 'src/store/uiStore.ts')

function loc(path: string): number {
  return readFileSync(path, 'utf8').split('\n').length
}

function read(path: string): string {
  return readFileSync(path, 'utf8')
}

test.describe('P63.1 ADR-088 — Mode Architecture (Accepted, ≤120 LOC, cross-refs)', () => {
  test('ADR-088 file exists and is ≤120 LOC', () => {
    expect(existsSync(ADR_088)).toBe(true)
    expect(loc(ADR_088)).toBeLessThanOrEqual(120)
  })
  test('ADR-088 has Status: Accepted and references ADR-085 + ADR-086 + ADR-073', () => {
    const src = read(ADR_088)
    expect(src).toMatch(/\*\*Status:\*\*\s+Accepted/)
    expect(src).toContain('ADR-085')
    expect(src).toContain('ADR-086')
    expect(src).toContain('ADR-073')
  })
  test('ADR-088 captures the three-mode discriminator decision', () => {
    const src = read(ADR_088)
    expect(src).toMatch(/whiteboard/i)
    expect(src).toMatch(/planning/i)
    expect(src).toMatch(/agentics/i)
    expect(src).toMatch(/appMode/i)
  })
})

test.describe('P63.2 ADR-089 — Agentics Data Model (Accepted, ≤120 LOC, schema design)', () => {
  test('ADR-089 file exists and is ≤120 LOC', () => {
    expect(existsSync(ADR_089)).toBe(true)
    expect(loc(ADR_089)).toBeLessThanOrEqual(120)
  })
  test('ADR-089 has Status: Accepted and mentions migration 005', () => {
    const src = read(ADR_089)
    expect(src).toMatch(/\*\*Status:\*\*\s+Accepted/)
    expect(src).toMatch(/migration\s+005/i)
  })
  test('ADR-089 enumerates phases / sprints / waves / agents / gates / seals', () => {
    const src = read(ADR_089)
    expect(src).toMatch(/\bphases\b/i)
    expect(src).toMatch(/\bsprints\b/i)
    expect(src).toMatch(/\bwaves\b/i)
    expect(src).toMatch(/\bagents\b/i)
    expect(src).toMatch(/\bgates\b/i)
    expect(src).toMatch(/\bseals\b/i)
  })
  test('ADR-089 cross-refs ADR-088 + ADR-085 + ADR-016', () => {
    const src = read(ADR_089)
    expect(src).toContain('ADR-088')
    expect(src).toContain('ADR-085')
    expect(src).toContain('ADR-016')
  })
})

test.describe('P63.3 ModeSelectorCard — exports + 3 cards rendered with testids', () => {
  test('ModeSelectorCard.tsx exists and exports ModeSelectorCard (named + default)', () => {
    expect(existsSync(MODE_CARD)).toBe(true)
    const src = read(MODE_CARD)
    expect(src).toMatch(/export\s+function\s+ModeSelectorCard\s*\(/)
    expect(src).toMatch(/export\s+default\s+ModeSelectorCard/)
  })
  test('ModeSelectorCard renders 3 mode cards with required testids', () => {
    const src = read(MODE_CARD)
    expect(src).toContain('mode-card-whiteboard')
    expect(src).toContain('mode-card-planning')
    expect(src).toContain('mode-card-agentics')
    expect(src).toContain('mode-selector-heading')
  })
  test('ModeSelectorCard heading copy matches owner-supplied verbatim', () => {
    const src = read(MODE_CARD)
    expect(src).toContain('What are you building today?')
    expect(src).toContain('Visualize your idea')
    expect(src).toContain('Design the process')
    expect(src).toContain('Coordinate your swarm')
    expect(src).toContain('Founders, Designers')
    expect(src).toContain('PMs + Teams, Product Leads')
    expect(src).toContain('Engineers, Architects')
  })
})

test.describe('P63.4 ModeSelectorCard — Coming soon markers for Planning + Agentics', () => {
  test('Planning + Agentics cards render "Coming soon" markers', () => {
    const src = read(MODE_CARD)
    expect(src).toContain('Coming soon')
    // Both Planning + Agentics testids get a sibling "-coming-soon" testid
    // generated via template literal `${m.testid}-coming-soon`.
    expect(src).toMatch(/`\$\{m\.testid\}-coming-soon`/)
  })
  test('Planning + Agentics cards are disabled (button + aria-disabled)', () => {
    const src = read(MODE_CARD)
    expect(src).toMatch(/disabled=\{!isLive\}/)
    expect(src).toMatch(/aria-disabled=\{!isLive\}/)
  })
  test('all three modes live as of P90 / AW-MODE-ARCH', () => {
    // P90 enabled Planning + Agentics (stubs; routes /planning + /agentics).
    // Pre-P90: Whiteboard sole live mode; this test gated `available: true`
    // count at 1. Post-P90 the count is 3 — see ADR-116 + tests/p90-*.spec.ts.
    const src = read(MODE_CARD)
    const trueMatches = src.match(/available:\s*true/g) ?? []
    const falseMatches = src.match(/available:\s*false/g) ?? []
    expect(trueMatches.length).toBe(3)
    expect(falseMatches.length).toBe(0)
  })
})

test.describe('P63.5 uiStore — appMode field + setAppMode action + kv persistence', () => {
  test('uiStore exports AppMode type with the three valid values', () => {
    const src = read(UI_STORE)
    expect(src).toMatch(/export\s+type\s+AppMode\s*=/)
    expect(src).toContain("'whiteboard'")
    expect(src).toContain("'planning'")
    expect(src).toContain("'agentics'")
  })
  test('uiStore declares appMode: AppMode | null on the UIStore interface', () => {
    const src = read(UI_STORE)
    expect(src).toMatch(/appMode:\s*AppMode\s*\|\s*null/)
  })
  test('uiStore declares setAppMode: (mode: AppMode) => void on the interface', () => {
    const src = read(UI_STORE)
    expect(src).toMatch(/setAppMode:\s*\(mode:\s*AppMode\)\s*=>\s*void/)
  })
  test('setAppMode persists to kv["ui_app_mode"] via kvSet', () => {
    const src = read(UI_STORE)
    expect(src).toContain("'ui_app_mode'")
    expect(src).toMatch(/kvSet\(APP_MODE_KEY,\s*mode\)/)
  })
})

test.describe('P63.6 uiStore — hydration via loadAppMode() / kvGet on init', () => {
  test('uiStore declares loadAppMode() helper that reads kv["ui_app_mode"]', () => {
    const src = read(UI_STORE)
    expect(src).toMatch(/function\s+loadAppMode\s*\(\s*\)/)
    expect(src).toMatch(/kvGet\(APP_MODE_KEY\)/)
  })
  test('uiStore initializes appMode by calling loadAppMode() in the create() block', () => {
    const src = read(UI_STORE)
    expect(src).toMatch(/appMode:\s*loadAppMode\(\)/)
  })
  test('loadAppMode() validates the persisted value against APP_MODE_VALID', () => {
    const src = read(UI_STORE)
    expect(src).toMatch(/APP_MODE_VALID/)
    // Defensive: an invalid persisted value returns null (re-show selector).
    expect(src).toMatch(/return\s+null/)
  })
})
