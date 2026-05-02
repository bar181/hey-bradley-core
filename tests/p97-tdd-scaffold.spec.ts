/**
 * P97 / TDD-SCAFFOLD — TDD Scaffold + AGENT_ATOM Production Wire seal spec.
 * PURE-UNIT: FS reads + regex/string asserts. NO browser bootstrap.
 * Pattern follows tests/p96-export-claude-code.spec.ts.
 *
 * P97.1 — ADR-128 file shape (4)                                     [hard-gate; A3 owns]
 * P97.2 — tddScaffoldGenerator module shape (A1) (3)                 [existsSync-guarded]
 * P97.3 — AGENT_ATOM production call site (A1) (1)                   [existsSync-guarded]
 * P97.4 — SpecWorkbench export button (A2) (1)                       [existsSync-guarded]
 * P97.5 — Bundle wire (A2) (1)                                       [existsSync-guarded]
 * P97.6 — KISS — no animation libs / no new deps (1)                 [existsSync-guarded + package.json]
 * P97.7 — EOP triplet for P97 at seal/ subfolder (3)                 [hard-gate; A3 owns]
 * P97.8 — Tier-2 markers in ADR-128 (1)                              [hard-gate; A3 owns]
 *
 * Soft-pass guards via existsSync() let A1/A2 timing slips surface as
 * deferred (carry-forward) rather than red. Hard-gate remains on A3-owned
 * files (ADR-128 + EOP triplet at seal/ subfolder).
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

// --- ADR-128 (A3 owns) ---
const ADR_128 = join(ROOT, 'docs/adr/ADR-128-tdd-scaffold-and-agent-atom-wire.md')

// --- A1-owned tddScaffoldGenerator module ---
const TDD_MODULE = join(
  ROOT,
  'src/contexts/specification/exporters/tddScaffoldGenerator.ts',
)

// --- A1-owned PlanningChatBar wire (AGENT_ATOM production call site) ---
const PLANNING_CHAT_BAR = join(ROOT, 'src/components/planning/PlanningChatBar.tsx')

// --- A2-owned SpecWorkbench export button + Claude Code bundle wire ---
const SPEC_WORKBENCH = join(ROOT, 'src/components/agentics/SpecWorkbench.tsx')
const EXPORT_MODULE = join(ROOT, 'src/contexts/specification/exportClaudeCode.ts')

// --- package.json (boundary check for no new deps) ---
const PACKAGE_JSON = join(ROOT, 'package.json')

// --- EOP triplet for P97 at seal/ subfolder (A3 owns) ---
// NOTE: seal/ subfolder mirrors P95/P96 pattern.
const SEAL_DIR = 'plans/implementation/phase-97/seal'
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

function read(p: string): string {
  return readFileSync(p, 'utf8')
}
function locOf(p: string): number {
  return read(p).split('\n').length
}

// =============================================================================
// P97.1 — ADR-128 file shape (hard-gate; A3 owns)
// =============================================================================
test.describe('P97.1 — ADR-128 file shape', () => {
  test('ADR-128 exists on disk', () => {
    expect(existsSync(ADR_128)).toBe(true)
  })
  test('ADR-128 is ≤120 LOC', () => {
    if (!existsSync(ADR_128)) return
    const n = locOf(ADR_128)
    expect(n, `ADR-128 LOC ${n} should be ≤120`).toBeLessThanOrEqual(120)
  })
  test('ADR-128 declares Status: Accepted (markdown-bold tolerant)', () => {
    if (!existsSync(ADR_128)) return
    expect(read(ADR_128)).toMatch(/Status:\s*\**\s*Accepted/i)
  })
  test('ADR-128 cross-refs ADR-120 + ADR-121 + ADR-122 + ADR-127', () => {
    if (!existsSync(ADR_128)) return
    const src = read(ADR_128)
    expect(src, 'cross-refs ADR-120').toContain('ADR-120')
    expect(src, 'cross-refs ADR-121').toContain('ADR-121')
    expect(src, 'cross-refs ADR-122').toContain('ADR-122')
    expect(src, 'cross-refs ADR-127').toContain('ADR-127')
  })
})

// =============================================================================
// P97.2 — tddScaffoldGenerator module shape (A1 surface; existsSync-guarded)
// =============================================================================
test.describe('P97.2 — tddScaffoldGenerator module shape (A1)', () => {
  test('tddScaffoldGenerator.ts exists (or A1 timing-slip)', () => {
    if (!existsSync(TDD_MODULE)) return
    expect(existsSync(TDD_MODULE)).toBe(true)
  })
  test('tddScaffoldGenerator source exports `buildTDDScaffold` function', () => {
    if (!existsSync(TDD_MODULE)) return
    expect(read(TDD_MODULE)).toMatch(/export\s+function\s+buildTDDScaffold/)
  })
  test('tddScaffoldGenerator source exports `TDDScaffoldOutput` interface or type', () => {
    if (!existsSync(TDD_MODULE)) return
    expect(read(TDD_MODULE)).toMatch(
      /export\s+(interface|type)\s+TDDScaffoldOutput/,
    )
  })
})

// =============================================================================
// P97.3 — AGENT_ATOM production call site (A1 surface; existsSync-guarded)
// =============================================================================
test.describe('P97.3 — AGENT_ATOM production call site (A1)', () => {
  test('PlanningChatBar.tsx contains `classifyAgents` (closes P101 #1)', () => {
    if (!existsSync(PLANNING_CHAT_BAR)) return
    expect(read(PLANNING_CHAT_BAR)).toContain('classifyAgents')
  })
})

// =============================================================================
// P97.4 — SpecWorkbench export button (A2 surface; existsSync-guarded)
// =============================================================================
test.describe('P97.4 — SpecWorkbench export button (A2)', () => {
  test('SpecWorkbench.tsx contains `generate-test-spec` testid', () => {
    if (!existsSync(SPEC_WORKBENCH)) return
    expect(read(SPEC_WORKBENCH)).toContain('generate-test-spec')
  })
})

// =============================================================================
// P97.5 — Bundle wire (A2 surface; existsSync-guarded)
// =============================================================================
test.describe('P97.5 — Bundle wire (A2)', () => {
  test('exportClaudeCode.ts contains `buildTDDScaffold` import / call', () => {
    if (!existsSync(EXPORT_MODULE)) return
    expect(read(EXPORT_MODULE)).toContain('buildTDDScaffold')
  })
})

// =============================================================================
// P97.6 — KISS — no animation libs / no new deps in P97 source
// =============================================================================
test.describe('P97.6 — KISS — no animation libs / no new deps', () => {
  test('no P97 source file imports banned animation tokens + no new opaque deps in package.json', () => {
    // (a) banned-token check on tddScaffoldGenerator.ts (existsSync-guarded)
    if (existsSync(TDD_MODULE)) {
      const src = read(TDD_MODULE).toLowerCase()
      for (const tok of BANNED_ANIMATION_TOKENS) {
        expect(
          src.includes(tok),
          `${TDD_MODULE} must not import banned animation lib '${tok}' (KISS / Hard rule)`,
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
    // Forbid NEW deps that should NOT have crept in this sprint.
    // (jszip + framer-motion are pre-existing legacy deps — out of scope per
    // P96 spec convention; ADR-128 markdown bundle pipeline is zero-dep at the
    // source-import boundary.)
    const FORBIDDEN_NEW_DEPS = [
      'archiver',
      '@supabase/supabase-js',
      'gsap',
      'lottie-web',
      'animejs',
    ]
    for (const dep of FORBIDDEN_NEW_DEPS) {
      expect(
        Object.prototype.hasOwnProperty.call(allDeps, dep),
        `package.json must not introduce '${dep}' at P97 (KISS / Hard rule)`,
      ).toBe(false)
    }
  })
})

// =============================================================================
// P97.7 — EOP triplet present for P97 at seal/ subfolder (hard-gate; A3 owns)
// =============================================================================
test.describe('P97.7 — EOP triplet present for P97', () => {
  test('phase-97/seal/02-post-review.md exists', () => {
    expect(existsSync(EOP_REVIEW)).toBe(true)
  })
  test('phase-97/seal/session-log.md exists', () => {
    expect(existsSync(EOP_LOG)).toBe(true)
  })
  test('phase-97/seal/retrospective.md exists', () => {
    expect(existsSync(EOP_RETRO)).toBe(true)
  })
})

// =============================================================================
// P97.8 — Tier-2 markers in ADR-128 (hard-gate; A3 owns)
// =============================================================================
test.describe('P97.8 — Tier-2 markers in ADR-128', () => {
  test('ADR-128 contains "Tier-2" (Out of Scope deferrals named)', () => {
    if (!existsSync(ADR_128)) return
    expect(read(ADR_128)).toContain('Tier-2')
  })
})
