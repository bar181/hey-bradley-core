/**
 * P26 Sprint C Phase 1 — AISP Crystal Atom for Intent Classification.
 *
 * Per `bar181/aisp-open-core ai_guide`. The Crystal Atom is the canonical
 * AISP shape: Ω (Objective) Σ (Structure) Γ (Grounding) Λ (Logistics)
 * Ε (Evaluation). This atom applies AISP's <2% ambiguity discipline to
 * user-input intent classification.
 *
 * Distinct from `prompts/system.ts` Crystal Atom which governs JSON-patch
 * GENERATION. This atom governs intent CLASSIFICATION — a smaller, simpler
 * grammar mapping user words to a typed Intent shape.
 *
 * ADR-053 (AISP Intent Classifier).
 */

/** The Crystal Atom for intent classification (verbatim AISP). */
export const INTENT_ATOM = `⟦
  Ω := { Classify user input into typed Intent for template router }
  Σ := {
    Intent:{verb:Verb, target:Target?, params:𝕊?},
    Verb:{op∈{hide,show,change,remove,add,reset}},
    Target:{type:𝕊, index:ℕ?},
    𝕊 := UTF-8 string ≤ 200 chars
  }
  Γ := {
    R1: ∀ Intent : Verb is one of the enumerated 6 ops,
    R2: target.index ∈ ℕ ⇒ index ≥ 1 (1-based user-facing),
    R3: target.type ∈ {hero, blog, footer, features, pricing, cta, testimonials, faq, value-props, gallery, image, team, columns, action, quotes, questions, numbers, divider, text, logos, menu},
    R4: params is verb-specific; only when verb ∈ {change, add}
  }
  Λ := {
    confidence_threshold := 0.85,
    cost_cap_reserve := 0.85,
    fallback := translateIntent (P25 rule-based) → tryMatchTemplate (P23/P24),
    project_context ?: {                              ⟵ P45 (A5 / ADR-068)
      present:𝔹,
      project_type ∈ { 'saas-app','landing-page','static-site','portfolio','unknown' }
    }
  }
  Ε := {
    V1: VERIFY Verb ∈ Σ.Verb.op,
    V2: VERIFY target.type ∈ Σ.Target allowed enum (R3),
    V3: VERIFY confidence ∈ [0,1]
  }
⟧`

/** TypeScript reflection of the atom for runtime use. */
export type IntentVerb = 'hide' | 'show' | 'change' | 'remove' | 'add' | 'reset'

/** Allowed target.type per Γ R3. Mirrors Hey Bradley section types. */
export const ALLOWED_TARGET_TYPES = [
  'hero', 'blog', 'footer', 'features', 'pricing', 'cta',
  'testimonials', 'faq', 'value-props', 'gallery', 'image',
  'team', 'columns', 'action', 'quotes', 'questions', 'numbers',
  'divider', 'text', 'logos', 'menu',
] as const

export type IntentTarget = {
  /** Section type per ALLOWED_TARGET_TYPES (Γ R3). */
  type: typeof ALLOWED_TARGET_TYPES[number]
  /** 1-based ordinal per Γ R2; null when user omitted (means "first match"). */
  index: number | null
}

export interface ClassifiedIntent {
  verb: IntentVerb
  target: IntentTarget | null
  /** verb-specific params; only set when verb ∈ {change, add}. */
  params?: Record<string, unknown>
  /** Confidence score in [0,1]. ≥0.85 = AISP win; <0.85 = fall through. */
  confidence: number
  /** Human-readable trace for transparency. */
  rationale: string
}

/** Sprint C confidence threshold per Λ. */
export const AISP_CONFIDENCE_THRESHOLD = 0.85

/**
 * P45 Sprint H Wave 2 (A5) — Project type values surfaced through Λ.project_context.
 * 'unknown' is the safe default and triggers byte-identical P44 behavior in
 * `classifyIntent`. ADR-068 (A6 owns).
 */
export const PROJECT_TYPES = [
  'saas-app',
  'landing-page',
  'static-site',
  'portfolio',
  'unknown',
] as const

export type ProjectType = typeof PROJECT_TYPES[number]

/**
 * P45 (A5) — Bias table: per-projectType preferred target.type ranking used
 * when the rule-based classifier is otherwise ambiguous. The values here are
 * a SUBSET of `ALLOWED_TARGET_TYPES` (Γ R3); we never invent a new target
 * enum, we only re-order candidates the existing classifier would already
 * allow.
 *
 * 'unknown' is intentionally empty — when projectType is null/'unknown' the
 * classifier MUST behave byte-identically to P44.
 */
export const PROJECT_TYPE_TARGET_BIAS: Record<ProjectType, ReadonlyArray<typeof ALLOWED_TARGET_TYPES[number]>> = {
  'saas-app':       ['pricing', 'cta', 'features', 'testimonials'],
  'landing-page':   ['hero', 'cta', 'features', 'value-props'],
  'static-site':    ['hero', 'blog', 'footer', 'text'],
  'portfolio':      ['hero', 'gallery', 'team', 'text'],
  'unknown':        [],
}
