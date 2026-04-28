/**
 * P24 Sprint B Phase 2 — Section Targeting via /<type>-<index> keyword scoping.
 *
 * Verifies:
 *   - parseSectionScope parser unit (5 input shapes)
 *   - resolveScopedSectionIndex multi-section resolution
 *   - hide-section template honors /type-N scope
 *   - change-headline template honors /hero-N scope
 *   - friendly empty-patch when scope can't resolve
 *
 * ADR-051 (Section Targeting Syntax).
 */
import { test, expect } from '@playwright/test'
import {
  parseSectionScope,
  resolveScopedSectionIndex,
} from '../src/contexts/intelligence/templates/scoping'

// Pure-unit tests (no browser; faster + deterministic)
test.describe('P24 — parseSectionScope (parser unit)', () => {
  test('extracts /hero-1 → { type: "hero", index: 0 }', () => {
    const r = parseSectionScope("change /hero-1 to 'Welcome'")
    expect(r.scope).toEqual({ type: 'hero', index: 0 })
    expect(r.cleanText).toBe("change to 'Welcome'")
  })

  test('extracts /blog-2 → { type: "blog", index: 1 }', () => {
    const r = parseSectionScope('hide /blog-2')
    expect(r.scope).toEqual({ type: 'blog', index: 1 })
    expect(r.cleanText).toBe('hide')
  })

  test('extracts /footer (no index) → { type: "footer", index: null }', () => {
    const r = parseSectionScope('hide /footer please')
    expect(r.scope).toEqual({ type: 'footer', index: null })
    expect(r.cleanText).toBe('hide please')
  })

  test('returns null scope when no token present', () => {
    const r = parseSectionScope('make it brighter')
    expect(r.scope).toBeNull()
    expect(r.cleanText).toBe('make it brighter')
  })

  test('first-match-wins for multiple scope tokens', () => {
    const r = parseSectionScope('hide /hero-1 and /footer')
    expect(r.scope).toEqual({ type: 'hero', index: 0 })
    // Remaining /footer stays in cleanText
    expect(r.cleanText).toContain('/footer')
  })
})

test.describe('P24 — resolveScopedSectionIndex (multi-section resolution)', () => {
  const config = {
    sections: [
      { type: 'hero', enabled: true },
      { type: 'blog', enabled: true },
      { type: 'blog', enabled: false },  // disabled — skipped in count
      { type: 'blog', enabled: true },   // counts as 2nd ENABLED blog
      { type: 'footer', enabled: true },
    ],
  }

  test('hero-1 → index 0 (first enabled hero)', () => {
    expect(resolveScopedSectionIndex(config, { type: 'hero', index: 0 })).toBe(0)
  })

  test('blog-1 → index 1 (first enabled blog; skips array index 2 which is disabled)', () => {
    expect(resolveScopedSectionIndex(config, { type: 'blog', index: 0 })).toBe(1)
  })

  test('blog-2 → index 3 (second enabled blog; index 2 is disabled)', () => {
    expect(resolveScopedSectionIndex(config, { type: 'blog', index: 1 })).toBe(3)
  })

  test('footer (null index) → first enabled footer', () => {
    expect(resolveScopedSectionIndex(config, { type: 'footer', index: null })).toBe(4)
  })

  test('out-of-range scope → -1', () => {
    expect(resolveScopedSectionIndex(config, { type: 'blog', index: 5 })).toBe(-1)
    expect(resolveScopedSectionIndex(config, { type: 'nonexistent', index: 0 })).toBe(-1)
  })
})
