/**
 * P34 Sprint E P1 — Assumptions Engine (Wave 2 A3).
 *
 * When INTENT_ATOM confidence < 0.7 OR target is null, the assumptions
 * engine generates a small ranked list of plausible interpretations so the
 * user can confirm one before patches apply. This is the "Sean from Good
 * Will Hunting" pattern — Bradley says "I think you mean X, Y, or Z. Which
 * is it?" instead of guessing silently.
 *
 * Output shape is purpose-built for the 3-button clarification UX (A4):
 * up to 3 ranked options + a free-text "something else" escape hatch.
 *
 * ADR-063.
 */
import {
  ALLOWED_TARGET_TYPES,
  type ClassifiedIntent,
  type IntentVerb,
} from './intentAtom'

/** Triggers an assumptions cycle when met. KISS: literal threshold. */
export const ASSUMPTIONS_TRIGGER_THRESHOLD = 0.7

export interface Assumption {
  /** Stable id for round-trip persistence (project context) + UI keys. */
  id: string
  /** Human-readable assumption shown on the button. */
  label: string
  /** Confidence in [0,1] — drives ordering + the "I assumed Y (confidence 85%)" copy. */
  confidence: number
  /**
   * Canonical text the pipeline will re-run on if the user accepts this
   * assumption. Should be a phrasing template router accepts.
   */
  rephrasing: string
  /** Optional short rationale for the panel. */
  rationale?: string
}

export interface AssumptionRequest {
  /** Original user text. */
  text: string
  /** The (low-confidence) classified intent. May be null when classifier didn't lock. */
  intent: ClassifiedIntent | null
}

/** Verb cue word table. Mirrors INTENT_ATOM verb enum. */
const VERB_CUES: Record<IntentVerb, readonly string[]> = {
  hide: ['hide', 'remove', 'delete', 'drop'],
  show: ['show', 'reveal', 'display', 'enable'],
  change: ['change', 'set', 'update', 'rewrite', 'edit'],
  remove: ['remove', 'delete'],
  add: ['add', 'insert', 'create', 'new'],
  reset: ['reset', 'undo', 'restore'],
}

/** Section types to score against based on cue words in the user text. */
const SECTION_CUES: Record<string, readonly string[]> = {
  hero: ['hero', 'banner', 'top', 'headline', 'header'],
  blog: ['blog', 'article', 'post', 'news'],
  footer: ['footer', 'bottom'],
  features: ['feature', 'capability'],
  pricing: ['pricing', 'price', 'plan', 'tier'],
  cta: ['cta', 'call to action', 'button'],
  testimonials: ['testimonial', 'quote', 'review'],
  faq: ['faq', 'question', 'q&a'],
  team: ['team', 'about us', 'people'],
}

function inferVerb(textLower: string): IntentVerb {
  for (const verb of Object.keys(VERB_CUES) as IntentVerb[]) {
    if (VERB_CUES[verb].some((c) => textLower.includes(c))) return verb
  }
  return 'change'
}

function scoreSection(textLower: string, type: string): number {
  const cues = SECTION_CUES[type] ?? [type]
  let hits = 0
  for (const cue of cues) {
    if (textLower.includes(cue)) hits += 1
  }
  return hits
}

/**
 * Generate up to 3 ranked assumptions for a low-confidence request.
 * Returns empty array when nothing plausible can be inferred (caller falls
 * back to the existing FALLBACK_HINT).
 */
export function generateAssumptions(req: AssumptionRequest): Assumption[] {
  if (!req.text || !req.text.trim()) return []
  const lower = req.text.toLowerCase()
  const verb = req.intent?.verb ?? inferVerb(lower)

  // Score every allowed section type against the user text.
  const scored = ALLOWED_TARGET_TYPES.map((type) => ({
    type,
    hits: scoreSection(lower, type),
  })).filter((s) => s.hits > 0)

  // No section cues → return a single low-confidence "did you mean to brighten/edit X?"
  if (scored.length === 0) {
    return []
  }

  // Sort by hit count (descending), then stable by enum order (preserved by sort).
  scored.sort((a, b) => b.hits - a.hits)
  const top = scored.slice(0, 3)

  // Rank confidence by hit count + position. Top 3 → 0.85 / 0.75 / 0.65.
  const confidences = [0.85, 0.75, 0.65]

  return top.map((s, i) => {
    const verbWord = verb === 'remove' ? 'hide' : verb
    const rephrasing = `${verbWord} the ${s.type}`
    return {
      id: `assumption-${verb}-${s.type}`,
      label: `${verbWord} the ${s.type} section`,
      confidence: confidences[i] ?? 0.6,
      rephrasing,
      rationale: `${s.hits} cue word(s) for "${s.type}" detected in your message.`,
    }
  })
}

/** True when the request's intent confidence merits a clarification cycle. */
export function shouldRequestAssumptions(intent: ClassifiedIntent | null): boolean {
  if (!intent) return true
  if (intent.confidence < ASSUMPTIONS_TRIGGER_THRESHOLD) return true
  if (!intent.target) return true
  return false
}
