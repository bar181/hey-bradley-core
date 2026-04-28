/**
 * P36 Sprint F P1 — Action preview for Listen Review Card.
 *
 * Pure-unit (no LLM): runs the rule-based INTENT_ATOM classifier on the
 * transcript and turns the structured intent into a plain-language preview
 * for the review card. Cheap (≤1ms); never fires on the LLM-paid path.
 *
 * Examples:
 *   "hide the hero"          → "Hide the hero section."
 *   "change headline to X"   → "Change the hero headline to 'X'."
 *   "make it brighter"       → "Brighten the page (theme)."
 *   <unrecognized>           → "Run the chat pipeline on this transcript."
 *
 * ADR-065.
 */
import { classifyIntent } from '@/contexts/intelligence/aisp/intentClassifier'
import type { ClassifiedIntent } from '@/contexts/intelligence/aisp/intentAtom'

export interface ActionPreview {
  /** Plain-English action description for the review card. */
  text: string
  /** Underlying classified intent (drives the confidence chip). */
  intent: ClassifiedIntent
}

const VERB_LABEL: Record<string, string> = {
  hide: 'Hide',
  show: 'Show',
  change: 'Change',
  remove: 'Remove',
  add: 'Add',
  reset: 'Reset',
}

export function buildActionPreview(transcript: string): ActionPreview {
  const intent = classifyIntent(transcript)
  if (intent.confidence < 0.5 || !intent.target) {
    return {
      text: 'Run the chat pipeline on this transcript.',
      intent,
    }
  }
  const verb = VERB_LABEL[intent.verb] ?? intent.verb
  const targetLabel = intent.target.index !== null
    ? `${intent.target.type} #${intent.target.index}`
    : `the ${intent.target.type}`
  const valueTail =
    typeof intent.params?.value === 'string'
      ? ` to "${intent.params.value}"`
      : ''
  const sectionWord =
    intent.target.type === 'hero' || intent.target.type === 'footer'
      ? '' // already specific enough
      : ' section'
  return {
    text: `${verb} ${targetLabel}${sectionWord}${valueTail}.`,
    intent,
  }
}
