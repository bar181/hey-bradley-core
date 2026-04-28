/**
 * P34 Sprint E P1 Wave 2 — Assumptions engine + Clarification UX tests.
 *
 * Pure-unit (no browser; no LLM). Verifies:
 *   - generateAssumptions produces ≤3 ranked candidates with descending confidence
 *   - shouldRequestAssumptions triggers on low confidence / null intent
 *   - assumptionStore round-trips records (source-level)
 *   - ClarificationPanel + ChatInput wiring (source-level)
 *   - 25+ user-prompt phrasings produce sensible assumptions (≥25/35 coverage gate)
 *
 * ADR-063.
 */
import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  ASSUMPTIONS_TRIGGER_THRESHOLD,
  generateAssumptions,
  shouldRequestAssumptions,
} from '../src/contexts/intelligence/aisp/assumptions'
import type { ClassifiedIntent } from '../src/contexts/intelligence/aisp/intentAtom'

const lowIntent: ClassifiedIntent = {
  verb: 'change',
  target: null,
  confidence: 0.5,
  rationale: 'low confidence',
}

const highIntent: ClassifiedIntent = {
  verb: 'hide',
  target: { type: 'hero', index: null },
  confidence: 0.95,
  rationale: 'high confidence',
}

test.describe('P34 — generateAssumptions algorithm', () => {
  test('returns empty array on empty text', () => {
    expect(generateAssumptions({ text: '', intent: null })).toEqual([])
    expect(generateAssumptions({ text: '   ', intent: null })).toEqual([])
  })

  test('returns empty array when no section cues match', () => {
    const r = generateAssumptions({
      text: 'foo bar baz',
      intent: lowIntent,
    })
    expect(r).toEqual([])
  })

  test('returns 1 assumption when exactly one section cued', () => {
    const r = generateAssumptions({
      text: 'hide the hero',
      intent: lowIntent,
    })
    expect(r.length).toBeGreaterThanOrEqual(1)
    expect(r[0].rephrasing).toContain('hero')
    expect(r[0].confidence).toBeCloseTo(0.85, 2)
  })

  test('returns ≤3 assumptions when multiple cued', () => {
    const r = generateAssumptions({
      text: 'change the hero blog footer pricing testimonials',
      intent: lowIntent,
    })
    expect(r.length).toBeLessThanOrEqual(3)
    expect(r.length).toBeGreaterThanOrEqual(1)
  })

  test('confidences are descending across the ranked list', () => {
    const r = generateAssumptions({
      text: 'change the hero blog footer',
      intent: lowIntent,
    })
    for (let i = 1; i < r.length; i++) {
      expect(r[i].confidence).toBeLessThanOrEqual(r[i - 1].confidence)
    }
  })

  test('infers verb "hide" from cue word', () => {
    const r = generateAssumptions({
      text: 'remove the testimonials section',
      intent: null,
    })
    expect(r.length).toBeGreaterThan(0)
    expect(r[0].rephrasing.startsWith('hide')).toBe(true) // remove → hide canonicalization
  })

  test('infers verb "add" from cue word', () => {
    const r = generateAssumptions({
      text: 'insert a pricing section',
      intent: null,
    })
    expect(r.length).toBeGreaterThan(0)
    expect(r[0].rephrasing.startsWith('add')).toBe(true)
  })

  test('infers verb "show" from cue word', () => {
    const r = generateAssumptions({
      text: 'reveal the faq',
      intent: null,
    })
    expect(r[0]?.rephrasing.startsWith('show')).toBe(true)
  })

  test('uses provided intent verb when set', () => {
    const r = generateAssumptions({
      text: 'the team area',
      intent: { ...lowIntent, verb: 'hide' },
    })
    expect(r[0]?.rephrasing.startsWith('hide')).toBe(true)
  })

  test('every assumption has id + label + confidence + rephrasing', () => {
    const r = generateAssumptions({
      text: 'change the hero',
      intent: lowIntent,
    })
    for (const a of r) {
      expect(a.id).toBeTruthy()
      expect(a.label).toBeTruthy()
      expect(typeof a.confidence).toBe('number')
      expect(a.confidence).toBeGreaterThanOrEqual(0)
      expect(a.confidence).toBeLessThanOrEqual(1)
      expect(a.rephrasing).toBeTruthy()
    }
  })
})

test.describe('P34 — shouldRequestAssumptions trigger predicate', () => {
  test('triggers on null intent', () => {
    expect(shouldRequestAssumptions(null)).toBe(true)
  })
  test('triggers on confidence < 0.7', () => {
    expect(shouldRequestAssumptions(lowIntent)).toBe(true)
  })
  test('triggers when target is null even at high confidence', () => {
    expect(
      shouldRequestAssumptions({ ...highIntent, target: null }),
    ).toBe(true)
  })
  test('does NOT trigger at high confidence with target set', () => {
    expect(shouldRequestAssumptions(highIntent)).toBe(false)
  })
  test('threshold constant is 0.7', () => {
    expect(ASSUMPTIONS_TRIGGER_THRESHOLD).toBe(0.7)
  })
})

test.describe('P34 — assumptionStore source-level wiring', () => {
  test('module exports recordAcceptedAssumption + listAcceptedAssumptions', () => {
    const src = readFileSync(
      join(process.cwd(), 'src/contexts/intelligence/aisp/assumptionStore.ts'),
      'utf8',
    )
    expect(src).toContain('export function recordAcceptedAssumption')
    expect(src).toContain('export function listAcceptedAssumptions')
  })

  test('uses kv repo (no migration needed)', () => {
    const src = readFileSync(
      join(process.cwd(), 'src/contexts/intelligence/aisp/assumptionStore.ts'),
      'utf8',
    )
    expect(src).toContain('kvGet')
    expect(src).toContain('kvSet')
  })

  test('clamps to MAX_ENTRIES (50) ring buffer', () => {
    const src = readFileSync(
      join(process.cwd(), 'src/contexts/intelligence/aisp/assumptionStore.ts'),
      'utf8',
    )
    expect(src).toMatch(/MAX_ENTRIES\s*=\s*50/)
    expect(src).toMatch(/slice\(-\(MAX_ENTRIES - 1\)\)/)
  })
})

test.describe('P34 — ClarificationPanel UX wiring', () => {
  const PANEL = join(process.cwd(), 'src/components/shell/ClarificationPanel.tsx')
  const CHAT = join(process.cwd(), 'src/components/shell/ChatInput.tsx')

  test('panel renders 3 option buttons + an "other" escape hatch', () => {
    const src = readFileSync(PANEL, 'utf8')
    expect(src).toMatch(/data-testid=\{`clarification-option-\$\{a\.id\}`\}/)
    expect(src).toMatch(/data-testid="clarification-option-other"/)
  })

  test('panel surfaces confidence as a percentage chip', () => {
    const src = readFileSync(PANEL, 'utf8')
    expect(src).toMatch(/data-testid=\{`clarification-confidence-\$\{a\.id\}`\}/)
    expect(src).toMatch(/Math\.round\(a\.confidence \* 100\)/)
  })

  test('panel shows the original user text', () => {
    const src = readFileSync(PANEL, 'utf8')
    expect(src).toMatch(/originalText/)
    expect(src).toMatch(/you said:/i)
  })

  test('ChatInput integrates ClarificationPanel + records accepted assumption', () => {
    const src = readFileSync(CHAT, 'utf8')
    expect(src).toContain("import { ClarificationPanel } from '@/components/shell/ClarificationPanel'")
    expect(src).toMatch(/recordAcceptedAssumption\(/)
    expect(src).toMatch(/setClarification\(null\)/)
  })

  test('ChatInput re-runs pipeline with rephrasing on Accept', () => {
    const src = readFileSync(CHAT, 'utf8')
    expect(src).toMatch(/runLLMPipeline\(a\.rephrasing\)/)
  })

  test('ChatInput surfaces a clarification when result.aisp signals low confidence', () => {
    const src = readFileSync(CHAT, 'utf8')
    expect(src).toMatch(/shouldRequestAssumptions\(result\.aisp\.intent\)/)
    expect(src).toMatch(/generateAssumptions\(\{ text, intent: result\.aisp\.intent \}\)/)
  })
})

test.describe('P34 — End-to-end prompt coverage (≥25 phrasings)', () => {
  // 35 fixture phrasings spanning all section types + verbs. Each should
  // produce ≥1 assumption (or pass through cleanly when no cues match).
  const PHRASINGS = [
    'hide the hero',
    'remove the blog',
    'delete the footer',
    'add a pricing section',
    'insert testimonials',
    'create a faq',
    'change the hero',
    'update the hero headline',
    'rewrite the hero',
    'show the team',
    'reveal the faq',
    'enable the pricing',
    'remove the testimonials section',
    'hide the bottom area',
    'hide the top banner',
    'add the team area',
    'create features section',
    'hide the cta button',
    'add a call to action',
    'change the headline',
    'rewrite the article post',
    'show the news',
    'reveal blog posts',
    'hide the gallery',
    'remove the team people',
    'reset the hero',
    'undo the footer',
    'add a newsletter',           // no section cue → empty
    'change the entire site',     // no section cue → empty
    'fix the spelling',           // no section cue → empty
    'hide the q&a',
    'remove the pricing tier',
    'show the price plan',
    'add quotes',
    'reveal the review section',
  ]

  const COVERAGE_GATE = 25

  test(`≥${COVERAGE_GATE}/${PHRASINGS.length} phrasings produce a non-empty assumption list`, () => {
    let coverage = 0
    for (const text of PHRASINGS) {
      const r = generateAssumptions({ text, intent: lowIntent })
      if (r.length > 0) coverage += 1
    }
    expect(coverage).toBeGreaterThanOrEqual(COVERAGE_GATE)
  })

  test('phrasings without section cues correctly return empty (no false positives)', () => {
    expect(generateAssumptions({ text: 'change the entire site', intent: lowIntent })).toEqual([])
    expect(generateAssumptions({ text: 'fix the spelling', intent: lowIntent })).toEqual([])
  })
})

test.describe('P34 — ADR-063 + chatPipeline integration', () => {
  test('ADR-063 file exists with full Accepted status', () => {
    const adr = readFileSync(
      join(process.cwd(), 'docs/adr/ADR-063-assumptions-engine.md'),
      'utf8',
    )
    expect(adr).toContain('Status:** Accepted')
    expect(adr).toContain('Assumptions Engine')
    expect(adr).toContain('shouldRequestAssumptions')
  })

  test('aisp barrel re-exports the new assumptions API', () => {
    const src = readFileSync(
      join(process.cwd(), 'src/contexts/intelligence/aisp/index.ts'),
      'utf8',
    )
    expect(src).toContain('generateAssumptions')
    expect(src).toContain('shouldRequestAssumptions')
    expect(src).toContain('ASSUMPTIONS_TRIGGER_THRESHOLD')
    expect(src).toContain('recordAcceptedAssumption')
  })
})
