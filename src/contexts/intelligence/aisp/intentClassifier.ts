/**
 * P26 Sprint C Phase 1 — AISP Intent Classifier.
 *
 * Maps user text → typed { verb, target, params, confidence } per the Crystal
 * Atom in intentAtom.ts. P26 ships a RULE-BASED implementation that conforms
 * to AISP grammar; P27 will add LLM-driven classification when rule-based
 * confidence is below threshold.
 *
 * Why rule-based at P26: $0 cost, deterministic, idempotent. Captures the
 * AISP shape contract without requiring an LLM call on every chat input.
 * The full thesis ("LLMs understand AISP natively") is demonstrated when
 * Sprint C P27 wires AISP atoms into the actual LLM system prompt.
 *
 * ADR-053 (AISP Intent Classifier).
 */

import {
  ALLOWED_TARGET_TYPES,
  AISP_CONFIDENCE_THRESHOLD,
  PROJECT_TYPE_TARGET_BIAS,
  type ClassifiedIntent,
  type IntentVerb,
  type IntentTarget,
  type ProjectType,
} from './intentAtom'

/** Verb vocabulary mapping (regex → canonical verb per Σ). */
const VERB_RULES: ReadonlyArray<[RegExp, IntentVerb, number]> = [
  // explicit verbs (high confidence)
  [/\b(?:hide|hides|hiding)\b/i, 'hide', 0.95],
  [/\b(?:show|shows|showing|reveal|reveals)\b/i, 'show', 0.95],
  [/\b(?:change|changes|changing|update|updates|set|sets)\b/i, 'change', 0.9],
  [/\b(?:remove|removes|removing|delete|deletes|drop|drops)\b/i, 'remove', 0.95],
  [/\b(?:add|adds|adding|insert|inserts)\b/i, 'add', 0.92],
  [/\b(?:reset|resets|restore|restores)\b/i, 'reset', 0.95],
  // synonyms (slightly lower confidence)
  [/\bget\s+rid\s+of\b/i, 'remove', 0.88],
  [/\btake\s+out\b/i, 'remove', 0.88],
  [/\bmake\s+(?:it|the)\b/i, 'change', 0.86],
]

const SCOPE_TOKEN_RE = /\/([a-z][a-z-]*?)(?:-(\d+))?\b/i

const ORDINAL_RE = /\b(?:(\d+)(?:st|nd|rd|th)?|first|second|third|fourth|fifth)\b/i
const ORDINAL_WORDS: Record<string, number> = {
  first: 1, second: 2, third: 3, fourth: 4, fifth: 5,
}

/**
 * P45 (A5) — Find every allowed target.type word the text mentions, in the
 * order they appear. Used by `inferTarget` so the project-type bias can
 * re-rank a multi-candidate text without ever introducing a target the
 * classifier wouldn't already allow. When `bias` is null/empty (the P44
 * default), the first hit wins — byte-identical to the prior behavior.
 */
function findAllTargetTypes(
  text: string,
): Array<typeof ALLOWED_TARGET_TYPES[number]> {
  const re = new RegExp(`\\b(${ALLOWED_TARGET_TYPES.join('|')})\\b`, 'gi')
  const hits: Array<typeof ALLOWED_TARGET_TYPES[number]> = []
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    hits.push(m[1].toLowerCase() as typeof ALLOWED_TARGET_TYPES[number])
  }
  return hits
}

function inferTarget(
  text: string,
  bias: ReadonlyArray<typeof ALLOWED_TARGET_TYPES[number]> | null = null,
): IntentTarget | null {
  // 1. Existing scope token wins (/blog-2 etc) — bias never overrides explicit scope
  const scope = SCOPE_TOKEN_RE.exec(text)
  if (scope) {
    const type = scope[1].toLowerCase() as IntentTarget['type']
    if (!ALLOWED_TARGET_TYPES.includes(type)) return null
    const index = scope[2] ? parseInt(scope[2], 10) : null
    return { type, index }
  }
  // 2. Type word + optional ordinal
  // P45 (A5): when a non-empty `bias` list is provided AND the text contains
  // multiple allowed target words, prefer the one earliest in `bias`. If only
  // one allowed type appears, behavior is identical to P44. If the text has
  // none, we return null (bias never invents a target).
  const allHits = findAllTargetTypes(text)
  if (allHits.length === 0) return null
  let chosen = allHits[0]
  if (bias && bias.length > 0 && allHits.length > 1) {
    const ranked = allHits
      .map((t) => ({ t, rank: bias.indexOf(t) }))
      .sort((a, b) => {
        const ar = a.rank === -1 ? Number.POSITIVE_INFINITY : a.rank
        const br = b.rank === -1 ? Number.POSITIVE_INFINITY : b.rank
        return ar - br
      })
    chosen = ranked[0].t
  }
  const ordMatch = ORDINAL_RE.exec(text)
  let index: number | null = null
  if (ordMatch) {
    const digit = ordMatch[1] ? parseInt(ordMatch[1], 10) : ORDINAL_WORDS[ordMatch[0].toLowerCase()] ?? null
    if (digit !== null && digit >= 1) index = digit
  }
  return { type: chosen, index }
}

function inferParams(verb: IntentVerb, text: string): Record<string, unknown> | undefined {
  if (verb !== 'change' && verb !== 'add') return undefined
  // Pattern: 'to "X"' or "to 'X'" or 'to X'
  const m = /\bto\s+["']?(.+?)["']?\s*[!.?]*$/.exec(text)
  if (!m) return undefined
  return { value: m[1].trim() }
}

/**
 * Classify intent per the AISP Crystal Atom.
 * Returns confidence-scored intent; consumers decide whether to act on it
 * (≥AISP_CONFIDENCE_THRESHOLD) or fall through to P25 rule-based translator.
 *
 * P45 Sprint H Wave 2 (A5) — accepts an OPTIONAL `projectType` from the
 * codebase-context manifest (Λ.project_context channel). When set to a
 * non-'unknown' value, the classifier biases ambiguous multi-candidate target
 * disambiguation toward the project type's typical sections (e.g. `saas-app`
 * favors pricing/cta/features/testimonials). When `projectType` is omitted,
 * null, or 'unknown', behavior is byte-identical to P44.
 */
export function classifyIntent(
  text: string,
  projectType?: ProjectType | null,
): ClassifiedIntent {
  // 1) verb match (first-rule-wins; rule order = preferred)
  let verb: IntentVerb | null = null
  let verbConfidence = 0
  for (const [re, v, c] of VERB_RULES) {
    if (re.test(text)) {
      verb = v
      verbConfidence = c
      break
    }
  }
  if (!verb) {
    return {
      verb: 'change', // safe default
      target: null,
      confidence: 0,
      rationale: 'no verb matched — fall through to rule-based translator',
    }
  }

  // 2) target inference (with optional project-type bias)
  // P45 (A5): bias is empty when projectType is null/'unknown', so the call
  // collapses to P44 first-hit-wins behavior.
  const bias =
    projectType && projectType !== 'unknown'
      ? PROJECT_TYPE_TARGET_BIAS[projectType]
      : null
  const target = inferTarget(text, bias)
  // No target lowers confidence (might be a generic command like "make it brighter")
  const targetPenalty = target ? 0 : 0.15

  // 3) params (verb-specific)
  const params = inferParams(verb, text)

  // 4) confidence: verb base × target presence × Σ schema validity
  // Σ verification (Ε V1+V2): we already enforced verb enum + target type enum
  const confidence = Math.max(0, Math.min(1, verbConfidence - targetPenalty))

  const ctxTrace = bias && bias.length > 0 ? ` ctx=${projectType}` : ''
  const rationale = `verb=${verb}(${verbConfidence.toFixed(2)}) target=${target ? `${target.type}-${target.index ?? 'first'}` : 'none'}${params ? ` params=${JSON.stringify(params)}` : ''}${ctxTrace}`

  return { verb, target, params, confidence, rationale }
}

export { AISP_CONFIDENCE_THRESHOLD }
