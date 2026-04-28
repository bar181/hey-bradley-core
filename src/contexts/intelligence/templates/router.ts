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
import type { TemplateMatchResult } from './types'

const CONFIDENCE_THRESHOLD = 0.8

/**
 * Try to match user text against any registered template.
 * Returns the first matching template + envelope + confidence, or null on miss.
 *
 * "First-match wins" is the trade-off — the registry is small (3 entries)
 * so order matters. Sprint C will introduce a scored selection (best-fit
 * across templates + AISP intent) instead of first-match.
 */
export function tryMatchTemplate(text: string): TemplateMatchResult | null {
  const config = useConfigStore.getState().config
  for (const tpl of TEMPLATE_REGISTRY) {
    const m = tpl.matchPattern.exec(text)
    if (!m) continue
    const confidence = tpl.confidence ?? 1.0
    if (confidence < CONFIDENCE_THRESHOLD) continue
    const envelope = tpl.envelope({ text, match: m, config })
    return { template: tpl, envelope, confidence }
  }
  return null
}

export { CONFIDENCE_THRESHOLD }
