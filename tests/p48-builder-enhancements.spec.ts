/**
 * P48 Sprint I Wave 2 — Builder Enhancements (Agent A6 cumulative).
 *
 * Pure-unit (FS-level only). Verifies A4 (`QuickAddPicker.tsx` curated 6-section
 * one-click panel + a11y + arrow-key nav, mounted inside SectionsSection) and
 * A5 (`aisp/improvementSuggester.ts` rule-based heuristic + `chatPipeline`
 * defensive integration + `ChatInput.tsx` `💡 Next steps` block).
 *
 * Mirrors the P47 source-level test pattern. NO browser bootstrap; NO DB; NO
 * LLM calls. Source-level reads ONLY — A4/A5 contracts validated through
 * file-content introspection (regex over the TS/TSX source).
 *
 * NOTE: Some assertions are expected to FAIL until A4+A5 land their commits;
 * those rows are documented in the agent report.
 *
 * ADR-071.
 */
import { test, expect } from '@playwright/test'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const QUICK_ADD = join(process.cwd(), 'src/components/left-panel/QuickAddPicker.tsx')
const SECTIONS = join(process.cwd(), 'src/components/left-panel/SectionsSection.tsx')
const SUGGESTER = join(process.cwd(), 'src/contexts/intelligence/aisp/improvementSuggester.ts')
const CHAT_PIPELINE = join(process.cwd(), 'src/contexts/intelligence/chatPipeline.ts')
const CHAT_INPUT = join(process.cwd(), 'src/components/shell/ChatInput.tsx')
const ADR = join(process.cwd(), 'docs/adr/ADR-071-builder-enhancements.md')
const PKG = join(process.cwd(), 'package.json')

test.describe('P48.1 QuickAddPicker — file shape', () => {
  test('exists + exports QuickAddPicker FC + ≤ 200 LOC', () => {
    expect(existsSync(QUICK_ADD)).toBe(true)
    const src = readFileSync(QUICK_ADD, 'utf8')
    expect(src).toMatch(/export\s+(default\s+)?(function|const)\s+QuickAddPicker|export\s+\{[^}]*QuickAddPicker/)
    expect(src.split('\n').length).toBeLessThanOrEqual(200)
  })
})

test.describe('P48.2 QuickAddPicker — 6 curated section types', () => {
  test('source contains the 6 curated literals (case-insensitive)', () => {
    const src = readFileSync(QUICK_ADD, 'utf8')
    for (const kind of ['hero', 'action', 'text', 'blog', 'pricing', 'footer']) {
      expect(src).toMatch(new RegExp(`['"\`]${kind}['"\`]`, 'i'))
    }
  })
})

test.describe('P48.3 QuickAddPicker — categorized', () => {
  test('source contains Hero & CTA + (Content OR Social Proof)', () => {
    const src = readFileSync(QUICK_ADD, 'utf8')
    expect(src).toMatch(/Hero & CTA/)
    expect(src).toMatch(/Content|Social Proof/)
  })
})

test.describe('P48.4 QuickAddPicker — wires addSection via store', () => {
  test('source matches addSection AND useConfigStore', () => {
    const src = readFileSync(QUICK_ADD, 'utf8')
    expect(src).toMatch(/addSection/)
    expect(src).toMatch(/useConfigStore/)
  })
})

test.describe('P48.5 QuickAddPicker — a11y roles + aria-expanded', () => {
  test('source contains role="list" + role="listitem" + aria-expanded', () => {
    const src = readFileSync(QUICK_ADD, 'utf8')
    expect(src).toMatch(/role="list"/)
    expect(src).toMatch(/role="listitem"/)
    expect(src).toMatch(/aria-expanded/)
  })
})

test.describe('P48.6 QuickAddPicker — keyboard nav', () => {
  test('source carries onKeyDown + Arrow handler', () => {
    const src = readFileSync(QUICK_ADD, 'utf8')
    expect(src).toMatch(/onKeyDown/)
    expect(src).toMatch(/ArrowUp|ArrowDown/)
  })
})

test.describe('P48.7 SectionsSection mounts QuickAddPicker', () => {
  test('imports + renders <QuickAddPicker', () => {
    const src = readFileSync(SECTIONS, 'utf8')
    expect(src).toMatch(/import\s+\{?\s*QuickAddPicker/)
    expect(src).toMatch(/<QuickAddPicker/)
  })
})

test.describe('P48.8 improvementSuggester — surface', () => {
  test('exists + exports suggestImprovements + ImprovementSuggestion + ≤ 150 LOC', () => {
    expect(existsSync(SUGGESTER)).toBe(true)
    const src = readFileSync(SUGGESTER, 'utf8')
    expect(src).toMatch(/export\s+(function|const|async\s+function)\s+suggestImprovements/)
    expect(src).toMatch(/export\s+(type|interface)\s+ImprovementSuggestion/)
    expect(src.split('\n').length).toBeLessThanOrEqual(150)
  })
})

test.describe('P48.9 improvementSuggester — caps at 3 results', () => {
  test('source caps return array at 3', () => {
    const src = readFileSync(SUGGESTER, 'utf8')
    // Accept literal slice(0, 3), .length<=3, OR a named constant set to 3.
    expect(src).toMatch(/slice\(0,\s*3\)|\.length\s*[<=]+\s*3|MAX_SUGGESTIONS\s*=\s*3/)
  })
})

test.describe('P48.10 improvementSuggester — heuristic keyword patterns', () => {
  test('source matches hero + pricing + cta rule keywords', () => {
    const src = readFileSync(SUGGESTER, 'utf8')
    expect(src).toMatch(/hero/i)
    expect(src).toMatch(/pricing/i)
    expect(src).toMatch(/cta/i)
  })
})

test.describe('P48.11 chatPipeline integration — defensive', () => {
  test('source matches improvements + try block guarding the suggester', () => {
    const src = readFileSync(CHAT_PIPELINE, 'utf8')
    expect(src).toMatch(/improvements/)
    expect(src).toMatch(/try\s*\{[\s\S]*?suggestImprovements[\s\S]*?\}/)
  })
})

test.describe('P48.12 ChatPipelineResult includes improvements', () => {
  test('source declares improvements?: on the result type', () => {
    const src = readFileSync(CHAT_PIPELINE, 'utf8')
    expect(src).toMatch(/improvements\?:/)
  })
})

test.describe('P48.13 ChatInput surfaces suggestions', () => {
  test('source contains aisp-improvement-suggestions testid + iterates improvements', () => {
    const src = readFileSync(CHAT_INPUT, 'utf8')
    expect(src).toMatch(/aisp-improvement-suggestions/)
    expect(src).toMatch(/improvements[\s\S]{0,40}\.map\(|\.improvements\?\.map\(/)
  })
})

test.describe('P48.14 No new dep bloat (KISS verification)', () => {
  test('package.json dependencies do NOT contain react-aria (carryover)', () => {
    const pkg = JSON.parse(readFileSync(PKG, 'utf8'))
    const deps = Object.keys(pkg.dependencies ?? {})
    expect(deps.includes('react-aria')).toBe(false)
  })

  test('package.json dependencies do NOT contain @radix-ui/react-tooltip (we hand-roll)', () => {
    const pkg = JSON.parse(readFileSync(PKG, 'utf8'))
    const deps = Object.keys(pkg.dependencies ?? {})
    expect(deps.includes('@radix-ui/react-tooltip')).toBe(false)
  })
})

test.describe('P48.15 ADR-071 file shape', () => {
  test('ADR-071 exists with Accepted status + Phase P48', () => {
    expect(existsSync(ADR)).toBe(true)
    const src = readFileSync(ADR, 'utf8')
    expect(src).toMatch(/^# ADR-071:/m)
    expect(src).toMatch(/\*\*Status:\*\*\s*Accepted/)
    expect(src).toMatch(/\*\*Phase:\*\*\s*P48/)
  })

  test('ADR-071 cross-references ADR-053 + ADR-058 + ADR-067 + ADR-070', () => {
    const src = readFileSync(ADR, 'utf8')
    expect(src).toContain('ADR-053')
    expect(src).toContain('ADR-058')
    expect(src).toContain('ADR-067')
    expect(src).toContain('ADR-070')
  })

  test('ADR-071 ≤ 120 lines (concise scope-locked ADR)', () => {
    const src = readFileSync(ADR, 'utf8')
    expect(src.split('\n').length).toBeLessThanOrEqual(120)
  })

  test('ADR-071 mentions improvement + quick-add', () => {
    const src = readFileSync(ADR, 'utf8')
    expect(src).toMatch(/improvement/i)
    expect(src).toMatch(/quick-add|Quick Add|QuickAdd/)
  })
})
