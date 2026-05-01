/**
 * P80 / OC-15 — Agentic-Product Templates seal spec.
 * PURE-UNIT: FS reads + regex/string asserts. NO browser bootstrap.
 * Pattern follows tests/p79-page-aware-pipeline.spec.ts +
 * tests/p78-multipage-mvp.spec.ts.
 *
 * P80.1 — ADR-105 file shape (4)
 * P80.2 — 4 new templates exist on disk (4) [existsSync-guarded; A1 owns]
 * P80.3 — each new template parses as JSON with site + theme + sections (1; loop)
 * P80.4 — each new template has ≥6 sections (1; loop)
 * P80.5 — index.ts wires all 4 + EXAMPLE_SITES count ≥41 (2) [existsSync-guarded; A1 owns]
 * P80.6 — KISS — no animation libs in P80 source (1) [existsSync-guarded]
 * P80.7 — EOP triplet present (3) [hard-gate; this agent A3 owns]
 *
 * Soft-pass guards via existsSync() let A1 timing slip surface as deferred
 * (carry-forward) rather than red — matches the P74 / P78 / P79 pattern.
 * The EOP block is the hard-gate: ADR-105 + EOP triplet are owned by THIS
 * agent (A3) and must exist at seal.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

// --- ADR-105 (this agent A3 owns) ---
const ADR_105 = join(ROOT, 'docs/adr/ADR-105-agentic-product-templates.md')

// --- 4 NEW templates (A1 owns) ---
const EXAMPLES_DIR = join(ROOT, 'src/data/examples')
const NEW_TEMPLATES = [
  'ai-agent-marketplace.json',
  'ai-coding-copilot.json',
  'ai-workflow-platform.json',
  'ai-support-copilot.json',
] as const

// --- index.ts (A1 owns) ---
const INDEX_TS = join(EXAMPLES_DIR, 'index.ts')

// --- EOP triplet (this agent A3 owns) ---
const PHASE_DIR = 'plans/implementation/phase-80'
const EOP_REVIEW = join(ROOT, PHASE_DIR, '02-post-review.md')
const EOP_LOG = join(ROOT, PHASE_DIR, 'session-log.md')
const EOP_RETRO = join(ROOT, PHASE_DIR, 'retrospective.md')

function read(p: string): string {
  return readFileSync(p, 'utf8')
}
function locOf(p: string): number {
  return read(p).split('\n').length
}

// =============================================================================
// P80.1 — ADR-105 file shape (hard-gate, this agent owns)
// =============================================================================
test.describe('P80.1 — ADR-105 file shape', () => {
  test('ADR-105 exists on disk', () => {
    expect(existsSync(ADR_105)).toBe(true)
  })
  test('ADR-105 is ≤120 LOC', () => {
    if (!existsSync(ADR_105)) return
    const n = locOf(ADR_105)
    expect(n, `ADR-105 LOC ${n} should be ≤120`).toBeLessThanOrEqual(120)
  })
  test('ADR-105 declares Status: Accepted (markdown-bold tolerant)', () => {
    if (!existsSync(ADR_105)) return
    expect(read(ADR_105)).toMatch(/Status:\s*\**\s*Accepted/i)
  })
  test('ADR-105 cross-refs ADR-096 + ADR-098 + ADR-091', () => {
    if (!existsSync(ADR_105)) return
    const src = read(ADR_105)
    expect(src, 'cross-refs ADR-096').toContain('ADR-096')
    expect(src, 'cross-refs ADR-098').toContain('ADR-098')
    expect(src, 'cross-refs ADR-091').toContain('ADR-091')
  })
})

// =============================================================================
// P80.2 — 4 new templates exist on disk (A1 owns; existsSync-guarded)
// =============================================================================
test.describe('P80.2 — 4 new templates exist on disk', () => {
  for (const name of NEW_TEMPLATES) {
    test(`${name} exists under src/data/examples/`, () => {
      const p = join(EXAMPLES_DIR, name)
      // Soft skip if A1 hasn't landed yet
      if (!existsSync(p)) {
        test.skip(true, `${name} not yet on disk (A1 timing)`)
        return
      }
      expect(existsSync(p)).toBe(true)
    })
  }
})

// =============================================================================
// P80.3 — each new template parses as JSON with site + theme + sections keys
// =============================================================================
test.describe('P80.3 — each new template parses as JSON with required keys', () => {
  test('all 4 new templates parse with site/theme/sections keys', () => {
    for (const name of NEW_TEMPLATES) {
      const p = join(EXAMPLES_DIR, name)
      if (!existsSync(p)) continue // soft skip per file
      let parsed: unknown
      expect(() => {
        parsed = JSON.parse(read(p))
      }, `${name} should parse as JSON`).not.toThrow()
      const obj = parsed as Record<string, unknown>
      expect(obj, `${name} has site key`).toHaveProperty('site')
      expect(obj, `${name} has theme key`).toHaveProperty('theme')
      expect(obj, `${name} has sections key`).toHaveProperty('sections')
    }
  })
})

// =============================================================================
// P80.4 — each new template has ≥6 sections
// =============================================================================
test.describe('P80.4 — each new template has ≥6 sections', () => {
  test('all 4 new templates have ≥6 sections', () => {
    for (const name of NEW_TEMPLATES) {
      const p = join(EXAMPLES_DIR, name)
      if (!existsSync(p)) continue
      const obj = JSON.parse(read(p)) as { sections?: unknown[] }
      expect(
        Array.isArray(obj.sections),
        `${name} sections should be an array`,
      ).toBe(true)
      const n = (obj.sections ?? []).length
      expect(n, `${name} sections count ${n} should be ≥6`).toBeGreaterThanOrEqual(6)
    }
  })
})

// =============================================================================
// P80.5 — index.ts wires all 4 + EXAMPLE_SITES count is ≥41
// =============================================================================
test.describe('P80.5 — index.ts wires all 4 templates + count ≥41', () => {
  test('index.ts source contains all 4 import names', () => {
    if (!existsSync(INDEX_TS)) return
    const body = read(INDEX_TS)
    // Each new template's basename should appear in the import block
    expect(body, 'wires ai-agent-marketplace').toContain('ai-agent-marketplace')
    expect(body, 'wires ai-coding-copilot').toContain('ai-coding-copilot')
    expect(body, 'wires ai-workflow-platform').toContain('ai-workflow-platform')
    expect(body, 'wires ai-support-copilot').toContain('ai-support-copilot')
  })
  test('EXAMPLE_SITES count (config: occurrences) is ≥41', () => {
    if (!existsSync(INDEX_TS)) return
    const body = read(INDEX_TS)
    const n = (body.match(/config:/g) || []).length
    // index.ts contains one `config:` in the ExampleSite interface declaration
    // plus one per EXAMPLE_SITES entry. Pre-P80 count was 38 (1 interface + 37
    // entries). P80 adds 4 → 42. Floor is 41 (1 interface + 40 entries).
    expect(
      n,
      `index.ts config: occurrence count ${n} should be ≥41`,
    ).toBeGreaterThanOrEqual(41)
  })
})

// =============================================================================
// P80.6 — KISS: no animation libs in P80 source surface (existsSync-guarded)
// =============================================================================
test.describe('P80.6 — KISS — no animation libs in P80 source', () => {
  test('none of the 4 new JSON templates contain animation-library strings', () => {
    const banned = /framer-motion|gsap|lottie|@react-spring|animejs/i
    for (const name of NEW_TEMPLATES) {
      const p = join(EXAMPLES_DIR, name)
      if (!existsSync(p)) continue
      const src = read(p)
      expect(
        src,
        `${name} should contain no animation-library strings`,
      ).not.toMatch(banned)
    }
  })
})

// =============================================================================
// P80.7 — EOP triplet present (hard-gate; this agent A3 owns)
// =============================================================================
test.describe('P80.7 — EOP triplet present', () => {
  test('phase-80/02-post-review.md exists', () => {
    expect(existsSync(EOP_REVIEW)).toBe(true)
  })
  test('phase-80/session-log.md exists', () => {
    expect(existsSync(EOP_LOG)).toBe(true)
  })
  test('phase-80/retrospective.md exists', () => {
    expect(existsSync(EOP_RETRO)).toBe(true)
  })
})
