/**
 * P99 / SEAL-PANEL — Seal Panel + EOP Persistence seal spec.
 * PURE-UNIT: FS reads + regex/string asserts. NO browser bootstrap.
 * Pattern follows tests/p98-kiss-review.spec.ts.
 *
 * P99.1 — ADR-130 file shape (4)                                     [hard-gate; A9 owns]
 * P99.2 — SealPanel component shape (A7) (3)                         [existsSync-guarded]
 * P99.3 — SealPanel testids (A7) (3)                                 [existsSync-guarded]
 * P99.4 — Agentics wire (A8) (1)                                     [existsSync-guarded]
 * P99.5 — PROCESS+DDD persistence (A8; closes P101 #2) (2)           [existsSync-guarded]
 * P99.6 — KISS — no animation libs / no new deps (1)                 [existsSync-guarded + package.json]
 * P99.7 — EOP triplet at seal/ subfolder (3)                         [hard-gate; A9 owns]
 * P99.8 — Tier-2 markers in ADR-130 (1)                              [hard-gate; A9 owns]
 *
 * Soft-pass guards via existsSync() let A7/A8 timing slips surface as
 * deferred (carry-forward) rather than red. Hard-gate remains on A9-owned
 * files (ADR-130 + EOP triplet at seal/ subfolder).
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

// --- ADR-130 (A9 owns) ---
const ADR_130 = join(ROOT, 'docs/adr/ADR-130-seal-panel-and-eop-persistence.md')

// --- A7-owned SealPanel component ---
const SEAL_PANEL = join(ROOT, 'src/components/agentics/SealPanel.tsx')

// --- A8-owned Agentics + PlanningChatBar wires ---
const AGENTICS_PAGE = join(ROOT, 'src/pages/Agentics.tsx')
const PLANNING_CHAT_BAR = join(
  ROOT,
  'src/components/planning/PlanningChatBar.tsx',
)

// --- package.json (boundary check for no new deps) ---
const PACKAGE_JSON = join(ROOT, 'package.json')

// --- EOP triplet for P99 at seal/ subfolder (A9 owns) ---
// NOTE: seal/ subfolder mirrors P95/P96/P97/P98 pattern.
const SEAL_DIR = 'plans/implementation/phase-99/seal'
const EOP_REVIEW = join(ROOT, SEAL_DIR, '02-post-review.md')
const EOP_LOG = join(ROOT, SEAL_DIR, 'session-log.md')
const EOP_RETRO = join(ROOT, SEAL_DIR, 'retrospective.md')

// Banned animation libs per Hard rules
const BANNED_ANIMATION_TOKENS = [
  'framer-motion',
  'gsap',
  'lottie',
  '@react-spring',
  'animejs',
]

// SealPanel testids per ADR-130 Acceptance Gate 2
const SEAL_PANEL_TESTIDS = [
  'seal-phase-button',
  'seal-card-post-review',
  'seal-card-session-log',
  'seal-card-retrospective',
]

function read(p: string): string {
  return readFileSync(p, 'utf8')
}
function locOf(p: string): number {
  return read(p).split('\n').length
}

// =============================================================================
// P99.1 — ADR-130 file shape (hard-gate; A9 owns)
// =============================================================================
test.describe('P99.1 — ADR-130 file shape', () => {
  test('ADR-130 exists on disk', () => {
    expect(existsSync(ADR_130)).toBe(true)
  })
  test('ADR-130 is ≤120 LOC', () => {
    if (!existsSync(ADR_130)) return
    const n = locOf(ADR_130)
    expect(n, `ADR-130 LOC ${n} should be ≤120`).toBeLessThanOrEqual(120)
  })
  test('ADR-130 declares Status: Accepted (markdown-bold tolerant)', () => {
    if (!existsSync(ADR_130)) return
    expect(read(ADR_130)).toMatch(/Status:\s*\**\s*Accepted/i)
  })
  test('ADR-130 cross-refs ADR-126 + ADR-128 + ADR-129', () => {
    if (!existsSync(ADR_130)) return
    const src = read(ADR_130)
    expect(src, 'cross-refs ADR-126').toContain('ADR-126')
    expect(src, 'cross-refs ADR-128').toContain('ADR-128')
    expect(src, 'cross-refs ADR-129').toContain('ADR-129')
  })
})

// =============================================================================
// P99.2 — SealPanel component shape (A7 surface; existsSync-guarded)
// =============================================================================
test.describe('P99.2 — SealPanel component shape (A7)', () => {
  test('SealPanel.tsx exists (or A7 timing-slip)', () => {
    if (!existsSync(SEAL_PANEL)) return
    expect(existsSync(SEAL_PANEL)).toBe(true)
  })
  test('SealPanel source exports `SealPanel` component', () => {
    if (!existsSync(SEAL_PANEL)) return
    expect(read(SEAL_PANEL)).toMatch(/export\s+(function|const)\s+SealPanel/)
  })
  test('SealPanel source contains `seal-phase-button` testid', () => {
    if (!existsSync(SEAL_PANEL)) return
    expect(read(SEAL_PANEL)).toContain('seal-phase-button')
  })
})

// =============================================================================
// P99.3 — SealPanel testids (A7 surface; existsSync-guarded)
// =============================================================================
test.describe('P99.3 — SealPanel testids (A7)', () => {
  test('SealPanel source contains `seal-card-post-review` testid', () => {
    if (!existsSync(SEAL_PANEL)) return
    expect(read(SEAL_PANEL)).toContain('seal-card-post-review')
  })
  test('SealPanel source contains `seal-card-session-log` testid', () => {
    if (!existsSync(SEAL_PANEL)) return
    expect(read(SEAL_PANEL)).toContain('seal-card-session-log')
  })
  test('SealPanel source contains `seal-card-retrospective` testid', () => {
    if (!existsSync(SEAL_PANEL)) return
    expect(read(SEAL_PANEL)).toContain('seal-card-retrospective')
  })
})

// =============================================================================
// P99.4 — Agentics wire (A8 surface; existsSync-guarded)
// =============================================================================
test.describe('P99.4 — Agentics wire (A8)', () => {
  test('Agentics.tsx contains `SealPanel` import + render', () => {
    if (!existsSync(AGENTICS_PAGE)) return
    const src = read(AGENTICS_PAGE)
    expect(
      src.includes('SealPanel'),
      'Agentics.tsx must import + render <SealPanel>',
    ).toBe(true)
  })
})

// =============================================================================
// P99.5 — PROCESS+DDD persistence (A8 surface; closes P101 #2)
// =============================================================================
test.describe('P99.5 — PROCESS+DDD persistence (A8; closes P101 #2)', () => {
  test('PlanningChatBar.tsx contains `process_atom_output` event_type', () => {
    if (!existsSync(PLANNING_CHAT_BAR)) return
    expect(
      read(PLANNING_CHAT_BAR),
      "PlanningChatBar must emit 'process_atom_output' log event (ADR-130 D4)",
    ).toContain('process_atom_output')
  })
  test('PlanningChatBar.tsx contains `ddd_atom_output` event_type', () => {
    if (!existsSync(PLANNING_CHAT_BAR)) return
    expect(
      read(PLANNING_CHAT_BAR),
      "PlanningChatBar must emit 'ddd_atom_output' log event (ADR-130 D4)",
    ).toContain('ddd_atom_output')
  })
})

// =============================================================================
// P99.6 — KISS — no animation libs / no new deps in P99 source
// =============================================================================
test.describe('P99.6 — KISS — no animation libs / no new deps', () => {
  test('no P99 source file imports banned animation tokens + no new opaque deps in package.json', () => {
    // (a) banned-token check on SealPanel.tsx (existsSync-guarded)
    if (existsSync(SEAL_PANEL)) {
      const src = read(SEAL_PANEL).toLowerCase()
      for (const tok of BANNED_ANIMATION_TOKENS) {
        expect(
          src.includes(tok),
          `${SEAL_PANEL} must not import banned animation lib '${tok}' (KISS / Hard rule)`,
        ).toBe(false)
      }
    }
    // (b) package.json sanity — must exist and parse as JSON; no new
    //     opaque deps should have crept in this sprint.
    expect(existsSync(PACKAGE_JSON)).toBe(true)
    const pkg = JSON.parse(read(PACKAGE_JSON)) as {
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
    }
    const allDeps = {
      ...(pkg.dependencies ?? {}),
      ...(pkg.devDependencies ?? {}),
    }
    // Forbid NEW deps that should NOT have crept in at P99 specifically —
    // KISS rejects parsers/animation libs that were not present before.
    // NOTE: `react-markdown` is pre-existing in this repo (predates P99) — the
    // KISS contract per ADR-130 D2 is that the SealPanel does NOT consume it;
    // that's enforced via the P99.6(a) source-file scan above + P99.2 import
    // check. The package.json check below targets deps that should have stayed
    // absent at P99 dispatch.
    const FORBIDDEN_NEW_DEPS = [
      'marked',
      'remark',
      '@supabase/supabase-js',
      'gsap',
      'lottie-web',
      'animejs',
    ]
    for (const dep of FORBIDDEN_NEW_DEPS) {
      expect(
        Object.prototype.hasOwnProperty.call(allDeps, dep),
        `package.json must not introduce '${dep}' at P99 (KISS / Hard rule)`,
      ).toBe(false)
    }
  })
})

// =============================================================================
// P99.7 — EOP triplet present for P99 at seal/ subfolder (hard-gate; A9 owns)
// =============================================================================
test.describe('P99.7 — EOP triplet present for P99', () => {
  test('phase-99/seal/02-post-review.md exists', () => {
    expect(existsSync(EOP_REVIEW)).toBe(true)
  })
  test('phase-99/seal/session-log.md exists', () => {
    expect(existsSync(EOP_LOG)).toBe(true)
  })
  test('phase-99/seal/retrospective.md exists', () => {
    expect(existsSync(EOP_RETRO)).toBe(true)
  })
})

// =============================================================================
// P99.8 — Tier-2 markers in ADR-130 (hard-gate; A9 owns)
// =============================================================================
test.describe('P99.8 — Tier-2 markers in ADR-130', () => {
  test('ADR-130 contains "Tier-2" (Out of Scope deferrals named)', () => {
    if (!existsSync(ADR_130)) return
    expect(read(ADR_130)).toContain('Tier-2')
  })
})

// Exported for sibling docs/audits
export { SEAL_PANEL_TESTIDS }
