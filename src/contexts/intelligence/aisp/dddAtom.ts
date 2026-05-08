/**
 * P93 / AW-DDD-ATOM — DDD_ATOM Crystal Atom (7th atom).
 *
 * Identifies bounded contexts from a project description and emits a
 * small domain model (contexts + relationships) for downstream
 * `DomainModelSVG` rendering and Tier-2 LLM enrichment. Pure module;
 * no React, no store imports. Mirrors `decompAtom.ts` Crystal-Atom
 * shape per `bar181/aisp-open-core ai_guide`.
 *
 * Sibling atoms: PROCESS_ATOM (P92), DECOMP_ATOM (P74), INTENT_ATOM,
 * SELECTION_ATOM, CONTENT_ATOM, ASSUMPTIONS_ATOM.
 */

/** The Crystal Atom for bounded-context identification (verbatim AISP). */
export const DDD_ATOM = `⟦
  Ω := { Identify bounded contexts from project description }
  Σ := { contexts: BoundedContext[], relationships: ContextRelationship[] }
  Γ := {
    R1: |contexts| ≤ 8,
    R2: ∀ context : context.responsibility.length ≥ 1,
    R3: ∀ relationship : (relationship.from, relationship.to) unique pairs,
    R4: relationship.kind ∈ {partnership, customer-supplier, conformist, anti-corruption-layer}
  }
  Λ := { contexts map to phases via relatedPhaseIds; relationships render in DomainModelSVG }
  Ε := {
    V1: VERIFY no shared mutable state between contexts,
    V2: VERIFY anti-corruption-layer relationships note cross-domain boundaries,
    V3: VERIFY context.id unique
  }
⟧`

export interface BoundedContext {
  id: string
  name: string
  responsibility: string
  relatedPhaseIds: string[]
  x: number
  y: number
}

export type ContextRelationshipKind =
  | 'partnership'
  | 'customer-supplier'
  | 'conformist'
  | 'anti-corruption-layer'

export interface ContextRelationship {
  from: string
  to: string
  kind: ContextRelationshipKind
}

export interface DDDAtomOutput {
  contexts: BoundedContext[]
  relationships: ContextRelationship[]
  rationale: string
}

export interface DomainModel {
  contexts: BoundedContext[]
  relationships: ContextRelationship[]
}

interface Recipe {
  id: string
  name: string
  responsibility: string
  tokens: readonly string[]
}

const RECIPES: readonly Recipe[] = [
  { id: 'auth', name: 'AuthContext', responsibility: 'User identity + session lifecycle',
    tokens: ['auth', 'login', 'oauth', 'signin', 'signup'] },
  { id: 'payment', name: 'PaymentContext', responsibility: 'Charges, subscriptions, invoicing',
    tokens: ['payment', 'billing', 'stripe', 'invoice', 'subscription'] },
  { id: 'user', name: 'UserContext', responsibility: 'User profile + preferences',
    tokens: ['user', 'account', 'profile', 'preferences'] },
  { id: 'dashboard', name: 'DashboardContext', responsibility: 'Admin views, metrics, analytics',
    tokens: ['dashboard', 'admin', 'analytics', 'metrics', 'reporting'] },
  { id: 'notification', name: 'NotificationContext', responsibility: 'Email + in-app notifications + messaging',
    tokens: ['email', 'notification', 'messaging', 'sms', 'inbox'] },
  { id: 'search', name: 'SearchContext', responsibility: 'Search + content discovery',
    tokens: ['search', 'discovery', 'index', 'query'] },
  { id: 'collaboration', name: 'CollaborationContext', responsibility: 'Teams, workspaces, shared resources',
    tokens: ['team', 'workspace', 'collaboration', 'collab'] },
] as const

const MAX_CONTEXTS = 8
const ROW_Y = 120
const X_BASE = 60
const X_STEP = 200

function defaultContexts(): BoundedContext[] {
  return [
    { id: 'core', name: 'CoreContext', responsibility: 'Primary domain logic + product workflow',
      relatedPhaseIds: [], x: X_BASE, y: ROW_Y },
    { id: 'infrastructure', name: 'InfrastructureContext', responsibility: 'Persistence, transport, platform plumbing',
      relatedPhaseIds: [], x: X_BASE + X_STEP, y: ROW_Y },
  ]
}

function pairExists(rels: ContextRelationship[], a: string, b: string): boolean {
  return rels.some((r) => (r.from === a && r.to === b) || (r.from === b && r.to === a))
}

function deriveRelationships(ids: ReadonlySet<string>): ContextRelationship[] {
  const rels: ContextRelationship[] = []
  const add = (from: string, to: string, kind: ContextRelationshipKind) => {
    if (ids.has(from) && ids.has(to) && !pairExists(rels, from, to)) {
      rels.push({ from, to, kind })
    }
  }
  add('auth', 'user', 'partnership')
  add('payment', 'auth', 'customer-supplier')
  add('dashboard', 'user', 'customer-supplier')
  add('notification', 'user', 'conformist')
  add('collaboration', 'user', 'partnership')
  add('search', 'core', 'anti-corruption-layer')
  return rels
}

/**
 * Rules-based bounded-context classifier. Token-matches the description
 * against `RECIPES`, falls back to a 2-context default, caps at 8 (Γ R1),
 * and arranges contexts in a horizontal row at `y=120`.
 */
export function classifyContexts(description: string): DDDAtomOutput {
  const text = (description ?? '').toLowerCase()
  const hits: Recipe[] = []
  for (const r of RECIPES) {
    if (r.tokens.some((t) => text.includes(t))) hits.push(r)
    if (hits.length >= MAX_CONTEXTS) break
  }

  const contexts: BoundedContext[] = hits.length === 0
    ? defaultContexts()
    : hits.map((r, i) => ({
        id: r.id, name: r.name, responsibility: r.responsibility,
        relatedPhaseIds: [], x: X_BASE + i * X_STEP, y: ROW_Y,
      }))

  const relationships = deriveRelationships(new Set(contexts.map((c) => c.id)))
  const rationale = hits.length === 0
    ? 'No domain tokens matched; falling back to a Core/Infrastructure split as the minimum viable bounded-context decomposition.'
    : `Identified ${contexts.length} bounded context(s) from description tokens; relationships reflect canonical DDD patterns (partnership for peers, customer-supplier for one-way dependencies).`

  return { contexts, relationships, rationale }
}

/**
 * AgentProxy-ready { prompt, schema } pair. Prompt cites Σ verbatim;
 * schema is JSON Schema 2020-12 of `DDDAtomOutput`.
 */
export function buildDDDAtom(description: string): { prompt: string; schema: Record<string, unknown> } {
  const prompt = [
    DDD_ATOM, '',
    'Project description:', description, '',
    'Return JSON matching Σ exactly. Do not include prose outside the JSON.',
  ].join('\n')

  const schema: Record<string, unknown> = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    type: 'object',
    required: ['contexts', 'relationships', 'rationale'],
    additionalProperties: false,
    properties: {
      contexts: {
        type: 'array', maxItems: MAX_CONTEXTS,
        items: {
          type: 'object',
          required: ['id', 'name', 'responsibility', 'relatedPhaseIds', 'x', 'y'],
          additionalProperties: false,
          properties: {
            id: { type: 'string', minLength: 1 },
            name: { type: 'string', minLength: 1 },
            responsibility: { type: 'string', minLength: 1 },
            relatedPhaseIds: { type: 'array', items: { type: 'string' } },
            x: { type: 'number' },
            y: { type: 'number' },
          },
        },
      },
      relationships: {
        type: 'array',
        items: {
          type: 'object',
          required: ['from', 'to', 'kind'],
          additionalProperties: false,
          properties: {
            from: { type: 'string', minLength: 1 },
            to: { type: 'string', minLength: 1 },
            kind: { type: 'string', enum: ['partnership', 'customer-supplier', 'conformist', 'anti-corruption-layer'] },
          },
        },
      },
      rationale: { type: 'string', minLength: 1 },
    },
  }
  return { prompt, schema }
}

const VALID_KINDS: ReadonlySet<ContextRelationshipKind> = new Set([
  'partnership', 'customer-supplier', 'conformist', 'anti-corruption-layer',
])

function stripFences(raw: string): string {
  const trimmed = raw.trim()
  const m = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i)
  return m ? m[1].trim() : trimmed
}

function asString(v: unknown, where: string, minLen = 0): string {
  if (typeof v !== 'string' || v.length < minLen) throw new Error(`DDD_ATOM parse: ${where}`)
  return v
}

/**
 * Parse JSON (optionally fenced) DDD response, validate against Σ/Γ/Ε,
 * and throw on schema mismatch. Idempotent on already-clean JSON.
 */
export function parseDDDResponse(raw: string): DDDAtomOutput {
  let parsed: unknown
  try { parsed = JSON.parse(stripFences(raw)) }
  catch (err) { throw new Error(`DDD_ATOM parse: invalid JSON (${(err as Error).message})`) }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('DDD_ATOM parse: expected object root')
  }
  const obj = parsed as Record<string, unknown>
  const rawContexts = obj.contexts
  const rawRels = obj.relationships
  if (!Array.isArray(rawContexts)) throw new Error('DDD_ATOM parse: contexts must be array')
  if (!Array.isArray(rawRels)) throw new Error('DDD_ATOM parse: relationships must be array')
  const rationale = asString(obj.rationale, 'rationale must be non-empty string', 1)
  if (rawContexts.length > MAX_CONTEXTS) {
    throw new Error(`DDD_ATOM parse: contexts exceeds Γ R1 cap of ${MAX_CONTEXTS}`)
  }

  const contexts: BoundedContext[] = rawContexts.map((c, i) => {
    if (!c || typeof c !== 'object') throw new Error(`DDD_ATOM parse: context[${i}] not object`)
    const r = c as Record<string, unknown>
    const id = asString(r.id, `context[${i}].id`, 1)
    const name = asString(r.name, `context[${i}].name`, 1)
    const responsibility = asString(r.responsibility, `context[${i}].responsibility (Γ R2)`, 1)
    const rp = r.relatedPhaseIds
    if (!Array.isArray(rp) || !rp.every((p) => typeof p === 'string')) {
      throw new Error(`DDD_ATOM parse: context[${i}].relatedPhaseIds`)
    }
    if (typeof r.x !== 'number' || typeof r.y !== 'number') {
      throw new Error(`DDD_ATOM parse: context[${i}].x|y must be number`)
    }
    return { id, name, responsibility, relatedPhaseIds: rp as string[], x: r.x, y: r.y }
  })

  const idSet = new Set<string>()
  for (const c of contexts) {
    if (idSet.has(c.id)) throw new Error(`DDD_ATOM parse: duplicate context.id "${c.id}" (Ε V3)`)
    idSet.add(c.id)
  }

  const relationships: ContextRelationship[] = rawRels.map((r, i) => {
    if (!r || typeof r !== 'object') throw new Error(`DDD_ATOM parse: relationship[${i}] not object`)
    const rec = r as Record<string, unknown>
    const from = asString(rec.from, `relationship[${i}].from`, 1)
    const to = asString(rec.to, `relationship[${i}].to`, 1)
    const kind = rec.kind
    if (typeof kind !== 'string' || !VALID_KINDS.has(kind as ContextRelationshipKind)) {
      throw new Error(`DDD_ATOM parse: relationship[${i}].kind invalid (Γ R4)`)
    }
    return { from, to, kind: kind as ContextRelationshipKind }
  })

  const seenPairs = new Set<string>()
  for (const r of relationships) {
    const key = `${r.from}::${r.to}`
    if (seenPairs.has(key)) throw new Error(`DDD_ATOM parse: duplicate relationship pair "${key}" (Γ R3)`)
    seenPairs.add(key)
  }

  return { contexts, relationships, rationale }
}

/**
 * Adapter: lifts a `DDDAtomOutput` into the renderer-shaped `DomainModel`
 * consumed by `DomainModelSVG`. Trivial mapping for v1; Tier-2 enriches.
 */
export function toDomainModel(output: DDDAtomOutput): DomainModel {
  return {
    contexts: output.contexts.map((c) => ({ ...c, relatedPhaseIds: [...c.relatedPhaseIds] })),
    relationships: output.relationships.map((r) => ({ ...r })),
  }
}
