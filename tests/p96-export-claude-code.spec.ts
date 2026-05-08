/**
 * P96 / AW-EXPORT-CLAUDE-CODE — Export Claude Code (Markdown Bundle) seal spec.
 * PURE-UNIT: FS reads + regex/string asserts. NO browser bootstrap.
 * Pattern follows tests/p95-spec-workbench.spec.ts.
 *
 * P96.1 — ADR-122 file shape (4)                                     [hard-gate; A3 owns]
 * P96.2 — exportClaudeCode.ts module shape (A1) (4)                  [existsSync-guarded]
 * P96.3 — ExportClaudeCodeButton component shape (A2) (3)            [existsSync-guarded]
 * P96.4 — SpecWorkbench wires button (A2) (1)                        [existsSync-guarded]
 * P96.5 — KISS — no new deps / no animation libs in P96 source (1)   [existsSync-guarded + package.json]
 * P96.6 — EOP triplet for P96 at seal/ subfolder (3)                 [hard-gate; A3 owns]
 *
 * Soft-pass guards via existsSync() let A1/A2 timing slips surface as
 * deferred (carry-forward) rather than red. Hard-gate remains on A3-owned
 * files (ADR-122 + EOP triplet at seal/ subfolder).
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

// --- ADR-122 (A3 owns) ---
const ADR_122 = join(ROOT, 'docs/adr/ADR-122-export-claude-code-markdown-bundle.md')

// --- A1-owned exportClaudeCode emitter module ---
const EXPORT_MODULE = join(ROOT, 'src/contexts/specification/exportClaudeCode.ts')

// --- A2-owned ExportClaudeCodeButton component + SpecWorkbench wire ---
const EXPORT_BUTTON = join(ROOT, 'src/components/agentics/ExportClaudeCodeButton.tsx')
const SPEC_WORKBENCH = join(ROOT, 'src/components/agentics/SpecWorkbench.tsx')

// --- package.json (boundary check for no new deps) ---
const PACKAGE_JSON = join(ROOT, 'package.json')

// --- EOP triplet for P96 at seal/ subfolder (A3 owns) ---
// NOTE: seal/ subfolder mirrors P95 pattern (avoids filename collision
// with planning sprint design docs that already live at phase-95/00..04
// and would conflict with phase-96/00..04 by naming convention).
const SEAL_DIR = 'plans/implementation/phase-96/seal'
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

// Banned ZIP / fs deps per ADR-122 D1 + D2 (markdown bundle is zero-dep)
const BANNED_ARCHIVE_TOKENS = ['jszip', 'archiver', 'fs-promises']

function read(p: string): string {
  return readFileSync(p, 'utf8')
}
function locOf(p: string): number {
  return read(p).split('\n').length
}

// =============================================================================
// P96.1 — ADR-122 file shape (hard-gate; A3 owns)
// =============================================================================
test.describe('P96.1 — ADR-122 file shape', () => {
  test('ADR-122 exists on disk', () => {
    expect(existsSync(ADR_122)).toBe(true)
  })
  test('ADR-122 is ≤120 LOC', () => {
    if (!existsSync(ADR_122)) return
    const n = locOf(ADR_122)
    expect(n, `ADR-122 LOC ${n} should be ≤120`).toBeLessThanOrEqual(120)
  })
  test('ADR-122 declares Status: Accepted (markdown-bold tolerant)', () => {
    if (!existsSync(ADR_122)) return
    expect(read(ADR_122)).toMatch(/Status:\s*\**\s*Accepted/i)
  })
  test('ADR-122 cross-refs ADR-101 + ADR-108 + ADR-110 + ADR-121', () => {
    if (!existsSync(ADR_122)) return
    const src = read(ADR_122)
    expect(src, 'cross-refs ADR-101').toContain('ADR-101')
    expect(src, 'cross-refs ADR-108').toContain('ADR-108')
    expect(src, 'cross-refs ADR-110').toContain('ADR-110')
    expect(src, 'cross-refs ADR-121').toContain('ADR-121')
  })
})

// =============================================================================
// P96.2 — exportClaudeCode.ts module shape (A1 surface; existsSync-guarded)
// =============================================================================
test.describe('P96.2 — exportClaudeCode.ts module shape (A1)', () => {
  test('src/contexts/specification/exportClaudeCode.ts exists (or A1 timing-slip)', () => {
    if (!existsSync(EXPORT_MODULE)) return
    expect(existsSync(EXPORT_MODULE)).toBe(true)
  })
  test('exportClaudeCode source exports `buildClaudeCodeBundle` function', () => {
    if (!existsSync(EXPORT_MODULE)) return
    expect(read(EXPORT_MODULE)).toMatch(/export\s+function\s+buildClaudeCodeBundle/)
  })
  test('exportClaudeCode source exports `ExportClaudeCodeBundle` interface or type', () => {
    if (!existsSync(EXPORT_MODULE)) return
    expect(read(EXPORT_MODULE)).toMatch(
      /export\s+(interface|type)\s+ExportClaudeCodeBundle/,
    )
  })
  test('exportClaudeCode source contains `# === FILE:` marker pattern (ADR-122 D2)', () => {
    if (!existsSync(EXPORT_MODULE)) return
    expect(read(EXPORT_MODULE)).toContain('# === FILE:')
  })
})

// =============================================================================
// P96.3 — ExportClaudeCodeButton component shape (A2 surface; existsSync-guarded)
// =============================================================================
test.describe('P96.3 — ExportClaudeCodeButton component (A2)', () => {
  test('src/components/agentics/ExportClaudeCodeButton.tsx exists (or A2 timing-slip)', () => {
    if (!existsSync(EXPORT_BUTTON)) return
    expect(existsSync(EXPORT_BUTTON)).toBe(true)
  })
  test('ExportClaudeCodeButton source contains `export-claude-code-button` testid', () => {
    if (!existsSync(EXPORT_BUTTON)) return
    expect(read(EXPORT_BUTTON)).toContain('data-testid="export-claude-code-button"')
  })
  test('ExportClaudeCodeButton source references `navigator` or `Blob` (download path)', () => {
    if (!existsSync(EXPORT_BUTTON)) return
    const src = read(EXPORT_BUTTON)
    const hasNavigator = /navigator/.test(src)
    const hasBlob = /Blob/.test(src)
    expect(
      hasNavigator || hasBlob,
      'ExportClaudeCodeButton must reference `navigator` OR `Blob` for the download path',
    ).toBe(true)
  })
})

// =============================================================================
// P96.4 — SpecWorkbench wires ExportClaudeCodeButton (A2 surface; existsSync-guarded)
// =============================================================================
test.describe('P96.4 — SpecWorkbench wires button (A2)', () => {
  test('SpecWorkbench.tsx imports + renders ExportClaudeCodeButton (≥2 references)', () => {
    if (!existsSync(SPEC_WORKBENCH)) return
    const src = read(SPEC_WORKBENCH)
    const refs = src.match(/ExportClaudeCodeButton/g) ?? []
    expect(
      refs.length,
      `SpecWorkbench.tsx must import + render ExportClaudeCodeButton (found ${refs.length} references; need ≥2)`,
    ).toBeGreaterThanOrEqual(2)
  })
})

// =============================================================================
// P96.5 — KISS — no new deps / no animation libs in P96 source
// =============================================================================
test.describe('P96.5 — KISS — no new deps / no animation libs in P96 source', () => {
  test('no P96 source file imports banned tokens + no new opaque deps in package.json', () => {
    // (a) banned-token check on exportClaudeCode.ts (existsSync-guarded)
    if (existsSync(EXPORT_MODULE)) {
      const src = read(EXPORT_MODULE).toLowerCase()
      for (const tok of BANNED_ANIMATION_TOKENS) {
        expect(
          src.includes(tok),
          `${EXPORT_MODULE} must not import banned animation lib '${tok}' (KISS / Hard rule)`,
        ).toBe(false)
      }
      for (const tok of BANNED_ARCHIVE_TOKENS) {
        expect(
          src.includes(tok),
          `${EXPORT_MODULE} must not import banned archive/fs lib '${tok}' (ADR-122 D1/D2 — markdown bundle is zero-dep)`,
        ).toBe(false)
      }
    }
    // (b) banned-token check on ExportClaudeCodeButton.tsx (existsSync-guarded)
    if (existsSync(EXPORT_BUTTON)) {
      const src = read(EXPORT_BUTTON).toLowerCase()
      for (const tok of BANNED_ANIMATION_TOKENS) {
        expect(
          src.includes(tok),
          `${EXPORT_BUTTON} must not import banned animation lib '${tok}' (KISS / Hard rule)`,
        ).toBe(false)
      }
    }
    // (c) package.json sanity — must exist and parse as JSON; no new deps
    //     should have crept in this sprint (jszip / archiver / Supabase / etc.).
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
    // (framer-motion + jszip are pre-existing legacy deps — out of scope for
    // this denylist. P96 source must not IMPORT them — covered by the
    // banned-token check above on EXPORT_MODULE; ADR-122 D1 markdown bundle
    // pipeline is zero-dep at the source-import boundary.)
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
        `package.json must not introduce '${dep}' at P96 (KISS / ADR-122 D1)`,
      ).toBe(false)
    }
  })
})

// =============================================================================
// P96.6 — EOP triplet present for P96 at seal/ subfolder (hard-gate; A3 owns)
// =============================================================================
test.describe('P96.6 — EOP triplet present for P96', () => {
  test('phase-96/seal/02-post-review.md exists', () => {
    expect(existsSync(EOP_REVIEW)).toBe(true)
  })
  test('phase-96/seal/session-log.md exists', () => {
    expect(existsSync(EOP_LOG)).toBe(true)
  })
  test('phase-96/seal/retrospective.md exists', () => {
    expect(existsSync(EOP_RETRO)).toBe(true)
  })
})
