/**
 * P26 Sprint C Phase 1 — AISP Intent Classifier (Crystal Atom).
 *
 * Verifies classifyIntent(text) returns conforming { verb, target, params,
 * confidence, rationale } per the Crystal Atom in intentAtom.ts.
 *
 * Pure-unit tests (no browser). ADR-053.
 */
import { test, expect } from '@playwright/test'
import {
  classifyIntent,
  AISP_CONFIDENCE_THRESHOLD,
  ALLOWED_TARGET_TYPES,
  INTENT_ATOM,
} from '../src/contexts/intelligence/aisp'

test.describe('P26 — AISP Crystal Atom shape', () => {
  test('INTENT_ATOM is a non-empty Crystal Atom string with Ω Σ Γ Λ Ε structure', () => {
    expect(INTENT_ATOM).toContain('⟦')
    expect(INTENT_ATOM).toContain('Ω')
    expect(INTENT_ATOM).toContain('Σ')
    expect(INTENT_ATOM).toContain('Γ')
    expect(INTENT_ATOM).toContain('Λ')
    expect(INTENT_ATOM).toContain('Ε')
    expect(INTENT_ATOM).toContain('⟧')
  })

  test('AISP_CONFIDENCE_THRESHOLD is 0.85 per Λ', () => {
    expect(AISP_CONFIDENCE_THRESHOLD).toBe(0.85)
  })

  test('ALLOWED_TARGET_TYPES includes baseline Hey Bradley section types', () => {
    expect(ALLOWED_TARGET_TYPES).toContain('hero')
    expect(ALLOWED_TARGET_TYPES).toContain('blog')
    expect(ALLOWED_TARGET_TYPES).toContain('footer')
  })
})

test.describe('P26 — classifyIntent (verb + target inference)', () => {
  test('"hide the hero" → verb:hide, target.type:hero, confidence ≥ 0.85', () => {
    const r = classifyIntent('hide the hero')
    expect(r.verb).toBe('hide')
    expect(r.target?.type).toBe('hero')
    expect(r.target?.index).toBeNull()
    expect(r.confidence).toBeGreaterThanOrEqual(0.85)
  })

  test('"hide the second blog" → verb:hide, target:blog/2, confidence ≥ 0.85', () => {
    const r = classifyIntent('hide the second blog')
    expect(r.verb).toBe('hide')
    expect(r.target?.type).toBe('blog')
    expect(r.target?.index).toBe(2)
    expect(r.confidence).toBeGreaterThanOrEqual(0.85)
  })

  test('"hide /footer" → existing scope token honored', () => {
    const r = classifyIntent('hide /footer')
    expect(r.verb).toBe('hide')
    expect(r.target?.type).toBe('footer')
    expect(r.target?.index).toBeNull()
  })

  test('"change the headline to Welcome" → verb:change with params.value', () => {
    const r = classifyIntent('change the headline to Welcome')
    expect(r.verb).toBe('change')
    expect(r.params?.value).toBe('Welcome')
  })
})

test.describe('P26 — classifyIntent (low-confidence fall-through)', () => {
  test('verbless input returns confidence 0', () => {
    const r = classifyIntent('the weather is nice today')
    expect(r.confidence).toBe(0)
    expect(r.rationale).toContain('no verb matched')
  })

  test('verb without target gets penalty (lower than threshold)', () => {
    const r = classifyIntent('change something')
    expect(r.verb).toBe('change')
    // Verb confidence 0.9 - target penalty 0.15 = 0.75; below threshold 0.85
    expect(r.confidence).toBeLessThan(AISP_CONFIDENCE_THRESHOLD)
  })
})
