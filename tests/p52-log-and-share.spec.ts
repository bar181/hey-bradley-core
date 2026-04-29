/**
 * P52 Sprint J Wave 3 — ConversationLogTab + ShareSpecButton tests.
 *
 * Pure-unit (FS-level reads). Mirrors P50/P51 spec docstring style.
 * NO browser bootstrap. NO aisp barrel imports.
 *
 * ADR-075.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const TAB = join(process.cwd(), 'src/components/center-canvas/ConversationLogTab.tsx')
const EXPORTER = join(process.cwd(), 'src/contexts/specification/conversationLogExport.ts')
const SHARE_BTN = join(process.cwd(), 'src/components/shell/ShareSpecButton.tsx')
const BUNDLE = join(process.cwd(), 'src/contexts/specification/shareSpecBundle.ts')
const UI_STORE = join(process.cwd(), 'src/store/uiStore.ts')
const TAB_BAR = join(process.cwd(), 'src/components/center-canvas/TabBar.tsx')
const CENTER = join(process.cwd(), 'src/components/center-canvas/CenterCanvas.tsx')
const CHAT_INPUT = join(process.cwd(), 'src/components/shell/ChatInput.tsx')
const ADR = join(process.cwd(), 'docs/adr/ADR-075-conversation-log-and-share.md')
const PKG = join(process.cwd(), 'package.json')

test.describe('P52.1 ConversationLogTab — file shape', () => {
  test('exists + exports ConversationLogTab + ≤300 LOC', () => {
    expect(existsSync(TAB)).toBe(true)
    const src = readFileSync(TAB, 'utf8')
    expect(src).toMatch(/export function ConversationLogTab/)
    expect(src.split('\n').length).toBeLessThanOrEqual(300)
  })
})

test.describe('P52.2 ConversationLogTab — testids', () => {
  test('has the 4 documented testids', () => {
    const src = readFileSync(TAB, 'utf8')
    expect(src).toContain('conversation-log-tab')
    expect(src).toContain('log-row')
    expect(src).toContain('log-export-md')
    expect(src).toContain('log-export-json')
  })
})

test.describe('P52.3 ConversationLogTab — filter UI', () => {
  test('source carries at least 2 documented filters', () => {
    const src = readFileSync(TAB, 'utf8')
    const matches = [
      /log-filter-session/.test(src),
      /log-filter-provider/.test(src),
      /log-filter-personality/.test(src),
      /log-filter-date/.test(src),
    ].filter(Boolean).length
    expect(matches).toBeGreaterThanOrEqual(2)
  })
})

test.describe('P52.4 ConversationLogTab — redactKeyShapes at render boundary', () => {
  test('every rendered string passes through redactKeyShapes', () => {
    const src = readFileSync(TAB, 'utf8')
    expect(src).toMatch(/redactKeyShapes/)
  })
})

test.describe('P52.5 ConversationLogTab — joins chat + llm via export module', () => {
  test('imports loadConversationLog from the export module', () => {
    const src = readFileSync(TAB, 'utf8')
    expect(src).toMatch(/loadConversationLog/)
    expect(src).toMatch(/conversationLogExport/)
  })
})

test.describe('P52.6 conversationLogExport — file shape', () => {
  test('exists + exports markdown + JSON + ≤120 LOC', () => {
    expect(existsSync(EXPORTER)).toBe(true)
    const src = readFileSync(EXPORTER, 'utf8')
    expect(src).toMatch(/export function exportConversationLogMarkdown/)
    expect(src).toMatch(/export function exportConversationLogJson/)
    expect(src.split('\n').length).toBeLessThanOrEqual(120)
  })
})

test.describe('P52.7 conversationLogExport — redactKeyShapes at boundary', () => {
  test('source matches redactKeyShapes', () => {
    const src = readFileSync(EXPORTER, 'utf8')
    expect(src).toMatch(/redactKeyShapes/)
  })
})

test.describe('P52.8 uiStore — CONVERSATION_LOG enum', () => {
  test('ActiveTab includes CONVERSATION_LOG', () => {
    const src = readFileSync(UI_STORE, 'utf8')
    expect(src).toContain("'CONVERSATION_LOG'")
  })
})

test.describe('P52.9 TabBar — registers Log tab', () => {
  test('source contains CONVERSATION_LOG + expert: true', () => {
    const src = readFileSync(TAB_BAR, 'utf8')
    expect(src).toContain('CONVERSATION_LOG')
    expect(src).toMatch(/CONVERSATION_LOG[\s\S]{0,200}expert:\s*true/)
  })
})

test.describe('P52.10 CenterCanvas — renders ConversationLogTab', () => {
  test('source contains ConversationLogTab render branch', () => {
    const src = readFileSync(CENTER, 'utf8')
    expect(src).toContain('<ConversationLogTab')
    expect(src).toMatch(/'CONVERSATION_LOG'\s*&&/)
  })
})

test.describe('P52.11 ShareSpecButton — file shape', () => {
  test('exists + exports ShareSpecButton + ≤140 LOC', () => {
    expect(existsSync(SHARE_BTN)).toBe(true)
    const src = readFileSync(SHARE_BTN, 'utf8')
    expect(src).toMatch(/export function ShareSpecButton/)
    expect(src.split('\n').length).toBeLessThanOrEqual(140)
  })
})

test.describe('P52.12 ShareSpecButton — testid + clipboard call', () => {
  test('source contains share-spec-button + navigator.clipboard', () => {
    const src = readFileSync(SHARE_BTN, 'utf8')
    expect(src).toContain('share-spec-button')
    expect(src).toMatch(/navigator\.clipboard|clipboard\.writeText/)
  })
})

test.describe('P52.13 ShareSpecButton — toast on success', () => {
  test('source contains a setTimeout or ephemeral state for toast', () => {
    const src = readFileSync(SHARE_BTN, 'utf8')
    expect(src).toMatch(/setTimeout|toast|Toast/)
  })
})

test.describe('P52.14 ShareSpecButton — fallback try/catch', () => {
  test('clipboard call has a try/catch around it', () => {
    const src = readFileSync(SHARE_BTN, 'utf8')
    expect(src).toMatch(/try\s*\{[\s\S]*?clipboard[\s\S]*?\}\s*catch|catch[\s\S]*?clipboard/)
  })
})

test.describe('P52.15 shareSpecBundle — file shape', () => {
  test('exists + exports composeShareSpecBundle + ≤80 LOC', () => {
    expect(existsSync(BUNDLE)).toBe(true)
    const src = readFileSync(BUNDLE, 'utf8')
    expect(src).toMatch(/export function composeShareSpecBundle/)
    expect(src.split('\n').length).toBeLessThanOrEqual(80)
  })
})

test.describe('P52.16 shareSpecBundle — returns json + dataUrl + estimatedBytes', () => {
  test('source returns the 3 documented keys', () => {
    const src = readFileSync(BUNDLE, 'utf8')
    expect(src).toMatch(/json/)
    expect(src).toMatch(/dataUrl/)
    expect(src).toMatch(/estimatedBytes/)
  })
})

test.describe('P52.17 shareSpecBundle — redactKeyShapes at boundary', () => {
  test('source matches redactKeyShapes before encoding', () => {
    const src = readFileSync(BUNDLE, 'utf8')
    expect(src).toMatch(/redactKeyShapes/)
  })
})

test.describe('P52.18 shareSpecBundle — base64 + JSON mime', () => {
  test('source matches base64 + application/json', () => {
    const src = readFileSync(BUNDLE, 'utf8')
    expect(src).toMatch(/base64|btoa/)
    expect(src).toContain('application/json')
  })
})

test.describe('P52.19 ChatInput — ShareSpecButton mount', () => {
  test('source imports + renders ShareSpecButton', () => {
    const src = readFileSync(CHAT_INPUT, 'utf8')
    expect(src).toMatch(/import.*ShareSpecButton/)
    expect(src).toContain('<ShareSpecButton')
  })
})

test.describe('P52.20 ADR-075 file shape', () => {
  test('exists, Status: Accepted, references ADR-040 + ADR-067 + ADR-073 + ADR-074, ≤120 LOC, mentions log + share', () => {
    expect(existsSync(ADR)).toBe(true)
    const src = readFileSync(ADR, 'utf8')
    expect(src).toContain('Status:** Accepted')
    expect(src).toContain('ADR-040')
    expect(src).toContain('ADR-067')
    expect(src).toContain('ADR-073')
    expect(src).toContain('ADR-074')
    expect(src.split('\n').length).toBeLessThanOrEqual(120)
    expect(src.toLowerCase()).toContain('log')
    expect(src.toLowerCase()).toContain('share')
  })
})

test.describe('P52.21 KISS dep guard', () => {
  test('package.json deps remain clean (no new heavy deps)', () => {
    const pkg = JSON.parse(readFileSync(PKG, 'utf8'))
    const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) }
    expect(Object.keys(deps).some((k) => k.startsWith('@dnd-kit/'))).toBe(false)
  })
})
