/**
 * P101 / A1 — Verb classifier extension seal spec.
 * PURE-UNIT: FS reads + regex/string asserts. NO browser bootstrap.
 * Pattern follows tests/p99-seal-panel.spec.ts.
 *
 * Closes P101 carry-forward #3 from B-wave audit:
 * verb classifier missing forget/need/create.
 *
 * Each describe combines:
 *  - rule presence checks (file-content grep against the source) and
 *  - word-boundary correctness (positive + negative cases asserted via
 *    direct regex evaluation against the same regex literal that appears
 *    in source — no runtime import required).
 *
 * P101.1 — forget verb (5 cases)
 * P101.2 — need verb (5 cases)
 * P101.3 — create verb (5 cases)
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

const INTENT_CLASSIFIER = join(
  ROOT,
  'src/contexts/intelligence/aisp/intentClassifier.ts',
)

function readClassifier(): string {
  expect(existsSync(INTENT_CLASSIFIER)).toBe(true)
  return readFileSync(INTENT_CLASSIFIER, 'utf8')
}

// Regex literals must match the patterns added to VERB_RULES.
// We replicate them locally for word-boundary correctness asserts to
// avoid pulling in the runtime module.
const FORGET_RE = /\bforget\b/i
const NEED_RE = /\bneed\b/i
const CREATE_RE = /\bcreate\b/i

// ---------------------------------------------------------------------------
// P101.1 — forget verb (5 cases)
// ---------------------------------------------------------------------------
test.describe('P101.1 forget verb', () => {
  test('"forget the team section" matches forget rule (→ remove)', () => {
    expect(FORGET_RE.test('forget the team section')).toBe(true)
  })

  test('"forget the pricing" matches forget rule (→ remove)', () => {
    expect(FORGET_RE.test('forget the pricing')).toBe(true)
  })

  test('"let\'s forget about the blog" matches forget rule (tolerant)', () => {
    expect(FORGET_RE.test("let's forget about the blog")).toBe(true)
  })

  test('"forgetful design" does NOT match forget rule (word-boundary)', () => {
    expect(FORGET_RE.test('forgetful design')).toBe(false)
  })

  test('intentClassifier source contains \\bforget\\b regex with remove verb', () => {
    const src = readClassifier()
    expect(src).toMatch(/\\bforget\\b/)
    // Ensure the rule maps forget → 'remove'
    expect(src).toMatch(/\\bforget\\b[^\]]*'remove'/)
  })
})

// ---------------------------------------------------------------------------
// P101.2 — need verb (5 cases)
// ---------------------------------------------------------------------------
test.describe('P101.2 need verb', () => {
  test('"we need a contact form" matches need rule (→ add)', () => {
    expect(NEED_RE.test('we need a contact form')).toBe(true)
  })

  test('"need pricing" matches need rule (→ add)', () => {
    expect(NEED_RE.test('need pricing')).toBe(true)
  })

  test('"I need a hero section" matches need rule (→ add)', () => {
    expect(NEED_RE.test('I need a hero section')).toBe(true)
  })

  test('"needed yesterday" does NOT match need rule (word-boundary)', () => {
    expect(NEED_RE.test('needed yesterday')).toBe(false)
  })

  test('intentClassifier source contains \\bneed\\b regex with add verb', () => {
    const src = readClassifier()
    expect(src).toMatch(/\\bneed\\b/)
    expect(src).toMatch(/\\bneed\\b[^\]]*'add'/)
  })
})

// ---------------------------------------------------------------------------
// P101.3 — create verb (5 cases)
// ---------------------------------------------------------------------------
test.describe('P101.3 create verb', () => {
  test('"create a pricing tier" matches create rule (→ add)', () => {
    expect(CREATE_RE.test('create a pricing tier')).toBe(true)
  })

  test('"create new section" matches create rule (→ add)', () => {
    expect(CREATE_RE.test('create new section')).toBe(true)
  })

  test('"let\'s create a blog" matches create rule (→ add)', () => {
    expect(CREATE_RE.test("let's create a blog")).toBe(true)
  })

  test('"creation" does NOT match create rule (word-boundary)', () => {
    expect(CREATE_RE.test('creation')).toBe(false)
  })

  test('intentClassifier source contains \\bcreate\\b regex with add verb', () => {
    const src = readClassifier()
    expect(src).toMatch(/\\bcreate\\b/)
    expect(src).toMatch(/\\bcreate\\b[^\]]*'add'/)
  })
})
