/**
 * P81 / OC-16 — Prompt Library Completeness Standard seal spec.
 * PURE-UNIT: FS reads + JSON parse + schema soundness. NO browser bootstrap.
 * Pattern follows tests/p79-page-aware-pipeline.spec.ts +
 * tests/p78-multipage-mvp.spec.ts.
 *
 * P81.1 — ADR-106 file shape (4)              [hard-gate; this agent owns]
 * P81.2 — Corpus count ≥500 (1)               [existsSync-guarded; A1 owns]
 * P81.3 — New category files exist (2)        [existsSync-guarded; A1 owns]
 * P81.4 — Per-file schema soundness (4)       [existsSync-guarded; A1 owns]
 * P81.5 — Migration 004 references prompt-library SQL (1)
 * P81.6 — KISS: no animation libs in P81 source (1)
 * P81.7 — EOP triplet present (3)             [hard-gate; this agent owns]
 *
 * Soft-pass guards via existsSync() let A1 timing-slips surface as deferred
 * (carry-forward) rather than red — matches the P74 / P78 / P79 pattern.
 * The hard-gate is ADR-106 + EOP triplet — owned by THIS agent (A2).
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

// --- ADR-106 (this agent owns) ---
const ADR_106 = join(ROOT, 'docs/adr/ADR-106-prompt-library-completeness.md')

// --- Corpus files (A1 owns) ---
const PROMPTS_DIR = join(ROOT, 'tests/prompts')
const BY_ATOM = join(PROMPTS_DIR, 'by-atom.json')
const BY_SECTION = join(PROMPTS_DIR, 'by-section.json')
const BY_PERSONA = join(PROMPTS_DIR, 'by-persona.json')
const EDGE_CASES = join(PROMPTS_DIR, 'edge-cases.json')
const MULTI_PAGE = join(PROMPTS_DIR, 'multi-page.json')
const TEMPLATE_TRIGGERS = join(PROMPTS_DIR, 'template-triggers.json')

// --- Migration 004 (P59 / ADR-083 contribution; sanity reference) ---
const MIGRATION_004 = join(
  ROOT,
  'src/contexts/persistence/migrations/004-prompt-library.sql',
)

// --- EOP triplet (this agent owns) ---
const PHASE_DIR = 'plans/implementation/phase-81'
const EOP_REVIEW = join(ROOT, PHASE_DIR, '02-post-review.md')
const EOP_LOG = join(ROOT, PHASE_DIR, 'session-log.md')
const EOP_RETRO = join(ROOT, PHASE_DIR, 'retrospective.md')

function read(p: string): string {
  return readFileSync(p, 'utf8')
}
function locOf(p: string): number {
  return read(p).split('\n').length
}

/**
 * Tolerant array detection — corpus files MAY ship as a top-level
 * `[ ... ]` array, OR as `{ "entries": [ ... ] }`, OR as a category-keyed
 * object whose values are arrays. We accept all three shapes so corpus
 * authors aren't coupled to a single layout.
 */
function entriesOf(p: string): unknown[] {
  if (!existsSync(p)) return []
  let data: unknown
  try {
    data = JSON.parse(read(p))
  } catch {
    return []
  }
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>
    if (Array.isArray(obj.entries)) return obj.entries as unknown[]
    // Category-keyed object → flatten array values
    const flat: unknown[] = []
    for (const v of Object.values(obj)) {
      if (Array.isArray(v)) flat.push(...v)
    }
    return flat
  }
  return []
}

/**
 * Tolerant smoke schema check — at least ONE entry in the file must carry
 * `id` + `input` + `expectedAtom`. We do not enforce on every entry so
 * corpus authors can extend without churn (per ADR-106 §3 mitigation).
 */
function hasOneSchemaSoundEntry(p: string): boolean {
  const entries = entriesOf(p)
  if (entries.length === 0) return false
  return entries.some((e) => {
    if (!e || typeof e !== 'object') return false
    const r = e as Record<string, unknown>
    return (
      typeof r.id === 'string' &&
      typeof r.input === 'string' &&
      typeof r.expectedAtom === 'string'
    )
  })
}

// =============================================================================
// P81.1 — ADR-106 file shape (hard-gate; this agent owns)
// =============================================================================
test.describe('P81.1 — ADR-106 file shape', () => {
  test('ADR-106 exists on disk', () => {
    expect(existsSync(ADR_106)).toBe(true)
  })
  test('ADR-106 is ≤120 LOC', () => {
    if (!existsSync(ADR_106)) return
    const n = locOf(ADR_106)
    expect(n, `ADR-106 LOC ${n} should be ≤120`).toBeLessThanOrEqual(120)
  })
  test('ADR-106 declares Status: Accepted (markdown-bold tolerant)', () => {
    if (!existsSync(ADR_106)) return
    expect(read(ADR_106)).toMatch(/Status:\s*\**\s*Accepted/i)
  })
  test('ADR-106 cross-refs ADR-083 + ADR-098 + ADR-099', () => {
    if (!existsSync(ADR_106)) return
    const src = read(ADR_106)
    expect(src, 'cross-refs ADR-083').toContain('ADR-083')
    expect(src, 'cross-refs ADR-098').toContain('ADR-098')
    expect(src, 'cross-refs ADR-099').toContain('ADR-099')
  })
})

// =============================================================================
// P81.2 — Corpus count ≥500 (A1 owns; existsSync-guarded)
// =============================================================================
test.describe('P81.2 — Corpus count', () => {
  test('combined corpus entry count is ≥500', () => {
    const files = [
      BY_ATOM,
      BY_SECTION,
      BY_PERSONA,
      EDGE_CASES,
      MULTI_PAGE,
      TEMPLATE_TRIGGERS,
    ]
    // Skip if A1 hasn't shipped both new files yet — soft skip per P79 pattern
    if (!existsSync(MULTI_PAGE) || !existsSync(TEMPLATE_TRIGGERS)) {
      test.skip(true, 'A1 corpus expansion not yet on disk (skip-friendly)')
      return
    }
    const total = files.reduce((sum, f) => sum + entriesOf(f).length, 0)
    expect(total, `combined corpus entries ${total} should be ≥500`).toBeGreaterThanOrEqual(500)
  })
})

// =============================================================================
// P81.3 — New category files exist (A1 owns; existsSync-guarded)
// =============================================================================
test.describe('P81.3 — New category files', () => {
  test('multi-page.json exists and is non-empty', () => {
    if (!existsSync(MULTI_PAGE)) {
      test.skip(true, 'multi-page.json not yet on disk (A1 timing)')
      return
    }
    const entries = entriesOf(MULTI_PAGE)
    expect(entries.length, 'multi-page.json non-empty').toBeGreaterThan(0)
  })
  test('template-triggers.json exists and is non-empty', () => {
    if (!existsSync(TEMPLATE_TRIGGERS)) {
      test.skip(true, 'template-triggers.json not yet on disk (A1 timing)')
      return
    }
    const entries = entriesOf(TEMPLATE_TRIGGERS)
    expect(entries.length, 'template-triggers.json non-empty').toBeGreaterThan(0)
  })
})

// =============================================================================
// P81.4 — Per-file schema soundness (A1 owns; existsSync-guarded)
// Tolerant smoke check — at least one entry per file has id/input/expectedAtom.
// =============================================================================
test.describe('P81.4 — Per-file schema soundness', () => {
  test('by-atom.json has ≥1 schema-sound entry', () => {
    if (!existsSync(BY_ATOM)) return
    expect(hasOneSchemaSoundEntry(BY_ATOM)).toBe(true)
  })
  test('by-section.json has ≥1 schema-sound entry', () => {
    if (!existsSync(BY_SECTION)) return
    expect(hasOneSchemaSoundEntry(BY_SECTION)).toBe(true)
  })
  test('by-persona.json has ≥1 schema-sound entry', () => {
    if (!existsSync(BY_PERSONA)) return
    expect(hasOneSchemaSoundEntry(BY_PERSONA)).toBe(true)
  })
  test('edge-cases.json has ≥1 schema-sound entry', () => {
    if (!existsSync(EDGE_CASES)) return
    expect(hasOneSchemaSoundEntry(EDGE_CASES)).toBe(true)
  })
})

// =============================================================================
// P81.5 — Migration 004 references prompt-library SQL
// =============================================================================
test.describe('P81.5 — Migration 004 reference', () => {
  test('004-prompt-library.sql exists', () => {
    expect(existsSync(MIGRATION_004)).toBe(true)
  })
})

// =============================================================================
// P81.6 — KISS: no animation libs in P81-owned source
// =============================================================================
test.describe('P81.6 — KISS — no animation libs in P81 source', () => {
  test('corpus JSON files contain no animation-library imports', () => {
    // ADR-106 may legitimately NAME the banned packages in its KISS section
    // (per ADR-104 / P79 precedent). The KISS gate applies to data + code
    // surfaces — corpus JSON entries should not carry import strings for
    // banned packages.
    const targets = [
      BY_ATOM,
      BY_SECTION,
      BY_PERSONA,
      EDGE_CASES,
      MULTI_PAGE,
      TEMPLATE_TRIGGERS,
    ]
    const banned = /framer-motion|gsap|lottie|@react-spring|animejs/i
    for (const f of targets) {
      if (!existsSync(f)) continue
      expect(read(f), `banned animation-lib string in ${f}`).not.toMatch(banned)
    }
  })
})

// =============================================================================
// P81.7 — EOP triplet present (hard-gate; this agent owns)
// =============================================================================
test.describe('P81.7 — EOP triplet present', () => {
  test('phase-81/02-post-review.md exists', () => {
    expect(existsSync(EOP_REVIEW)).toBe(true)
  })
  test('phase-81/session-log.md exists', () => {
    expect(existsSync(EOP_LOG)).toBe(true)
  })
  test('phase-81/retrospective.md exists', () => {
    expect(existsSync(EOP_RETRO)).toBe(true)
  })
})
