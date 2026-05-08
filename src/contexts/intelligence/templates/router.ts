/**
 * P23 Sprint B Phase 1 — Natural Language Router.
 *
 * Routes user input through templates BEFORE the LLM call. Confidence
 * threshold: ≥0.8 → template short-circuit; <0.8 → fall through to LLM.
 *
 * Today the regex-match-or-not yields a binary 1.0 / 0.0 confidence.
 * Sprint C P26 (AISP intent classifier) replaces this binary with a
 * real probabilistic score from the Crystal Atom intent layer.
 */

import { useConfigStore } from '@/store/configStore'
import { TEMPLATE_REGISTRY } from './registry'
import { parseSectionScope } from './scoping'
import type { TemplateMatchResult } from './types'

const CONFIDENCE_THRESHOLD = 0.8

/**
 * Try to match user text against any registered template.
 * Returns the first matching template + envelope + confidence, or null on miss.
 *
 * P24 — extracts `/type-N` scope token from text BEFORE matching template
 * regex (so 'hide /hero-1' matches the same regex as 'hide the hero').
 * Scope is passed through to the envelope context for templates that
 * honor index-targeting (hide-section + change-headline).
 *
 * "First-match wins" through TEMPLATE_REGISTRY (Sprint C P26 replaces with
 * scored selection).
 */
export function tryMatchTemplate(text: string): TemplateMatchResult | null {
  const config = useConfigStore.getState().config
  // P24: extract /type-N scope; pass cleaned text to template matchers
  const { scope, cleanText } = parseSectionScope(text)
  const matchTarget = cleanText || text
  for (const tpl of TEMPLATE_REGISTRY) {
    const m = tpl.matchPattern.exec(matchTarget)
    if (!m) continue
    const confidence = tpl.confidence ?? 1.0
    if (confidence < CONFIDENCE_THRESHOLD) continue
    const envelope = tpl.envelope({ text: matchTarget, match: m, config, scope })
    return { template: tpl, envelope, confidence }
  }
  return null
}

export { CONFIDENCE_THRESHOLD }
