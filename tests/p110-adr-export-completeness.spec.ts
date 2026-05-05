/**
 * P110 / A3 — ADR-138 Export Completeness + ADR Enforcement Verifier.
 *
 * Closer spec for the P110 sprint. Wave 1 sealed:
 *   - A1 commit `34f973a` — `tests/architecture-invariants.spec.ts` (12 invariants)
 *                          + `scripts/adr-lint.ts` (rule table + lint runner)
 *   - A2 commit `ca662c8` — `src/contexts/specification/exportClaudeCode.ts`
 *                          (4 NEW logical files; ≥10 baseline; readAdr IoC)
 *                          + `src/contexts/specification/types.ts` (PhaseCard
 *                            gains optional dddOutput + processOutput)
 *
 * Wave 2 (this closer) authors ADR-138 + this spec + EOP triplet + CLAUDE.md
 * sync. No source edits. Acceptance: ≥15 cases / ≥6 describes / ≤300 LOC;
 * cumulative regression ≥252 GREEN at this anchor.
 *
 * Per the closer mandate: existsSync soft-pass guards on Wave-1 surfaces;
 * hard-gate on ADR-138 file shape + Status: Accepted + cross-refs to
 * ADR-102/122/126/128/134/135 + EOP triplet + KISS no-new-deps boundary.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'
import { buildClaudeCodeBundle } from '../src/contexts/specification/exportClaudeCode'
import type { PhaseCard } from '../src/contexts/specification/types'

const ROOT = process.cwd()

const ADR_138 = join(ROOT, 'docs/adr/ADR-138-export-completeness-adr-enforcement.md')
const EXPORT_FILE = join(ROOT, 'src/contexts/specification/exportClaudeCode.ts')
const TYPES_FILE = join(ROOT, 'src/contexts/specification/types.ts')
const ARCH_INVARIANTS = join(ROOT, 'tests/architecture-invariants.spec.ts')
const ADR_LINT = join(ROOT, 'scripts/adr-lint.ts')
const PHASE_DIR = join(ROOT, 'plans/implementation/phase-110')
const PKG_JSON = join(ROOT, 'package.json')

/** Minimal but realistic PhaseCard for buildClaudeCodeBundle invocation. */
function makeSamplePhase(): PhaseCard {
  return {
    id: 'p110-sample',
    phase: 110,
    name: 'P110 Sample',
    status: 'sealed',
    sprints: [
      {
        id: 's1',
        name: 'Wave 1 — Enforcement + Export',
        status: 'sealed',
        agentCount: 2,
        keyDeliverable: 'Architecture invariants + bundle file types',
        agentScopes: [
          { id: 'a1', role: 'enforcement', ownedFiles: ['tests/architecture-invariants.spec.ts'] },
          { id: 'a2', role: 'exporter', ownedFiles: ['src/contexts/specification/exportClaudeCode.ts'] },
        ],
        dod: ['12 invariants pass', 'bundle ≥10 files'],
      },
    ],
    humanSpec: {
      northStar: 'Close the export-completeness + ADR-enforcement gaps in one sprint.',
      sadd: 'Two parallel disjoint-scope tracks plus a closer ADR.',
      implementationPlan: 'A1 ships invariants + lint; A2 ships 4 new file types; A3 closes.',
    },
    aispSpec: 'Σ := { phase: PhaseCard }\nΩ := { close gaps }\nΓ := { R1: bundle ≥10 }',
    adrRefs: [
      { id: 'ADR-122', title: 'Export Claude Code Markdown Bundle' },
      { id: 'ADR-138', title: 'Export Completeness Standard + ADR Enforcement Architecture' },
    ],
  }
}

// ─── P110.1 — ADR-138 file shape ────────────────────────────────────────────
test.describe('P110.1 — ADR-138 file shape (Status + cross-refs)', () => {
  test('ADR-138 exists', () => {
    expect(existsSync(ADR_138), 'ADR-138 file must exist on disk').toBe(true)
  })

  test('Status: Accepted + ≤120 LOC', () => {
    const txt = readFileSync(ADR_138, 'utf8')
    expect(txt, 'must declare Status: Accepted').toMatch(/Status:\*?\*?\s+Accepted/)
    const loc = txt.split('\n').length
    expect(loc, `ADR-138 LOC = ${loc}; cap = 120`).toBeLessThanOrEqual(120)
  })

  test('cites ADR-102 + ADR-122 + ADR-126 + ADR-128 + ADR-134 + ADR-135', () => {
    const txt = readFileSync(ADR_138, 'utf8')
    for (const id of ['ADR-102', 'ADR-122', 'ADR-126', 'ADR-128', 'ADR-134', 'ADR-135']) {
      expect(txt, `must cite ${id}`).toContain(id)
    }
  })
})

// ─── P110.2-P110.6 — Export bundle file emission ────────────────────────────
test.describe('P110.2 — buildClaudeCodeBundle emits ≥10 logical files', () => {
  test('bundle.files.length ≥ 10', () => {
    if (!existsSync(EXPORT_FILE)) test.skip(true, 'exportClaudeCode.ts absent')
    const bundle = buildClaudeCodeBundle(makeSamplePhase())
    expect(bundle.files.length, `files = ${bundle.files.length}; floor = 10`).toBeGreaterThanOrEqual(10)
  })
})

test.describe('P110.3 — ddd-contexts.md emitted', () => {
  test('bundle.files contains ddd-contexts.md path', () => {
    if (!existsSync(EXPORT_FILE)) test.skip(true, 'exportClaudeCode.ts absent')
    const bundle = buildClaudeCodeBundle(makeSamplePhase())
    const paths = bundle.files.map((f) => f.path)
    expect(paths, `paths: ${paths.join(', ')}`).toContain('ddd-contexts.md')
  })
})

test.describe('P110.4 — top-level implementation-plan.md emitted', () => {
  test('bundle.files contains implementation-plan.md path', () => {
    if (!existsSync(EXPORT_FILE)) test.skip(true, 'exportClaudeCode.ts absent')
    const bundle = buildClaudeCodeBundle(makeSamplePhase())
    const paths = bundle.files.map((f) => f.path)
    expect(paths, 'top-level implementation-plan.md present').toContain('implementation-plan.md')
    // Back-compat: human-spec/implementation-plan.md retained.
    expect(paths, 'back-compat human-spec/implementation-plan.md present').toContain(
      'human-spec/implementation-plan.md',
    )
  })
})

test.describe('P110.5 — tdd-scaffold.md emitted (wires P97 buildTDDScaffold)', () => {
  test('bundle.files contains tdd-scaffold.md path', () => {
    if (!existsSync(EXPORT_FILE)) test.skip(true, 'exportClaudeCode.ts absent')
    const bundle = buildClaudeCodeBundle(makeSamplePhase())
    const paths = bundle.files.map((f) => f.path)
    expect(paths, 'tdd-scaffold.md present').toContain('tdd-scaffold.md')
  })
})

test.describe('P110.6 — adr-bundle/<id>.md emitted per phase.adrRefs', () => {
  test('two adrRefs → two adr-bundle/ files', () => {
    if (!existsSync(EXPORT_FILE)) test.skip(true, 'exportClaudeCode.ts absent')
    const bundle = buildClaudeCodeBundle(makeSamplePhase())
    const adrBundlePaths = bundle.files.map((f) => f.path).filter((p) => p.startsWith('adr-bundle/'))
    expect(adrBundlePaths.length, `adr-bundle/ count = ${adrBundlePaths.length}`).toBe(2)
    expect(adrBundlePaths, 'adr-bundle/ADR-122.md present').toContain('adr-bundle/ADR-122.md')
    expect(adrBundlePaths, 'adr-bundle/ADR-138.md present').toContain('adr-bundle/ADR-138.md')
  })
})

// ─── P110.7 — readAdr callback parameter ───────────────────────────────────
test.describe('P110.7 — readAdr callback wires through (IoC pattern)', () => {
  test('readAdr supplied → ADR text inlined into adr-bundle/', () => {
    if (!existsSync(EXPORT_FILE)) test.skip(true, 'exportClaudeCode.ts absent')
    const phase = makeSamplePhase()
    const readAdr = (id: string): string | null =>
      id === 'ADR-122' ? '# ADR-122 INLINED CONTENT' : null
    const bundle = buildClaudeCodeBundle(phase, undefined, undefined, readAdr)
    const adr122 = bundle.files.find((f) => f.path === 'adr-bundle/ADR-122.md')
    expect(adr122, 'adr-bundle/ADR-122.md present').toBeTruthy()
    expect(adr122!.content, 'inlined content honored').toContain('ADR-122 INLINED CONTENT')
    // ADR-138 fell back to stub link (readAdr returned null)
    const adr138 = bundle.files.find((f) => f.path === 'adr-bundle/ADR-138.md')
    expect(adr138!.content, 'fallback stub for null return').toMatch(/ADR-138/)
  })
})

// ─── P110.8 — exportClaudeCode atom-purity preserved ───────────────────────
test.describe('P110.8 — exportClaudeCode.ts atom purity (ADR-122 D1 + ADR-134)', () => {
  test('zero @/components imports + zero fs imports', () => {
    const txt = readFileSync(EXPORT_FILE, 'utf8')
    expect(txt, 'no @/components imports').not.toMatch(/from\s+['"]@\/components/)
    expect(txt, 'no node:fs imports').not.toMatch(/from\s+['"]node:fs['"]/)
    expect(txt, 'no fs imports').not.toMatch(/from\s+['"]fs['"]/)
    expect(txt, 'no fs/promises imports').not.toMatch(/from\s+['"]fs\/promises['"]/)
  })
})

// ─── P110.9 — architecture-invariants spec has ≥10 invariants ──────────────
test.describe('P110.9 — architecture-invariants.spec.ts has ≥10 fitness functions', () => {
  test('count test.describe blocks', () => {
    if (!existsSync(ARCH_INVARIANTS)) test.skip(true, 'architecture-invariants.spec.ts absent')
    const txt = readFileSync(ARCH_INVARIANTS, 'utf8')
    const describes = txt.match(/test\.describe\(/g) ?? []
    expect(describes.length, `describes = ${describes.length}; floor = 10`).toBeGreaterThanOrEqual(10)
  })
})

// ─── P110.10 — adr-lint exists with rule table ─────────────────────────────
test.describe('P110.10 — scripts/adr-lint.ts has ADR_RULES with ≥6 unique ADRs', () => {
  test('rule table coverage', () => {
    if (!existsSync(ADR_LINT)) test.skip(true, 'adr-lint.ts absent')
    const txt = readFileSync(ADR_LINT, 'utf8')
    expect(txt, 'must declare ADR_RULES').toMatch(/ADR_RULES/)
    const adrs = new Set(txt.match(/ADR-\d{3}/g) ?? [])
    expect(adrs.size, `unique ADR refs = ${adrs.size}; floor = 6`).toBeGreaterThanOrEqual(6)
  })
})

// ─── P110.11 — adr-lint smoke run exits 0 on clean diff ────────────────────
test.describe('P110.11 — adr-lint exits 0 on clean diff (smoke)', () => {
  test('node --experimental-strip-types scripts/adr-lint.ts', () => {
    if (!existsSync(ADR_LINT)) test.skip(true, 'adr-lint.ts absent')
    let exitCode = 0
    try {
      execSync(`node --experimental-strip-types --no-warnings ${ADR_LINT}`, {
        cwd: ROOT,
        encoding: 'utf8',
        stdio: 'pipe',
      })
    } catch (err: unknown) {
      const e = err as { status?: number }
      exitCode = typeof e.status === 'number' ? e.status : 1
    }
    // PASS = 0; ADVISORY mode (no commit-msg) also returns 0 unless rules violate.
    expect(exitCode, `adr-lint exit code = ${exitCode}; expected 0 on clean diff`).toBe(0)
  })
})

// ─── P110.12 — types.ts gains optional dddOutput + processOutput ───────────
test.describe('P110.12 — PhaseCard gains optional dddOutput + processOutput', () => {
  test('types.ts declares both optional fields', () => {
    if (!existsSync(TYPES_FILE)) test.skip(true, 'types.ts absent')
    const txt = readFileSync(TYPES_FILE, 'utf8')
    expect(txt, 'declares dddOutput?').toMatch(/dddOutput\?\s*:\s*DDDAtomOutput/)
    expect(txt, 'declares processOutput?').toMatch(/processOutput\?\s*:\s*ProcessAtomOutput/)
  })
})

// ─── P110.13 — Backward compat: 3-arg signature still type-checks ──────────
test.describe('P110.13 — buildClaudeCodeBundle backward-compat signature', () => {
  test('3-arg call (phase, slug?, onEmit?) still accepted; 4th readAdr? optional', () => {
    if (!existsSync(EXPORT_FILE)) test.skip(true, 'exportClaudeCode.ts absent')
    const txt = readFileSync(EXPORT_FILE, 'utf8')
    // Hard regex — both old (3-arg) and new (4-arg) callers compile.
    expect(txt, 'signature includes onEmit? and readAdr? as optionals').toMatch(
      /buildClaudeCodeBundle\s*\([\s\S]*?onEmit\?:[\s\S]*?readAdr\?:/,
    )
    // Smoke: 1-arg, 2-arg, 3-arg, 4-arg invocations type-check at runtime.
    expect(buildClaudeCodeBundle(makeSamplePhase()).files.length).toBeGreaterThan(0)
    expect(buildClaudeCodeBundle(makeSamplePhase(), 'slug').files.length).toBeGreaterThan(0)
    expect(buildClaudeCodeBundle(makeSamplePhase(), 'slug', () => undefined).files.length).toBeGreaterThan(
      0,
    )
    expect(
      buildClaudeCodeBundle(
        makeSamplePhase(),
        'slug',
        () => undefined,
        () => null,
      ).files.length,
    ).toBeGreaterThan(0)
  })
})

// ─── P110.14 — EOP triplet at phase-110 ────────────────────────────────────
test.describe('P110.14 — EOP triplet at plans/implementation/phase-110/', () => {
  test('session-log.md + retrospective.md present at root (preflight already exists)', () => {
    expect(existsSync(join(PHASE_DIR, 'session-log.md')), 'session-log.md').toBe(true)
    expect(existsSync(join(PHASE_DIR, 'retrospective.md')), 'retrospective.md').toBe(true)
    expect(existsSync(join(PHASE_DIR, 'preflight.md')), 'preflight.md').toBe(true)
  })
})

// ─── P110.15 — KISS no-new-deps boundary ───────────────────────────────────
// Per P105.7 + P106.9 precedent: denylist scoped to deps NOT pre-existing in
// baseline. `jszip` is pre-existing per CLAUDE.md (P77 / OC-10); ADR-122 D4
// rejects new ZIP deps but the existing dep stays for sprint-N share-spec
// archive flow. The denylist below covers deps never installed.
test.describe('P110.15 — KISS no-new-deps boundary check', () => {
  test('package.json forbids deps not pre-existing at P109 baseline', () => {
    const pkg = JSON.parse(readFileSync(PKG_JSON, 'utf8'))
    const all = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) }
    // Bundle-emission alternates that ADR-122 / ADR-138 explicitly reject:
    for (const banned of ['archiver', 'fs-promises', 'fs-extra']) {
      expect(all, `package.json must not declare ${banned}`).not.toHaveProperty(banned)
    }
    // ADR-lint stays Node stdlib only — no commander/yargs/chalk install.
    for (const banned of ['commander', 'yargs', 'chalk']) {
      expect(all, `package.json must not declare ${banned}`).not.toHaveProperty(banned)
    }
    // Animation libs explicitly denylisted across recent specs (P95.6+).
    for (const banned of ['gsap', 'lottie-web', '@react-spring/web', 'animejs']) {
      expect(all, `package.json must not declare ${banned}`).not.toHaveProperty(banned)
    }
  })
})
