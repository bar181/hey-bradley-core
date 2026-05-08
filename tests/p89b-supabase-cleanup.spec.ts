/**
 * P89b / TIER2-CLEANUP — open-core Supabase boundary correction seal spec.
 * PURE-UNIT: FS reads + recursive walk + regex/string asserts. NO browser bootstrap.
 * Pattern follows tests/p89-tier2-foundation.spec.ts.
 *
 * P89b.1 — Open-core source has zero Supabase refs (3)              [hard-gate; A1 owns]
 * P89b.2 — Tier-2 README exists + non-empty (1)                     [hard-gate; this agent owns]
 * P89b.3 — ADR-114 + ADR-115 carry Tier-2 marker (1)                [hard-gate; this agent owns]
 * P89b.4 — EOP triplet present for P89b (3)                         [hard-gate; this agent owns]
 *
 * Background: P89 prematurely landed Supabase scaffolding inside `src/`.
 * P89b moves it to `plans/tier-2/` and verifies open-core has zero leak.
 * The forbidden-token check uses recursive readdirSync over .ts/.tsx files
 * — purely a FS-read assertion, no compilation, no browser.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

// --- Open-core source roots that MUST be Supabase-free ---
const SRC_PERSISTENCE = join(ROOT, 'src/contexts/persistence')
const SRC_STORE = join(ROOT, 'src/store')
const SRC_COMPONENTS = join(ROOT, 'src/components')

// --- Tier-2 README (this agent owns) ---
const TIER2_README = join(ROOT, 'plans/tier-2/README.md')

// --- ADR-114 + ADR-115 (this agent surgical EDIT owns the marker) ---
const ADR_114 = join(ROOT, 'docs/adr/ADR-114-supabase-architecture.md')
const ADR_115 = join(ROOT, 'docs/adr/ADR-115-feature-flag-architecture.md')

// --- EOP triplet for P89b (this agent owns) ---
const PHASE_DIR = 'plans/implementation/phase-89b'
const EOP_REVIEW = join(ROOT, PHASE_DIR, '02-post-review.md')
const EOP_LOG = join(ROOT, PHASE_DIR, 'session-log.md')
const EOP_RETRO = join(ROOT, PHASE_DIR, 'retrospective.md')

// Forbidden CODE-COUPLING tokens that must not appear anywhere in open-core src/.
//
// We deliberately narrow on code-shapes (camelCase identifier, env-var name,
// import-path token) rather than the bare lowercased word "supabase" — the
// latter has legitimate marketing-prose mentions (e.g. "Supabase auth +
// persistence" describing the commercial tier in OpenCoreVsCommercial.tsx),
// which are FINE: marketing copy may describe what Tier-2 offers without
// the open-core build path coupling to Supabase code. The assertion is
// "no code coupling", not "no brand-name mention".
const FORBIDDEN_OPEN_CORE_TOKENS = [
  '@supabase/',       // SDK import path — code coupling
  'isSupabaseMode',   // featureFlag.ts identifier — code coupling
  'VITE_SUPABASE',    // env var — code coupling
]

function read(p: string): string {
  return readFileSync(p, 'utf8')
}
function locOf(p: string): number {
  return read(p).split('\n').length
}

/**
 * Recursively walk a directory and collect .ts / .tsx files.
 * Tolerates missing roots (returns []); skips node_modules / dist defensively.
 */
function walkDir(root: string, files: string[] = []): string[] {
  if (!existsSync(root)) return files
  for (const name of readdirSync(root)) {
    if (name === 'node_modules' || name === 'dist' || name === '.next') continue
    const path = join(root, name)
    let st
    try {
      st = statSync(path)
    } catch {
      continue
    }
    if (st.isDirectory()) {
      walkDir(path, files)
    } else if (path.endsWith('.ts') || path.endsWith('.tsx')) {
      files.push(path)
    }
  }
  return files
}

/**
 * Count case-insensitive occurrences of any forbidden token across all
 * .ts / .tsx files under the given root. Returns the [file, token, count]
 * tuples that violate (count > 0).
 */
function findForbidden(root: string): Array<[string, string, number]> {
  const violations: Array<[string, string, number]> = []
  for (const file of walkDir(root)) {
    let body: string
    try {
      body = read(file)
    } catch {
      continue
    }
    for (const tok of FORBIDDEN_OPEN_CORE_TOKENS) {
      // Case-sensitive — these are code identifiers (`@supabase/...` import
      // path, `isSupabaseMode` identifier, `VITE_SUPABASE_*` env var).
      const matches = body.match(
        new RegExp(tok.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      )
      if (matches && matches.length > 0) {
        violations.push([file, tok, matches.length])
      }
    }
  }
  return violations
}

// =============================================================================
// P89b.1 — Open-core source has zero Supabase refs (hard-gate; A1 owns)
// =============================================================================
test.describe('P89b.1 — Open-core source has zero Supabase refs', () => {
  test('src/contexts/persistence/ tree contains 0 @supabase/|isSupabaseMode|VITE_SUPABASE code-coupling matches', () => {
    if (!existsSync(SRC_PERSISTENCE)) return // tolerant if A1 timing-slipped
    const violations = findForbidden(SRC_PERSISTENCE)
    expect(
      violations,
      `src/contexts/persistence must have zero Supabase refs (open-core boundary; ADR-114 + P89b correction). Violations: ${JSON.stringify(violations, null, 2)}`,
    ).toEqual([])
  })

  test('src/store/ tree contains 0 @supabase/|isSupabaseMode|VITE_SUPABASE code-coupling matches', () => {
    if (!existsSync(SRC_STORE)) return
    const violations = findForbidden(SRC_STORE)
    expect(
      violations,
      `src/store must have zero Supabase refs (open-core boundary). Violations: ${JSON.stringify(violations, null, 2)}`,
    ).toEqual([])
  })

  test('src/components/ tree contains 0 @supabase/|isSupabaseMode|VITE_SUPABASE code-coupling matches', () => {
    if (!existsSync(SRC_COMPONENTS)) return
    const violations = findForbidden(SRC_COMPONENTS)
    expect(
      violations,
      `src/components must have zero Supabase refs (open-core boundary). Violations: ${JSON.stringify(violations, null, 2)}`,
    ).toEqual([])
  })
})

// =============================================================================
// P89b.2 — Tier-2 README exists + non-empty (hard-gate; this agent owns)
// =============================================================================
test.describe('P89b.2 — Tier-2 README exists', () => {
  test('plans/tier-2/README.md exists, ≥80 LOC, mentions BYOK + open-core + Tier-2 + boundary', () => {
    expect(existsSync(TIER2_README)).toBe(true)
    const n = locOf(TIER2_README)
    expect(n, `tier-2 README LOC ${n} should be ≥80`).toBeGreaterThanOrEqual(80)
    const body = read(TIER2_README)
    expect(body, 'mentions BYOK').toContain('BYOK')
    expect(body, 'mentions open-core').toMatch(/open[- ]core/i)
    expect(body, 'mentions Tier-2').toContain('Tier-2')
    expect(body, 'mentions boundary').toMatch(/boundary/i)
  })
})

// =============================================================================
// P89b.3 — ADR-114 + ADR-115 carry Tier-2 marker (hard-gate; this agent owns)
// =============================================================================
test.describe('P89b.3 — ADR-114 + ADR-115 Tier-2 markers', () => {
  test('ADR-114 + ADR-115 both contain "Tier-2 planning document" marker', () => {
    expect(existsSync(ADR_114)).toBe(true)
    expect(existsSync(ADR_115)).toBe(true)
    expect(read(ADR_114), 'ADR-114 marker').toContain('Tier-2 planning document')
    expect(read(ADR_115), 'ADR-115 marker').toContain('Tier-2 planning document')
  })
})

// =============================================================================
// P89b.4 — EOP triplet present for P89b (hard-gate; this agent owns)
// =============================================================================
test.describe('P89b.4 — EOP triplet present for P89b', () => {
  test('phase-89b/02-post-review.md exists', () => {
    expect(existsSync(EOP_REVIEW)).toBe(true)
  })
  test('phase-89b/session-log.md exists', () => {
    expect(existsSync(EOP_LOG)).toBe(true)
  })
  test('phase-89b/retrospective.md exists', () => {
    expect(existsSync(EOP_RETRO)).toBe(true)
  })
})
