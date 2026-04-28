/**
 * P37 Sprint F P2 (Wave 1 Agent A1) — Command Trigger System tests.
 *
 * Pure-unit (no browser, no LLM). Verifies:
 *   - parseCommand accepts slash + voice phrasings
 *   - bare nouns ("templates", "design") REJECT
 *   - whole-input matching (rejects embedded phrases)
 *   - case-insensitive
 *   - templated forms extract the target
 *   - COMMAND_TRIGGER_LIST documents every kind
 *   - AISP barrel re-exports parseCommand + COMMAND_TRIGGER_LIST
 *   - ChatInput + ListenTab call parseCommand on submit
 *
 * ADR-066.
 */
import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  parseCommand,
  COMMAND_TRIGGER_LIST,
} from '../src/contexts/intelligence/commands/commandTriggers'

const CHAT_INPUT = join(process.cwd(), 'src/components/shell/ChatInput.tsx')
const LISTEN_TAB = join(process.cwd(), 'src/components/left-panel/ListenTab.tsx')
const AISP_BARREL = join(process.cwd(), 'src/contexts/intelligence/aisp/index.ts')

test.describe('P37 — parseCommand (slash forms)', () => {
  test('/browse → kind:browse', () => {
    const c = parseCommand('/browse')
    expect(c?.kind).toBe('browse')
    expect(c?.raw).toBe('/browse')
  })

  test('/templates → kind:browse (alias)', () => {
    expect(parseCommand('/templates')?.kind).toBe('browse')
  })

  test('/generate → kind:generate', () => {
    expect(parseCommand('/generate')?.kind).toBe('generate')
  })

  test('/design → kind:design', () => {
    expect(parseCommand('/design')?.kind).toBe('design')
  })

  test('/content → kind:content', () => {
    expect(parseCommand('/content')?.kind).toBe('content')
  })

  test('/hide → kind:hide and /show → kind:show', () => {
    expect(parseCommand('/hide')?.kind).toBe('hide')
    expect(parseCommand('/show')?.kind).toBe('show')
  })

  test('/template <name> extracts target', () => {
    const c = parseCommand('/template bakery')
    expect(c?.kind).toBe('apply-template')
    expect(c?.target).toBe('bakery')
  })

  test('/template <multi-word name> preserves whitespace', () => {
    const c = parseCommand('/template harvard capstone')
    expect(c?.kind).toBe('apply-template')
    expect(c?.target).toBe('harvard capstone')
  })

  test('/template with no name returns template-help (P37 R1 F1 fix-pass; was: null)', () => {
    // Pre-fix: bare `/template` was a silent reject. Post-fix: hint-bearing
    // `template-help` kind so the host can surface a friendly help reply.
    expect(parseCommand('/template')?.kind).toBe('template-help')
    expect(parseCommand('/template   ')?.kind).toBe('template-help')
  })

  test('slash forms are case-insensitive', () => {
    expect(parseCommand('/BROWSE')?.kind).toBe('browse')
    expect(parseCommand('/Templates')?.kind).toBe('browse')
    expect(parseCommand('/GENERATE')?.kind).toBe('generate')
  })

  test('leading + trailing whitespace is tolerated', () => {
    expect(parseCommand('  /browse  ')?.kind).toBe('browse')
    expect(parseCommand('\t/generate\n')?.kind).toBe('generate')
  })
})

test.describe('P37 — parseCommand (voice phrasings)', () => {
  test('"browse templates" → kind:browse', () => {
    expect(parseCommand('browse templates')?.kind).toBe('browse')
  })

  test('"show me templates" → kind:browse', () => {
    expect(parseCommand('show me templates')?.kind).toBe('browse')
  })

  test('"show templates" → kind:browse', () => {
    expect(parseCommand('show templates')?.kind).toBe('browse')
  })

  test('"generate content" / "write content" → kind:generate', () => {
    expect(parseCommand('generate content')?.kind).toBe('generate')
    expect(parseCommand('write content')?.kind).toBe('generate')
    expect(parseCommand('write copy')?.kind).toBe('generate')
  })

  test('"design only" / "style only" → kind:design', () => {
    expect(parseCommand('design only')?.kind).toBe('design')
    expect(parseCommand('style only')?.kind).toBe('design')
  })

  test('"content only" / "copy only" → kind:content', () => {
    expect(parseCommand('content only')?.kind).toBe('content')
    expect(parseCommand('copy only')?.kind).toBe('content')
  })

  test('"apply template <name>" + "use template <name>" → apply-template', () => {
    const a = parseCommand('apply template bakery')
    expect(a?.kind).toBe('apply-template')
    expect(a?.target).toBe('bakery')

    const b = parseCommand('use template saas')
    expect(b?.kind).toBe('apply-template')
    expect(b?.target).toBe('saas')
  })

  test('voice phrasings are case-insensitive', () => {
    expect(parseCommand('BROWSE TEMPLATES')?.kind).toBe('browse')
    expect(parseCommand('Generate Content')?.kind).toBe('generate')
  })
})

test.describe('P37 — parseCommand (rejection cases — guardrails)', () => {
  test('bare "templates" alone REJECTS (ambiguous on voice)', () => {
    expect(parseCommand('templates')).toBeNull()
  })

  test('bare "design" / "content" / "generate" REJECT', () => {
    expect(parseCommand('design')).toBeNull()
    expect(parseCommand('content')).toBeNull()
    expect(parseCommand('generate')).toBeNull()
  })

  test('embedded phrases REJECT (whole-input only)', () => {
    expect(parseCommand('hey can you browse templates please')).toBeNull()
    expect(parseCommand('please generate content for me')).toBeNull()
    expect(parseCommand('apply template bakery and add pricing')).not.toBeNull()
    // ↑ apply-template captures the rest as target — this is acceptable
    // because the user was explicit about applying a template; the host
    // can decide to truncate. The test below pins this behaviour:
    expect(parseCommand('apply template bakery and add pricing')?.target).toBe(
      'bakery and add pricing',
    )
  })

  test('empty string + non-string → null', () => {
    expect(parseCommand('')).toBeNull()
    expect(parseCommand('   ')).toBeNull()
    // @ts-expect-error — defensive null branch
    expect(parseCommand(null)).toBeNull()
    // @ts-expect-error — defensive undefined branch
    expect(parseCommand(undefined)).toBeNull()
  })

  test('single slash REJECTS', () => {
    expect(parseCommand('/')).toBeNull()
  })

  test('unrelated slash command REJECTS', () => {
    expect(parseCommand('/foo')).toBeNull()
    expect(parseCommand('/clear')).toBeNull()
  })

  test('voice prose containing "templates" but not the exact phrase REJECTS', () => {
    expect(parseCommand('I want some templates')).toBeNull()
    expect(parseCommand('templates please')).toBeNull()
  })
})

test.describe('P37 — parseCommand (idempotence + return shape)', () => {
  test('repeated calls produce identical triggers (pure function)', () => {
    const a = parseCommand('/browse')
    const b = parseCommand('/browse')
    expect(a).toEqual(b)
  })

  test('CommandTrigger.raw preserves original (trimmed) text', () => {
    expect(parseCommand('  /browse  ')?.raw).toBe('/browse')
    expect(parseCommand('Browse Templates')?.raw).toBe('Browse Templates')
  })
})

test.describe('P37 — COMMAND_TRIGGER_LIST documentation', () => {
  test('documents every CommandKind', () => {
    const kinds = COMMAND_TRIGGER_LIST.map((s) => s.kind)
    expect(kinds).toContain('browse')
    expect(kinds).toContain('apply-template')
    expect(kinds).toContain('generate')
    expect(kinds).toContain('design')
    expect(kinds).toContain('content')
    expect(kinds).toContain('hide')
    expect(kinds).toContain('show')
  })

  test('every entry has slash + description', () => {
    for (const spec of COMMAND_TRIGGER_LIST) {
      expect(spec.slash.length).toBeGreaterThan(0)
      expect(spec.description.length).toBeGreaterThan(0)
    }
  })
})

test.describe('P37 — barrel + host wiring (source-level)', () => {
  test('AISP barrel re-exports parseCommand + COMMAND_TRIGGER_LIST', () => {
    const src = readFileSync(AISP_BARREL, 'utf8')
    expect(src).toContain('parseCommand')
    expect(src).toContain('COMMAND_TRIGGER_LIST')
  })

  test('ChatInput imports parseCommand from the AISP barrel', () => {
    const src = readFileSync(CHAT_INPUT, 'utf8')
    expect(src).toContain('parseCommand')
    expect(src).toMatch(/from\s+['"]@\/contexts\/intelligence\/aisp['"]/)
  })

  test('ChatInput dispatches by command kind in handleSend', () => {
    const src = readFileSync(CHAT_INPUT, 'utf8')
    expect(src).toContain('parseCommand(text)')
    expect(src).toContain("case 'browse'")
    expect(src).toContain("case 'apply-template'")
    expect(src).toContain("case 'generate'")
  })

  test('ChatInput preserves /browse + /templates behaviour (opens picker)', () => {
    const src = readFileSync(CHAT_INPUT, 'utf8')
    // setShowBrowsePicker(true) must still appear in the browse branch.
    expect(src).toMatch(/case 'browse'[\s\S]*?setShowBrowsePicker\(true\)/)
  })

  test('ListenTab calls parseCommand BEFORE setting pttReview', () => {
    // P37 R2 S3 — pipeline lifecycle moved to useListenPipeline.
    const PIPELINE = join(process.cwd(), 'src/components/left-panel/listen/useListenPipeline.ts')
    const src = readFileSync(PIPELINE, 'utf8')
    expect(src).toContain('parseCommand')
    const submitIdx = src.indexOf('submitListenFinal')
    const parseIdx = src.indexOf('parseCommand(text)', submitIdx)
    const reviewIdx = src.indexOf('setPttReview', submitIdx)
    expect(parseIdx).toBeGreaterThan(-1)
    expect(reviewIdx).toBeGreaterThan(-1)
    expect(parseIdx).toBeLessThan(reviewIdx)
  })

  test('ListenTab dispatches command kinds via setPendingChatPrefill', () => {
    const PIPELINE = join(process.cwd(), 'src/components/left-panel/listen/useListenPipeline.ts')
    const src = readFileSync(PIPELINE, 'utf8')
    expect(src).toContain("setLeftPanelTab('chat')")
    expect(src).toContain('setPendingChatPrefill')
  })
})
