/**
 * P35 Sprint E P2 — LLM-driven Assumptions generator.
 *
 * Sends ASSUMPTIONS_ATOM verbatim to the active LLM adapter, validates the
 * response against ATOM Σ + Γ rules, and returns ranked assumptions. Falls
 * back to the P34 rule-based generator on:
 *   - cost-cap exceeded (Λ reserve threshold)
 *   - LLM error (network, rate_limit, invalid_response, timeout)
 *   - Σ/Γ validation failure (output doesn't match the atom contract)
 *   - any thrown exception
 *
 * The rule-based fallback (assumptions.ts) is the safety floor — assumptions
 * always have a path to the user, even with no key configured.
 *
 * ADR-064.
 */

import { useIntelligenceStore } from '@/store/intelligenceStore'
import { auditedComplete } from '@/contexts/intelligence/llm/auditedComplete'
import {
  ASSUMPTIONS_ATOM,
  ASSUMPTIONS_COST_CAP_RESERVE,
  ASSUMPTIONS_MAX_OPTIONS,
  validateAssumptionsAtomOutput,
  type AssumptionAtomItem,
} from './assumptionsAtom'
import {
  generateAssumptions as generateAssumptionsRuleBased,
  type Assumption,
  type AssumptionRequest,
} from './assumptions'
import { ALLOWED_TARGET_TYPES } from './intentAtom'

export interface LLMAssumptionsResult {
  /** The ranked assumptions (≤3 per Γ R1). */
  assumptions: Assumption[]
  /** Which path produced them — for the EXPERT debug pane. */
  source: 'llm' | 'rules' | 'empty'
  /** Optional rationale / failure reason for transparency. */
  trace?: string
}

const SYSTEM_PROMPT = [
  ASSUMPTIONS_ATOM,
  '',
  'Return ONLY a JSON object: {"items":[{...},...]} where each item has:',
  '  id          — kebab-case identifier (a-z0-9-) ≤ 64 chars',
  '  label       — human-readable button text ≤ 200 chars',
  '  rephrasing  — canonical command text the pipeline can re-run, ≤ 100 chars',
  '  confidence  — number in [0,1], descending across the list',
  '  rationale   — optional short reason ≤ 500 chars',
  '',
  'Rules:',
  '  • Up to 3 items. Empty array allowed.',
  `  • rephrasing MUST start with one of these verbs: hide, show, change, add, reset, remove`,
  `  • rephrasing MUST reference one of these section types: ${ALLOWED_TARGET_TYPES.join(', ')}`,
  '  • Output JSON only. No markdown, no commentary, no code fences.',
].join('\n')

/**
 * Convert a validated atom item into the ChatInput-shape Assumption.
 * (Same shape as the P34 rule-based generator returns.)
 */
function toAssumption(item: AssumptionAtomItem): Assumption {
  return {
    id: item.id,
    label: item.label,
    confidence: item.confidence,
    rephrasing: item.rephrasing,
    rationale: item.rationale,
  }
}

function ruleFallback(
  req: AssumptionRequest,
  trace: string,
): LLMAssumptionsResult {
  const r = generateAssumptionsRuleBased(req)
  return {
    assumptions: r.slice(0, ASSUMPTIONS_MAX_OPTIONS),
    source: r.length > 0 ? 'rules' : 'empty',
    trace,
  }
}

/**
 * Generate assumptions via the LLM, falling back to the rule-based stub
 * (P34 / ADR-063) on any failure. Always returns a result; never throws.
 */
export async function generateAssumptionsLLM(
  req: AssumptionRequest,
): Promise<LLMAssumptionsResult> {
  if (!req.text || !req.text.trim()) {
    return { assumptions: [], source: 'empty', trace: 'empty input' }
  }

  const store = useIntelligenceStore.getState()
  const adapter = store.adapter
  if (!adapter) {
    return ruleFallback(req, 'no adapter — using rule-based fallback')
  }

  // Cost-cap reserve check (Λ): if we're already past the per-atom reserve,
  // don't burn tokens on a low-confidence side-call. Fall back to rules.
  // Note: per-call cost is also enforced inside auditedComplete; this is the
  // earlier soft-gate for the assumptions stage specifically.
  const cap = store.capUsd ?? 0
  const sessionUsd = store.sessionUsd ?? 0
  if (cap > 0 && sessionUsd >= cap * ASSUMPTIONS_COST_CAP_RESERVE) {
    return ruleFallback(req, 'cost-cap reserve hit — using rule-based fallback')
  }

  const userPrompt = JSON.stringify({
    user_text: req.text,
    intent: req.intent
      ? {
          verb: req.intent.verb,
          target: req.intent.target,
          confidence: req.intent.confidence,
        }
      : null,
  })

  let res
  try {
    res = await auditedComplete(
      adapter,
      { systemPrompt: SYSTEM_PROMPT, userPrompt },
      { source: 'chat' },
    )
  } catch (e) {
    const detail = e instanceof Error ? e.message : String(e)
    return ruleFallback(req, `LLM threw — fallback (${detail})`)
  }

  if (!res.ok) {
    return ruleFallback(req, `LLM error: ${res.error.kind}`)
  }

  const validated = validateAssumptionsAtomOutput(res.json)
  if (!validated) {
    return ruleFallback(req, 'LLM output failed ATOM Σ/Γ validation')
  }

  // Atom validation already enforced ≤3 items + descending confidence.
  return {
    assumptions: validated.map(toAssumption),
    source: 'llm',
    trace: `LLM produced ${validated.length} assumption(s) within ATOM contract`,
  }
}
