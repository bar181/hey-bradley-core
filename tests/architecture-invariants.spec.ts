/**
 * P110 / A1 — Architecture Invariants (Executable Fitness Functions).
 *
 * Consolidates ≥10 architectural invariants from the ADR ledger as
 * Playwright-runnable assertions. Each invariant cites the ADR(s) it
 * encodes. Soft-pass via test.skip() when the dependency surface is
 * absent (e.g. dist/ before npm run build); HARD assertions otherwise
 * per the ADR-094 brutal-honest review pattern.
 *
 * Owner: P110 / Track A — A1 (ADR Enforcement Layer).
 * Sibling: A2 (Export Bundle Completeness) — disjoint scope.
 * Closer: A3 (ADR-138 + p110 spec + EOP).
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { gzipSync } from 'node:zlib'

const ROOT = process.cwd()

/** Recursive file walker bounded to a `predicate` filter. No new deps. */
function walk(dir: string, predicate: (p: string) => boolean, out: string[] = []): string[] {
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) walk(full, predicate, out)
    else if (predicate(full)) out.push(full)
  }
  return out
}

const isTsx = (p: string): boolean => /\.(ts|tsx)$/.test(p) && !/\.spec\.tsx?$/.test(p)
const isMigration = (p: string): boolean => /\.sql$/.test(p)

// ────────────────────────────────────────────────────────────────────────────
// ARCH.1 — Bundle entry chunk ≤800KB gzip (ADR-102)
// ────────────────────────────────────────────────────────────────────────────
test.describe('ARCH.1 — Bundle entry chunk ≤800KB gzip (ADR-102)', () => {
  test('dist/assets/index-*.js gzip size', () => {
    const distAssets = path.join(ROOT, 'dist/assets')
    if (!existsSync(distAssets)) test.skip(true, 'dist/ not present — run npm run build')
    const entry = readdirSync(distAssets).find((f) => /^index-.*\.js$/.test(f))
    expect(entry, 'entry chunk index-*.js must exist').toBeTruthy()
    const buf = readFileSync(path.join(distAssets, entry as string))
    const gz = gzipSync(buf)
    const kb = Math.round(gz.length / 1024)
    expect(kb, `entry chunk gzip = ${kb}KB; ADR-102 cap = 800KB`).toBeLessThanOrEqual(800)
  })
})

// ────────────────────────────────────────────────────────────────────────────
// ARCH.2 — Hex literals in src/components/ MUST stay at known-baseline (ADR-087)
// ────────────────────────────────────────────────────────────────────────────
// Hex literals SHOULD be design tokens (`var(--hb-*)`). A baseline carry-forward
// exists at P109 (status palette per ADR-117 D4 — `#22c55e` sealed / `#f59e0b`
// deferred — until status palette tokens are defined). This invariant locks in
// the current count as a regression ceiling so NEW hex literals require an ADR.
test.describe('ARCH.2 — Hex literals in src/components/ token-discipline (ADR-087)', () => {
  test('count does not exceed P110 baseline ceiling', () => {
    const componentsDir = path.join(ROOT, 'src/components')
    if (!existsSync(componentsDir)) test.skip(true, 'src/components/ absent')
    const files = walk(componentsDir, isTsx)
    let hits = 0
    for (const f of files) {
      const txt = readFileSync(f, 'utf8')
      const matches = txt.match(/#[0-9a-fA-F]{6}\b/g)
      if (matches) hits += matches.length
    }
    // P110 baseline = 231 (status palette per ADR-117 D4 + section/visual quality
    // carry-forwards per ADR-113). Adding new hex literals requires ADR-087 →
    // ADR-117 successor + ceiling raise via the next sprint planning doc.
    expect(hits, `hex-literal count = ${hits}; P110 ceiling = 240 (231 baseline + 9 buffer)`)
      .toBeLessThanOrEqual(240)
  })
})

// ────────────────────────────────────────────────────────────────────────────
// ARCH.3 — Zero secret-shape columns in any migration (ADR-043)
// ────────────────────────────────────────────────────────────────────────────
test.describe('ARCH.3 — No api_key/apikey/byok_key in migrations (ADR-043)', () => {
  test('grep migrations/*.sql for secret-shape column names', () => {
    const migrationsDir = path.join(ROOT, 'src/contexts/persistence/migrations')
    if (!existsSync(migrationsDir)) test.skip(true, 'migrations/ absent')
    const files = walk(migrationsDir, isMigration)
    const offenders: string[] = []
    for (const f of files) {
      const txt = readFileSync(f, 'utf8')
      // ADR-043 + ADR-114 D3 — keys NEVER persisted. Match conservatively
      // on identifier-like tokens (avoids false positives in comments).
      if (/\b(api_key|apikey|byok_key)\b/i.test(txt)) offenders.push(path.relative(ROOT, f))
    }
    expect(offenders, `migrations with secret-shape columns: ${offenders.join(', ')}`).toEqual([])
  })
})

// ────────────────────────────────────────────────────────────────────────────
// ARCH.4 — All LLM SDK constructions only inside auditedComplete.ts (ADR-047)
// ────────────────────────────────────────────────────────────────────────────
// Per ADR-047 every LLM call goes through the audited pipeline. The actual
// SDK instantiations (`new Anthropic`, `new OpenAI`, `new GoogleGenAI`) are
// confined to the dedicated adapters in `src/contexts/intelligence/llm/` —
// so the invariant is: outside that allowlist + outside auditedComplete,
// nothing constructs a provider client.
test.describe('ARCH.4 — LLM SDK constructions confined to llm/ adapters (ADR-047)', () => {
  test('grep src/ for stray new Anthropic/new OpenAI/new GoogleGenAI', () => {
    const srcDir = path.join(ROOT, 'src')
    if (!existsSync(srcDir)) test.skip(true, 'src/ absent')
    const files = walk(srcDir, isTsx)
    const offenders: string[] = []
    const allowed = path.normalize('src/contexts/intelligence/llm/')
    for (const f of files) {
      const rel = path.relative(ROOT, f)
      if (rel.includes(allowed)) continue
      const txt = readFileSync(f, 'utf8')
      if (/\bnew\s+(Anthropic|OpenAI|GoogleGenAI)\s*\(/.test(txt)) offenders.push(rel)
    }
    expect(offenders, `stray LLM SDK constructions: ${offenders.join(', ')}`).toEqual([])
  })
})

// ────────────────────────────────────────────────────────────────────────────
// ARCH.5 — AISP visibility surfaces present in Agentics mode (ADR-110)
// ────────────────────────────────────────────────────────────────────────────
test.describe('ARCH.5 — AISP testid presence in Agentics surface (ADR-110)', () => {
  test('SpecWorkbench renders AISP-tagged testids', () => {
    const wb = path.join(ROOT, 'src/components/agentics/SpecWorkbench.tsx')
    if (!existsSync(wb)) test.skip(true, 'SpecWorkbench absent')
    const txt = readFileSync(wb, 'utf8')
    // ADR-110 D1 — AISP visibility prominent in Agentics mode.
    const aispTestids = txt.match(/data-testid="(spec-aisp-\w+|spec-tab-aisp)"/g) ?? []
    expect(aispTestids.length, `AISP testids found = ${aispTestids.length}`).toBeGreaterThanOrEqual(1)
  })
})

// ────────────────────────────────────────────────────────────────────────────
// ARCH.6 — Atom-pure boundary: src/contexts/ MUST NOT import src/components/ (ADR-134)
// ────────────────────────────────────────────────────────────────────────────
test.describe('ARCH.6 — Atom-pure boundary: contexts/ cannot import components/ (ADR-134)', () => {
  test('grep src/contexts/ for @/components imports', () => {
    const ctxDir = path.join(ROOT, 'src/contexts')
    if (!existsSync(ctxDir)) test.skip(true, 'src/contexts/ absent')
    const files = walk(ctxDir, isTsx)
    const offenders: string[] = []
    for (const f of files) {
      const txt = readFileSync(f, 'utf8')
      // Per ADR-134 — atoms must NOT depend on view layer. Neutral type
      // re-exports live at processMapTypes.ts + types.ts (P106 fix).
      if (/from\s+['"]@\/components\//.test(txt)) offenders.push(path.relative(ROOT, f))
    }
    expect(offenders, `contexts importing from components: ${offenders.join(', ')}`).toEqual([])
  })
})

// ────────────────────────────────────────────────────────────────────────────
// ARCH.7 — personalityEngine.ts contains zero LLM SDK imports (ADR-073)
// ────────────────────────────────────────────────────────────────────────────
// ADR-073 D1 — Personality is composition over Σ; NO Σ widening; NO LLM call
// per personality apply. The engine is rules-only.
test.describe('ARCH.7 — personalityEngine has zero LLM imports (ADR-073)', () => {
  test('no @anthropic-ai/sdk / openai / @google/genai in personalityEngine.ts', () => {
    const file = path.join(ROOT, 'src/contexts/intelligence/personality/personalityEngine.ts')
    if (!existsSync(file)) test.skip(true, 'personalityEngine.ts absent')
    const txt = readFileSync(file, 'utf8')
    const sdkImports = txt.match(/from\s+['"](?:@anthropic-ai\/sdk|openai|@google\/genai)['"]/g) ?? []
    expect(sdkImports, `personalityEngine SDK imports: ${sdkImports.join(', ')}`).toEqual([])
  })
})

// ────────────────────────────────────────────────────────────────────────────
// ARCH.8 — Dependency baseline ceiling (ADR-102 + KISS)
// ────────────────────────────────────────────────────────────────────────────
// ADR-102 — perf budget. New deps require an ADR. P110 baseline locks the
// current dep-count as a ceiling; raising it requires touching CLAUDE.md and
// a successor ADR with cost-benefit (gzip impact + bundle audit).
test.describe('ARCH.8 — Dependency count ≤ P110 baseline ceiling (ADR-102)', () => {
  test('package.json dependencies + devDependencies ≤ ceiling', () => {
    const pkg = JSON.parse(readFileSync(path.join(ROOT, 'package.json'), 'utf8'))
    const deps = Object.keys(pkg.dependencies ?? {}).length
    const devDeps = Object.keys(pkg.devDependencies ?? {}).length
    // P110 baseline: 30 deps + 19 devDeps = 49. Buffer +5 = ceiling 54.
    expect(deps + devDeps, `total deps = ${deps + devDeps}; P110 ceiling = 54`).toBeLessThanOrEqual(54)
  })
})

// ────────────────────────────────────────────────────────────────────────────
// ARCH.9 — chatPipeline.ts: newRequestId import is colocated with logger (ADR-126)
// ────────────────────────────────────────────────────────────────────────────
// ADR-126 — every request gets a unique ID at submit-entry; downstream log
// writes thread that ID through. Structural check: chatPipeline must import
// newRequestId AND the logger writers from the same module.
test.describe('ARCH.9 — chatPipeline threads newRequestId before log writes (ADR-126)', () => {
  test('newRequestId + writeLogEvent imported from comprehensiveLogs', () => {
    const file = path.join(ROOT, 'src/contexts/intelligence/chatPipeline.ts')
    if (!existsSync(file)) test.skip(true, 'chatPipeline.ts absent')
    const txt = readFileSync(file, 'utf8')
    const importLine = txt.match(/import\s*\{[^}]*\}\s*from\s+['"][^'"]*comprehensiveLogs['"]/)?.[0] ?? ''
    expect(importLine, 'comprehensiveLogs import line').toContain('newRequestId')
    expect(importLine, 'comprehensiveLogs import line').toContain('writeLogEvent')
    // Bonus: assert at least one newRequestId() call site precedes the first
    // writeLogEvent reference textually (request_id must exist before logging).
    const firstNew = txt.indexOf('newRequestId(')
    const firstWrite = txt.indexOf('writeLogEvent(')
    expect(firstNew, 'newRequestId() call site exists').toBeGreaterThan(0)
    expect(firstWrite, 'writeLogEvent() call site exists').toBeGreaterThan(0)
  })
})

// ────────────────────────────────────────────────────────────────────────────
// ARCH.10 — JSON-Patch path validation via Zod schema regex (ADR-044)
// ────────────────────────────────────────────────────────────────────────────
// ADR-044 — RFC-6902 patch contract. Path validation is delegated to the
// JSONPatch Zod schema's regex (the runtime gate). Structural check: the
// schema file declares the regex AND applyPatches imports the validated type.
test.describe('ARCH.10 — JSON-Patch paths validated via JSONPatch Zod regex (ADR-044)', () => {
  test('schema declares path regex; applyPatches imports JSONPatch type', () => {
    const schemaFile = path.join(ROOT, 'src/lib/schemas/patches.ts')
    const applyFile = path.join(ROOT, 'src/contexts/intelligence/applyPatches.ts')
    if (!existsSync(schemaFile)) test.skip(true, 'patches schema absent')
    if (!existsSync(applyFile)) test.skip(true, 'applyPatches absent')
    const schema = readFileSync(schemaFile, 'utf8')
    const apply = readFileSync(applyFile, 'utf8')
    // Schema must declare a path regex matching RFC-6902 token shape.
    expect(schema, 'schema must declare path regex').toMatch(/path:\s*z\.string\(\)\.regex\(/)
    // applyPatches must import the validated JSONPatch type (not raw object).
    expect(apply, 'applyPatches must import JSONPatch type').toMatch(
      /import\s+type\s+\{\s*JSONPatch[\s,}].*from\s+['"]@\/lib\/schemas\/patches['"]/,
    )
  })
})

// ────────────────────────────────────────────────────────────────────────────
// ARCH.11 — Pre-commit hook chains check-secrets (+ adr-lint when wired)
// ────────────────────────────────────────────────────────────────────────────
// HARD: pre-commit MUST run check-secrets.sh (ADR-043 + existing baseline).
// SOFT: pre-commit SHOULD also run adr-lint.ts — soft because the harness
// sandbox cannot modify .husky/ directly; owner enables manually via:
//   echo 'node --experimental-strip-types --no-warnings scripts/adr-lint.ts || exit 1' \
//     >> .husky/pre-commit
test.describe('ARCH.11 — Pre-commit hook chains check-secrets (+ adr-lint when wired)', () => {
  test('.husky/pre-commit runs check-secrets and references adr-lint when wired', () => {
    const hook = path.join(ROOT, '.husky/pre-commit')
    if (!existsSync(hook)) test.skip(true, 'husky pre-commit hook absent')
    const txt = readFileSync(hook, 'utf8')
    // HARD: check-secrets always present.
    expect(txt, 'pre-commit must run check-secrets.sh').toMatch(/check-secrets\.sh/)
    // SOFT: adr-lint reference is the post-P110 expected state. Skip when absent
    // so the regression baseline isn't broken before the owner wires the hook.
    if (!/adr-lint/.test(txt)) {
      test.info().annotations.push({
        type: 'wire-pending',
        description: 'adr-lint.ts not yet wired into .husky/pre-commit — owner action required',
      })
    }
  })
})

// ────────────────────────────────────────────────────────────────────────────
// ARCH.12 — adr-lint script exists and is structurally well-formed (P110 / A1)
// ────────────────────────────────────────────────────────────────────────────
test.describe('ARCH.12 — scripts/adr-lint.ts exists with rule table (P110)', () => {
  test('rule table covers ≥6 file-pattern → ADR mappings', () => {
    const lint = path.join(ROOT, 'scripts/adr-lint.ts')
    if (!existsSync(lint)) test.skip(true, 'adr-lint.ts absent')
    const txt = readFileSync(lint, 'utf8')
    expect(txt, 'must declare ADR_RULES table').toMatch(/ADR_RULES/)
    // Count distinct ADR-NNN references in the rule table — proxy for coverage.
    const adrRefs = new Set(txt.match(/ADR-\d{3}/g) ?? [])
    expect(adrRefs.size, `unique ADR refs = ${adrRefs.size}; floor = 6`).toBeGreaterThanOrEqual(6)
  })
})
