/**
 * P109 / ADR-LEDGER-TRUTH-UP — Wave 1 / Agent A13.
 * Section-type enum DRIFT REGRESSION GUARD.
 *
 * P106 reconciled a 3-way drift across section-type definitions to the
 * canonical 18 per ADR-100. This spec parses each of the 5 sources of
 * truth and asserts mutual equality + alias purity, preventing future
 * drift from reintroducing the regression.
 *
 * Five sources:
 *   1. src/lib/schemas/section.ts            — sectionTypeSchema (Zod enum)
 *   2. src/lib/schemas/section.ts            — VALID_SECTION_TYPES  (P104)
 *   3. src/contexts/intelligence/prompts/system.ts — PATCH_ATOM SectionType
 *   4. src/contexts/intelligence/aisp/intentAtom.ts — ALLOWED_TARGET_TYPES
 *   5. src/lib/schemas/intent.ts             — intentTargetTypeSchema
 *
 * Hard-gate (no soft-pass existsSync) per preflight rule 6.
 * 7 describe blocks / 13 cases.
 */
import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

const SECTION_SCHEMA = join(ROOT, 'src/lib/schemas/section.ts')
const PROMPTS_SYSTEM = join(ROOT, 'src/contexts/intelligence/prompts/system.ts')
const INTENT_ATOM = join(ROOT, 'src/contexts/intelligence/aisp/intentAtom.ts')
const INTENT_SCHEMA = join(ROOT, 'src/lib/schemas/intent.ts')

/** Canonical 18 per ADR-100 + sectionTypeSchema. */
const CANONICAL_18 = [
  'hero', 'menu', 'columns', 'pricing', 'action', 'footer',
  'quotes', 'questions', 'numbers', 'gallery', 'logos', 'team',
  'image', 'divider', 'text', 'blog', 'case-study', 'contact-form',
] as const

/** Read source from disk (utf8). */
function read(p: string): string {
  return readFileSync(p, 'utf8')
}

/**
 * Parse a list of single-quoted identifiers from the FIRST capture of
 * `regex` against `source`. Sources 1, 2, 4, 5 use TS arrays / Zod enums
 * with `'foo'` quoted strings; works for all four.
 */
function parseQuotedTypes(source: string, regex: RegExp): string[] {
  const block = source.match(regex)?.[1] ?? ''
  const types = Array.from(block.matchAll(/['"]([\w-]+)['"]/g)).map((m) => m[1])
  return [...new Set(types)]
}

/**
 * Source 3 (PATCH_ATOM SectionType in system.ts) uses an AISP math-symbol
 * enum: `SectionType := 𝔼{ hero, menu, ..., contact-form }` — bare
 * comma-separated tokens, NOT JSON-quoted. Custom parser.
 */
function parsePatchAtomSectionType(source: string): string[] {
  const block = source.match(/SectionType\s*:=\s*𝔼\s*\{([^}]+)\}/)?.[1] ?? ''
  const types = block
    .split(/[\s,]+/)
    .map((t) => t.trim())
    .filter((t) => /^[a-z][\w-]*$/.test(t))
  return [...new Set(types)]
}

// ---------------------------------------------------------------------------
// P109.1 — Source 1: sectionTypeSchema (Zod enum)
// ---------------------------------------------------------------------------
test.describe('P109.1 — Source 1: sectionTypeSchema canonical', () => {
  test('sectionTypeSchema enum matches canonical 18', () => {
    const src = read(SECTION_SCHEMA)
    const types = parseQuotedTypes(src, /sectionTypeSchema\s*=\s*z\.enum\(\[([\s\S]*?)\]\)/)
    expect(types.sort()).toEqual([...CANONICAL_18].sort())
  })
})

// ---------------------------------------------------------------------------
// P109.2 — Source 2: VALID_SECTION_TYPES (P104 helper)
// ---------------------------------------------------------------------------
test.describe('P109.2 — Source 2: VALID_SECTION_TYPES helper', () => {
  test('VALID_SECTION_TYPES array matches canonical 18', () => {
    const src = read(SECTION_SCHEMA)
    const types = parseQuotedTypes(src, /VALID_SECTION_TYPES\s*=\s*\[([\s\S]*?)\]\s*as\s+const/)
    expect(types.sort()).toEqual([...CANONICAL_18].sort())
  })
})

// ---------------------------------------------------------------------------
// P109.3 — Source 3: PATCH_ATOM SectionType (post-P106 reconciliation)
// ---------------------------------------------------------------------------
test.describe('P109.3 — Source 3: PATCH_ATOM SectionType enum', () => {
  test('PATCH_ATOM SectionType matches canonical 18 (post-P106 fix)', () => {
    const src = read(PROMPTS_SYSTEM)
    const types = parsePatchAtomSectionType(src)
    expect(types.sort()).toEqual([...CANONICAL_18].sort())
  })
  test('PATCH_ATOM enum does NOT contain "navbar" typo (P106 fix lock)', () => {
    const src = read(PROMPTS_SYSTEM)
    expect(src).not.toMatch(/\bnavbar\b/)
  })
})

// ---------------------------------------------------------------------------
// P109.4 — Source 4: INTENT_ATOM ALLOWED_TARGET_TYPES
// ---------------------------------------------------------------------------
test.describe('P109.4 — Source 4: INTENT_ATOM ALLOWED_TARGET_TYPES', () => {
  test('ALLOWED_TARGET_TYPES array matches canonical 18', () => {
    const src = read(INTENT_ATOM)
    const types = parseQuotedTypes(src, /ALLOWED_TARGET_TYPES\s*=\s*\[([\s\S]*?)\]\s*as\s+const/)
    expect(types.sort()).toEqual([...CANONICAL_18].sort())
  })
})

// ---------------------------------------------------------------------------
// P109.5 — Source 5: intentTargetTypeSchema (post-P106 reconciliation)
// ---------------------------------------------------------------------------
test.describe('P109.5 — Source 5: intentTargetTypeSchema canonical', () => {
  test('intentTargetTypeSchema matches canonical 18 (post-P106 fix)', () => {
    const src = read(INTENT_SCHEMA)
    const types = parseQuotedTypes(src, /intentTargetTypeSchema\s*=\s*z\.enum\(\[([\s\S]*?)\]\)/)
    expect(types.sort()).toEqual([...CANONICAL_18].sort())
  })
})

// ---------------------------------------------------------------------------
// P109.6 — Aliases live in validateSectionType only (not in atom enums)
// ---------------------------------------------------------------------------
test.describe('P109.6 — Aliases live in validateSectionType only', () => {
  test('validateSectionType has ≥8 alias entries (per ADR-104 taxonomy)', () => {
    const src = read(SECTION_SCHEMA)
    const aliasBlock = src.match(/const aliases:\s*Record<[^>]+>\s*=\s*\{([\s\S]*?)\}/)?.[1] ?? ''
    const aliasEntries = Array.from(
      aliasBlock.matchAll(/['"]?([\w-]+)['"]?\s*:\s*['"]([\w-]+)['"]/g),
    )
    expect(aliasEntries.length).toBeGreaterThanOrEqual(8)
  })

  test('INTENT_ATOM ALLOWED_TARGET_TYPES contains NO aliases', () => {
    const src = read(INTENT_ATOM)
    const block = src.match(/ALLOWED_TARGET_TYPES\s*=\s*\[([\s\S]*?)\]\s*as\s+const/)?.[1] ?? ''
    const ALIAS_TOKENS = ['article', 'long-form', 'testimonial', 'testimonials', 'pull-quote', 'nav', 'navigation', 'cta', 'faq', 'stats']
    for (const alias of ALIAS_TOKENS) {
      expect(block).not.toMatch(new RegExp(`['"]${alias}['"]`))
    }
  })

  test('intentTargetTypeSchema contains NO aliases', () => {
    const src = read(INTENT_SCHEMA)
    const block = src.match(/intentTargetTypeSchema\s*=\s*z\.enum\(\[([\s\S]*?)\]\)/)?.[1] ?? ''
    const ALIAS_TOKENS = ['article', 'testimonial', 'pull-quote', 'cta', 'faq']
    for (const alias of ALIAS_TOKENS) {
      expect(block).not.toMatch(new RegExp(`['"]${alias}['"]`))
    }
  })

  test('PATCH_ATOM SectionType contains NO aliases', () => {
    const src = read(PROMPTS_SYSTEM)
    const types = parsePatchAtomSectionType(src)
    const ALIAS_TOKENS = ['article', 'testimonial', 'navbar', 'cta', 'faq', 'stats']
    for (const alias of ALIAS_TOKENS) {
      expect(types).not.toContain(alias)
    }
  })
})

// ---------------------------------------------------------------------------
// P109.7 — All 5 sources mutually consistent (pairwise equality)
// ---------------------------------------------------------------------------
test.describe('P109.7 — All 5 sources mutually consistent', () => {
  test('All 5 sources produce identical sorted type lists', () => {
    const sectionSrc = read(SECTION_SCHEMA)
    const promptsSrc = read(PROMPTS_SYSTEM)
    const intentAtomSrc = read(INTENT_ATOM)
    const intentSchemaSrc = read(INTENT_SCHEMA)

    const s1 = parseQuotedTypes(sectionSrc, /sectionTypeSchema\s*=\s*z\.enum\(\[([\s\S]*?)\]\)/).sort()
    const s2 = parseQuotedTypes(sectionSrc, /VALID_SECTION_TYPES\s*=\s*\[([\s\S]*?)\]\s*as\s+const/).sort()
    const s3 = parsePatchAtomSectionType(promptsSrc).sort()
    const s4 = parseQuotedTypes(intentAtomSrc, /ALLOWED_TARGET_TYPES\s*=\s*\[([\s\S]*?)\]\s*as\s+const/).sort()
    const s5 = parseQuotedTypes(intentSchemaSrc, /intentTargetTypeSchema\s*=\s*z\.enum\(\[([\s\S]*?)\]\)/).sort()

    // All 5 must equal the canonical 18 + each other (transitive)
    const canonical = [...CANONICAL_18].sort()
    expect(s1).toEqual(canonical)
    expect(s2).toEqual(s1)
    expect(s3).toEqual(s1)
    expect(s4).toEqual(s1)
    expect(s5).toEqual(s1)
  })

  test('Each source has exactly 18 entries (length gate)', () => {
    const sectionSrc = read(SECTION_SCHEMA)
    const promptsSrc = read(PROMPTS_SYSTEM)
    const intentAtomSrc = read(INTENT_ATOM)
    const intentSchemaSrc = read(INTENT_SCHEMA)

    expect(parseQuotedTypes(sectionSrc, /sectionTypeSchema\s*=\s*z\.enum\(\[([\s\S]*?)\]\)/).length).toBe(18)
    expect(parseQuotedTypes(sectionSrc, /VALID_SECTION_TYPES\s*=\s*\[([\s\S]*?)\]\s*as\s+const/).length).toBe(18)
    expect(parsePatchAtomSectionType(promptsSrc).length).toBe(18)
    expect(parseQuotedTypes(intentAtomSrc, /ALLOWED_TARGET_TYPES\s*=\s*\[([\s\S]*?)\]\s*as\s+const/).length).toBe(18)
    expect(parseQuotedTypes(intentSchemaSrc, /intentTargetTypeSchema\s*=\s*z\.enum\(\[([\s\S]*?)\]\)/).length).toBe(18)
  })

  test('Canonical 18 contains exactly the post-P75 / OC-7 additions (case-study + contact-form)', () => {
    expect(CANONICAL_18).toContain('case-study')
    expect(CANONICAL_18).toContain('contact-form')
    expect(CANONICAL_18.length).toBe(18)
  })
})
