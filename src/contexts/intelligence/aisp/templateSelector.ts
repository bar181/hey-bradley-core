/**
 * P28 Sprint C P3 — A3: Template Selector (Step 1 of 2-step pipeline).
 *
 * First LLM call in the AISP-driven 2-step pipeline. Given the user's input
 * + classified intent, the LLM picks the best-fit Template ID from the
 * registry. AISP-scoped: the system prompt embeds a Σ-restricted Crystal
 * Atom that constrains output to template IDs only (no free-form patches).
 *
 * Falls back gracefully:
 *   - cost-cap exceeded → returns null
 *   - LLM response invalid → returns null
 *   - confidence < threshold → returns null
 *
 * ADR-057 (2-step AISP Template Selection).
 */
import { z } from 'zod'
import { useIntelligenceStore } from '@/store/intelligenceStore'
import { TEMPLATE_REGISTRY } from '@/contexts/intelligence/templates'
import type { ClassifiedIntent } from './intentAtom'

// Σ-restricted Crystal Atom for Step 1: output is JUST a template ID.
const SELECTION_ATOM = `⟦
  Ω := { Pick best-fit template ID for user intent }
  Σ := {
    Selection:{templateId:𝕊, confidence:ℝ[0,1], rationale:𝕊}
  }
  Γ := {
    R1: templateId ∈ enumerated_template_ids,
    R2: confidence ∈ [0,1],
    R3: rationale ≤ 200 chars
  }
  Λ := { confidence_threshold := 0.7 }
  Ε := {
    V1: VERIFY templateId ∈ Γ.R1.list,
    V2: VERIFY confidence ∈ [0,1]
  }
⟧`

const STEP1_THRESHOLD = 0.7

export interface TemplateSelection {
  templateId: string
  confidence: number
  rationale: string
}

const selectionSchema = z.object({
  templateId: z.string(),
  confidence: z.number().min(0).max(1),
  rationale: z.string().max(500).optional(),
})

function buildSystemPrompt(): string {
  const ids = TEMPLATE_REGISTRY.map((t) => `"${t.id}"`).join(', ')
  return `${SELECTION_ATOM}

Available template IDs: [${ids}]

Templates:
${TEMPLATE_REGISTRY.map((t) => `- ${t.id}: ${t.description}`).join('\n')}

Respond with ONLY a JSON object:
{ "templateId": <one of available>, "confidence": <number in [0,1]>, "rationale": "<short>" }
No prose. No markdown fences.`
}

/**
 * Select the best-fit template via LLM call. Returns null on any failure
 * (cap, parse, threshold) so caller falls through to the existing rule-based
 * path (P26 classifyIntent + P25 translateIntent + P23 tryMatchTemplate).
 */
export async function selectTemplate(
  userText: string,
  intent: ClassifiedIntent | null,
): Promise<TemplateSelection | null> {
  const store = useIntelligenceStore.getState()
  const adapter = store.adapter
  if (!adapter) return null
  // Step 1 + Step 2 will both spend; reserve generous headroom (skip if ≥75%)
  if (store.sessionUsd >= store.capUsd * 0.75) return null

  const intentLine = intent
    ? `Classified intent: verb=${intent.verb} target=${intent.target?.type ?? 'none'}-${intent.target?.index ?? 'first'}`
    : 'No prior intent classification'

  try {
    const res = await adapter.complete({
      systemPrompt: buildSystemPrompt(),
      userPrompt: `${intentLine}\n\nUser input: ${userText}`,
    })
    if (!res.ok) return null
    const raw = typeof res.json === 'string' ? safeParse(res.json) : res.json
    if (!raw) return null
    const parsed = selectionSchema.safeParse(raw)
    if (!parsed.success) return null

    // Verify Γ R1: templateId must be in the registry
    const valid = TEMPLATE_REGISTRY.some((t) => t.id === parsed.data.templateId)
    if (!valid) return null
    if (parsed.data.confidence < STEP1_THRESHOLD) return null

    store.recordUsage(res.tokens.in, res.tokens.out, res.cost_usd)
    return {
      templateId: parsed.data.templateId,
      confidence: parsed.data.confidence,
      rationale: parsed.data.rationale ?? `LLM picked ${parsed.data.templateId}`,
    }
  } catch {
    return null
  }
}

function safeParse(s: string): unknown {
  try {
    const cleaned = s.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim()
    return JSON.parse(cleaned)
  } catch {
    return null
  }
}

export { STEP1_THRESHOLD }
