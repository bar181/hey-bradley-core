/**
 * P112 / GAP-CLOSURE — Wave 2 / Agent A4 (closer).
 *
 * Verifies the 5 P111 gaps were closed (or honestly classified) per
 * preflight + ADR-140:
 *  - G1 (UPSTREAM-DEFERRED) — TS heuristic stopgap at src/lib/aisp-score/
 *  - G2 (CLOSED) — ADR README CI drift guard
 *  - G3 (CLOSED via alternative) — GitHub Actions gates.yml
 *  - G4 (OWNER-REQUIRED) — documented in ADR-140 Decision section
 *  - G5 (CLARIFICATION ERROR) — connections/docs/specs/README.md fix
 *
 * Pattern follows tests/p111-dogfood-gates.spec.ts (closer-spec precedent).
 * Hard-gate on ADR-140 file shape + atom-purity + EOP triplet + KISS.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

const ADR_140 = join(ROOT, 'docs/adr/ADR-140-gap-closure-stopgaps.md')
const SCORE_INDEX = join(ROOT, 'src/lib/aisp-score/index.ts')
const SCORE_SYMBOLS = join(ROOT, 'src/lib/aisp-score/symbolTable.ts')
const VALIDATE_AISP = join(ROOT, 'connections/mcp/tools/validate-aisp.ts')
const DRIFT_SPEC = join(ROOT, 'tests/p112-adr-readme-drift.spec.ts')
const GATES_YML = join(ROOT, '.github/workflows/gates.yml')
const CONTRIBUTING = join(ROOT, 'CONTRIBUTING.md')
const ADR_README = join(ROOT, 'docs/adr/README.md')
const SPECS_README = join(ROOT, 'connections/docs/specs/README.md')
const PHASE_DIR = join(ROOT, 'plans/implementation/phase-112')
const PACKAGE_JSON = join(ROOT, 'package.json')

test.describe('P112.1 — ADR-140 file shape', () => {
  test('ADR-140 exists with Status: Accepted', () => {
    expect(existsSync(ADR_140)).toBe(true)
    const txt = readFileSync(ADR_140, 'utf8')
    expect(/Status:\s*\*?\*?\s*Accepted/i.test(txt)).toBe(true)
  })

  test('ADR-140 ≤120 LOC', () => {
    const lines = readFileSync(ADR_140, 'utf8').split('\n').length
    expect(lines).toBeLessThanOrEqual(120)
  })

  test('ADR-140 cross-refs ADR-C07 + ADR-138 + ADR-139', () => {
    const txt = readFileSync(ADR_140, 'utf8')
    expect(txt).toMatch(/ADR-C07/)
    expect(txt).toMatch(/ADR-138/)
    expect(txt).toMatch(/ADR-139/)
  })
})

test.describe('P112.2 — AISP score index', () => {
  test('exports scoreAisp + AispScore + AispTier', () => {
    expect(existsSync(SCORE_INDEX)).toBe(true)
    const src = readFileSync(SCORE_INDEX, 'utf8')
    expect(src).toMatch(/export\s+function\s+scoreAisp\b/)
    expect(src).toMatch(/export\s+(?:type|interface)\s+AispScore\b/)
    expect(src).toMatch(/export\s+type\s+AispTier\b/)
  })
})

test.describe('P112.3 — AISP symbol table', () => {
  test('exports SYMBOL_REGEX + AISP_SYMBOLS', () => {
    expect(existsSync(SCORE_SYMBOLS)).toBe(true)
    const src = readFileSync(SCORE_SYMBOLS, 'utf8')
    expect(src).toMatch(/export\s+const\s+SYMBOL_REGEX\b/)
    expect(src).toMatch(/export\s+const\s+AISP_SYMBOLS\b/)
  })
})

test.describe('P112.4 — validate-aisp imports shared helper', () => {
  test('connections/mcp/tools/validate-aisp.ts imports scoreAisp', () => {
    expect(existsSync(VALIDATE_AISP)).toBe(true)
    const src = readFileSync(VALIDATE_AISP, 'utf8')
    expect(src).toMatch(/import\s*\{[^}]*\bscoreAisp\b[^}]*\}\s*from\s*['"][^'"]*aisp-score/)
  })
})

test.describe('P112.5 — ADR README drift spec', () => {
  test('drift spec exists with ≥4 cases', () => {
    expect(existsSync(DRIFT_SPEC)).toBe(true)
    const src = readFileSync(DRIFT_SPEC, 'utf8')
    const cases = (src.match(/\btest\(/g) ?? []).length
    expect(cases).toBeGreaterThanOrEqual(4)
  })
})

test.describe('P112.6 — GitHub Actions gates workflow', () => {
  test('gates.yml exists + declares gates + build jobs', () => {
    expect(existsSync(GATES_YML)).toBe(true)
    const src = readFileSync(GATES_YML, 'utf8')
    // Lightweight YAML structural check (no extra dep): top-level "jobs:" + 2 job names indented.
    expect(src).toMatch(/^jobs:/m)
    expect(src).toMatch(/^\s{2}gates:/m)
    expect(src).toMatch(/^\s{2}build:/m)
    expect(src).toMatch(/check:invariants|check:adr-lint/)
  })
})

test.describe('P112.7 — CONTRIBUTING.md CI gates section', () => {
  test('CONTRIBUTING.md has "## CI gates" header', () => {
    expect(existsSync(CONTRIBUTING)).toBe(true)
    const src = readFileSync(CONTRIBUTING, 'utf8')
    expect(src).toMatch(/^##\s+CI\s+gates\b/im)
  })
})

test.describe('P112.8 — Atom-purity (src/lib/aisp-score/)', () => {
  test('zero `from "react"` imports', () => {
    const a = readFileSync(SCORE_INDEX, 'utf8')
    const b = readFileSync(SCORE_SYMBOLS, 'utf8')
    expect(a).not.toMatch(/from\s+['"]react['"]/)
    expect(b).not.toMatch(/from\s+['"]react['"]/)
  })

  test('zero `from "@/contexts"` imports', () => {
    const a = readFileSync(SCORE_INDEX, 'utf8')
    const b = readFileSync(SCORE_SYMBOLS, 'utf8')
    expect(a).not.toMatch(/from\s+['"]@\/contexts/)
    expect(b).not.toMatch(/from\s+['"]@\/contexts/)
  })
})

test.describe('P112.9 — README header truth-up', () => {
  test('README declares ≥130 files / ADR-139+ highest-ID', () => {
    const txt = readFileSync(ADR_README, 'utf8')
    const cnt = txt.match(/Total files(?:\s+on\s+disk)?:\s*\*?\*?\s*(\d+)/i)
    const max = txt.match(/Highest-ID:\s*\*?\*?\s*ADR-(\d+)/i)
    expect(cnt).toBeTruthy()
    expect(max).toBeTruthy()
    expect(parseInt(cnt?.[1] ?? '0', 10)).toBeGreaterThanOrEqual(130)
    expect(parseInt(max?.[1] ?? '0', 10)).toBeGreaterThanOrEqual(139)
  })
})

test.describe('P112.10 — EOP triplet at phase-112/', () => {
  test('preflight + session-log + retrospective present', () => {
    expect(existsSync(join(PHASE_DIR, 'preflight.md'))).toBe(true)
    expect(existsSync(join(PHASE_DIR, 'session-log.md'))).toBe(true)
    expect(existsSync(join(PHASE_DIR, 'retrospective.md'))).toBe(true)
  })

  test('retrospective has "Gap classification" section', () => {
    const path = join(PHASE_DIR, 'retrospective.md')
    if (!existsSync(path)) test.skip()
    const txt = readFileSync(path, 'utf8')
    expect(txt).toMatch(/Gap\s+classification/i)
  })
})

test.describe('P112.11 — KISS no-new-deps boundary', () => {
  test('package.json adds zero new runtime/dev deps for P112', () => {
    const pkg = JSON.parse(readFileSync(PACKAGE_JSON, 'utf8'))
    const all = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) }
    // Denylist scoped to deps NOT pre-existing baseline (mirrors P111.10 + P110.15 precedent).
    const denylisted = ['archiver', 'fs-extra', 'simple-git-hooks', 'lint-staged', 'commander', 'yargs', 'chalk', 'gsap', 'lottie-web', '@react-spring/core', 'animejs']
    for (const d of denylisted) expect(all[d]).toBeUndefined()
  })
})

test.describe('P112.12 — connections/docs/specs/README.md clarification', () => {
  test('specs README clarifies 14 implemented + 4 deferred', () => {
    if (!existsSync(SPECS_README)) test.skip()
    const txt = readFileSync(SPECS_README, 'utf8')
    expect(txt).toMatch(/14\b.*(?:implemented|impl)/i)
    expect(txt).toMatch(/(?:deferred|blueprint).*(?:Rust|ADR-C07)/i)
  })
})
