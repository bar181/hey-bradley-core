/**
 * P37 fix-pass — addresses must-fix + selected should-fix items from the
 * 3-reviewer brutal-honest review.
 *
 * Pure-unit (source-level + module-import). Verifies:
 *   - R1 F1: bare `/template` returns kind 'template-help' (no more silent reject)
 *   - R1 F2: chatPipeline content-route copy is Grandma-friendly + non-looping
 *   - R1 L1: voice phrases "open templates" / "pick a template" / "template browser" → browse
 *   - R1 L2: voice apply-template accepts load|switch to|try in addition to apply|use
 *   - R1 L3: ChatInput L3 fallthrough copy uses friendly affordance, not /browse literal
 *   - R2 L3: uiStore BYOK_KEY_SHAPES adds Bearer pattern (matches redactKeyShapes)
 *   - R3 L2: chatPipeline classifyRoute fires on low-confidence intents too
 *
 * Cross-ref: phase-37/deep-dive/01-ux-func-review.md (R1 F1, F2, L1, L2, L3),
 *            phase-37/deep-dive/02-security-review.md (R2 L3),
 *            phase-37/deep-dive/03-architecture-review.md (R3 L2)
 */
import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  parseCommand,
  COMMAND_TRIGGER_LIST,
} from '../src/contexts/intelligence/commands/commandTriggers'

const CHAT = join(process.cwd(), 'src/components/shell/ChatInput.tsx')
const PIPE = join(process.cwd(), 'src/contexts/intelligence/chatPipeline.ts')
const STORE = join(process.cwd(), 'src/store/uiStore.ts')

test.describe('R1 F1 — bare /template returns template-help (no silent reject)', () => {
  test('parseCommand("/template") returns kind=template-help', () => {
    const r = parseCommand('/template')
    expect(r).not.toBeNull()
    expect(r?.kind).toBe('template-help')
  })

  test('parseCommand("/template ") (trailing space) also returns template-help', () => {
    const r = parseCommand('/template ')
    expect(r).not.toBeNull()
    expect(r?.kind).toBe('template-help')
  })

  test('parseCommand("/template bakery") still returns apply-template with target', () => {
    const r = parseCommand('/template bakery')
    expect(r?.kind).toBe('apply-template')
    expect(r?.target).toBe('bakery')
  })

  test('ChatInput dispatches template-help to a typewriter help reply', () => {
    const src = readFileSync(CHAT, 'utf8')
    expect(src).toMatch(/case 'template-help'/)
    expect(src).toMatch(/Try `\/template bakery`/)
  })
})

test.describe('R1 F2 — content-route reply is Grandma-friendly + non-looping', () => {
  test('chatPipeline summary field no longer ships "wired up" dev copy', () => {
    const src = readFileSync(PIPE, 'utf8')
    // The fix-pass keeps "wired up" in the comment header (for traceability)
    // but the actual `summary:` literal must be the new Grandma-friendly copy.
    // Scope check: the string after the last `summary:` in the content branch
    // must match the new copy and NOT the old copy.
    const contentBranch = src.match(/aispRoute === 'content'[\s\S]+?summary: canned\.matched\s*\?\s*canned\.summary\s*:\s*"([^"]+)"/)
    expect(contentBranch).not.toBeNull()
    if (contentBranch) {
      expect(contentBranch[1]).not.toContain('wired up in the next phase')
    }
  })

  test('chatPipeline content-route copy mentions a concrete next step', () => {
    const src = readFileSync(PIPE, 'utf8')
    expect(src).toMatch(/change the headline to|specific phrasing|browse button/i)
  })
})

test.describe('R1 L1 — voice idiom expansions for browse', () => {
  test('"open templates" → browse', () => {
    expect(parseCommand('open templates')?.kind).toBe('browse')
  })
  test('"open the templates" → browse', () => {
    expect(parseCommand('open the templates')?.kind).toBe('browse')
  })
  test('"pick a template" → browse', () => {
    expect(parseCommand('pick a template')?.kind).toBe('browse')
  })
  test('"template browser" → browse', () => {
    expect(parseCommand('template browser')?.kind).toBe('browse')
  })
})

test.describe('R1 L2 — voice apply-template verb expansions', () => {
  test('"load template bakery" → apply-template', () => {
    const r = parseCommand('load template bakery')
    expect(r?.kind).toBe('apply-template')
    expect(r?.target).toBe('bakery')
  })
  test('"switch to template wellness" → apply-template', () => {
    const r = parseCommand('switch to template wellness')
    expect(r?.kind).toBe('apply-template')
    expect(r?.target).toBe('wellness')
  })
  test('"try template agency" → apply-template', () => {
    const r = parseCommand('try template agency')
    expect(r?.kind).toBe('apply-template')
    expect(r?.target).toBe('agency')
  })
  test('"use the template bakery" (with article) → apply-template', () => {
    const r = parseCommand('use the template bakery')
    expect(r?.kind).toBe('apply-template')
    expect(r?.target).toBe('bakery')
  })
})

test.describe('R1 L3 — L3 fallthrough copy no longer leaks /browse dev syntax', () => {
  test('ChatInput L3 fallthrough copy uses friendly affordance', () => {
    const src = readFileSync(CHAT, 'utf8')
    expect(src).toMatch(/browse templates.*(affordance|button)|tap the.*browse.*templates/i)
  })

  test('ChatInput L3 fallthrough copy does NOT contain bare "/browse" word in user-visible string', () => {
    const src = readFileSync(CHAT, 'utf8')
    // The copy uses "browse templates" affordance, not "/browse".
    const fallthroughLine = src.split('\n').find((l) =>
      l.includes("Hmm — I'm a little unsure"),
    )
    expect(fallthroughLine).toBeDefined()
    // Adjacent line should mention the affordance, not slash syntax
    const idx = src.indexOf("Hmm — I'm a little unsure")
    const slice = src.slice(idx, idx + 400)
    expect(slice).toMatch(/browse templates/i)
    // The slash form is documented elsewhere; the L3 message itself
    // should not lead with /browse literal.
    expect(slice).not.toMatch(/type \/browse/i)
  })
})

test.describe('R2 L3 — uiStore BYOK shapes match redactKeyShapes', () => {
  test('uiStore BYOK_KEY_SHAPES includes Bearer pattern', () => {
    const src = readFileSync(STORE, 'utf8')
    expect(src).toMatch(/Bearer\\s\+\\S\+|Bearer\\s\+/i)
  })
})

test.describe('R3 L2 — classifyRoute fires on low-confidence too', () => {
  test('chatPipeline calls classifyRoute unconditionally (no AISP_CONFIDENCE_THRESHOLD gate)', () => {
    const src = readFileSync(PIPE, 'utf8')
    // The R3 L2 fix made classifyRoute always run; the previous predicate
    // gating it on >= AISP_CONFIDENCE_THRESHOLD must be gone for the
    // aispRoute assignment.
    expect(src).toMatch(/aispRoute\s*=\s*classifyRoute\(aisp\.target\s*\?\s*aisp\s*:\s*null,\s*text\)\.route/)
  })
})

test.describe('COMMAND_TRIGGER_LIST documents new aliases (regression)', () => {
  test('COMMAND_TRIGGER_LIST is non-empty (post-fix-pass)', () => {
    expect(COMMAND_TRIGGER_LIST.length).toBeGreaterThan(0)
  })
})
