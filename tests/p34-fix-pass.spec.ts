/**
 * P34+ fix-pass — addresses must-fix items from R1 UX, R2 Functionality,
 * R3 Security, R4 Architecture brutal-honest reviews.
 *
 * - R1 F1 (UX): persistent /browse affordance after first message
 * - R1 F2 (UX): "yours" tag removed (dead branch)
 * - R1 F3 (UX): Escape-key dismiss for /browse + ClarificationPanel
 * - R1 F4 (UX): /browse + Clarification mutually exclusive
 * - R1 L1 (UX): "closest match below ↓" copy alignment with ADR-063
 * - R1 L2 (UX): "X% match" framing instead of "X%" alone
 * - R1 L5 (UX a11y): aria-live region on ClarificationPanel
 * - R2 F1 (Func): clarification trigger gated on `!result.ok`
 * - R2 L4 (Func): VERB_CUES.hide no longer contains 'remove'
 * - R3 F2 (Sec): assumptionStore drops BYOK-shaped originalText
 * - R3 F5 (Sec): generateAssumptions clamps text length
 * - R4 F1 (Arch): SECTION_CUES typed via Partial<Record<AllowedSectionType, ...>>
 *
 * Cross-ref: phase-34/deep-dive/01-ux-review.md, 02-functionality-review.md,
 * 03-security-review.md, 04-architecture-review.md
 */
import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  generateAssumptions,
} from '../src/contexts/intelligence/aisp/assumptions'

const CHAT_INPUT = join(process.cwd(), 'src/components/shell/ChatInput.tsx')
const PANEL = join(process.cwd(), 'src/components/shell/ClarificationPanel.tsx')
const PICKER = join(process.cwd(), 'src/components/shell/TemplateBrowsePicker.tsx')
const ASSUMPTIONS = join(process.cwd(), 'src/contexts/intelligence/aisp/assumptions.ts')
const STORE = join(process.cwd(), 'src/contexts/intelligence/aisp/assumptionStore.ts')

test.describe('R1 F1 — persistent /browse affordance', () => {
  test('ChatInput renders a /browse link after first message', () => {
    const src = readFileSync(CHAT_INPUT, 'utf8')
    expect(src).toMatch(/data-testid="browse-templates-link"/)
    expect(src).toMatch(/messages\.length\s*>\s*0/)
  })
})

test.describe('R1 F2 — "yours" tag dead branch removed', () => {
  test('TemplateBrowsePicker no longer renders the source==="user" branch', () => {
    const src = readFileSync(PICKER, 'utf8')
    expect(src).not.toMatch(/source === 'user'/)
  })
})

test.describe('R1 F3 — Escape-key dismiss', () => {
  test('Both panels handle onKeyDown Escape', () => {
    const src = readFileSync(CHAT_INPUT, 'utf8')
    // Both wrapper divs (browse picker + clarification) declare onKeyDown
    const escapeHandlers = (src.match(/e\.key === 'Escape'/g) ?? []).length
    expect(escapeHandlers).toBeGreaterThanOrEqual(2)
  })
})

test.describe('R1 F4 — /browse + Clarification mutually exclusive', () => {
  test('ChatInput render guard prevents both panels open at once', () => {
    const src = readFileSync(CHAT_INPUT, 'utf8')
    expect(src).toMatch(/showBrowsePicker && !clarification/)
  })

  test('Clarification trigger closes /browse', () => {
    const src = readFileSync(CHAT_INPUT, 'utf8')
    // setShowBrowsePicker(false) appears inside the clarification trigger block
    const clarificationBlock = src.match(/if \([\s\S]*?shouldRequestAssumptions[\s\S]*?\}\s*\}/)
    expect(clarificationBlock).not.toBeNull()
    if (clarificationBlock) {
      expect(clarificationBlock[0]).toContain('setShowBrowsePicker(false)')
    }
  })
})

test.describe('R1 L1 + L2 — copy alignment', () => {
  test('ClarificationPanel uses "Pick the closest match below ↓" copy', () => {
    const src = readFileSync(PANEL, 'utf8')
    expect(src).toContain('Pick the closest match below')
    expect(src).not.toContain("I'm not 100% sure — pick the one you meant")
  })

  test('Confidence pill renders "X% match" not bare "X%"', () => {
    const src = readFileSync(PANEL, 'utf8')
    expect(src).toMatch(/\{Math\.round\(a\.confidence \* 100\)\}%\s*match/)
  })
})

test.describe('R1 L5 — aria-live region', () => {
  test('Clarification wrapper sets role="region" + aria-live="polite"', () => {
    const src = readFileSync(CHAT_INPUT, 'utf8')
    expect(src).toContain('role="region"')
    expect(src).toContain('aria-live="polite"')
    expect(src).toContain('aria-label="Clarification needed"')
  })
})

test.describe('R2 F1 — clarification trigger gated on !result.ok', () => {
  test('ChatInput trigger predicate includes !result.ok', () => {
    const src = readFileSync(CHAT_INPUT, 'utf8')
    expect(src).toMatch(/!result\.ok\s*&&[\s\S]*?shouldRequestAssumptions/)
  })
})

test.describe('R2 L4 — VERB_CUES disambiguated', () => {
  test('VERB_CUES.hide no longer contains "remove"', () => {
    const src = readFileSync(ASSUMPTIONS, 'utf8')
    // Match the literal hide entry; should NOT include 'remove'
    const hideRow = src.match(/hide:\s*\[([^\]]+)\]/)
    expect(hideRow).not.toBeNull()
    if (hideRow) {
      expect(hideRow[1]).not.toContain("'remove'")
    }
  })

  test('VERB_CUES.remove still owns "remove" cue', () => {
    const src = readFileSync(ASSUMPTIONS, 'utf8')
    const removeRow = src.match(/remove:\s*\[([^\]]+)\]/)
    expect(removeRow).not.toBeNull()
    if (removeRow) {
      expect(removeRow[1]).toContain("'remove'")
    }
  })

  test('"remove the testimonials" still produces a hide-canonical rephrasing (canonicalization at call site)', () => {
    // After fix-pass, inferVerb("remove the testimonials") returns 'remove',
    // and the call-site canonicalizes verb='remove' → verbWord='hide' (consistent
    // with INTENT_ATOM remove→hide canonicalization in chatPipeline.ts).
    const r = generateAssumptions({ text: 'remove the testimonials section', intent: null })
    expect(r.length).toBeGreaterThan(0)
    expect(r[0].rephrasing.startsWith('hide')).toBe(true)
  })
})

test.describe('R2 L1 — cue-vs-intent precedence', () => {
  test('strong cue word in text overrides intent.verb', () => {
    // intent says 'change' but text says 'remove' (a strong hide cue) —
    // user voice should win.
    const r = generateAssumptions({
      text: 'remove the testimonials',
      intent: { verb: 'change', target: null, confidence: 0.5, rationale: '' },
    })
    expect(r[0]?.rephrasing.startsWith('hide')).toBe(true)
  })

  test('intent.verb retained when no cue word matches', () => {
    const r = generateAssumptions({
      text: 'the testimonials section',
      intent: { verb: 'add', target: null, confidence: 0.5, rationale: '' },
    })
    expect(r[0]?.rephrasing.startsWith('add')).toBe(true)
  })
})

test.describe('R3 F2 — BYOK leak guard in assumptionStore', () => {
  test('BYOK_KEY_SHAPES exported in limits', () => {
    const src = readFileSync(STORE, 'utf8')
    expect(src).toMatch(/BYOK_KEY_SHAPES/)
    expect(src).toContain('sk-')
    expect(src).toContain('AIza')
    expect(src).toContain('ghp_')
  })

  test('recordAcceptedAssumption refuses BYOK-shaped originalText', () => {
    const src = readFileSync(STORE, 'utf8')
    expect(src).toMatch(/looksLikeSecret\(rec\.originalText\)/)
  })

  test('originalText clamped to MAX_ORIGINAL_TEXT_LENGTH (1024)', () => {
    const src = readFileSync(STORE, 'utf8')
    expect(src).toMatch(/MAX_ORIGINAL_TEXT_LENGTH\s*=\s*1024/)
    expect(src).toMatch(/slice\(0,\s*MAX_ORIGINAL_TEXT_LENGTH\)/)
  })
})

test.describe('R3 F5 — generateAssumptions DoS clamp', () => {
  test('MAX_TEXT_LENGTH bound declared in module', () => {
    const src = readFileSync(ASSUMPTIONS, 'utf8')
    expect(src).toMatch(/MAX_TEXT_LENGTH\s*=\s*8192/)
  })

  test('500K-char input completes quickly + does not blow up', () => {
    const huge = 'hide the hero ' + 'x'.repeat(500_000)
    const startedAt = Date.now()
    const r = generateAssumptions({ text: huge, intent: null })
    const elapsed = Date.now() - startedAt
    // Should be fast (< 100ms even on slow hosts) thanks to the clamp.
    expect(elapsed).toBeLessThan(100)
    // Still produces an assumption (hero cue is in the first 8K).
    expect(r.length).toBeGreaterThan(0)
  })
})

test.describe('R4 F1 — SECTION_CUES typed via AllowedSectionType', () => {
  test('SECTION_CUES uses Partial<Record<AllowedSectionType, ...>>', () => {
    const src = readFileSync(ASSUMPTIONS, 'utf8')
    expect(src).toMatch(/Partial<Record<AllowedSectionType,\s*readonly string\[\]>>/)
    expect(src).toMatch(/type AllowedSectionType\s*=\s*typeof ALLOWED_TARGET_TYPES\[number\]/)
  })

  test('scoreSection signature uses AllowedSectionType (not loose string)', () => {
    const src = readFileSync(ASSUMPTIONS, 'utf8')
    expect(src).toMatch(/scoreSection\(\s*textLower:\s*string,\s*type:\s*AllowedSectionType/)
  })
})
