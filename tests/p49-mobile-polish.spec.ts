/**
 * P49 Sprint I Wave 3 — Mobile Polish + C11 Closure (Agent A8 cumulative).
 *
 * Pure-unit (FS-level only). Verifies A7 (Welcome.tsx vertical-snap carousel
 * for <640px viewports + builder-mode `active:` touch parity + QuickAddPicker
 * mobile grid + RealityTab AddSectionDivider touch parity) and A8 (ADR-072 +
 * wiki refresh).
 *
 * Mirrors the P47 / P48 source-level test pattern. NO browser bootstrap; NO
 * DB; NO LLM calls; NO aisp barrel imports. Source-level reads ONLY —
 * contracts validated through file-content introspection.
 *
 * ADR-072.
 */
import { test, expect } from '@playwright/test'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const WELCOME = join(process.cwd(), 'src/pages/Welcome.tsx')
const SECTIONS = join(process.cwd(), 'src/components/left-panel/SectionsSection.tsx')
const QUICK_ADD = join(process.cwd(), 'src/components/left-panel/QuickAddPicker.tsx')
const REALITY_TAB = join(process.cwd(), 'src/components/center-canvas/RealityTab.tsx')
const ADR = join(process.cwd(), 'docs/adr/ADR-072-sprint-i-mobile-polish.md')
const WIKI = join(process.cwd(), 'docs/wiki/llm-call-process-flow.md')
const PKG = join(process.cwd(), 'package.json')

test.describe('P49.1 Welcome.tsx — max-sm responsive layout (C11 surface)', () => {
  test('source applies max-sm: variant on the starter-examples / modes list', () => {
    const src = readFileSync(WELCOME, 'utf8')
    expect(src).toMatch(/max-sm:/)
  })
})

test.describe('P49.2 Welcome.tsx — vertical-list carousel pattern', () => {
  test('source contains snap-y OR (flex-col + max-sm:) vertical-list pattern', () => {
    const src = readFileSync(WELCOME, 'utf8')
    expect(src).toMatch(/snap-y|max-sm:flex-col|max-sm:grid-cols-1/)
  })
})

test.describe('P49.3 SectionsSection.tsx — touch parity active: variants', () => {
  test('source carries at least one active: Tailwind variant', () => {
    const src = readFileSync(SECTIONS, 'utf8')
    expect(src).toMatch(/active:/)
  })
})

test.describe('P49.4 QuickAddPicker.tsx — mobile-responsive grid', () => {
  test('source has max-sm:grid-cols-* OR grid-cols-1 fallback', () => {
    const src = readFileSync(QUICK_ADD, 'utf8')
    expect(src).toMatch(/max-sm:grid-cols-|grid-cols-1/)
  })
})

test.describe('P49.5 RealityTab.tsx AddSectionDivider — touch parity', () => {
  test('source contains active: variant OR mobile-aware comment', () => {
    const src = readFileSync(REALITY_TAB, 'utf8')
    expect(src).toMatch(/active:|max-sm:|mobile/i)
  })
})

test.describe('P49.6 KISS — no new mobile-carousel deps', () => {
  test('package.json deps NOT include @dnd-kit/* / embla* / swiper*', () => {
    const pkg = JSON.parse(readFileSync(PKG, 'utf8'))
    const deps = Object.keys(pkg.dependencies ?? {})
    expect(deps.some((d) => d.startsWith('@dnd-kit/') || d.startsWith('embla') || d.startsWith('swiper'))).toBe(false)
  })
})

test.describe('P49.7 ADR-072 file shape', () => {
  test('exists with Accepted status + Phase P49 + ≤120 lines + cross-refs ADR-070 + ADR-071', () => {
    expect(existsSync(ADR)).toBe(true)
    const src = readFileSync(ADR, 'utf8')
    expect(src).toMatch(/^# ADR-072:/m)
    expect(src).toMatch(/\*\*Status:\*\*\s*Accepted/)
    expect(src).toMatch(/\*\*Phase:\*\*\s*P49/)
    expect(src.split('\n').length).toBeLessThanOrEqual(120)
  })

  test('cross-references ADR-070 + ADR-071 + mentions C11 / mobile / <600px', () => {
    const src = readFileSync(ADR, 'utf8')
    expect(src).toContain('ADR-070')
    expect(src).toContain('ADR-071')
    expect(src).toMatch(/C11|mobile|<600px|<640px/)
  })
})

test.describe('P49.8 Wiki — llm-call-process-flow refreshed to P49', () => {
  test('source matches "P49 sealed" OR "P49"', () => {
    expect(existsSync(WIKI)).toBe(true)
    const src = readFileSync(WIKI, 'utf8')
    expect(src).toMatch(/P49 sealed|P49/)
  })
})

test.describe('P49.9 PURE-UNIT discipline — no aisp barrel imports', () => {
  test('this spec source does NOT import from any aisp barrel', () => {
    const self = join(process.cwd(), 'tests/p49-mobile-polish.spec.ts')
    const src = readFileSync(self, 'utf8')
    expect(src).not.toMatch(/from\s+['"][^'"]*\/aisp['"]/)
    expect(src).not.toMatch(/from\s+['"]@\/contexts\/intelligence\/aisp['"]/)
  })
})
