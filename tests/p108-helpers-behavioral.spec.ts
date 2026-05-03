/**
 * P108 / A10 — Behavioral coverage for cleanTranscript + validateEventType +
 * validateSectionType (Track D D1 + D3 closure). Audit:
 * plans/strategic-reviews/2026-05-04-gaps-to-done/04-test-coverage.md.
 *   D1: cleanTranscript (ADR-127) had ZERO behavioral coverage.
 *   D3: validateEventType + validateSectionType (P104) never invoked at runtime.
 *
 * NOTE on validateEventType: comprehensiveLogs.ts statically imports `persist`
 * from `../db`, which transitively pulls migrations/index.ts whose
 * `import.meta.glob` is Vite-only and explodes under raw Playwright/Node. To
 * preserve the "import + invoke the helper" contract without restructuring
 * src/, we extract validateEventType + VALID_LOG_EVENT_TYPES from the source
 * file via a tiny vm sandbox — still executes the actual helper code from
 * disk; no re-implementation. 4 describes / 25 cases.
 */
import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { runInNewContext } from 'node:vm'
import { cleanTranscript } from '../src/contexts/intelligence/stt/transcriptCleanup'
import { validateSectionType, VALID_SECTION_TYPES } from '../src/lib/schemas/section'

// ─── validateEventType: vm-extracted from source (Vite-glob barrier) ────────
const SRC = readFileSync(
  join(process.cwd(), 'src/contexts/persistence/repositories/comprehensiveLogs.ts'),
  'utf8',
)
const VALID_BLOCK = SRC.match(/export const VALID_LOG_EVENT_TYPES = \[([\s\S]*?)\] as const;/)?.[1] ?? ''
const FN_BLOCK = SRC.match(/export function validateEventType\(t: string\)[^{]*\{([\s\S]*?)\n\}\n/)?.[1] ?? ''
const FN_JS = FN_BLOCK
  .replace(/ as readonly string\[\]/g, '')
  .replace(/ as ValidLogEventType/g, '')
  .replace(/: ValidLogEventType \| null/g, '')
const sandbox = { console, result: null as unknown }
runInNewContext(
  `const VALID_LOG_EVENT_TYPES = [${VALID_BLOCK}];
   function validateEventType(t) { ${FN_JS} }
   result = { validateEventType, VALID_LOG_EVENT_TYPES };`,
  sandbox,
)
const { validateEventType, VALID_LOG_EVENT_TYPES } = sandbox.result as {
  validateEventType: (t: string) => string | null
  VALID_LOG_EVENT_TYPES: readonly string[]
}

test.describe('P108.1 — cleanTranscript behavioral', () => {
  test('strips leading "uh"', () => {
    expect(cleanTranscript('uh make the hero brighter')).toBe('make the hero brighter')
  })
  test('strips mid-sentence "um"', () => {
    expect(cleanTranscript('add um a pricing section')).toBe('add a pricing section')
  })
  test('strips multi-word "you know"', () => {
    expect(cleanTranscript('you know change the colors')).toBe('change the colors')
  })
  test('strips "like" filler', () => {
    expect(cleanTranscript('add like a testimonials section')).toBe('add a testimonials section')
  })
  test('strips trailing ellipsis pause', () => {
    expect(cleanTranscript('make it pop...')).toBe('make it pop')
  })
  test('strips em-dash trailing pause', () => {
    expect(cleanTranscript('add a hero — yeah')).toBe('add a hero yeah')
  })
  test('collapses repeated false-starts', () => {
    expect(cleanTranscript('make make the hero brighter')).toBe('make the hero brighter')
  })
  test('handles stacked disfluencies', () => {
    expect(cleanTranscript('um uh like add a hero section')).toBe('add a hero section')
  })
  test('case-insensitive on capitalized "Uh"', () => {
    expect(cleanTranscript('Uh make the Hero brighter')).toBe('make the Hero brighter')
  })
  test('idempotent on already-clean input', () => {
    const clean = 'make the hero brighter'
    expect(cleanTranscript(clean)).toBe(clean)
  })
  test('idempotent under double-application', () => {
    const once = cleanTranscript('uh um like add a hero')
    expect(cleanTranscript(once)).toBe(once)
  })
  test('empty string returns empty', () => {
    expect(cleanTranscript('')).toBe('')
  })
})

test.describe('P108.2 — validateEventType behavioral', () => {
  test('all 15 valid event_types pass through unchanged', () => {
    expect(VALID_LOG_EVENT_TYPES.length).toBe(15)
    for (const t of VALID_LOG_EVENT_TYPES) expect(validateEventType(t)).toBe(t)
  })
  test('patch_applied alias remaps to patch_validation', () => {
    expect(validateEventType('patch_applied')).toBe('patch_validation')
  })
  test('unknown type returns null', () => {
    expect(validateEventType('totally_made_up')).toBeNull()
  })
  test('empty string returns null', () => {
    expect(validateEventType('')).toBeNull()
  })
  test('case-sensitive — uppercase rejected', () => {
    expect(validateEventType('INPUT_EVENT')).toBeNull()
  })
})

test.describe('P108.3 — validateSectionType behavioral', () => {
  test('all 18 canonical section types pass through unchanged', () => {
    expect(VALID_SECTION_TYPES.length).toBe(18)
    for (const t of VALID_SECTION_TYPES) expect(validateSectionType(t)).toBe(t)
  })
  test('article alias → text', () => { expect(validateSectionType('article')).toBe('text') })
  test('long-form alias → text', () => { expect(validateSectionType('long-form')).toBe('text') })
  test('testimonial alias → quotes', () => { expect(validateSectionType('testimonial')).toBe('quotes') })
  test('testimonials alias → quotes', () => { expect(validateSectionType('testimonials')).toBe('quotes') })
  test('pull-quote alias → quotes', () => { expect(validateSectionType('pull-quote')).toBe('quotes') })
  test('nav alias → menu', () => { expect(validateSectionType('nav')).toBe('menu') })
  test('navigation alias → menu', () => { expect(validateSectionType('navigation')).toBe('menu') })
  test('cta alias → action', () => { expect(validateSectionType('cta')).toBe('action') })
  test('faq alias → questions', () => { expect(validateSectionType('faq')).toBe('questions') })
  test('stats alias → numbers', () => { expect(validateSectionType('stats')).toBe('numbers') })
  test('unknown returns null', () => { expect(validateSectionType('totally_made_up_section')).toBeNull() })
  test('empty string returns null', () => { expect(validateSectionType('')).toBeNull() })
})

test.describe('P108.4 — Helper integration sanity', () => {
  test('cleanTranscript + validateSectionType chain (article alias)', () => {
    expect(cleanTranscript('uh add an article section')).toBe('add an article section')
    expect(validateSectionType('article')).toBe('text')
  })
  test('cleanTranscript + validateEventType chain (input_event survives strip)', () => {
    const cleaned = cleanTranscript('um like input_event you know')
    expect(cleaned).toBe('input_event')
    expect(validateEventType(cleaned)).toBe('input_event')
  })
  test('all three helpers handle empty input without throwing', () => {
    expect(cleanTranscript('')).toBe('')
    expect(validateEventType('')).toBeNull()
    expect(validateSectionType('')).toBeNull()
  })
})
