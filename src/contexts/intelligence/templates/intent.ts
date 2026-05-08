/**
 * P25 Sprint B Phase 3 — Intent Translation (rule-based; pre-AISP).
 *
 * Rewrites messy user input into canonical text + scope token form BEFORE
 * the template router runs. Examples:
 *   "get rid of the second blog post"  → "hide /blog-2"
 *   "remove the footer"                → "hide /footer"
 *   "make the headline say Welcome"    → "change the headline to Welcome"
 *   "set /hero-1 text to Welcome"      → "change /hero-1 to Welcome"  (idempotent on canonical)
 *
 * This is a thin rule-based pre-processor. Sprint C P26 (AISP Crystal Atom
 * intent classifier) replaces this with a probabilistic AI-driven layer over
 * the same Template registry.
 *
 * ADR-052 (Intent Translator).
 */

export interface IntentTranslation {
  /** Rewritten text the template router sees. */
  canonicalText: string
  /** Was the input already canonical (no rewrites applied)? */
  unchanged: boolean
  /** Short human description of what was rewritten (for transparency UI). */
  rationale: string
}

// Verb synonyms — left-hand maps to canonical verb.
// Order matters: longest phrase first to prevent partial matches.
const VERB_REWRITES: ReadonlyArray<[RegExp, string]> = [
  // hide synonyms
  [/\bget\s+rid\s+of\b/gi, 'hide'],
  [/\btake\s+out\b/gi, 'hide'],
  [/\b(?:remove|delete|drop)\b/gi, 'hide'],
  // change synonyms
  [/\b(?:make|set)\s+the\s+headline\s+say\b/gi, 'change the headline to'],
  [/\b(?:set|update)\s+the\s+headline\s+to\b/gi, 'change the headline to'],
  [/\b(?:set|update)\b/gi, 'change'],
]

// Ordinal words → digit. "second blog post" → "blog-2"
const ORDINALS: ReadonlyArray<[RegExp, number]> = [
  [/\b(?:1st|first)\b/gi, 1],
  [/\b(?:2nd|second)\b/gi, 2],
  [/\b(?:3rd|third)\b/gi, 3],
  [/\b(?:4th|fourth)\b/gi, 4],
  [/\b(?:5th|fifth)\b/gi, 5],
]

// Section type aliases — "blog post" → "blog"; "page footer" → "footer"
const TYPE_NORMALIZE: ReadonlyArray<[RegExp, string]> = [
  [/\bblog\s+(?:post|article|entry)\b/gi, 'blog'],
  [/\bpage\s+footer\b/gi, 'footer'],
  [/\bhero\s+(?:section|block|banner)\b/gi, 'hero'],
]

/**
 * Translate one chat input into its canonical form.
 *
 * Strategy:
 *   1. Verb rewrites (idempotent on canonical input)
 *   2. Type normalization
 *   3. Ordinal-to-scope-token: detect "second blog" → emit "/blog-2"
 *   4. Collapse double whitespace
 *
 * Idempotent: applying twice yields the same output.
 */
export function translateIntent(input: string): IntentTranslation {
  const original = input
  let text = input

  // 1) verb rewrites
  for (const [re, canonical] of VERB_REWRITES) {
    text = text.replace(re, canonical)
  }

  // 2) type normalization
  for (const [re, canonical] of TYPE_NORMALIZE) {
    text = text.replace(re, canonical)
  }

  // 3) "Nth <type>" → "/type-N" scope token
  // Only apply when there's no existing scope token
  if (!/\/[a-z][a-z-]*?(?:-\d+)?\b/i.test(text)) {
    for (const [re, n] of ORDINALS) {
      // matches "second blog" / "the second blog" — capture the type word
      const ordinalTypeRe = new RegExp(
        `(?:the\\s+)?${re.source}\\s+([a-z][a-z-]*)`,
        'gi',
      )
      text = text.replace(ordinalTypeRe, (_full, type: string) => `/${type.toLowerCase()}-${n}`)
    }
  }

  // 4) collapse whitespace
  text = text.replace(/\s{2,}/g, ' ').trim()

  const unchanged = text === original.trim()
  const rationale = unchanged
    ? 'no rewrite (input already canonical)'
    : `"${original.trim()}" → "${text}"`

  return { canonicalText: text, unchanged, rationale }
}
