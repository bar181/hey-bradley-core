/**
 * P48 Sprint I Wave 2 (A5) — Improvement Suggester.
 *
 * After a successful patch lands (`appliedPatchCount > 0`), surface 1-3
 * actionable next-step suggestions to nudge the user toward a more complete
 * site. Pure-rule heuristic table; NO LLM call by default. Σ-restriction
 * discipline — KISS, $0, deterministic, idempotent.
 *
 * Heuristics scan the current section-type set + the just-classified intent
 * and pick at most 3 suggestions in a stable rule order. Each suggestion is
 * prefixed with a brief Grandma-friendly affirmation chosen deterministically
 * from the summary's first character (no randomness).
 *
 * Decisions:
 *   - rule-based table only (P48); AgentProxy lift is a Wave 3+ option
 *   - max 3 suggestions (cognitive load)
 *   - deterministic prefix selection so identical inputs → identical output
 *   - rationale is optional — used by EXPERT trace pane if it ever wants it
 */

export interface ImprovementSuggestion {
  text: string
  rationale?: string
}

export interface SuggesterInput {
  userText: string
  appliedPatchCount: number
  summary: string
  sectionTypesPresent: readonly string[]
  /** From aisp.intent.verb when AISP locked. */
  verb?: string
  /** From aisp.intent.target.type when AISP locked. */
  targetType?: string
}

const AFFIRMATIONS = ['Looks great — ', 'Nice — ', 'On its way — '] as const
const MAX_SUGGESTIONS = 3

/**
 * Pick a stable affirmation prefix based on the first char of `summary`.
 * Falls back to AFFIRMATIONS[0] when summary is empty.
 */
function pickPrefix(summary: string): string {
  if (!summary) return AFFIRMATIONS[0]
  const code = summary.charCodeAt(0)
  return AFFIRMATIONS[code % AFFIRMATIONS.length]
}

/**
 * Pure-rule improvement heuristics. Returns AT MOST 3 suggestions in a
 * stable rule-priority order. Designed to be safe to call from any
 * pipeline path; never throws on partial input.
 */
export function suggestImprovements(
  input: SuggesterInput,
): readonly ImprovementSuggestion[] {
  if (input.appliedPatchCount <= 0) return []

  const types = new Set(input.sectionTypesPresent)
  const has = (t: string): boolean => types.has(t)
  const prefix = pickPrefix(input.summary)
  const out: ImprovementSuggestion[] = []

  // Rule 1: hero without social proof
  if (has('hero') && !has('testimonials') && !has('quotes')) {
    out.push({
      text: `${prefix}add social proof — testimonials build trust right after the hero pitch.`,
      rationale: 'hero-without-social-proof',
    })
  }

  // Rule 2: pricing without CTA
  if (has('pricing') && !has('cta') && !has('action')) {
    out.push({
      text: `${prefix}add a CTA section — pricing pages convert better with a clear next step.`,
      rationale: 'pricing-without-cta',
    })
  }

  // Rule 3: footer + thin site
  if (has('footer') && input.sectionTypesPresent.length < 4) {
    out.push({
      text: `${prefix}your site feels light — try adding a Features or About section.`,
      rationale: 'thin-site-with-footer',
    })
  }

  // Rule 4: hero edit follow-up nudge
  if (input.verb === 'change' && input.targetType === 'hero') {
    out.push({
      text: `${prefix}want me to refresh the subheading to match? Just ask.`,
      rationale: 'hero-change-follow-up',
    })
  }

  // Rule 5: duplicate image surfaces
  if (has('gallery') && has('image')) {
    out.push({
      text: `${prefix}two image sections — consider keeping the strongest one.`,
      rationale: 'gallery-and-image-redundant',
    })
  }

  return out.slice(0, MAX_SUGGESTIONS)
}
