/**
 * P94 / AW-AGENT-ATOM (A1) — AGENT_ATOM Crystal Atom (8th + final atom).
 *
 * Per ADR-120. Decomposes a single PROCESS_ATOM Wave into ordered
 * AgentSpec[] with disjoint owned-files + DoD checklists. Pure module.
 *
 * Boundary vs PROCESS_ATOM (ADR-118): PROCESS_ATOM emits a lightweight
 * AgentScope skeleton (id/waveId/role/ownedFiles); AGENT_ATOM enriches
 * each into a full AgentSpec (+ scope/dod/inputs/outputs) for AgentProxy
 * live-LLM dispatch in P95+. PROCESS_ATOM's AgentScope stays distinct.
 *
 * Cross-refs: ADR-053 INTENT, ADR-099 DECOMP, ADR-118 PROCESS, ADR-119 DDD.
 */

import type { AgentScope, Wave } from '@/contexts/intelligence/aisp/processAtom'
import type { BoundedContext } from '@/contexts/intelligence/aisp/dddAtom'

/** Kebab-case role identifier (Γ R4). */
export type AgentRole = string

/** Context required to decompose a wave into agents. */
export interface WaveContext {
  wave: Wave
  /** Bounded contexts the wave intersects (from DDD_ATOM). */
  contexts: BoundedContext[]
  /** Existing AgentScope hints from PROCESS_ATOM (lighter-weight; this atom enriches). */
  scopeHints?: AgentScope[]
}

/** Full agent spec — what AGENT_ATOM emits per agent. */
export interface AgentSpec {
  id: string
  role: string
  ownedFiles: string[]
  scope: string
  dod: string[]
  inputs: string[]
  outputs: string[]
}

/** AGENT_ATOM result envelope. */
export interface AgentAtomOutput {
  waveId: string
  agents: AgentSpec[]
  rationale: string
}

/** AGENT_ATOM Crystal Atom (verbatim AISP). */
export const AGENT_ATOM = `⟦
  Ω := { Decompose wave into ordered AgentSpec[] with disjoint owned-files + DoD checklists }
  Σ := { agents: AgentSpec[] }
  Γ := {
    R1: |agents| ≤ 7,
    R2: ∀ agent : agent.dod.length ≥ 1,
    R3: ∀ wave  : ownedFiles disjoint across same-wave agents,
    R4: ∀ agent : agent.role ∈ kebab-case identifier
  }
  Λ := { agents within a wave run parallel; sequential across waves per PROCESS_ATOM Λ }
  Ε := {
    V1: VERIFY ownedFiles disjoint per wave,
    V2: VERIFY dod.length ≥ 1 per agent,
    V3: VERIFY role unique within wave
  }
⟧`

const MAX_AGENTS_PER_WAVE = 7
const KEBAB_RE = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/

interface RoleRecipe {
  ownedTemplate: (waveId: string) => string[]
  scopeTemplate: (contexts: BoundedContext[]) => string
  dod: readonly string[]
  inputs: (contexts: BoundedContext[]) => string[]
}

const ROLE_RECIPES: Readonly<Record<string, RoleRecipe>> = {
  'schema-design': {
    ownedTemplate: (w) => [`src/contexts/persistence/migrations/${w}-schema.sql`],
    scopeTemplate: (cs) => `Design schema + RLS for ${cs.map((c) => c.name).join(', ') || 'this wave'}.`,
    dod: ['RLS policies present', 'FK constraints valid', 'migration idempotent'],
    inputs: (cs) => cs.map((c) => `${c.id}.responsibility`),
  },
  'test-coverage': {
    ownedTemplate: (w) => [`tests/${w}.spec.ts`],
    scopeTemplate: (cs) => `Author Playwright pure-unit specs covering ${cs.map((c) => c.name).join(', ') || 'wave deliverables'}.`,
    dod: ['≥80% line coverage', 'all describe blocks GREEN', 'no skipped suites'],
    inputs: (cs) => cs.map((c) => `${c.id}.acceptance`),
  },
  'ui-component': {
    ownedTemplate: (w) => [`src/components/${w}/Index.tsx`],
    scopeTemplate: (cs) => `Build the React component surface for ${cs.map((c) => c.name).join(', ') || 'wave UI'}.`,
    dod: ['WCAG 2.1 AA contrast', '44px touch targets', 'token-derived spacing/colors'],
    inputs: (cs) => cs.map((c) => `${c.id}.viewModel`),
  },
  'closer-tests': {
    ownedTemplate: (w) => [`tests/${w}-closer.spec.ts`],
    scopeTemplate: () => 'Author the wave closer test suite (cross-agent integration + EOP gate).',
    dod: ['EOP triplet present', 'ADR cross-refs valid', 'all wave specs GREEN'],
    inputs: () => ['previous-agents.outputs'],
  },
  'closer-docs': {
    ownedTemplate: (w) => [`plans/implementation/${w}/session-log.md`, `plans/implementation/${w}/retrospective.md`],
    scopeTemplate: () => 'Write the session log + retrospective + master-checklist tick.',
    dod: ['session-log filled', 'retrospective: keep/drop/reframe', 'master-checklist ticked'],
    inputs: () => ['previous-agents.outputs'],
  },
}

const FALLBACK_RECIPE: RoleRecipe = {
  ownedTemplate: (w) => [`src/${w}/index.ts`],
  scopeTemplate: (cs) => `Implement scope for ${cs.map((c) => c.name).join(', ') || 'this wave'}.`,
  dod: ['acceptance criteria met', 'tests added'],
  inputs: (cs) => cs.map((c) => c.id),
}

function resolveRecipe(role: string): RoleRecipe {
  return ROLE_RECIPES[role] ?? FALLBACK_RECIPE
}

function disjointify(used: Set<string>, files: string[]): string[] {
  return files.map((f) => {
    if (!used.has(f)) {
      used.add(f)
      return f
    }
    let n = 2
    let candidate = f.replace(/(\.[^.]+)?$/, (ext) => `-${n}${ext ?? ''}`)
    while (used.has(candidate)) {
      n += 1
      candidate = f.replace(/(\.[^.]+)?$/, (ext) => `-${n}${ext ?? ''}`)
    }
    used.add(candidate)
    return candidate
  })
}

function defaultHints(waveId: string): AgentScope[] {
  return [
    { id: `${waveId}-a1`, waveId, role: 'closer-tests', ownedFiles: [] },
    { id: `${waveId}-a2`, waveId, role: 'closer-docs', ownedFiles: [] },
  ]
}

/** Rules-based deterministic classifier. Baseline + AgentProxy fallback. */
export function classifyAgents(ctx: WaveContext): AgentAtomOutput {
  const waveId = ctx.wave.id
  const seedHints = ctx.scopeHints && ctx.scopeHints.length > 0
    ? ctx.scopeHints.filter((h) => h.waveId === waveId).slice(0, MAX_AGENTS_PER_WAVE)
    : defaultHints(waveId)
  const hints = seedHints.length > 0 ? seedHints : defaultHints(waveId)

  const usedFiles = new Set<string>()
  const seenRoles = new Set<string>()
  const agents: AgentSpec[] = []

  hints.forEach((h, i) => {
    const recipe = resolveRecipe(h.role)
    const baseFiles = h.ownedFiles.length > 0 ? h.ownedFiles : recipe.ownedTemplate(waveId)
    const ownedFiles = disjointify(usedFiles, baseFiles)
    let role = h.role
    if (seenRoles.has(role)) role = `${role}-${i + 1}`
    seenRoles.add(role)
    const scope = recipe.scopeTemplate(ctx.contexts)
    const dod = [...recipe.dod]
    const inputs = recipe.inputs(ctx.contexts)
    agents.push({
      id: h.id || `${waveId}-a${i + 1}`,
      role,
      ownedFiles,
      scope,
      dod,
      inputs,
      outputs: [...ownedFiles],
    })
  })

  const rationale = ctx.scopeHints && ctx.scopeHints.length > 0
    ? `Enriched ${agents.length} PROCESS_ATOM scope hint(s) into full AgentSpec(s) for wave ${waveId}.`
    : `No scope hints supplied; applied default 2-agent closer scaffold for wave ${waveId}.`

  return { waveId, agents, rationale }
}

/** Build the AgentProxy prompt + JSON schema for LLM enrichment. */
export function buildAgentAtom(
  ctx: WaveContext,
): { prompt: string; schema: Record<string, unknown> } {
  const hintLine = ctx.scopeHints && ctx.scopeHints.length > 0
    ? ctx.scopeHints.map((h) => `${h.role}@${h.id}`).join(', ')
    : '(none)'
  const ctxLine = ctx.contexts.map((c) => `${c.id}:${c.name}`).join(', ') || '(none)'
  const prompt = [
    'You are decomposing a single wave per the AGENT_ATOM AISP contract.',
    '',
    'Σ contract: return { waveId, agents: AgentSpec[], rationale }.',
    'AgentSpec fields: { id, role, ownedFiles, scope, dod, inputs, outputs }.',
    'Γ caps: ≤7 agents per wave; each agent.dod.length ≥ 1; role kebab-case.',
    'Λ: agents within the wave run in parallel; ownedFiles MUST be disjoint.',
    'Ε: VERIFY ownedFiles disjoint, dod ≥ 1 per agent, role unique within the wave.',
    '',
    `Wave: ${ctx.wave.id} (sprint ${ctx.wave.sprintId}, parallel=${ctx.wave.parallel})`,
    `Bounded contexts: ${ctxLine}`,
    `PROCESS_ATOM scope hints: ${hintLine}`,
    '',
    'Return ONLY a JSON object conforming to the schema. No prose, no markdown fences.',
  ].join('\n')

  const STR = { type: 'string' } as const
  const STR_ARR = { type: 'array', items: STR } as const
  const obj = (req: string[], props: Record<string, unknown>): Record<string, unknown> =>
    ({ type: 'object', required: req, additionalProperties: false, properties: props })

  const schema: Record<string, unknown> = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    type: 'object',
    required: ['waveId', 'agents', 'rationale'],
    additionalProperties: false,
    properties: {
      waveId: STR,
      agents: {
        type: 'array',
        maxItems: MAX_AGENTS_PER_WAVE,
        items: obj(
          ['id', 'role', 'ownedFiles', 'scope', 'dod', 'inputs', 'outputs'],
          {
            id: STR, role: STR, ownedFiles: STR_ARR, scope: STR,
            dod: { type: 'array', minItems: 1, items: STR },
            inputs: STR_ARR, outputs: STR_ARR,
          },
        ),
      },
      rationale: STR,
    },
  }
  return { prompt, schema }
}

function bad(field: string): never {
  throw new Error(`AGENT_ATOM schema mismatch: ${field}`)
}

function strArr(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === 'string')
}

function parseAgent(raw: unknown, i: number): AgentSpec {
  if (!raw || typeof raw !== 'object') bad(`agents[${i}]`)
  const a = raw as Record<string, unknown>
  if (typeof a.id !== 'string') bad(`agents[${i}].id`)
  if (typeof a.role !== 'string') bad(`agents[${i}].role`)
  if (typeof a.scope !== 'string') bad(`agents[${i}].scope`)
  if (!strArr(a.ownedFiles)) bad(`agents[${i}].ownedFiles`)
  if (!strArr(a.dod)) bad(`agents[${i}].dod`)
  if (!strArr(a.inputs)) bad(`agents[${i}].inputs`)
  if (!strArr(a.outputs)) bad(`agents[${i}].outputs`)
  return {
    id: a.id, role: a.role, scope: a.scope,
    ownedFiles: a.ownedFiles as string[], dod: a.dod as string[],
    inputs: a.inputs as string[], outputs: a.outputs as string[],
  }
}

function verifyInvariants(out: AgentAtomOutput): void {
  if (out.agents.length > MAX_AGENTS_PER_WAVE) bad('agents exceeds Γ R1 cap of 7')
  const fileSet = new Set<string>()
  const roleSet = new Set<string>()
  out.agents.forEach((a, i) => {
    if (a.dod.length < 1) bad(`agents[${i}].dod (Ε V2: dod.length ≥ 1)`)
    if (!KEBAB_RE.test(a.role)) bad(`agents[${i}].role (Γ R4: kebab-case)`)
    if (roleSet.has(a.role)) bad(`agents[${i}].role (Ε V3: role unique within wave)`)
    roleSet.add(a.role)
    a.ownedFiles.forEach((f) => {
      if (fileSet.has(f)) bad(`agents[${i}].ownedFiles (Ε V1: disjoint per wave)`)
      fileSet.add(f)
    })
  })
}

/** Parse AgentProxy response → AgentAtomOutput. Throws on schema or Ε mismatch. */
export function parseAgentResponse(raw: string): AgentAtomOutput {
  const trimmed = raw.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const body = (fenced ? fenced[1] : trimmed).trim()
  let parsed: unknown
  try {
    parsed = JSON.parse(body)
  } catch {
    bad('not valid JSON')
  }
  if (!parsed || typeof parsed !== 'object') bad('root not an object')
  const obj = parsed as Record<string, unknown>
  if (typeof obj.waveId !== 'string') bad('waveId')
  if (!Array.isArray(obj.agents)) bad('agents')
  if (typeof obj.rationale !== 'string') bad('rationale')
  const agents = obj.agents.map((a, i) => parseAgent(a, i))
  const out: AgentAtomOutput = { waveId: obj.waveId, agents, rationale: obj.rationale }
  verifyInvariants(out)
  return out
}
