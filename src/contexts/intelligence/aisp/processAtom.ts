/**
 * P92 / AW-PROCESS-ATOM (A1) — PROCESS_ATOM Crystal Atom (6th atom).
 *
 * Per ADR-118 PROCESS_ATOM. Decomposes a project description into
 * phases / sprints / waves / agents for live ProcessMapSVG rendering.
 *
 * Boundary vs DECOMP_ATOM (ADR-099):
 *   DECOMP_ATOM:  single-session multi-clause utterance → ordered Todo[]
 *                 for matcher patches. Scope: one user prompt.
 *   PROCESS_ATOM: multi-phase project description → ProcessMap structure.
 *                 Scope: one project plan.
 *
 * AISP contract:
 *   Ω := { Decompose project description into phases/sprints/waves/agents }
 *   Σ := { phases: Phase[], sprints: Sprint[], waves: Wave[], agents: AgentScope[] }
 *   Γ := { R1: |phases| ≤ 5,
 *          R2: ∀ phase: |sprints[phaseId === phase.id]| ≤ 4,
 *          R3: ∀ wave:  |agents[waveId === wave.id]| ≤ 7,
 *          R4: phase.position ∈ [0, 4]
 *        }
 *   Λ := { sequential phases by position;
 *          parallel waves within sprint when wave.parallel = true;
 *          gate between sprints (DoD checklist required) }
 *   Ε := { V1: VERIFY ∀ agent: agent.ownedFiles disjoint across same-wave agents,
 *          V2: VERIFY ∀ sprint gate: dod.length ≥ 1,
 *          V3: VERIFY ∀ phase: phase.id unique }
 *
 * Cross-refs: ADR-045 PATCH_ATOM, ADR-053 INTENT_ATOM, ADR-099 DECOMP_ATOM,
 *             ADR-116 Three-Mode, ADR-117 Process Map SVG.
 */

// P106 / A2 — Pure-module discipline per ADR-118 D1 + ADR-134: import shared
// types from the neutral processMapTypes module, NOT from the React renderer.
import type {
  ProcessEdge,
  ProcessMap,
  ProcessNode,
  ProcessNodeStatus,
} from '@/contexts/intelligence/aisp/processMapTypes'

/** PROCESS_ATOM Crystal Atom (verbatim AISP).
 *  P113 / A1 — δ density bumped Bronze (0.266) → Gold (≥0.60) via prose
 *  → AISP-symbol replacement; semantics preserved. Ambig stays <0.02. */
export const PROCESS_ATOM = `⟦
  Ω := { Decompose description ↦ phases / sprints / waves / agents }
  Σ := { Phase, Sprint, Wave, AgentScope }
  Γ := {
    R1: |phases|≤5,
    R2: ∀phase ⇒ |{s∈sprints : s.phaseId=phase.id}|≤4,
    R3: ∀wave  ⇒ |{a∈agents  : a.waveId=wave.id}|≤7,
    R4: ∀phase ⇒ phase.position∈[0,4]
  }
  Λ := {
    seq      := phases ordered → position,
    parallel := wave.parallel ⇔ ∀a∈wave run concurrent,
    gate     := ∀sprint→sprint ⇒ DoD≠∅
  }
  Ε := {
    V1: ∀a₁≠a₂∈wave ⇒ ownedFiles(a₁)∩ownedFiles(a₂)=∅,
    V2: ∀sprint.gate ⇒ |dod|≥1,
    V3: ∀p₁≠p₂∈phases ⇒ p₁.id≠p₂.id
  }
⟧`

export type ProcessAtomStatus = ProcessNodeStatus

/** A single project phase. */
export interface Phase { id: string; name: string; position: number; status: ProcessAtomStatus }

/** A sprint within a phase. */
export interface Sprint {
  id: string; phaseId: string; name: string; position: number; status: ProcessAtomStatus
}

/** A wave (parallel or sequential agent batch) within a sprint. */
export interface Wave { id: string; sprintId: string; parallel: boolean; position: number }

/** A single agent's owned scope within a wave. */
export interface AgentScope { id: string; waveId: string; role: string; ownedFiles: string[] }

/** PROCESS_ATOM result envelope. */
export interface ProcessAtomOutput {
  phases: Phase[]
  sprints: Sprint[]
  waves: Wave[]
  agents: AgentScope[]
  rationale: string
}

const MAX_PHASES = 5
const MAX_SPRINTS_PER_PHASE = 4
const MAX_AGENTS_PER_WAVE = 7

interface PhaseRecipe {
  id: string
  name: string
  keywords: readonly string[]
  sprintNames: readonly [string, string]
}

const PHASE_RECIPES: readonly PhaseRecipe[] = [
  { id: 'auth', name: 'Auth', keywords: ['auth', 'login', 'signup', 'oauth'], sprintNames: ['Auth Schema', 'Auth UI'] },
  { id: 'payments', name: 'Payments', keywords: ['payment', 'stripe', 'checkout', 'billing'], sprintNames: ['Payments Schema', 'Payments UI'] },
  { id: 'dashboard', name: 'Dashboard', keywords: ['dashboard', 'admin'], sprintNames: ['Dashboard Data', 'Dashboard UI'] },
  { id: 'backend', name: 'Backend', keywords: ['api', 'backend', 'database'], sprintNames: ['API Schema', 'API Endpoints'] },
  { id: 'frontend', name: 'Frontend', keywords: ['ui', 'frontend', 'landing', 'marketing'], sprintNames: ['Frontend Layout', 'Frontend Polish'] },
]

const FALLBACK_PHASES: readonly PhaseRecipe[] = [
  { id: 'foundation', name: 'Foundation', keywords: [], sprintNames: ['Setup', 'Schema'] },
  { id: 'build', name: 'Build', keywords: [], sprintNames: ['Core', 'Integration'] },
  { id: 'polish', name: 'Polish', keywords: [], sprintNames: ['QA', 'Release'] },
]

function matchPhases(description: string): { recipes: PhaseRecipe[]; matched: boolean } {
  const hay = description.toLowerCase()
  const hits = PHASE_RECIPES.filter((r) => r.keywords.some((k) => hay.includes(k))).slice(0, MAX_PHASES)
  return hits.length > 0
    ? { recipes: hits, matched: true }
    : { recipes: [...FALLBACK_PHASES].slice(0, MAX_PHASES), matched: false }
}

/** Rules-based deterministic classifier. Baseline + AgentProxy fallback. */
export function classifyProcess(description: string): ProcessAtomOutput {
  const { recipes, matched } = matchPhases(description)
  const phases: Phase[] = []
  const sprints: Sprint[] = []
  const waves: Wave[] = []
  const agents: AgentScope[] = []

  recipes.forEach((r, phaseIdx) => {
    phases.push({ id: r.id, name: r.name, position: phaseIdx, status: 'planned' })
    const budget = Math.min(r.sprintNames.length, MAX_SPRINTS_PER_PHASE)
    for (let s = 0; s < budget; s += 1) {
      const sprintId = `${r.id}-s${s + 1}`
      sprints.push({ id: sprintId, phaseId: r.id, name: r.sprintNames[s], position: s, status: 'planned' })
      const waveId = `${sprintId}-w1`
      waves.push({ id: waveId, sprintId, parallel: false, position: 0 })
      const slate = [
        { role: 'schema-design', file: `src/${r.id}/${sprintId}-schema.ts` },
        { role: 'test-coverage', file: `tests/${sprintId}.spec.ts` },
      ].slice(0, MAX_AGENTS_PER_WAVE)
      slate.forEach((a, i) => {
        agents.push({ id: `${waveId}-a${i + 1}`, waveId, role: a.role, ownedFiles: [a.file] })
      })
    }
  })

  const rationale = matched
    ? `Matched ${phases.length} domain phase(s) from description: ${phases.map((p) => p.name).join(', ')}.`
    : `No domain keywords matched; applied default ${phases.length}-phase scaffold (Foundation / Build / Polish).`
  return { phases, sprints, waves, agents, rationale }
}

/** Build the AgentProxy prompt + JSON schema for LLM enrichment. */
export function buildProcessAtom(
  description: string,
): { prompt: string; schema: Record<string, unknown> } {
  const prompt = [
    'You are decomposing a project description per the PROCESS_ATOM AISP contract.',
    '',
    'Σ contract: return an object with fields { phases, sprints, waves, agents, rationale }.',
    'Γ caps: ≤5 phases; ≤4 sprints per phase; ≤7 agents per wave; phase.position ∈ [0,4].',
    'Λ: phases sequential by position; waves parallel within sprint when wave.parallel=true; gates between sprints require DoD.',
    'Ε: agents in the same wave must have disjoint ownedFiles; phase.id values must be unique.',
    '',
    `Description:\n${description}`,
    '',
    'Return ONLY a JSON object conforming to the schema. No prose, no markdown fences.',
  ].join('\n')

  const STR = { type: 'string' }
  const INT0 = { type: 'integer', minimum: 0 }
  const STATUS = { type: 'string', enum: ['planned', 'in-flight', 'sealed', 'deferred'] }
  const obj = (req: string[], props: Record<string, unknown>): Record<string, unknown> =>
    ({ type: 'object', required: req, properties: props })
  const list = (it: Record<string, unknown>, max?: number): Record<string, unknown> =>
    max ? { type: 'array', maxItems: max, items: it } : { type: 'array', items: it }

  const schema: Record<string, unknown> = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    type: 'object',
    required: ['phases', 'sprints', 'waves', 'agents', 'rationale'],
    additionalProperties: false,
    properties: {
      phases: list(obj(['id', 'name', 'position', 'status'],
        { id: STR, name: STR, position: { type: 'integer', minimum: 0, maximum: 4 }, status: STATUS }), MAX_PHASES),
      sprints: list(obj(['id', 'phaseId', 'name', 'position', 'status'],
        { id: STR, phaseId: STR, name: STR, position: INT0, status: STATUS })),
      waves: list(obj(['id', 'sprintId', 'parallel', 'position'],
        { id: STR, sprintId: STR, parallel: { type: 'boolean' }, position: INT0 })),
      agents: list(obj(['id', 'waveId', 'role', 'ownedFiles'],
        { id: STR, waveId: STR, role: STR, ownedFiles: { type: 'array', items: STR } })),
      rationale: STR,
    },
  }
  return { prompt, schema }
}

const STATUS_VALUES: readonly string[] = ['planned', 'in-flight', 'sealed', 'deferred']
type FieldKind = 'string' | 'number' | 'boolean' | 'status' | 'string[]'

function bad(field: string): never {
  throw new Error(`PROCESS_ATOM schema mismatch: ${field}`)
}

function checkKind(v: unknown, kind: FieldKind): boolean {
  if (kind === 'string') return typeof v === 'string'
  if (kind === 'number') return typeof v === 'number'
  if (kind === 'boolean') return typeof v === 'boolean'
  if (kind === 'status') return typeof v === 'string' && STATUS_VALUES.includes(v)
  return Array.isArray(v) && v.every((x) => typeof x === 'string')
}

function parseList<T>(
  obj: Record<string, unknown>,
  key: string,
  fields: ReadonlyArray<readonly [string, FieldKind]>,
): T[] {
  if (!Array.isArray(obj[key])) bad(key)
  return (obj[key] as unknown[]).map((raw, i) => {
    const x = raw as Record<string, unknown>
    const out: Record<string, unknown> = {}
    for (const [name, kind] of fields) {
      if (!checkKind(x[name], kind)) bad(`${key}[${i}].${name}`)
      out[name] = x[name]
    }
    return out as T
  })
}

const PHASE_FIELDS = [['id', 'string'], ['name', 'string'], ['position', 'number'], ['status', 'status']] as const
const SPRINT_FIELDS = [['id', 'string'], ['phaseId', 'string'], ['name', 'string'], ['position', 'number'], ['status', 'status']] as const
const WAVE_FIELDS = [['id', 'string'], ['sprintId', 'string'], ['parallel', 'boolean'], ['position', 'number']] as const
const AGENT_FIELDS = [['id', 'string'], ['waveId', 'string'], ['role', 'string'], ['ownedFiles', 'string[]']] as const

/** Parse AgentProxy response → ProcessAtomOutput. Throws on schema mismatch. */
export function parseProcessResponse(raw: string): ProcessAtomOutput {
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

  const phases = parseList<Phase>(obj, 'phases', PHASE_FIELDS)
  const sprints = parseList<Sprint>(obj, 'sprints', SPRINT_FIELDS)
  const waves = parseList<Wave>(obj, 'waves', WAVE_FIELDS)
  const agents = parseList<AgentScope>(obj, 'agents', AGENT_FIELDS)
  if (typeof obj.rationale !== 'string') bad('rationale')
  return { phases, sprints, waves, agents, rationale: obj.rationale }
}

const PHASE_ROW_Y = 80
const SPRINT_ROW_Y = 240
const COL_X0 = 80
const COL_DX = 180
const SPRINT_DX = 160
const phaseX = (pos: number): number => COL_X0 + pos * COL_DX

/** Adapter: ProcessAtomOutput → ProcessMap (direct ProcessMapSVG consumption). */
export function toProcessMap(output: ProcessAtomOutput): ProcessMap {
  const nodes: ProcessNode[] = []
  const edges: ProcessEdge[] = []

  output.phases.forEach((p) => {
    nodes.push({
      id: p.id, label: p.name, phase: p.position, status: p.status,
      x: phaseX(p.position), y: PHASE_ROW_Y, shape: 'rect',
    })
  })

  output.sprints.forEach((sp) => {
    const parent = output.phases.find((p) => p.id === sp.phaseId)
    const basePos = parent ? parent.position : 0
    nodes.push({
      id: sp.id, label: sp.name, phase: basePos, status: sp.status,
      x: phaseX(basePos) + (sp.position - 0.5) * (SPRINT_DX / 2),
      y: SPRINT_ROW_Y + sp.position * 80, shape: 'rect',
    })
    edges.push({ from: sp.phaseId, to: sp.id, type: 'sequential' })
  })

  // Sequential phase→phase edges; insert diamond gate when status changes
  // sealed → in-flight (proves the gate-edge architecture).
  const sorted = [...output.phases].sort((a, b) => a.position - b.position)
  for (let i = 0; i < sorted.length - 1; i += 1) {
    const a = sorted[i]
    const b = sorted[i + 1]
    if (a.status === 'sealed' && b.status === 'in-flight') {
      const gateId = `gate-${a.id}-${b.id}`
      nodes.push({
        id: gateId, label: 'DoD', phase: a.position, status: 'planned',
        x: (phaseX(a.position) + phaseX(b.position)) / 2,
        y: PHASE_ROW_Y, shape: 'diamond',
      })
      edges.push({ from: a.id, to: gateId, type: 'gate' })
      edges.push({ from: gateId, to: b.id, type: 'gate' })
    } else {
      edges.push({ from: a.id, to: b.id, type: 'sequential' })
    }
  }

  return { nodes, edges }
}
