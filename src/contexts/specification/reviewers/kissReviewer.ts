/**
 * P98 / Agent A4 — KISS Review Engine (NEW; pure module). Per ADR-129.
 * Evaluates a PhaseCard against 6 KISS categories (no-new-deps / loc-cap /
 * no-hardcode / gate-conditions / aisp-sigma / scope-creep) and emits a
 * deterministic findings report (P1 block / P2 should-fix / P3 note) plus
 * markdown. Pure — no React, no fs, no store. Cross-refs ADR-091/118/121/128.
 */

import type { PhaseCard, SprintSummary } from '@/components/agentics/SpecWorkbench'

export type KissSeverity = 'P1' | 'P2' | 'P3'
export type KissCategory =
  | 'no-new-deps'
  | 'loc-cap'
  | 'no-hardcode'
  | 'gate-conditions'
  | 'aisp-sigma'
  | 'scope-creep'

export interface KissFinding {
  id: string
  severity: KissSeverity
  category: KissCategory
  title: string
  details: string
  source?: string
  fix?: string
}

export interface KissReviewOutput {
  phaseId: string
  phaseName: string
  findings: KissFinding[]
  summary: { p1: number; p2: number; p3: number; total: number }
  markdown: string
  passes: boolean
}

const SPRINT_CAP_PER_PHASE = 4 // PROCESS_ATOM Γ R2 (ADR-118)
const AGENT_CAP_PER_WAVE = 7 // AGENT_ATOM Γ R1 (ADR-120)
const OWNED_FILES_OVERLOAD = 3
const HEX_COLOR_RE = /#[0-9a-fA-F]{6}\b/
const RAW_TIMEOUT_RE = /\b\d{4,}\s*(ms|milliseconds)\b/i
const RAW_PIXEL_RE = /\b\d{3,}\s*px\b/i
const DEP_ADD_RE = /\b(add|introduc|install)\b.*\bpackage\.json\b/i

function fid(category: KissCategory, index: number): string {
  return `kiss-${category}-${String(index + 1).padStart(2, '0')}`
}

/** Category 1 — no-new-deps. Scan adrRefs titles for "add to package.json" hints. */
function checkNoNewDeps(phase: PhaseCard): KissFinding[] {
  const out: KissFinding[] = []
  phase.adrRefs.forEach((adr, i) => {
    if (DEP_ADD_RE.test(adr.title)) {
      out.push({
        id: fid('no-new-deps', i),
        severity: 'P1',
        category: 'no-new-deps',
        title: `Possible dependency add in ${adr.id}`,
        details: `ADR title hints a package.json modification: "${adr.title}". KISS requires explicit waiver.`,
        source: adr.id,
        fix: 'Either remove the dependency or land a dedicated waiver ADR documenting the trade-off.',
      })
    }
  })
  return out
}

/** Category 2 — loc-cap. Flag agent scopes whose ownedFiles[] count is at risk. */
function checkLocCap(phase: PhaseCard): KissFinding[] {
  const out: KissFinding[] = []
  let idx = 0
  for (const sprint of phase.sprints) {
    if (!sprint.agentScopes) continue
    for (const agent of sprint.agentScopes) {
      if (agent.ownedFiles.length > OWNED_FILES_OVERLOAD) {
        out.push({
          id: fid('loc-cap', idx++),
          severity: 'P2',
          category: 'loc-cap',
          title: `Agent ${agent.id} owns ${agent.ownedFiles.length} files`,
          details:
            `Agent "${agent.role}" in sprint "${sprint.name}" owns ${agent.ownedFiles.length} files; ` +
            `risk of exceeding canonical caps (component ≤200, pure module ≤300, ADR ≤120).`,
          source: `${sprint.id}/${agent.id}`,
          fix: 'Decompose into multiple agents, or split surfaces across sibling waves.',
        })
      }
    }
  }
  return out
}

/** Hardcode-pattern table: regex × kind × fix copy. */
const HARDCODE_PATTERNS: ReadonlyArray<{ re: RegExp; kind: string; fix: string }> = [
  { re: HEX_COLOR_RE, kind: 'color', fix: 'Replace with the appropriate design token (`var(--hb-*)`).' },
  { re: RAW_TIMEOUT_RE, kind: 'timeout', fix: 'Move the value into a named config constant.' },
  { re: RAW_PIXEL_RE, kind: 'pixel value', fix: 'Use a token-derived spacing/sizing variable.' },
]

/** Category 3 — no-hardcode. Scan humanSpec prose for raw values. */
function checkNoHardcode(phase: PhaseCard): KissFinding[] {
  const out: KissFinding[] = []
  const fields: Array<readonly [string, string]> = [
    ['northStar', phase.humanSpec.northStar],
    ['sadd', phase.humanSpec.sadd],
    ['implementationPlan', phase.humanSpec.implementationPlan],
  ]
  let idx = 0
  for (const [key, value] of fields) {
    for (const pat of HARDCODE_PATTERNS) {
      const m = value.match(pat.re)
      if (!m) continue
      out.push({
        id: fid('no-hardcode', idx++),
        severity: 'P3',
        category: 'no-hardcode',
        title: `Hardcoded ${pat.kind} in humanSpec.${key}`,
        details: `Found literal "${m[0]}". Should reference a config/token.`,
        source: `humanSpec.${key}`,
        fix: pat.fix,
      })
    }
  }
  return out
}

/** Category 4 — gate-conditions. Each sprint must declare a non-empty DoD. */
function checkGateConditions(phase: PhaseCard): KissFinding[] {
  const out: KissFinding[] = []
  phase.sprints.forEach((sprint, i) => {
    if (!sprint.dod || sprint.dod.length === 0) {
      out.push({
        id: fid('gate-conditions', i),
        severity: 'P1',
        category: 'gate-conditions',
        title: `Sprint "${sprint.name}" has no Definition of Done`,
        details: 'KISS: every gate must be explicit. Empty or missing DoD blocks the seal.',
        source: sprint.id,
        fix: 'Add an explicit DoD checklist before dispatch.',
      })
    }
  })
  return out
}

/** Category 5 — aisp-sigma. Each sprint should carry an AISP Σ block. */
function checkAispSigma(phase: PhaseCard): KissFinding[] {
  const out: KissFinding[] = []
  phase.sprints.forEach((sprint, i) => {
    const spec = sprint.aispSpec ?? ''
    if (!hasSigmaBlock(spec)) {
      out.push({
        id: fid('aisp-sigma', i),
        severity: 'P2',
        category: 'aisp-sigma',
        title: `Sprint "${sprint.name}" missing AISP Σ block`,
        details:
          'AISP Σ contract not detected (expected `Σ :=` or similar). Crystal Atom contracts must be machine-checkable.',
        source: sprint.id,
        fix: 'Author a Σ block describing the input/output contract.',
      })
    }
  })
  return out
}

/** True when `aispSpec` contains a Σ-block opener. */
function hasSigmaBlock(spec: string): boolean {
  if (!spec) return false
  return /Σ\s*:?=/.test(spec) || /\bSigma\b\s*:?=/i.test(spec)
}

/** Category 6 — scope-creep. Sprint cap (Γ R2) + per-wave agent cap (Γ R3). */
function checkScopeCreep(phase: PhaseCard, agentTotal: number): KissFinding[] {
  const out: KissFinding[] = []
  if (phase.sprints.length > SPRINT_CAP_PER_PHASE) {
    out.push({
      id: fid('scope-creep', 0),
      severity: 'P1',
      category: 'scope-creep',
      title: `Phase has ${phase.sprints.length} sprints (cap ${SPRINT_CAP_PER_PHASE})`,
      details:
        `PROCESS_ATOM Γ R2 caps a phase at ${SPRINT_CAP_PER_PHASE} sprints. ` +
        `Found ${phase.sprints.length}. Re-decompose or escalate to a sibling phase.`,
      source: phase.id,
      fix: 'Split the phase or consolidate sprints under shared deliverables.',
    })
  }
  if (agentTotal > AGENT_CAP_PER_WAVE) {
    out.push({
      id: fid('scope-creep', 1),
      severity: 'P1',
      category: 'scope-creep',
      title: `Aggregate agent count ${agentTotal} exceeds wave cap ${AGENT_CAP_PER_WAVE}`,
      details:
        `AGENT_ATOM Γ R1 caps a wave at ${AGENT_CAP_PER_WAVE} agents. ` +
        `Aggregate across sprints is ${agentTotal}. Stagger across multiple waves.`,
      source: phase.id,
      fix: 'Rebalance agents across additional waves.',
    })
  }
  return out
}

/** Aggregate agent count across all sprints (treats each sprint as one wave). */
function totalAgents(sprints: ReadonlyArray<SprintSummary>): number {
  let n = 0
  for (const s of sprints) n += s.agentCount
  return n
}

/** Render markdown from findings + summary header. */
function renderMarkdown(phase: PhaseCard, findings: KissFinding[], passes: boolean): string {
  const summary = aggregate(findings)
  const verdict = passes ? 'PASS' : 'FAIL'
  const header =
    `# KISS Review — ${phase.name}\n\n` +
    `> Phase ${phase.phase} · Status: ${phase.status}\n` +
    `> Reviewer: Hey Bradley KISS Reviewer\n` +
    `> Generated: ${new Date().toISOString()}\n\n` +
    `## Summary\n\n` +
    `- P1 blocking: ${summary.p1}\n` +
    `- P2 should-fix: ${summary.p2}\n` +
    `- P3 notes: ${summary.p3}\n` +
    `- **Verdict:** ${verdict}\n\n`
  if (findings.length === 0) {
    return `${header}## No findings — KISS holds.\n`
  }
  const ordered = [...findings].sort((a, b) => severityRank(a.severity) - severityRank(b.severity))
  const body = `## Findings\n\n${ordered.map(renderFinding).join('\n')}`
  return `${header}${body}\n`
}

/** Render a single finding section. */
function renderFinding(f: KissFinding): string {
  const lines: string[] = [`### ${f.severity} — ${f.category} — ${f.title}`, `- ${f.details}`]
  if (f.source) lines.push(`- Source: ${f.source}`)
  if (f.fix) lines.push(`- Fix: ${f.fix}`)
  return `${lines.join('\n')}\n`
}

/** Severity ranker for stable ordering (P1 first). */
function severityRank(s: KissSeverity): number {
  if (s === 'P1') return 0
  if (s === 'P2') return 1
  return 2
}

/** Tally findings by severity. */
function aggregate(findings: KissFinding[]): { p1: number; p2: number; p3: number; total: number } {
  let p1 = 0
  let p2 = 0
  let p3 = 0
  for (const f of findings) {
    if (f.severity === 'P1') p1++
    else if (f.severity === 'P2') p2++
    else p3++
  }
  return { p1, p2, p3, total: findings.length }
}

/** Public entry point — build a KISS review for a phase. Pure, deterministic. */
export function buildKissReview(phase: PhaseCard): KissReviewOutput {
  const findings: KissFinding[] = []
  findings.push(...checkNoNewDeps(phase))
  findings.push(...checkLocCap(phase))
  findings.push(...checkNoHardcode(phase))
  findings.push(...checkGateConditions(phase))
  findings.push(...checkAispSigma(phase))
  findings.push(...checkScopeCreep(phase, totalAgents(phase.sprints)))
  const summary = aggregate(findings)
  const passes = summary.p1 === 0
  const markdown = renderMarkdown(phase, findings, passes)
  return {
    phaseId: phase.id,
    phaseName: phase.name,
    findings,
    summary,
    markdown,
    passes,
  }
}
