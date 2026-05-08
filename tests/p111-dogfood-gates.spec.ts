/**
 * P111 / A3 — ADR-139 Dogfood Gates + DDD/ADR Output Priority Verifier.
 *
 * Closer spec for the P111 sprint. Wave 1 sealed at `a238747`:
 *   - A1 — DDD + ADR Priority in Bundle Output (+21 LOC):
 *     `src/contexts/specification/exportClaudeCode.ts` re-ordered files array
 *     so ddd-contexts.md (pos 2) + adr-bundle/<id>.md (pos 3) lead after
 *     CLAUDE.md preamble. CLAUDE.md preamble updated with Bounded contexts
 *     + Cited Architecture Decisions markers.
 *   - A2 — Dogfood CI Runner: package.json +3 scripts (check:invariants /
 *     check:adr-lint / check:gates) + scripts/run-gates.sh (19 LOC) +
 *     CONTRIBUTING.md +37 LOC "Running the gates" section.
 *
 * Wave 2 (this closer) authors ADR-139 + this spec + EOP triplet + CLAUDE.md
 * sync. No source edits. Acceptance: ≥10 cases / ≥4 describes / ≤250 LOC.
 *
 * Per the closer mandate: existsSync soft-pass guards on Wave-1 surfaces;
 * hard-gate on ADR-139 file shape + Status: Accepted + cross-refs to
 * ADR-122 + ADR-134 + ADR-138 + atom-purity + EOP triplet.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

const ROOT = process.cwd()

const ADR_139 = join(ROOT, 'docs/adr/ADR-139-dogfood-gates-ddd-adr-priority.md')
const EXPORT_FILE = join(ROOT, 'src/contexts/specification/exportClaudeCode.ts')
const ADR_LINT = join(ROOT, 'scripts/adr-lint.ts')
const RUN_GATES = join(ROOT, 'scripts/run-gates.sh')
const PKG_JSON = join(ROOT, 'package.json')
const CONTRIBUTING = join(ROOT, 'CONTRIBUTING.md')
const PHASE_DIR = join(ROOT, 'plans/implementation/phase-111')

// ─── P111.1 — ADR-139 file shape ────────────────────────────────────────────
test.describe('P111.1 — ADR-139 file shape (Status + LOC + cross-refs)', () => {
  test('ADR-139 exists', () => {
    expect(existsSync(ADR_139), 'ADR-139 file must exist on disk').toBe(true)
  })

  test('Status: Accepted + ≤120 LOC', () => {
    const txt = readFileSync(ADR_139, 'utf8')
    expect(txt, 'must declare Status: Accepted').toMatch(/Status:\*?\*?\s+Accepted/)
    const loc = txt.split('\n').length
    expect(loc, `ADR-139 LOC = ${loc}; cap = 120`).toBeLessThanOrEqual(120)
  })

  test('cites ADR-122 + ADR-134 + ADR-138 (primary cross-refs)', () => {
    const txt = readFileSync(ADR_139, 'utf8')
    for (const id of ['ADR-122', 'ADR-134', 'ADR-138']) {
      expect(txt, `must cite ${id}`).toContain(id)
    }
  })

  test('declares 3 decisions (D1 priority + D2 preamble + D3 dogfood gates)', () => {
    const txt = readFileSync(ADR_139, 'utf8')
    expect(txt, 'D1 — DDD/ADR priority').toMatch(/Decision 1.*priority|priority.*Decision 1/i)
    expect(txt, 'D2 — preamble architecture').toMatch(/preamble|Bounded contexts/i)
    expect(txt, 'D3 — Dogfood gates').toMatch(/Decision 3.*[Dd]ogfood|[Dd]ogfood.*Decision 3/i)
  })
})

// ─── P111.2 — Bundle order: DDD + ADR within first 4 push() calls ──────────
test.describe('P111.2 — Export bundle re-order: DDD + ADR within first 4 files', () => {
  test('ddd-contexts.md AND adr-bundle in first 4 push() statements', () => {
    if (!existsSync(EXPORT_FILE)) test.skip(true, 'exportClaudeCode.ts absent')
    const txt = readFileSync(EXPORT_FILE, 'utf8')
    // Extract sequential files.push({ path: '...', ... }) statements.
    const pushPaths = [...txt.matchAll(/files\.push\(\s*\{\s*path:\s*['"`]([^'"`]+?)['"`]/g)].map(
      (m) => m[1],
    )
    expect(pushPaths.length, `≥4 push() calls expected; saw ${pushPaths.length}`).toBeGreaterThanOrEqual(4)
    const first4 = pushPaths.slice(0, 4)
    // Position 2 = ddd-contexts.md (literal); position 3 may be a template
    // string `adr-bundle/${adr.id}.md` so test against the prefix.
    expect(first4, `first 4 push paths: ${first4.join(', ')}`).toContain('ddd-contexts.md')
    const hasAdrBundle = first4.some((p) => p.startsWith('adr-bundle/'))
    expect(hasAdrBundle, `first 4 must include adr-bundle/* path; saw ${first4.join(', ')}`).toBe(true)
  })
})

// ─── P111.3 — CLAUDE.md preamble has architectural overview markers ────────
test.describe('P111.3 — CLAUDE.md preamble leads with architecture (D2)', () => {
  test('preamble template references Bounded contexts + Cited Architecture Decisions', () => {
    if (!existsSync(EXPORT_FILE)) test.skip(true, 'exportClaudeCode.ts absent')
    const txt = readFileSync(EXPORT_FILE, 'utf8')
    expect(txt, 'preamble must include "Bounded contexts" header').toContain('Bounded contexts')
    expect(txt, 'preamble must include "Cited Architecture Decisions" header').toContain(
      'Cited Architecture Decisions',
    )
  })
})

// ─── P111.4 — package.json has 3 new check scripts ─────────────────────────
test.describe('P111.4 — package.json declares 3 dogfood scripts (D3)', () => {
  test('check:invariants + check:adr-lint + check:gates present', () => {
    const pkg = JSON.parse(readFileSync(PKG_JSON, 'utf8'))
    const scripts = pkg.scripts ?? {}
    expect(scripts, 'check:invariants script declared').toHaveProperty('check:invariants')
    expect(scripts, 'check:adr-lint script declared').toHaveProperty('check:adr-lint')
    expect(scripts, 'check:gates script declared').toHaveProperty('check:gates')
    // check:gates chains both checks sequentially.
    expect(scripts['check:gates'], 'check:gates chains both checks').toMatch(
      /check:invariants[\s\S]*&&[\s\S]*check:adr-lint/,
    )
  })
})

// ─── P111.5 — scripts/run-gates.sh exists + executable + sh shebang ───────
test.describe('P111.5 — scripts/run-gates.sh wrapper present (D3)', () => {
  test('file exists with sh shebang and executable bit set', () => {
    expect(existsSync(RUN_GATES), 'scripts/run-gates.sh must exist').toBe(true)
    const txt = readFileSync(RUN_GATES, 'utf8')
    expect(txt, 'must start with #!/bin/sh').toMatch(/^#!\/bin\/sh/)
    // Executable bit (any of owner/group/world-execute set).
    const mode = statSync(RUN_GATES).mode & 0o777
    const anyExec = (mode & 0o111) !== 0
    expect(anyExec, `run-gates.sh mode = ${mode.toString(8)}; expected any-exec bit`).toBe(true)
  })

  test('chains secret-scan + invariants + adr-lint with FAIL handling', () => {
    if (!existsSync(RUN_GATES)) test.skip(true, 'run-gates.sh absent')
    const txt = readFileSync(RUN_GATES, 'utf8')
    expect(txt, 'must invoke check-secrets.sh').toContain('check-secrets.sh')
    expect(txt, 'must invoke architecture-invariants').toContain('architecture-invariants')
    expect(txt, 'must invoke adr-lint.ts').toContain('adr-lint.ts')
    expect(txt, 'must echo PASS summary').toMatch(/PASS/)
  })
})

// ─── P111.6 — CONTRIBUTING.md "Running the gates" section ─────────────────
test.describe('P111.6 — CONTRIBUTING.md "Running the gates" section (D3)', () => {
  test('section header present + ≥2 check:gates references', () => {
    expect(existsSync(CONTRIBUTING), 'CONTRIBUTING.md must exist').toBe(true)
    const txt = readFileSync(CONTRIBUTING, 'utf8')
    expect(txt, 'must contain "## Running the gates" header').toMatch(/##\s+Running the gates/)
    const refs = (txt.match(/check:gates/g) ?? []).length
    expect(refs, `check:gates references = ${refs}; floor = 2`).toBeGreaterThanOrEqual(2)
  })

  test('documents owner pre-commit wire snippet (carry-forward marker)', () => {
    const txt = readFileSync(CONTRIBUTING, 'utf8')
    expect(txt, 'pre-commit wire snippet documented').toMatch(
      /\.husky\/pre-commit|run-gates\.sh.*exit\s+1|pre-commit/i,
    )
  })
})

// ─── P111.7 — adr-lint smoke run (clean diff exit 0) ──────────────────────
test.describe('P111.7 — npm run check:adr-lint smoke (clean diff exits 0)', () => {
  test('node --experimental-strip-types scripts/adr-lint.ts → exit 0', () => {
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
    expect(exitCode, `adr-lint exit code = ${exitCode}; expected 0 on clean diff`).toBe(0)
  })
})

// ─── P111.8 — Atom purity preserved (ADR-122 D1 + ADR-134) ───────────────
test.describe('P111.8 — exportClaudeCode.ts atom purity preserved', () => {
  test('zero @/components imports + zero fs imports after Wave 1 edit', () => {
    if (!existsSync(EXPORT_FILE)) test.skip(true, 'exportClaudeCode.ts absent')
    const txt = readFileSync(EXPORT_FILE, 'utf8')
    expect(txt, 'no @/components imports').not.toMatch(/from\s+['"]@\/components/)
    expect(txt, 'no node:fs imports').not.toMatch(/from\s+['"]node:fs['"]/)
    expect(txt, 'no fs imports').not.toMatch(/from\s+['"]fs['"]/)
    expect(txt, 'no fs/promises imports').not.toMatch(/from\s+['"]fs\/promises['"]/)
  })
})

// ─── P111.9 — EOP triplet at phase-111 ────────────────────────────────────
test.describe('P111.9 — EOP triplet at plans/implementation/phase-111/', () => {
  test('preflight + session-log + retrospective all present at phase root', () => {
    expect(existsSync(join(PHASE_DIR, 'preflight.md')), 'preflight.md').toBe(true)
    expect(existsSync(join(PHASE_DIR, 'session-log.md')), 'session-log.md').toBe(true)
    expect(existsSync(join(PHASE_DIR, 'retrospective.md')), 'retrospective.md').toBe(true)
  })

  test('retrospective.md includes "How it works" section (P111 hard rule 6)', () => {
    const retroPath = join(PHASE_DIR, 'retrospective.md')
    if (!existsSync(retroPath)) test.skip(true, 'retrospective.md absent')
    const txt = readFileSync(retroPath, 'utf8')
    expect(txt, 'must include "How it works" or "How the dogfood gates work" section').toMatch(
      /How (it works|the dogfood gates work)/i,
    )
    // Concrete commands required per closer mandate.
    expect(txt, 'must reference npm run check:gates').toContain('check:gates')
    expect(txt, 'must reference run-gates.sh').toContain('run-gates.sh')
  })
})

// ─── P111.10 — KISS no-new-deps boundary check ───────────────────────────
test.describe('P111.10 — KISS no-new-deps boundary (P111 hard rule 1)', () => {
  test('package.json forbids deps not pre-existing at P110 baseline', () => {
    const pkg = JSON.parse(readFileSync(PKG_JSON, 'utf8'))
    const all = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) }
    // Husky is pre-existing in the P110 baseline (devDependency); per P105.7 +
    // P106.9 + P110.15 precedent the denylist is scoped to deps NOT pre-
    // existing. The husky WIRE remains owner-action per ADR-138 D3 + ADR-139
    // D3 — the SDK is already installed; only the .husky/pre-commit append
    // is sandbox-blocked. Pre-commit-tooling alternates P111 explicitly rejects:
    for (const banned of ['lint-staged', 'simple-git-hooks', 'pre-commit']) {
      expect(all, `package.json must not declare ${banned}`).not.toHaveProperty(banned)
    }
    // CLI / runner alternates rejected (run-gates.sh is plain sh; no SDK):
    for (const banned of ['commander', 'yargs', 'chalk', 'archiver', 'fs-extra']) {
      expect(all, `package.json must not declare ${banned}`).not.toHaveProperty(banned)
    }
    // Animation libs denylisted across recent specs (P95.6+ precedent).
    for (const banned of ['gsap', 'lottie-web', '@react-spring/web', 'animejs']) {
      expect(all, `package.json must not declare ${banned}`).not.toHaveProperty(banned)
    }
  })
})
