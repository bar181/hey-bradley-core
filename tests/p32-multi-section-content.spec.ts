/**
 * P32 Sprint D P4 — Multi-section Content Pipeline tests.
 *
 * Pure-unit (no browser; no LLM). Verifies section-aware tone/length
 * defaults + cue-precedence + unknown-type fallback.
 *
 * ADR-061.
 */
import { test, expect } from '@playwright/test'
import {
  getSectionDefaults,
  SECTION_CONTENT_DEFAULTS,
} from '../src/contexts/intelligence/aisp/contentDefaults'
import { generateContent } from '../src/contexts/intelligence/aisp/contentGenerator'

test.describe('P32 — Section-aware defaults', () => {
  test('SECTION_CONTENT_DEFAULTS covers hero, blog, footer, cta, features', () => {
    expect(SECTION_CONTENT_DEFAULTS.hero).toEqual({ tone: 'bold', length: 'short' })
    expect(SECTION_CONTENT_DEFAULTS.blog).toEqual({ tone: 'neutral', length: 'medium' })
    expect(SECTION_CONTENT_DEFAULTS.footer).toEqual({ tone: 'warm', length: 'short' })
    expect(SECTION_CONTENT_DEFAULTS.cta).toEqual({ tone: 'bold', length: 'short' })
    expect(SECTION_CONTENT_DEFAULTS.features).toEqual({ tone: 'authoritative', length: 'short' })
  })

  test('SECTION_CONTENT_DEFAULTS covers ≥15 section types', () => {
    expect(Object.keys(SECTION_CONTENT_DEFAULTS).length).toBeGreaterThanOrEqual(15)
  })

  test('getSectionDefaults returns hero defaults', () => {
    expect(getSectionDefaults('hero')).toEqual({ tone: 'bold', length: 'short' })
  })

  test('getSectionDefaults falls back to neutral/short on unknown type', () => {
    expect(getSectionDefaults('frobnitz')).toEqual({ tone: 'neutral', length: 'short' })
    expect(getSectionDefaults(null)).toEqual({ tone: 'neutral', length: 'short' })
    expect(getSectionDefaults(undefined)).toEqual({ tone: 'neutral', length: 'short' })
  })
})

test.describe('P32 — generateContent with sectionType', () => {
  test('hero section forces tone=bold by default', () => {
    const r = generateContent({
      text: 'set headline "Stop guessing, start shipping"',
      sectionType: 'hero',
    })
    expect(r?.tone).toBe('bold')
  })

  test('blog section forces tone=neutral length=medium by default', () => {
    const r = generateContent({
      text: 'set body to "We help teams build faster every day"',
      sectionType: 'blog',
    })
    expect(r?.tone).toBe('neutral')
    expect(r?.length).toBe('medium')
  })

  test('footer section forces tone=warm by default', () => {
    const r = generateContent({
      text: 'set footer "Made with care in Boston"',
      sectionType: 'footer',
    })
    expect(r?.tone).toBe('warm')
  })

  test('explicit cue word in text wins over section default', () => {
    // hero defaults to 'bold' but user said 'fun'
    const r = generateContent({
      text: 'fun headline "Pop the kettle on"',
      sectionType: 'hero',
    })
    expect(r?.tone).toBe('playful') // cue wins
  })

  test('caller defaultTone wins over section default but loses to cue', () => {
    // sectionType=hero (bold), defaultTone=warm, cue=playful
    const r = generateContent({
      text: 'playful "Howdy folks"',
      sectionType: 'hero',
      defaultTone: 'warm',
    })
    expect(r?.tone).toBe('playful')
  })

  test('unknown section type falls back to neutral/short', () => {
    const r = generateContent({
      text: 'set "Hello world"',
      sectionType: 'frobnitz',
    })
    expect(r?.tone).toBe('neutral')
    expect(r?.length).toBe('short')
  })

  test('omitting sectionType still works (P31 backward-compat)', () => {
    const r = generateContent({ text: 'set "Hi there"' })
    expect(r?.tone).toBe('neutral')
    expect(r?.length).toBe('short')
  })
})
