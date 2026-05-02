/**
 * P97 / Agent A1 — TDD Scaffold Generator (NEW; pure module).
 *
 * Per ADR-128 (P97). Derives a deterministic Given/When/Then test-spec
 * scaffold from a `PhaseCard` plus optional `BoundedContext[]` (DDD_ATOM)
 * and `AgentSpec[]` (AGENT_ATOM) outputs. Pure transform — no React, no
 * fs/network, no store imports. Cap: 30 test cases per phase.
 *
 * Sources (Σ): 4 derivation paths
 *   1. AISP Σ Γ rules    — parsed from `sprint.aispSpec` (R1/R2/...)
 *   2. DDD context        — per `BoundedContext.responsibility`
 *   3. AGENT DoD          — per `AgentSpec.dod[]`
 *   4. Phase gate         — per `phase.adrRefs[]`
 *
 * Cross-refs: ADR-053 INTENT, ADR-099 DECOMP, ADR-118 PROCESS,
 *             ADR-119 DDD, ADR-120 AGENT, ADR-121 SpecWorkbench.
 */

import type { PhaseCard, SprintSummary } from '@/components/agentics/SpecWorkbench'
import type { BoundedContext } from '@/contexts/intelligence/aisp/dddAtom'
import type { AgentSpec } from '@/contexts/intelligence/aisp/agentAtom'

/** Source classifier for each test case. */
export type TDDDerivedFrom = 'AISP-Σ' | 'DDD-context' | 'AGENT-DoD' | 'phase-gate'

/** Single Given/When/Then test case. */
export interface TDDTestCase {
  id: string
  given: string
  when: string
  then: string
  derivedFrom: TDDDerivedFrom
  source?: string
}

/** TDD scaffold output envelope. */
export interface TDDScaffoldOutput {
  phaseId: string
  phaseName: string
  testCases: TDDTestCase[]
  markdown: string
}

/** Hard cap on test cases per phase (Γ R1). */
const MAX_TEST_CASES = 30

/** Match Γ-rule lines like "R1: |contexts| ≤ 8" or "R2: ∀ x : y" inside an AISP block. */
const GAMMA_RULE_RE = /R\d+\s*:\s*([^,\n}]+)/g

/** Build a stable id from prefix + index. */
function tcId(prefix: string, i: number): string {
  return `${prefix}-${String(i + 1).padStart(2, '0')}`
}

/** Extract Γ rule clauses from a Crystal-Atom AISP spec string. */
function parseGammaRules(aispSpec: string | undefined): string[] {
  if (!aispSpec) return []
  const rules: string[] = []
  for (const m of aispSpec.matchAll(GAMMA_RULE_RE)) {
    const clause = m[1]?.trim()
    if (clause) rules.push(clause)
  }
  return rules
}

/** Convert a Γ rule clause into a Given/When/Then test case. */
function gammaToTestCase(rule: string, sprint: SprintSummary, idx: number): TDDTestCase {
  return {
    id: tcId(`${sprint.id}-aisp`, idx),
    given: `the AISP Σ contract for sprint "${sprint.name}"`,
    when: `the pipeline emits output`,
    then: `it satisfies the rule: ${rule}`,
    derivedFrom: 'AISP-Σ',
    source: sprint.id,
  }
}

/** Convert a BoundedContext into a Given/When/Then test case. */
function contextToTestCase(ctx: BoundedContext, idx: number): TDDTestCase {
  return {
    id: tcId(`ddd-${ctx.id}`, idx),
    given: `the bounded context "${ctx.name}"`,
    when: `it handles its responsibility`,
    then: ctx.responsibility,
    derivedFrom: 'DDD-context',
    source: ctx.id,
  }
}

/** Convert a single AgentSpec DoD bullet into a Given/When/Then test case. */
function dodToTestCase(agent: AgentSpec, dod: string, idx: number): TDDTestCase {
  return {
    id: tcId(`agent-${agent.id}`, idx),
    given: `agent "${agent.role}" (${agent.id}) is dispatched`,
    when: `the wave seals`,
    then: `the DoD item is met: ${dod}`,
    derivedFrom: 'AGENT-DoD',
    source: agent.id,
  }
}

/** Convert an ADR ref into a phase-gate test case. */
function adrToTestCase(adr: PhaseCard['adrRefs'][number], phaseId: string, idx: number): TDDTestCase {
  return {
    id: tcId(`gate-${phaseId}`, idx),
    given: `phase ${phaseId} reaches the gate`,
    when: `the gate is verified`,
    then: `${adr.id} ("${adr.title}") is Accepted on disk`,
    derivedFrom: 'phase-gate',
    source: adr.id,
  }
}

/** Render a single test case as markdown. */
function renderCase(tc: TDDTestCase): string {
  const head = `### ${tc.id} · ${tc.derivedFrom}${tc.source ? ` · ${tc.source}` : ''}`
  return [
    head,
    '',
    `- **Given** ${tc.given}`,
    `- **When** ${tc.when}`,
    `- **Then** ${tc.then}`,
    '',
  ].join('\n')
}

/** Render the full TDD spec markdown. */
function renderMarkdown(phase: PhaseCard, cases: TDDTestCase[]): string {
  const counts: Record<TDDDerivedFrom, number> = {
    'AISP-Σ': 0, 'DDD-context': 0, 'AGENT-DoD': 0, 'phase-gate': 0,
  }
  for (const c of cases) counts[c.derivedFrom] += 1

  const header = [
    `# Test Spec — ${phase.name}`,
    '',
    `Phase ${phase.phase} · ${phase.id} · status: ${phase.status}`,
    '',
    '## Coverage',
    '',
    `- AISP Σ rules: ${counts['AISP-Σ']}`,
    `- DDD contexts: ${counts['DDD-context']}`,
    `- AGENT DoD: ${counts['AGENT-DoD']}`,
    `- Phase gates: ${counts['phase-gate']}`,
    `- Total cases: ${cases.length} (cap ${MAX_TEST_CASES})`,
    '',
    '## Test Cases',
    '',
  ].join('\n')

  if (cases.length === 0) {
    return `${header}_No derivable test cases — supply AISP Σ specs, DDD contexts, AGENT DoD, or ADR refs._\n`
  }
  return header + cases.map(renderCase).join('\n')
}

/** Build the full TDD scaffold for one phase. */
export function buildTDDScaffold(
  phase: PhaseCard,
  contexts?: BoundedContext[],
  agents?: AgentSpec[],
): TDDScaffoldOutput {
  const cases: TDDTestCase[] = []

  // 1. AISP Σ Γ rules — per sprint.aispSpec.
  for (const sprint of phase.sprints) {
    const rules = parseGammaRules(sprint.aispSpec)
    rules.forEach((rule, i) => {
      if (cases.length < MAX_TEST_CASES) cases.push(gammaToTestCase(rule, sprint, i))
    })
  }

  // 2. DDD context responsibilities.
  if (contexts && contexts.length > 0) {
    contexts.forEach((ctx, i) => {
      if (cases.length < MAX_TEST_CASES) cases.push(contextToTestCase(ctx, i))
    })
  }

  // 3. AGENT DoD bullets — flatten agents × dod.
  if (agents && agents.length > 0) {
    let dodIdx = 0
    for (const agent of agents) {
      for (const item of agent.dod) {
        if (cases.length >= MAX_TEST_CASES) break
        cases.push(dodToTestCase(agent, item, dodIdx))
        dodIdx += 1
      }
      if (cases.length >= MAX_TEST_CASES) break
    }
  }

  // 4. Phase gate items — per phase.adrRefs.
  phase.adrRefs.forEach((adr, i) => {
    if (cases.length < MAX_TEST_CASES) cases.push(adrToTestCase(adr, phase.id, i))
  })

  const markdown = renderMarkdown(phase, cases)
  return { phaseId: phase.id, phaseName: phase.name, testCases: cases, markdown }
}
