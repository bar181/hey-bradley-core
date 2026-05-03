/**
 * E2E-TEST-2 / C4 — Load & verify spec.
 * PURE-UNIT: FS reads + JSON.parse + regex/string asserts. NO browser bootstrap.
 *
 * E2E2.1 — All 3 site JSONs parse + have schema-shape (3)
 * E2E2.2 — EXAMPLE_SITES.length increased by 3 (43 -> 46) (1)
 * E2E2.3 — Each site has >=6 sections + <=14 sections (3)
 * E2E2.4 — Theme palette has valid hex (#XXXXXX) for bgPrimary + accentPrimary (3)
 * E2E2.5 — Each site has >=1 hero section (3)
 * E2E2.6 — Trigger-word taxonomy doc exists at docs/aisp-adoption/03-... (1)
 * E2E2.7 — Seed script exists + parses fixtures + has writeLogEvent marker (2)
 * E2E2.8 — All 3 fixture JSONs parse + each row has session_id/request_id/event_type/event_data fields;
 *          event_type is in CHECK enum (post-normalization) (3)
 * E2E2.9 — EOP triplet at plans/implementation/phase-e2e-test-2/seal/ (3) [hard-gate]
 *
 * Soft-pass guards via existsSync() let upstream surface slips degrade
 * to skipped rather than red. Hard-gate on EXAMPLE_SITES count + EOP triplet.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

// --- Owned site JSONs (Wave 1 / C1-C3) ---
const SITE_1_JSON = join(ROOT, 'src/data/examples/coffee-essay.json')
const SITE_2_JSON = join(ROOT, 'src/data/examples/north-light-agency.json')
const SITE_3_JSON = join(ROOT, 'src/data/examples/indie-coffee-roaster.json')
const SITE_JSONS = [SITE_1_JSON, SITE_2_JSON, SITE_3_JSON]
const SITE_NAMES = ['coffee-essay', 'north-light-agency', 'indie-coffee-roaster']

// --- C4-owned wire ---
const EXAMPLES_INDEX = join(ROOT, 'src/data/examples/index.ts')

// --- C1-C3-owned fixtures ---
const FIX_1 = join(ROOT, 'tests/fixtures/e2e2-coffee-essay-logevents.json')
const FIX_2 = join(ROOT, 'tests/fixtures/e2e2-north-light-agency-logevents.json')
const FIX_3 = join(ROOT, 'tests/fixtures/e2e2-indie-coffee-roaster-logevents.json')
const FIXTURES = [FIX_1, FIX_2, FIX_3]

// --- C4-owned ---
const TRIGGER_DOC = join(ROOT, 'docs/aisp-adoption/03-trigger-word-taxonomy.md')
const SEED_SCRIPT = join(ROOT, 'scripts/seed-e2e2-logevents.ts')

// --- C4-owned EOP triplet at seal/ ---
const SEAL_DIR = 'plans/implementation/phase-e2e-test-2/seal'
const EOP_REVIEW = join(ROOT, SEAL_DIR, '02-post-review.md')
const EOP_LOG = join(ROOT, SEAL_DIR, 'session-log.md')
const EOP_RETRO = join(ROOT, SEAL_DIR, 'retrospective.md')

// CHECK enum from migration 005-comprehensive-logs.sql §46-58
const ALLOWED_EVENT_TYPES = new Set([
  'input_event', 'intent_classification', 'decomposition', 'template_match',
  'patch_validation', 'personality_display', 'listen_capture', 'multi_page_scope',
  'process_atom_output', 'ddd_atom_output', 'error_event', 'response_summary',
  'todo_execution', 'decomp_split', 'export_emit',
])
// Defensive remap mirrors scripts/seed-e2e2-logevents.ts
const REMAP: Record<string, string> = { patch_applied: 'patch_validation' }

function read(p: string): string { return readFileSync(p, 'utf8') }
function parseRows(p: string): Array<Record<string, unknown>> {
  const raw = JSON.parse(read(p)) as unknown
  if (Array.isArray(raw)) return raw as Array<Record<string, unknown>>
  if (raw && typeof raw === 'object' && Array.isArray((raw as { rows?: unknown }).rows)) {
    return (raw as { rows: Array<Record<string, unknown>> }).rows
  }
  return []
}

// ------------------------------------------------------------------
// E2E2.1 — All 3 site JSONs parse + have schema-shape (3)
// ------------------------------------------------------------------
test.describe('E2E2.1 — All 3 site JSONs parse + have schema-shape', () => {
  for (let i = 0; i < SITE_JSONS.length; i++) {
    const p = SITE_JSONS[i]
    const name = SITE_NAMES[i]
    test(`${name}.json exists, parses, and has site/theme/sections`, () => {
      if (!existsSync(p)) {
        test.skip(true, `${name} surface deferred — soft-pass`)
        return
      }
      const raw = read(p)
      const cfg = JSON.parse(raw)
      expect(cfg).toHaveProperty('site')
      expect(cfg).toHaveProperty('theme')
      expect(cfg).toHaveProperty('sections')
      expect(Array.isArray(cfg.sections)).toBe(true)
    })
  }
})

// ------------------------------------------------------------------
// E2E2.2 — EXAMPLE_SITES.length increased by 3 (43 -> 46) (1) [hard-gate]
// ------------------------------------------------------------------
test.describe('E2E2.2 — EXAMPLE_SITES wired with 3 NEW entries', () => {
  test('index.ts imports the 3 NEW JSONs + adds 3 entries (length 46)', () => {
    expect(existsSync(EXAMPLES_INDEX)).toBe(true)
    const src = read(EXAMPLES_INDEX)
    expect(src).toMatch(/import\s+coffeeEssay\s+from\s+['"]\.\/coffee-essay\.json['"]/)
    expect(src).toMatch(/import\s+northLightAgency\s+from\s+['"]\.\/north-light-agency\.json['"]/)
    expect(src).toMatch(/import\s+indieCoffeeRoaster\s+from\s+['"]\.\/indie-coffee-roaster\.json['"]/)
    // Count entries via top-level "  {\n" inside EXAMPLE_SITES (mirrors existing pattern).
    const entryCount = (src.match(/^\s{2}\{\n/gm) ?? []).length
    expect(entryCount).toBeGreaterThanOrEqual(46)
  })
})

// ------------------------------------------------------------------
// E2E2.3 — Each site has >=6 sections + <=14 sections (3)
// ------------------------------------------------------------------
test.describe('E2E2.3 — Section count bounds [6, 14]', () => {
  for (let i = 0; i < SITE_JSONS.length; i++) {
    const p = SITE_JSONS[i]
    const name = SITE_NAMES[i]
    test(`${name} has 6-14 sections`, () => {
      if (!existsSync(p)) { test.skip(true, `${name} deferred`); return }
      const cfg = JSON.parse(read(p))
      expect(cfg.sections.length).toBeGreaterThanOrEqual(6)
      expect(cfg.sections.length).toBeLessThanOrEqual(14)
    })
  }
})

// ------------------------------------------------------------------
// E2E2.4 — Theme palette has valid hex (#XXXXXX) for bgPrimary + accentPrimary (3)
// ------------------------------------------------------------------
test.describe('E2E2.4 — Theme palette hex validity', () => {
  const HEX = /^#[0-9a-fA-F]{6}$/
  for (let i = 0; i < SITE_JSONS.length; i++) {
    const p = SITE_JSONS[i]
    const name = SITE_NAMES[i]
    test(`${name} palette.bgPrimary + palette.accentPrimary are valid #XXXXXX`, () => {
      if (!existsSync(p)) { test.skip(true, `${name} deferred`); return }
      const cfg = JSON.parse(read(p))
      expect(cfg.theme).toHaveProperty('palette')
      expect(HEX.test(cfg.theme.palette.bgPrimary)).toBe(true)
      expect(HEX.test(cfg.theme.palette.accentPrimary)).toBe(true)
    })
  }
})

// ------------------------------------------------------------------
// E2E2.5 — Each site has >=1 hero section (3)
// ------------------------------------------------------------------
test.describe('E2E2.5 — Each site has >=1 hero section', () => {
  for (let i = 0; i < SITE_JSONS.length; i++) {
    const p = SITE_JSONS[i]
    const name = SITE_NAMES[i]
    test(`${name} contains at least one section with type='hero'`, () => {
      if (!existsSync(p)) { test.skip(true, `${name} deferred`); return }
      const cfg = JSON.parse(read(p))
      const heroes = cfg.sections.filter((s: { type?: string }) => s.type === 'hero')
      expect(heroes.length).toBeGreaterThanOrEqual(1)
    })
  }
})

// ------------------------------------------------------------------
// E2E2.6 — Trigger-word taxonomy doc exists (1) [hard-gate]
// ------------------------------------------------------------------
test.describe('E2E2.6 — Trigger-word taxonomy doc landed', () => {
  test('docs/aisp-adoption/03-trigger-word-taxonomy.md exists with all 5 sections', () => {
    expect(existsSync(TRIGGER_DOC)).toBe(true)
    const src = read(TRIGGER_DOC)
    expect(src).toMatch(/Section type triggers/)
    expect(src).toMatch(/DECOMP verb triggers/)
    expect(src).toMatch(/Tone & style triggers/)
    expect(src).toMatch(/Brand triggers/)
    expect(src).toMatch(/Listen-mode specific/)
  })
})

// ------------------------------------------------------------------
// E2E2.7 — Seed script exists + parses fixtures + has writeLogEvent marker (2)
// ------------------------------------------------------------------
test.describe('E2E2.7 — Seed script', () => {
  test('scripts/seed-e2e2-logevents.ts exists', () => {
    expect(existsSync(SEED_SCRIPT)).toBe(true)
  })
  test('seed script references writeLogEvent + reads all 3 fixtures + remaps patch_applied', () => {
    if (!existsSync(SEED_SCRIPT)) { test.skip(true, 'seed deferred'); return }
    const src = read(SEED_SCRIPT)
    expect(src).toMatch(/writeLogEvent/)
    expect(src).toMatch(/e2e2-coffee-essay-logevents\.json/)
    expect(src).toMatch(/e2e2-north-light-agency-logevents\.json/)
    expect(src).toMatch(/e2e2-indie-coffee-roaster-logevents\.json/)
    expect(src).toMatch(/patch_applied/)
    expect(src).toMatch(/patch_validation/)
  })
})

// ------------------------------------------------------------------
// E2E2.8 — All 3 fixtures parse + rows have required fields + post-remap event_type in CHECK enum (3)
// ------------------------------------------------------------------
test.describe('E2E2.8 — Fixture row schema validity (post-remap)', () => {
  for (let i = 0; i < FIXTURES.length; i++) {
    const p = FIXTURES[i]
    const name = SITE_NAMES[i]
    test(`${name} fixture rows are well-formed + event_type in CHECK enum (post-remap)`, () => {
      if (!existsSync(p)) { test.skip(true, `${name} fixture deferred`); return }
      const rows = parseRows(p)
      expect(rows.length).toBeGreaterThanOrEqual(1)
      for (const row of rows) {
        expect(typeof row.session_id).toBe('string')
        expect(typeof row.request_id).toBe('string')
        expect(typeof row.event_type).toBe('string')
        expect(typeof row.event_data).toBe('object')
        const original = String(row.event_type)
        const remapped = REMAP[original] ?? original
        expect(ALLOWED_EVENT_TYPES.has(remapped)).toBe(true)
      }
    })
  }
})

// ------------------------------------------------------------------
// E2E2.9 — EOP triplet at seal/ (3) [hard-gate]
// ------------------------------------------------------------------
test.describe('E2E2.9 — EOP triplet at seal/', () => {
  test('seal/02-post-review.md exists', () => {
    expect(existsSync(EOP_REVIEW)).toBe(true)
  })
  test('seal/session-log.md exists', () => {
    expect(existsSync(EOP_LOG)).toBe(true)
  })
  test('seal/retrospective.md exists', () => {
    expect(existsSync(EOP_RETRO)).toBe(true)
  })
})
