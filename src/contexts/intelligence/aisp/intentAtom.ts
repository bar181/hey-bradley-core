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
    Target:{type:𝕊, index:ℕ?, pageId:𝕊?},
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
  'case-study', 'contact-form',
] as const

export type IntentTarget = {
  /** Section type per ALLOWED_TARGET_TYPES (Γ R3). */
  type: typeof ALLOWED_TARGET_TYPES[number]
  /** 1-based ordinal per Γ R2; null when user omitted (means "first match"). */
  index: number | null
  /**
   * P82 / OC-CLEANUP (A3) — page-aware target. When the user references a
   * specific page ("on page 2", "the contact page", "homepage"), this carries
   * the resolved page id so chatPipeline can override the active-page scope.
   * Absent (undefined) → caller falls back to activePageId (P79 behavior).
   * Verifier R3 allows this field; it is OPTIONAL and never a Γ R3 enum.
   */
  pageId?: string
}

// ---------------------------------------------------------------------------
// P82 / OC-CLEANUP (A3) — Page-reference detection helpers (pure).
// ---------------------------------------------------------------------------

/** Minimal page shape the resolver consumes. Mirrors PageConfig (id+title+isHome). */
export interface PageRef {
  id: string
  title: string
  isHome?: boolean
}

/**
 * Detect "page N" / "page X" / "the X page" / "homepage" / "<title> page" in
 * free-form user text. Returns the resolved page id (null when no reference
 * detected OR when reference cannot be resolved against `pages`).
 *
 * Pure: no store reads, no side effects. When `pages` is empty/undefined OR
 * no page-reference regex hits, returns `null` and callers fall back to the
 * activePageId path (P79-byte-equivalent behavior).
 *
 * Patterns in priority order:
 *   1) "homepage" / "home page"          → first page (or page with isHome)
 *   2) "page N" / "page <ordinal>"       → 1-indexed positional
 *   3) "on page X" / "the X page"        → fuzzy title match (lowercase contains)
 *   4) "<title> page" / "X page"         → fuzzy title match (lowercase contains)
 */
export function resolvePageReference(
  text: string,
  pages?: ReadonlyArray<PageRef>,
): string | null {
  if (!pages || pages.length === 0) return null
  const lc = text.toLowerCase()

  // 1) homepage / home page → page with isHome OR first page
  if (/\b(?:home\s*page|homepage)\b/.test(lc)) {
    const home = pages.find((p) => p.isHome)
    return (home ?? pages[0]).id
  }

  // 2) "page N" (numeric) — 1-indexed
  const numMatch = /\bpage\s+(\d+)\b/.exec(lc)
  if (numMatch) {
    const n = parseInt(numMatch[1], 10)
    if (n >= 1 && n <= pages.length) return pages[n - 1].id
  }

  // 2b) "page <word-ordinal>"
  const wordMatch = /\bpage\s+(one|two|three|four|five|six|seven|eight|nine|ten)\b/.exec(lc)
  if (wordMatch) {
    const map: Record<string, number> = {
      one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    }
    const n = map[wordMatch[1]]
    if (n >= 1 && n <= pages.length) return pages[n - 1].id
  }

  // 3) "the X page" / "on the X page" / "X page" — fuzzy title match
  // Captures one-or-two-word titles preceding " page" (e.g. "contact page",
  // "about us page"). Bounded to 1-3 words to avoid greedy capture.
  const titleMatch = /\b(?:the\s+|on\s+(?:the\s+)?)?([a-z][a-z\s-]{1,30}?)\s+page\b/.exec(lc)
  if (titleMatch) {
    const phrase = titleMatch[1].trim()
    // direct fuzzy contains: lowercase title contains phrase OR vice versa
    const hit = pages.find((p) => {
      const pt = p.title.toLowerCase()
      return pt === phrase || pt.includes(phrase) || phrase.includes(pt)
    })
    if (hit) return hit.id
  }

  return null
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
