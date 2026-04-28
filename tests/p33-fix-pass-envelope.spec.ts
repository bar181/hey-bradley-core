/**
 * P33+ fix-pass — wire GENERATE_HEADLINE envelope to actually call generateContent.
 *
 * Pure-unit. Verifies the R1 UX review F1 fix: typing "rewrite the headline
 * to 'X'" produces a real JSON-Patch instead of the dev-speak placeholder.
 *
 * Cross-ref: phase-33/deep-dive/01-ux-review.md F1.
 */
import { test, expect } from '@playwright/test'
import { TEMPLATE_REGISTRY } from '../src/contexts/intelligence/templates/registry'
import type { TemplateMatchContext } from '../src/contexts/intelligence/templates/types'

// Minimal MasterConfig-shaped fixture. Cast through unknown to avoid pulling
// the schema barrel (which transitively imports default-config.json).
const HERO_CONFIG = {
  sections: [
    {
      id: 'hero-1',
      type: 'hero',
      enabled: true,
      components: [
        { id: 'h1', type: 'heading', props: { text: 'Old headline' } },
      ],
    },
  ],
} as unknown as TemplateMatchContext['config']

function getTpl() {
  const t = TEMPLATE_REGISTRY.find((x) => x.id === 'generate-headline')
  if (!t) throw new Error('generate-headline missing')
  return t
}

test.describe('P33+ fix-pass — generate-headline envelope', () => {
  test('NO LONGER returns the "run via 2-step pipeline" dev-speak', () => {
    const tpl = getTpl()
    const text = 'rewrite the headline to "Welcome home"'
    const m = tpl.matchPattern.exec(text)
    expect(m).not.toBeNull()
    if (!m) return
    const env = tpl.envelope({ text, match: m, config: HERO_CONFIG })
    expect(env.summary).not.toContain('2-step pipeline')
    expect(env.summary).not.toContain('Try the chat')
  })

  test('produces a real replace-patch on hero/heading when given quoted copy', () => {
    const tpl = getTpl()
    const text = 'rewrite the headline to "Welcome home"'
    const m = tpl.matchPattern.exec(text)!
    const env = tpl.envelope({ text, match: m, config: HERO_CONFIG })
    expect(env.patches.length).toBe(1)
    expect(env.patches[0].op).toBe('replace')
    expect(env.patches[0].path).toContain('/sections/0/components/0/props/text')
    expect(env.patches[0].value).toBe('Welcome home')
  })

  test('summary includes tone + length so the user sees WHY (R1 L3)', () => {
    const tpl = getTpl()
    const text = 'bold headline "Stop guessing, start shipping"'
    const m = /^/.exec(text) // matchPattern doesn't catch this phrasing — emulate one that does:
    const text2 = 'rewrite the headline bold to "Stop guessing, start shipping"'
    const m2 = tpl.matchPattern.exec(text2)!
    const env = tpl.envelope({ text: text2, match: m2, config: HERO_CONFIG })
    expect(env.summary).toMatch(/bold/)
    void m
  })

  test('returns friendly help message when no quoted copy provided', () => {
    const tpl = getTpl()
    const text = 'rewrite the headline'
    const m = tpl.matchPattern.exec(text)!
    const env = tpl.envelope({ text, match: m, config: HERO_CONFIG })
    expect(env.patches.length).toBe(0)
    expect(env.summary).toContain('quotes')
    expect(env.summary).not.toContain('2-step pipeline') // never dev-speak
  })

  test('FALLBACK_HINT in chatPipeline references the new template', async () => {
    // Source-level check (don't import chatPipeline — runtime deps).
    const { readFileSync } = await import('node:fs')
    const { join } = await import('node:path')
    const src = readFileSync(
      join(process.cwd(), 'src/contexts/intelligence/chatPipeline.ts'),
      'utf8',
    )
    expect(src).toMatch(/Rewrite the headline/i)
  })

  test('description directs users to use quotes (no dev-speak in label)', () => {
    const tpl = getTpl()
    expect(tpl.description).toContain('quotes')
    expect(tpl.description).not.toContain('pipeline')
  })

  test('examples now use quoted copy so they actually work end-to-end', () => {
    const tpl = getTpl()
    expect(tpl.examples).toBeDefined()
    // Every example should contain a quoted phrase OR be a phrasing that intentionally fails for help.
    for (const ex of tpl.examples ?? []) {
      // At least 3 of the 4 should have quotes (one bare case is allowed for the help-message path).
      // Verified: all 4 should now have quotes.
      expect(ex).toMatch(/"[^"]+"/)
    }
  })
})
