/**
 * P34 Sprint E P1 (Sprint D UI closure) — Wave 1 wiring tests.
 *
 * Pure-unit (no browser). Verifies source-level wiring of the AISPTranslationPanel
 * and TemplateBrowsePicker into ChatInput + the chatPipeline result extension.
 *
 * Closes R1 F2 (AISPTranslationPanel orphaned → wired) + R1 F3 + F4
 * (browse-picker UI + examples discovery surface).
 */
import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const CHAT_INPUT = join(process.cwd(), 'src/components/shell/ChatInput.tsx')
const PANEL_FILE = join(process.cwd(), 'src/components/shell/AISPTranslationPanel.tsx')
const PICKER_FILE = join(process.cwd(), 'src/components/shell/TemplateBrowsePicker.tsx')
const PIPELINE_FILE = join(process.cwd(), 'src/contexts/intelligence/chatPipeline.ts')

test.describe('A1 — chatPipeline result carries AISP trace', () => {
  test('ChatPipelineResult declares aisp + templateId fields', () => {
    const src = readFileSync(PIPELINE_FILE, 'utf8')
    expect(src).toMatch(/aisp\?:\s*\{/)
    expect(src).toMatch(/templateId\?:\s*string\s*\|\s*null/)
  })

  test('aisp source enum includes rules | llm | fallthrough', () => {
    const src = readFileSync(PIPELINE_FILE, 'utf8')
    expect(src).toMatch(/'rules'\s*\|\s*'llm'\s*\|\s*'fallthrough'/)
  })

  test('every chatPipeline return path includes aisp metadata', () => {
    const src = readFileSync(PIPELINE_FILE, 'utf8')
    // 5 return statements should include aisp:
    // 1. template patcher success, 2. template empty-patch, 3. LLM success,
    // 4. no_adapter precondition, 5. canned-fallback exit
    const aispReturnsCount = (src.match(/aisp:\s*aispTrace/g) ?? []).length
    expect(aispReturnsCount).toBeGreaterThanOrEqual(5)
  })

  test('aispSource is set to "llm" when LLM classifier wins', () => {
    const src = readFileSync(PIPELINE_FILE, 'utf8')
    expect(src).toMatch(/aispSource\s*=\s*'llm'/)
  })

  test('aispSource defaults to "rules" and falls to "fallthrough"', () => {
    const src = readFileSync(PIPELINE_FILE, 'utf8')
    expect(src).toMatch(/aispSource:\s*'rules'\s*\|\s*'llm'\s*\|\s*'fallthrough'\s*=\s*'rules'/)
    expect(src).toMatch(/aispSource\s*=\s*'fallthrough'/)
  })
})

test.describe('A1 — AISPTranslationPanel renders inline under bradley messages', () => {
  test('ChatInput imports AISPSurface (P35 fix-pass dispatcher; supersedes direct AISPTranslationPanel import)', () => {
    const src = readFileSync(CHAT_INPUT, 'utf8')
    expect(src).toContain("import { AISPSurface } from '@/components/shell/AISPSurface'")
    // The dispatcher renders AISPTranslationPanel internally in SIMPLE mode.
    const surfaceSrc = readFileSync(
      join(process.cwd(), 'src/components/shell/AISPSurface.tsx'),
      'utf8',
    )
    expect(surfaceSrc).toContain("import { AISPTranslationPanel }")
  })

  test('ChatInput captures AISP trace into pendingAispRef on submit', () => {
    const src = readFileSync(CHAT_INPUT, 'utf8')
    expect(src).toContain('pendingAispRef')
    expect(src).toMatch(/pendingAispRef\.current\s*=\s*\{/)
  })

  test('ChatMessage carries optional aisp + userText + templateId', () => {
    const src = readFileSync(CHAT_INPUT, 'utf8')
    expect(src).toMatch(/aisp\?:\s*\{/)
    expect(src).toMatch(/userText\?:\s*string/)
    expect(src).toMatch(/templateId\?:\s*string\s*\|\s*null/)
  })

  test('AISPSurface rendered inside the bradley message branch (renders AISPTranslationPanel in SIMPLE mode internally)', () => {
    const src = readFileSync(CHAT_INPUT, 'utf8')
    expect(src).toMatch(/msg\.role === 'bradley' && msg\.userText && msg\.aisp/)
    expect(src).toMatch(/<AISPSurface/)
  })

  test('AISPTranslationPanel accepts templateId prop (chip even with null intent)', () => {
    const src = readFileSync(PANEL_FILE, 'utf8')
    expect(src).toMatch(/templateId\?:\s*string\s*\|\s*null/)
    // Renders chip when templateId set
    expect(src).toMatch(/data-testid="aisp-template-chip"/)
    // Falls back gracefully when intent is null but templateId is set
    expect(src).toMatch(/if \(!intent && !templateId\) return null/)
  })
})

test.describe('A2 — TemplateBrowsePicker component + /browse trigger', () => {
  test('TemplateBrowsePicker module exists with onPick + onClose props', () => {
    const src = readFileSync(PICKER_FILE, 'utf8')
    expect(src).toMatch(/export function TemplateBrowsePicker/)
    expect(src).toMatch(/onPick:\s*\(examplePhrase:\s*string\)\s*=>\s*void/)
    expect(src).toMatch(/onClose:\s*\(\)\s*=>\s*void/)
  })

  test('TemplateBrowsePicker uses listAllForBrowse + groups by category', () => {
    const src = readFileSync(PICKER_FILE, 'utf8')
    expect(src).toContain('listAllForBrowse')
    expect(src).toMatch(/categoryOrder/)
    expect(src).toContain("'theme'")
    expect(src).toContain("'section'")
    expect(src).toContain("'content'")
  })

  test('Each template card has data-testid + click handler', () => {
    const src = readFileSync(PICKER_FILE, 'utf8')
    expect(src).toMatch(/data-testid={`template-card-\$\{t\.id\}`}/)
    expect(src).toMatch(/onClick={\(\) => onPick\(example\)}/)
  })

  test('R1 F2 fix-pass: "yours" tag dead branch removed (no source==="user" rendering)', () => {
    const src = readFileSync(PICKER_FILE, 'utf8')
    // Branch must be gone until P34+ wires loadUserRows so it can never mislead.
    expect(src).not.toMatch(/source === 'user'/)
    // Ensure no JSX renders the literal "yours" copy (comments are fine).
    expect(src).not.toMatch(/>\s*yours\s*</)
  })

  test('ChatInput wires /browse slash command to setShowBrowsePicker(true)', () => {
    const src = readFileSync(CHAT_INPUT, 'utf8')
    expect(src).toContain("text === '/browse'")
    expect(src).toMatch(/setShowBrowsePicker\(true\)/)
  })

  test('Picker click fills input and closes picker', () => {
    const src = readFileSync(CHAT_INPUT, 'utf8')
    expect(src).toMatch(/onPick=\{\(example\) => \{\s+setInput\(example\)/)
    expect(src).toMatch(/setShowBrowsePicker\(false\)/)
  })

  test('Empty-state hint mentions /browse so users discover the picker', () => {
    const src = readFileSync(CHAT_INPUT, 'utf8')
    expect(src).toMatch(/type\s*<span[^>]*>\/browse<\/span>\s*to pick a template/)
  })
})
