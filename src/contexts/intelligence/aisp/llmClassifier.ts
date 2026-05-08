/**
 * P27 Sprint C P2 — LLM-driven AISP intent classification.
 *
 * Sends INTENT_ATOM to the LLM as system prompt; user input as user prompt.
 * Parses LLM JSON response through Zod (intent.ts schema) and returns a
 * ClassifiedIntent. Falls back gracefully on parse failure or cost-cap.
 *
 * Thesis demonstration ADR-056: LLMs understand AISP natively. The Crystal
 * Atom is sent verbatim — no prose translation, no English wrapper. The
 * LLM extracts {verb, target, params, confidence} from messy English input
 * because the AISP atom defines the output contract precisely (Σ schema +
 * Γ rules + Ε verification).
 *
 * Cost discipline: only fires when rule-based AISP confidence < threshold
 * AND cap budget allows. Uses cheapest model per provider (Haiku / Flash).
 */

import { useIntelligenceStore } from '@/store/intelligenceStore'
import { llmIntentResponseSchema } from '@/lib/schemas/intent'
import { INTENT_ATOM, AISP_CONFIDENCE_THRESHOLD, type ClassifiedIntent } from './intentAtom'

const SYSTEM_PROMPT_PREFIX = `You are an AISP-native intent classifier for the Hey Bradley site builder.

Below is the canonical Crystal Atom that defines your output contract:

${INTENT_ATOM}

Your job: read the user's input and return a JSON object matching this exact shape:
{
  "verb": "hide" | "show" | "change" | "remove" | "add" | "reset",
  "target": { "type": <one of allowed types>, "index": <1-based int or null> } | null,
  "params": { ...verb-specific } | undefined,
  "confidence": <number in [0,1]>,
  "rationale": "<short trace>"
}

Respond with ONLY the JSON object. No prose. No markdown fences.`

/**
 * Drive the LLM through INTENT_ATOM. Returns null on cap-exceeded or parse failure.
 */
export async function llmClassifyIntent(text: string): Promise<ClassifiedIntent | null> {
  const store = useIntelligenceStore.getState()
  const adapter = store.adapter
  if (!adapter) return null
  // Cost-cap pre-check (cheap-model assumption; conservative skip if near cap)
  if (store.sessionUsd >= store.capUsd * 0.9) return null

  try {
    const res = await adapter.complete({
      systemPrompt: SYSTEM_PROMPT_PREFIX,
      userPrompt: text,
    })
    if (!res.ok) return null
    // adapter response.json may already be parsed; coerce defensively
    const raw = typeof res.json === 'string' ? safeParseJson(res.json) : res.json
    if (!raw) return null
    const parsed = llmIntentResponseSchema.safeParse(raw)
    if (!parsed.success) return null
    // Record usage so cost-cap math reflects the LLM AISP call
    store.recordUsage(res.tokens.in, res.tokens.out, res.cost_usd)
    const classified: ClassifiedIntent = {
      verb: parsed.data.verb,
      target: parsed.data.target,
      params: parsed.data.params,
      confidence: parsed.data.confidence,
      rationale: parsed.data.rationale ?? `LLM AISP: verb=${parsed.data.verb} target=${parsed.data.target?.type ?? 'none'}`,
    }
    return classified.confidence >= AISP_CONFIDENCE_THRESHOLD ? classified : null
  } catch {
    // Network / SDK failure → graceful null; caller falls through to rule-based
    return null
  }
}

function safeParseJson(s: string): unknown {
  try {
    // strip markdown fences if any
    const cleaned = s.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim()
    return JSON.parse(cleaned)
  } catch {
    return null
  }
}
