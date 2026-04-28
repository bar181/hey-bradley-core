/**
 * P37 Sprint F P2 — Listen ↔ Chat Bridge Integration (PURE-UNIT).
 *
 * The bridge thesis: voice + text consume the SAME upstream gates —
 *   1. parseCommand (A1; commandTriggers.ts)        — slash + voice
 *   2. classifyRoute (A2; aisp/routeClassifier.ts)  — content vs design
 *
 * Tests the COMPOSITION of the two gates plus source-level wiring across
 * ChatInput + chatPipeline. No browser, no LLM, no sql.js. Mirrors p36
 * spec style (readFileSync source assertions + pure-fn behaviour).
 *
 * 33/35 prompt-coverage gate: 35 representative voice + chat phrasings
 * should resolve to either a command kind OR a non-ambiguous route.
 *
 * ADR-066.
 */
import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  parseCommand,
  COMMAND_TRIGGER_LIST,
  type CommandKind,
} from '../src/contexts/intelligence/commands/commandTriggers'
import { classifyRoute } from '../src/contexts/intelligence/aisp/routeClassifier'
import { classifyIntent } from '../src/contexts/intelligence/aisp/intentClassifier'

const CHAT_PIPELINE = join(process.cwd(), 'src/contexts/intelligence/chatPipeline.ts')
const CHAT_INPUT = join(process.cwd(), 'src/components/shell/ChatInput.tsx')
const ADR = join(process.cwd(), 'docs/adr/ADR-066-command-system-and-route-split.md')

/* 1) bridge composition (parseCommand + classifyRoute) */

test.describe('P37 — bridge composition', () => {
  test('parseCommand catches commands BEFORE classifyRoute would run', () => {
    // Voice "browse templates" → command; host bypasses classifyRoute.
    expect(parseCommand('browse templates')?.kind).toBe('browse')
  })

  test('classifyRoute runs on non-command input only', () => {
    expect(parseCommand('change the headline to "Welcome"')).toBeNull()
    const intent = classifyIntent('change the headline to "Welcome"')
    expect(classifyRoute(intent, 'change the headline to "Welcome"').route).toBe('content')
  })

  test('voice "browse templates" → browse command (skip atoms entirely)', () => {
    // Mirrors ListenTab handoff: voice → parseCommand → bypass review +
    // switch to chat tab to surface the picker.
    expect(parseCommand('browse templates')?.kind).toBe('browse')
  })

  test('text "/content rewrite hero" — compound is null; route classifier wins', () => {
    // parseCommand is whole-input only — "/content rewrite hero" is not a
    // bare slash, so it returns null (correct). The route classifier on the
    // remaining text routes to 'content' via the explicit content verb.
    expect(parseCommand('/content rewrite hero')).toBeNull()
    const intent = classifyIntent('rewrite hero')
    expect(classifyRoute(intent, 'rewrite hero').route).toBe('content')
  })

  test('bare /content slash → content command', () => {
    expect(parseCommand('/content')?.kind).toBe('content')
  })

  test('design verb "hide the hero" → design route (no command)', () => {
    expect(parseCommand('hide the hero')).toBeNull()
    const intent = classifyIntent('hide the hero')
    expect(classifyRoute(intent, 'hide the hero').route).toBe('design')
  })

  test('content noun + generic verb → content route', () => {
    const intent = classifyIntent('update the tagline')
    expect(classifyRoute(intent, 'update the tagline').route).toBe('content')
  })

  test('bare "change it" → ambiguous (ASSUMPTIONS_ATOM territory)', () => {
    const intent = classifyIntent('change it')
    expect(classifyRoute(intent, 'change it').route).toBe('ambiguous')
  })

  test('parseCommand + classifyRoute are idempotent (pure fn contract)', () => {
    expect(parseCommand('/browse')).toEqual(parseCommand('/browse'))
    const intent = classifyIntent('rewrite the headline')
    expect(classifyRoute(intent, 'rewrite the headline')).toEqual(
      classifyRoute(intent, 'rewrite the headline'),
    )
  })
})

/* 2) surface wiring (source-level) */

test.describe('P37 — surface wiring', () => {
  test('ChatInput imports parseCommand + dispatches every CommandKind', () => {
    const src = readFileSync(CHAT_INPUT, 'utf8')
    expect(src).toMatch(/parseCommand/)
    const kinds: ReadonlyArray<CommandKind> = ['browse', 'apply-template', 'generate', 'design', 'content']
    for (const k of kinds) expect(src).toContain(`case '${k}':`)
  })

  test('chatPipeline imports classifyRoute + gates content path before LLM', () => {
    const src = readFileSync(CHAT_PIPELINE, 'utf8')
    expect(src).toMatch(/classifyRoute/)
    expect(src).toMatch(/'@\/contexts\/intelligence\/aisp'/)
    expect(src).toMatch(/aispRoute\s*===\s*'content'/)
  })
})

/* 3) ADR-066 doc-quality */

test.describe('P37 — ADR-066', () => {
  test('Status Accepted; cross-refs INTENT/SELECTION/CONTENT/ASSUMPTIONS/LISTEN', () => {
    const adr = readFileSync(ADR, 'utf8')
    expect(adr).toContain('**Status:** Accepted')
    expect(adr).toContain('**Phase:** P37')
    for (const id of ['ADR-053', 'ADR-057', 'ADR-060', 'ADR-064', 'ADR-065']) {
      expect(adr).toContain(id)
    }
    expect(adr).toMatch(/parseCommand/)
    expect(adr).toMatch(/classifyRoute/)
    expect(adr).toMatch(/ambiguous/i)
  })
})

/* 4) 33/35 prompt coverage gate */

test.describe('P37 — coverage gate', () => {
  test('≥33/35 representative prompts resolve to a command OR a non-ambiguous route', () => {
    const prompts: ReadonlyArray<string> = [
      // commands — slash
      '/browse', '/templates', '/generate', '/design', '/content', '/template bakery',
      // commands — voice
      'browse templates', 'show me templates', 'apply template wellness',
      'generate content', 'design only', 'content only',
      // design route
      'hide the hero', 'show the testimonials', 'add a pricing section',
      'remove the blog', 'reset the hero', 'change to dark mode',
      'make the theme brighter', 'change the colors', 'change the layout',
      // content route
      'rewrite the headline', 'regenerate the tagline', 'rephrase the body',
      'reword the description', 'change the headline to "Welcome"',
      'update the subtitle', 'set the title to "Hello"', 'rewrite the copy',
      // mixed / edge
      'make it professional', 'add a faq section', 'show the team',
      'make the hero brighter', 'change the footer', 'rewrite the headline bold',
    ]

    expect(prompts.length).toBe(35)
    let resolved = 0
    const ambiguous: string[] = []
    for (const p of prompts) {
      const cmd = parseCommand(p)
      if (cmd) { resolved += 1; continue }
      const intent = classifyIntent(p)
      const r = classifyRoute(intent, p)
      if (r.route !== 'ambiguous') resolved += 1
      else ambiguous.push(p)
    }
    if (resolved < 33) console.warn('[p37 coverage] ambiguous:', ambiguous)
    expect(resolved).toBeGreaterThanOrEqual(33)
  })

  test('every COMMAND_TRIGGER_LIST entry has a slash form + kind', () => {
    for (const spec of COMMAND_TRIGGER_LIST) {
      expect(spec.slash.startsWith('/')).toBe(true)
      expect(spec.kind).toBeTruthy()
    }
  })
})
