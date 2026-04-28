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
  type ClassifiedIntent,
  type IntentVerb,
  type IntentTarget,
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

const TARGET_TYPE_RE = new RegExp(
  `\\b(${ALLOWED_TARGET_TYPES.join('|')})\\b`,
  'i',
)

const SCOPE_TOKEN_RE = /\/([a-z][a-z-]*?)(?:-(\d+))?\b/i

const ORDINAL_RE = /\b(?:(\d+)(?:st|nd|rd|th)?|first|second|third|fourth|fifth)\b/i
const ORDINAL_WORDS: Record<string, number> = {
  first: 1, second: 2, third: 3, fourth: 4, fifth: 5,
}

function inferTarget(text: string): IntentTarget | null {
  // 1. Existing scope token wins (/blog-2 etc)
  const scope = SCOPE_TOKEN_RE.exec(text)
  if (scope) {
    const type = scope[1].toLowerCase() as IntentTarget['type']
    if (!ALLOWED_TARGET_TYPES.includes(type)) return null
    const index = scope[2] ? parseInt(scope[2], 10) : null
    return { type, index }
  }
  // 2. Type word + optional ordinal
  const typeMatch = TARGET_TYPE_RE.exec(text)
  if (!typeMatch) return null
  const type = typeMatch[1].toLowerCase() as IntentTarget['type']
  const ordMatch = ORDINAL_RE.exec(text)
  let index: number | null = null
  if (ordMatch) {
    const digit = ordMatch[1] ? parseInt(ordMatch[1], 10) : ORDINAL_WORDS[ordMatch[0].toLowerCase()] ?? null
    if (digit !== null && digit >= 1) index = digit
  }
  return { type, index }
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
 */
export function classifyIntent(text: string): ClassifiedIntent {
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

  // 2) target inference
  const target = inferTarget(text)
  // No target lowers confidence (might be a generic command like "make it brighter")
  const targetPenalty = target ? 0 : 0.15

  // 3) params (verb-specific)
  const params = inferParams(verb, text)

  // 4) confidence: verb base × target presence × Σ schema validity
  // Σ verification (Ε V1+V2): we already enforced verb enum + target type enum
  const confidence = Math.max(0, Math.min(1, verbConfidence - targetPenalty))

  const rationale = `verb=${verb}(${verbConfidence.toFixed(2)}) target=${target ? `${target.type}-${target.index ?? 'first'}` : 'none'}${params ? ` params=${JSON.stringify(params)}` : ''}`

  return { verb, target, params, confidence, rationale }
}

export { AISP_CONFIDENCE_THRESHOLD }
