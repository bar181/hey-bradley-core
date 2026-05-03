/**
 * P101 / A3 — 7-step end-to-end smoke spec.
 * PURE-UNIT: FS reads + regex/string asserts. NO browser bootstrap.
 * Pattern follows tests/p99-seal-panel.spec.ts + tests/p101-verb-classifier.spec.ts.
 *
 * Verifies the 7-step methodology fires end-to-end:
 *   1. Research        — Onboarding/Welcome project context loading
 *   2. Decompose       — DECOMP_ATOM in chatPipeline
 *   3. Architect       — DDD_ATOM (classifyContexts) in PlanningChatBar
 *   4. Spec            — PROCESS_ATOM (classifyProcess) in PlanningChatBar
 *   5. Plan            — AGENT_ATOM (classifyAgents) in PlanningChatBar (P97 wire)
 *   6. Build           — TDD scaffold (buildTDDScaffold) in exportClaudeCode
 *   7. Reflect         — KISS review + SealPanel in SpecWorkbench/Agentics (P98+P99)
 *
 * Plus: all 8 atoms have ≥1 production import site.
 *
 * P101E2E.1 — Step 1 Research surface (1)
 * P101E2E.2 — Step 2 Decompose (2)
 * P101E2E.3 — Step 3 Architect (DDD + ADR) (2)
 * P101E2E.4 — Step 4 Spec (PROCESS + AISP) (2)
 * P101E2E.5 — Step 5 Plan (AGENT) (2)
 * P101E2E.6 — Step 6 Build (TDD scaffold) (1)
 * P101E2E.7 — Step 7 Reflect (KISS + Seal) (2)
 * P101E2E.8 — All 8 atoms have production call sites (3)
 *
 * Soft-pass via existsSync() guards — surfaces that haven't yet shipped surface
 * as deferred (carry-forward) rather than red.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

// ─── Source surfaces ─────────────────────────────────────────────────────────
const ONBOARDING = join(ROOT, 'src/pages/Onboarding.tsx')
const WELCOME = join(ROOT, 'src/pages/Welcome.tsx')
const CHAT_PIPELINE = join(ROOT, 'src/contexts/intelligence/chatPipeline.ts')
const DECOMP_ATOM = join(ROOT, 'src/contexts/intelligence/aisp/decompAtom.ts')
const PLANNING_CHAT_BAR = join(
  ROOT,
  'src/components/planning/PlanningChatBar.tsx',
)
const DDD_ATOM = join(ROOT, 'src/contexts/intelligence/aisp/dddAtom.ts')
const PROCESS_ATOM = join(ROOT, 'src/contexts/intelligence/aisp/processAtom.ts')
const AGENT_ATOM = join(ROOT, 'src/contexts/intelligence/aisp/agentAtom.ts')
const EXPORT_CLAUDE_CODE = join(
  ROOT,
  'src/contexts/specification/exportClaudeCode.ts',
)
const SPEC_WORKBENCH = join(ROOT, 'src/components/agentics/SpecWorkbench.tsx')
const AGENTICS_PAGE = join(ROOT, 'src/pages/Agentics.tsx')

// ─── Helpers ────────────────────────────────────────────────────────────────
function readSrc(path: string): string {
  expect(existsSync(path)).toBe(true)
  return readFileSync(path, 'utf8')
}

function readSrcOrEmpty(path: string): string {
  if (!existsSync(path)) return ''
  return readFileSync(path, 'utf8')
}

// ───────────────────────────────────────────────────────────────────────────
// P101E2E.1 — Step 1 Research surface (1)
// ───────────────────────────────────────────────────────────────────────────
test.describe('P101E2E.1 step1-research surface', () => {
  test('Onboarding.tsx OR Welcome.tsx contains existing-project loading', () => {
    const onboarding = readSrcOrEmpty(ONBOARDING)
    const welcome = readSrcOrEmpty(WELCOME)
    // At least one surface must exist and one must reference loadProject /
    // saved project / project-context loading.
    expect(onboarding.length + welcome.length).toBeGreaterThan(0)
    const combined = onboarding + '\n' + welcome
    const hasProjectLoad =
      /loadProject\b/.test(combined) ||
      /hasSavedProject\b/.test(combined) ||
      /STORAGE_KEY/.test(combined) ||
      /useProjectStore/.test(combined)
    expect(hasProjectLoad).toBe(true)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// P101E2E.2 — Step 2 Decompose (2)
// ───────────────────────────────────────────────────────────────────────────
test.describe('P101E2E.2 step2-decompose', () => {
  test('chatPipeline.ts contains DECOMP_ATOM call (decompAtom import + invocation)', () => {
    const src = readSrc(CHAT_PIPELINE)
    // Either static or dynamic import of decompAtom + a decompose() call.
    expect(src).toMatch(/aisp\/decompAtom/)
    expect(src).toMatch(/\bdecompose\s*\(/)
  })

  test('decompAtom.ts exports decompose function', () => {
    const src = readSrc(DECOMP_ATOM)
    // Match `export function decompose` or `export const decompose =`.
    const hasExport =
      /export\s+function\s+decompose\b/.test(src) ||
      /export\s+(?:const|let|var)\s+decompose\b/.test(src) ||
      /export\s*\{[^}]*\bdecompose\b[^}]*\}/.test(src)
    expect(hasExport).toBe(true)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// P101E2E.3 — Step 3 Architect (DDD + ADR) (2)
// ───────────────────────────────────────────────────────────────────────────
test.describe('P101E2E.3 step3-architect', () => {
  test('PlanningChatBar.tsx contains classifyContexts call (DDD_ATOM)', () => {
    const src = readSrc(PLANNING_CHAT_BAR)
    expect(src).toMatch(/classifyContexts/)
    expect(src).toMatch(/aisp\/dddAtom/)
  })

  test('dddAtom.ts exports classifyContexts', () => {
    const src = readSrc(DDD_ATOM)
    const hasExport =
      /export\s+function\s+classifyContexts\b/.test(src) ||
      /export\s+(?:const|let|var)\s+classifyContexts\b/.test(src) ||
      /export\s*\{[^}]*\bclassifyContexts\b[^}]*\}/.test(src)
    expect(hasExport).toBe(true)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// P101E2E.4 — Step 4 Spec (PROCESS + AISP) (2)
// ───────────────────────────────────────────────────────────────────────────
test.describe('P101E2E.4 step4-spec', () => {
  test('PlanningChatBar.tsx contains classifyProcess call (PROCESS_ATOM)', () => {
    const src = readSrc(PLANNING_CHAT_BAR)
    expect(src).toMatch(/classifyProcess/)
    expect(src).toMatch(/aisp\/processAtom/)
  })

  test('processAtom.ts exports classifyProcess', () => {
    const src = readSrc(PROCESS_ATOM)
    const hasExport =
      /export\s+function\s+classifyProcess\b/.test(src) ||
      /export\s+(?:const|let|var)\s+classifyProcess\b/.test(src) ||
      /export\s*\{[^}]*\bclassifyProcess\b[^}]*\}/.test(src)
    expect(hasExport).toBe(true)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// P101E2E.5 — Step 5 Plan (AGENT) (2)
// ───────────────────────────────────────────────────────────────────────────
test.describe('P101E2E.5 step5-plan', () => {
  test('PlanningChatBar.tsx contains classifyAgents call (AGENT_ATOM; P97 wire)', () => {
    const src = readSrc(PLANNING_CHAT_BAR)
    expect(src).toMatch(/classifyAgents/)
    expect(src).toMatch(/aisp\/agentAtom/)
  })

  test('agentAtom.ts exports classifyAgents', () => {
    const src = readSrc(AGENT_ATOM)
    const hasExport =
      /export\s+function\s+classifyAgents\b/.test(src) ||
      /export\s+(?:const|let|var)\s+classifyAgents\b/.test(src) ||
      /export\s*\{[^}]*\bclassifyAgents\b[^}]*\}/.test(src)
    expect(hasExport).toBe(true)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// P101E2E.6 — Step 6 Build (TDD scaffold) (1)
// ───────────────────────────────────────────────────────────────────────────
test.describe('P101E2E.6 step6-build', () => {
  test('exportClaudeCode.ts contains buildTDDScaffold import + call', () => {
    const src = readSrc(EXPORT_CLAUDE_CODE)
    // Import statement.
    expect(src).toMatch(
      /import\s*\{[^}]*\bbuildTDDScaffold\b[^}]*\}\s*from\s*['"][^'"]*tddScaffoldGenerator['"]/,
    )
    // Invocation site.
    expect(src).toMatch(/\bbuildTDDScaffold\s*\(/)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// P101E2E.7 — Step 7 Reflect (KISS + Seal) (2)
// ───────────────────────────────────────────────────────────────────────────
test.describe('P101E2E.7 step7-reflect', () => {
  test('SpecWorkbench.tsx contains run-kiss-review testid (P98 wire)', () => {
    const src = readSrc(SPEC_WORKBENCH)
    expect(src).toMatch(/data-testid=["']run-kiss-review/)
  })

  test('Agentics.tsx contains SealPanel import + render (P99 wire)', () => {
    const src = readSrc(AGENTICS_PAGE)
    expect(src).toMatch(
      /import\s*\{[^}]*\bSealPanel\b[^}]*\}\s*from\s*['"][^'"]*SealPanel['"]/,
    )
    expect(src).toMatch(/<SealPanel\b/)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// P101E2E.8 — All 8 atoms have production call sites (3)
// ───────────────────────────────────────────────────────────────────────────
test.describe('P101E2E.8 all-8-atoms-wired', () => {
  test('INTENT/ASSUMPTIONS/SELECTION/CONTENT/PATCH all referenced in chatPipeline.ts', () => {
    const src = readSrc(CHAT_PIPELINE)
    // INTENT — atom name OR intentAtom import.
    expect(/INTENT_ATOM|intentAtom/.test(src)).toBe(true)
    // ASSUMPTIONS — atom name OR assumptionsAtom import.
    expect(/ASSUMPTIONS_ATOM|assumptionsAtom/.test(src)).toBe(true)
    // SELECTION — atom name OR templateSelector import.
    expect(/SELECTION_ATOM|templateSelector/.test(src)).toBe(true)
    // CONTENT — atom name OR contentAtom import.
    expect(/CONTENT_ATOM|contentAtom/.test(src)).toBe(true)
    // PATCH — atom name OR applyPatches reference (canonical PATCH_ATOM apply site).
    expect(/PATCH_ATOM|applyPatches/.test(src)).toBe(true)
  })

  test('DECOMP referenced in chatPipeline.ts (P74)', () => {
    const src = readSrc(CHAT_PIPELINE)
    expect(/DECOMP_ATOM|decompAtom|\bdecompose\s*\(/.test(src)).toBe(true)
  })

  test('PROCESS+DDD+AGENT all referenced in PlanningChatBar.tsx (P97)', () => {
    const src = readSrc(PLANNING_CHAT_BAR)
    expect(/classifyProcess/.test(src)).toBe(true)
    expect(/classifyContexts/.test(src)).toBe(true)
    expect(/classifyAgents/.test(src)).toBe(true)
  })
})
