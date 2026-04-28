/**
 * P31 Sprint D P3 — Content Generators (CONTENT_ATOM) tests.
 *
 * Pure-unit (no browser; no LLM). Verifies CONTENT_ATOM Σ shape +
 * Γ rules + generateContent stub behavior.
 *
 * ADR-060.
 */
import { test, expect } from '@playwright/test'
import {
  ALLOWED_TONES,
  ALLOWED_LENGTHS,
  CONTENT_ATOM,
  CONTENT_CONFIDENCE_THRESHOLD,
  isCleanContent,
  LENGTH_MAX_CHARS,
} from '../src/contexts/intelligence/aisp/contentAtom'
import { generateContent } from '../src/contexts/intelligence/aisp/contentGenerator'

test.describe('P31 — CONTENT_ATOM', () => {
  test('CONTENT_ATOM is verbatim AISP w/ Ω/Σ/Γ/Λ/Ε sections', () => {
    expect(CONTENT_ATOM).toContain('Ω :=')
    expect(CONTENT_ATOM).toContain('Σ :=')
    expect(CONTENT_ATOM).toContain('Γ :=')
    expect(CONTENT_ATOM).toContain('Λ :=')
    expect(CONTENT_ATOM).toContain('Ε :=')
    expect(CONTENT_ATOM).toContain('confidence_threshold := 0.7')
  })

  test('ALLOWED_TONES enumerates 5 tones', () => {
    expect(ALLOWED_TONES).toEqual([
      'neutral',
      'playful',
      'authoritative',
      'warm',
      'bold',
    ])
  })

  test('ALLOWED_LENGTHS enumerates 3 lengths', () => {
    expect(ALLOWED_LENGTHS).toEqual(['short', 'medium', 'long'])
  })

  test('LENGTH_MAX_CHARS Γ R1 caps: 60/160/400', () => {
    expect(LENGTH_MAX_CHARS.short).toBe(60)
    expect(LENGTH_MAX_CHARS.medium).toBe(160)
    expect(LENGTH_MAX_CHARS.long).toBe(400)
  })

  test('CONTENT_CONFIDENCE_THRESHOLD = 0.7 per Λ', () => {
    expect(CONTENT_CONFIDENCE_THRESHOLD).toBe(0.7)
  })

  test('isCleanContent rejects code blocks / headings / URLs / mentions / multi-paragraph', () => {
    expect(isCleanContent('Welcome home')).toBe(true)
    expect(isCleanContent('Hello ```code```')).toBe(false)
    expect(isCleanContent('# Heading')).toBe(false)
    expect(isCleanContent('Visit https://example.com today')).toBe(false)
    expect(isCleanContent('Hi @user')).toBe(false)
    expect(isCleanContent('Hi #trending')).toBe(false)
    expect(isCleanContent('Para one\n\nPara two')).toBe(false)
    expect(isCleanContent('{"json": true}')).toBe(false)
  })
})

test.describe('P31 — generateContent stub', () => {
  test('returns null on empty text', () => {
    expect(generateContent({ text: '' })).toBeNull()
    expect(generateContent({ text: '   ' })).toBeNull()
  })

  test('returns null when no quoted copy is present', () => {
    expect(generateContent({ text: 'change the headline' })).toBeNull()
  })

  test('extracts quoted copy with default tone neutral + length short', () => {
    const r = generateContent({ text: 'change the headline to "Welcome home"' })
    expect(r).not.toBeNull()
    expect(r?.text).toBe('Welcome home')
    expect(r?.tone).toBe('neutral')
    expect(r?.length).toBe('short')
    expect(r?.confidence).toBeGreaterThanOrEqual(0.7)
  })

  test('infers tone "playful" from cue word', () => {
    const r = generateContent({ text: 'make it fun and say "Pop in"' })
    expect(r?.tone).toBe('playful')
    expect(r?.confidence).toBeGreaterThanOrEqual(0.85)
  })

  test('infers tone "authoritative" from cue word', () => {
    const r = generateContent({ text: 'professional headline "Trusted by 500+ teams"' })
    expect(r?.tone).toBe('authoritative')
  })

  test('infers length "long" from explicit cue', () => {
    const r = generateContent({
      text: 'long detailed body "We help teams build faster, ship sooner, and worry less about the boring parts of marketing infrastructure"',
    })
    expect(r?.length).toBe('long')
  })

  test('rejects copy that exceeds length cap (Γ R1)', () => {
    const longCopy = 'x'.repeat(70)
    const r = generateContent({ text: `set headline to "${longCopy}"` })
    expect(r).toBeNull() // 70 > short cap of 60
  })

  test('rejects copy that fails Γ R3 forbidden-content scan (URL inside copy)', () => {
    const r = generateContent({ text: 'set copy to "Visit https://example.com today"' })
    expect(r).toBeNull()
  })

  test('Σ output shape: {text, tone, length, confidence, rationale}', () => {
    const r = generateContent({ text: 'set warm headline "Come on in"' })
    expect(r).not.toBeNull()
    expect(r).toHaveProperty('text')
    expect(r).toHaveProperty('tone')
    expect(r).toHaveProperty('length')
    expect(r).toHaveProperty('confidence')
    expect(r).toHaveProperty('rationale')
    expect(typeof r?.confidence).toBe('number')
    expect(r?.confidence).toBeGreaterThanOrEqual(0)
    expect(r?.confidence).toBeLessThanOrEqual(1)
  })
})
