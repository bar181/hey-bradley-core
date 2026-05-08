/**
 * P25 Sprint B Phase 3 — Intent Translator (rule-based pre-AISP).
 *
 * Verifies translateIntent rewrites messy input into canonical form.
 * Pure-unit tests; no browser. ADR-052.
 */
import { test, expect } from '@playwright/test'
import { translateIntent } from '../src/contexts/intelligence/templates/intent'

test.describe('P25 — translateIntent (verb rewrites)', () => {
  test('"get rid of the footer" → "hide footer" (verb rewrite + article strip)', () => {
    const r = translateIntent('get rid of the footer')
    expect(r.canonicalText).toContain('hide')
    expect(r.canonicalText).toContain('footer')
    expect(r.unchanged).toBe(false)
  })

  test('"remove the hero" → "hide the hero"', () => {
    const r = translateIntent('remove the hero')
    expect(r.canonicalText).toBe('hide the hero')
    expect(r.unchanged).toBe(false)
  })

  test('"make the headline say Welcome" → "change the headline to Welcome"', () => {
    const r = translateIntent('make the headline say Welcome')
    expect(r.canonicalText).toBe('change the headline to Welcome')
    expect(r.unchanged).toBe(false)
  })
})

test.describe('P25 — translateIntent (type normalization + ordinal-to-scope)', () => {
  test('"hide the second blog post" → emits "/blog-2" scope token', () => {
    const r = translateIntent('hide the second blog post')
    // type normalization: "blog post" → "blog"; ordinal: "second blog" → "/blog-2"
    expect(r.canonicalText).toContain('/blog-2')
    expect(r.canonicalText.toLowerCase()).toContain('hide')
  })

  test('"get rid of the third hero section" → hide /hero-3', () => {
    const r = translateIntent('get rid of the third hero section')
    expect(r.canonicalText).toContain('/hero-3')
    expect(r.canonicalText).toContain('hide')
  })
})

test.describe('P25 — translateIntent (idempotency + edge cases)', () => {
  test('canonical input passes through unchanged', () => {
    const canonical = 'hide /blog-2'
    const r = translateIntent(canonical)
    expect(r.canonicalText).toBe(canonical)
    expect(r.unchanged).toBe(true)
    expect(r.rationale).toContain('no rewrite')
  })

  test('input with existing scope token is preserved (no double-translation)', () => {
    const r = translateIntent('hide /hero-1')
    expect(r.canonicalText).toBe('hide /hero-1')
    expect(r.unchanged).toBe(true)
  })
})
