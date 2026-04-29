/**
 * P55 Sprint L Wave 1 — Make The Spec Unmissable.
 *
 * Pure-unit (FS-level reads). Mirrors P54 spec docstring style.
 * NO browser bootstrap. NO aisp barrel imports. Each assertion body ≤6 lines.
 *
 * Some cases may fail until A1 (always-on trace) and A2 (spec auto-open +
 * primary-tab promotion) land — those are expected-failures by design and
 * GREEN-flip on Wave 1 seal.
 *
 * ADR-078.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const AISP_PANEL = join(ROOT, 'src/components/shell/AISPTranslationPanel.tsx')
// A1 factored the always-on pill out into AISPTraceLine; the panel + the
// EXPERT pipeline pane both mount it. Tests P55.1-P55.4 read the trace line.
const TRACE_LINE = join(ROOT, 'src/components/shell/AISPTraceLine.tsx')
const UI_STORE = join(ROOT, 'src/store/uiStore.ts')
const CENTER = join(ROOT, 'src/components/center-canvas/CenterCanvas.tsx')
const TAB_BAR = join(ROOT, 'src/components/center-canvas/TabBar.tsx')
const XAI_TAB = join(ROOT, 'src/components/center-canvas/XAIDocsTab.tsx')
const ADR = join(ROOT, 'docs/adr/ADR-078-spec-unmissable.md')
const PKG = join(ROOT, 'package.json')
const WIKI = join(ROOT, 'docs/wiki/llm-call-process-flow.md')

test.describe('P55.1 AISP trace always-on — testid present outside any collapse', () => {
  test('AISPTraceLine renders the always-on testid; the panel mounts it above the toggle', () => {
    const traceSrc = readFileSync(TRACE_LINE, 'utf8')
    expect(traceSrc).toContain('aisp-trace-always-on')
    const panelSrc = readFileSync(AISP_PANEL, 'utf8')
    // The mount sits above the existing collapsible toggle (not inside `{open && …}`)
    const mountIdx = panelSrc.indexOf('<AISPTraceLine')
    const toggleIdx = panelSrc.indexOf('aisp-translation-toggle')
    expect(mountIdx).toBeGreaterThan(0)
    expect(mountIdx).toBeLessThan(toggleIdx)
  })
})

test.describe('P55.2 AISPTraceLine — DRAFT mode "I understood:" format', () => {
  test('source contains the simplified DRAFT message', () => {
    const src = readFileSync(TRACE_LINE, 'utf8')
    expect(src).toMatch(/I understood/)
  })
})

test.describe('P55.3 AISPTraceLine — EXPERT mode Crystal Atom labels', () => {
  test('source contains all five Crystal Atom symbols', () => {
    const src = readFileSync(TRACE_LINE, 'utf8')
    expect(src.includes('Ω') && src.includes('Σ') && src.includes('Γ')).toBe(true)
    expect(src.includes('Λ') && src.includes('Ε')).toBe(true)
  })
})

test.describe('P55.4 AISPTraceLine — atom light-up animation', () => {
  test('source contains transition + pulse/duration animation hint', () => {
    const src = readFileSync(TRACE_LINE, 'utf8')
    expect(src).toContain('transition')
    expect(/animate-pulse|duration-/.test(src)).toBe(true)
  })
})

test.describe('P55.5 uiStore — specPanelHasAutoOpened field', () => {
  test('source declares the auto-open boolean field', () => {
    const src = readFileSync(UI_STORE, 'utf8')
    expect(src).toContain('specPanelHasAutoOpened')
  })
})

test.describe('P55.6 uiStore — kv persistence key', () => {
  test('source contains the kv persistence key', () => {
    const src = readFileSync(UI_STORE, 'utf8')
    expect(src).toContain('ui_spec_panel_auto_opened')
  })
})

test.describe('P55.7 uiStore — markSpecAutoOpened action', () => {
  test('source declares the markSpecAutoOpened action', () => {
    const src = readFileSync(UI_STORE, 'utf8')
    expect(src).toContain('markSpecAutoOpened')
  })
})

test.describe('P55.8 uiStore — specHasUnseenUpdate field', () => {
  test('source declares the unseen-update boolean field', () => {
    const src = readFileSync(UI_STORE, 'utf8')
    expect(src).toContain('specHasUnseenUpdate')
  })
})

test.describe('P55.9 CenterCanvas — auto-open wired to first patch', () => {
  test('source calls setActiveTab(XAI_DOCS) AND markSpecAutoOpened', () => {
    const src = readFileSync(CENTER, 'utf8')
    expect(src).toContain("setActiveTab('XAI_DOCS')")
    expect(src).toContain('markSpecAutoOpened')
  })
})

test.describe('P55.10 TabBar — XAI_DOCS promoted above DATA', () => {
  test('TABS array order has XAI_DOCS above DATA', () => {
    const src = readFileSync(TAB_BAR, 'utf8')
    const xaiIdx = src.indexOf("'XAI_DOCS'")
    const dataIdx = src.indexOf("'DATA'")
    expect(xaiIdx).toBeGreaterThan(-1)
    expect(dataIdx).toBeGreaterThan(-1)
    expect(xaiIdx).toBeLessThan(dataIdx)
  })
})

test.describe('P55.11 TabBar — unseen-update indicator', () => {
  test('source references spec-unseen-indicator testid OR specHasUnseenUpdate', () => {
    const src = readFileSync(TAB_BAR, 'utf8')
    expect(src.includes('spec-unseen-indicator') || src.includes('specHasUnseenUpdate')).toBe(true)
  })
})

test.describe('P55.12 XAIDocsTab — human-readable default view', () => {
  test('source declares a human-readable sub-tab default if sub-tabs exist', () => {
    if (!existsSync(XAI_TAB)) test.skip()
    const src = readFileSync(XAI_TAB, 'utf8')
    expect(/human|Human|readable|Readable/.test(src)).toBe(true)
  })
})

test.describe('P55.13 ADR-078 — file shape + cross-refs', () => {
  test('exists, Status: Accepted, ≤120 LOC, refs ADR-053 + ADR-073 + ADR-077', () => {
    expect(existsSync(ADR)).toBe(true)
    const src = readFileSync(ADR, 'utf8')
    expect(src).toContain('Status:** Accepted')
    expect(src.split('\n').length).toBeLessThanOrEqual(120)
    expect(src.includes('ADR-053') && src.includes('ADR-073') && src.includes('ADR-077')).toBe(true)
  })
})

test.describe('P55.14 KISS dep guard — Sprint L adds no new animation deps', () => {
  test('package.json has not added react-spring; framer-motion pin unchanged from pre-P55', () => {
    const src = readFileSync(PKG, 'utf8')
    expect(src.includes('react-spring')).toBe(false)
    expect(src).toMatch(/"framer-motion":\s*"\^12\.38\.0"/)
  })
})

test.describe('P55.15 Wiki — phase pin ≥ P55', () => {
  test('llm-call-process-flow.md "Last verified" header references P55 or later', () => {
    const src = readFileSync(WIKI, 'utf8')
    const m = src.match(/Last verified against code:\*\*\s*P(\d{2,})/)
    expect(m).not.toBeNull()
    expect(Number(m![1])).toBeGreaterThanOrEqual(55)
  })
})
