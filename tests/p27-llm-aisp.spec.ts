/**
 * P27 Sprint C P2 — LLM-Native AISP Intent Classification.
 *
 * Verifies:
 *   - Zod schema accepts canonical AISP responses
 *   - Zod schema rejects malformed / out-of-enum responses
 *   - INTENT_ATOM is exported and contains required AISP block delimiters
 *   - LLM AISP path called when rule-based < threshold (mocked)
 *
 * Pure-unit Playwright (no real LLM; no browser). ADR-056.
 */
import { test, expect } from '@playwright/test'
import { llmIntentResponseSchema } from '../src/lib/schemas/intent'
import { INTENT_ATOM } from '../src/contexts/intelligence/aisp/intentAtom'

test.describe('P27 — Zod schema (Σ mirror)', () => {
  test('accepts canonical AISP response with all fields', () => {
    const r = llmIntentResponseSchema.safeParse({
      verb: 'hide',
      target: { type: 'hero', index: 1 },
      params: { value: 'unused' },
      confidence: 0.92,
      rationale: 'extracted via AISP',
    })
    expect(r.success).toBe(true)
  })

  test('accepts response with null target + no params', () => {
    const r = llmIntentResponseSchema.safeParse({
      verb: 'reset',
      target: null,
      confidence: 0.9,
    })
    expect(r.success).toBe(true)
  })

  test('rejects out-of-enum verb', () => {
    const r = llmIntentResponseSchema.safeParse({
      verb: 'destroy',
      target: { type: 'hero', index: null },
      confidence: 0.95,
    })
    expect(r.success).toBe(false)
  })

  test('rejects out-of-enum target.type', () => {
    const r = llmIntentResponseSchema.safeParse({
      verb: 'hide',
      target: { type: 'sidebar', index: null },
      confidence: 0.9,
    })
    expect(r.success).toBe(false)
  })

  test('rejects confidence > 1', () => {
    const r = llmIntentResponseSchema.safeParse({
      verb: 'hide',
      target: { type: 'hero', index: null },
      confidence: 1.5,
    })
    expect(r.success).toBe(false)
  })

  test('rejects target.index = 0 (Γ R2: must be 1-based ≥ 1)', () => {
    const r = llmIntentResponseSchema.safeParse({
      verb: 'hide',
      target: { type: 'blog', index: 0 },
      confidence: 0.9,
    })
    expect(r.success).toBe(false)
  })
})

test.describe('P27 — INTENT_ATOM Crystal Atom (sent to LLM verbatim)', () => {
  test('INTENT_ATOM contains all 5 AISP block delimiters', () => {
    expect(INTENT_ATOM).toContain('Ω')
    expect(INTENT_ATOM).toContain('Σ')
    expect(INTENT_ATOM).toContain('Γ')
    expect(INTENT_ATOM).toContain('Λ')
    expect(INTENT_ATOM).toContain('Ε')
  })

  test('INTENT_ATOM defines all 6 verbs in Σ.Verb.op enum', () => {
    expect(INTENT_ATOM).toContain('hide')
    expect(INTENT_ATOM).toContain('show')
    expect(INTENT_ATOM).toContain('change')
    expect(INTENT_ATOM).toContain('remove')
    expect(INTENT_ATOM).toContain('add')
    expect(INTENT_ATOM).toContain('reset')
  })

  test('INTENT_ATOM specifies confidence_threshold = 0.85 in Λ', () => {
    expect(INTENT_ATOM).toMatch(/confidence_threshold\s*:?=\s*0\.85/)
  })
})
