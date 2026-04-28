/**
 * P31 Sprint D Phase 3 — AISP Crystal Atom for Content Generation.
 *
 * Per `bar181/aisp-open-core ai_guide`. The Crystal Atom is the canonical
 * AISP shape: Ω (Objective) Σ (Structure) Γ (Grounding) Λ (Logistics)
 * Ε (Evaluation).
 *
 * Distinct from INTENT_ATOM (P26 / ADR-053; intent classification) and
 * SELECTION_ATOM (P28 / ADR-057; template selection). CONTENT_ATOM
 * governs LLM CONTENT GENERATION when a generator template is active —
 * Σ is intentionally narrow (`text`, `tone`, `length`) so the LLM cannot
 * produce JSON patches, schema drift, or unbounded prose.
 *
 * Sprint C's three Crystal Atoms (system prompt / INTENT / SELECTION) plus
 * P31's CONTENT_ATOM gives a 4-atom AISP architecture spanning the full
 * chat pipeline:
 *   1. INTENT_ATOM       — what the user wants (verb + target)
 *   2. SELECTION_ATOM    — which template handles it (id + confidence)
 *   3. CONTENT_ATOM      — generate text fields when kind='generator'
 *   4. PATCH_ATOM (P18)  — final JSON patches when kind='patcher'
 *
 * ADR-060.
 */

/** The Crystal Atom for content generation (verbatim AISP). */
export const CONTENT_ATOM = `⟦
  Ω := { Generate constrained content text for a generator template field }
  Σ := {
    Content:{text:𝕊, tone:Tone, length:Length},
    Tone:{value∈{neutral,playful,authoritative,warm,bold}},
    Length:{value∈{short,medium,long}, max_chars∈{60,160,400}},
    𝕊 := UTF-8 string ≤ 400 chars
  }
  Γ := {
    R1: ∀ Content.text : length(text) ≤ Σ.Length.max_chars[Σ.Length.value],
    R2: tone ∈ Σ.Tone.value,
    R3: text MUST NOT contain JSON, code blocks, markdown headings, URLs,
        @mentions, or hashtags (content is rendered as plain copy),
    R4: text MUST be a single paragraph (no \\n\\n separators)
  }
  Λ := {
    confidence_threshold := 0.7,
    cost_cap_reserve := 0.85,
    default_tone := 'neutral',
    default_length := 'short'
  }
  Ε := {
    V1: VERIFY length(text) ≤ max_chars(length),
    V2: VERIFY tone ∈ Σ.Tone.value,
    V3: VERIFY text passes Γ R3 forbidden-content scan,
    V4: VERIFY confidence ∈ [0,1]
  }
⟧`

/** TypeScript reflection of the atom for runtime use. */
export type ContentTone = 'neutral' | 'playful' | 'authoritative' | 'warm' | 'bold'
export type ContentLength = 'short' | 'medium' | 'long'

export const ALLOWED_TONES: readonly ContentTone[] = [
  'neutral',
  'playful',
  'authoritative',
  'warm',
  'bold',
] as const

export const ALLOWED_LENGTHS: readonly ContentLength[] = [
  'short',
  'medium',
  'long',
] as const

/** Per Σ.Length.max_chars — Γ R1 enforcement bound. */
export const LENGTH_MAX_CHARS: Record<ContentLength, number> = {
  short: 60,
  medium: 160,
  long: 400,
}

export interface GeneratedContent {
  text: string
  tone: ContentTone
  length: ContentLength
  /** Confidence score in [0,1]. ≥0.7 = win; <0.7 = caller falls back. */
  confidence: number
  /** Human-readable trace for transparency. */
  rationale: string
}

export const CONTENT_CONFIDENCE_THRESHOLD = 0.7

/**
 * Γ R3 forbidden-content scan. Returns true when text is clean.
 * Intentionally permissive — this is a content guard, not a security filter
 * (XSS protection lives in the patch validator at P18 / ADR-045).
 *
 * R2 fix-pass: URI scan broadened to common non-http schemes (mailto:, tel:,
 * data:, javascript:, file:, ftp:) so headlines don't slip through with
 * "Email me at mailto:foo@bar". JSON-shape detection also catches embedded
 * `"key":` patterns mid-string (not just leading-character).
 */
export function isCleanContent(text: string): boolean {
  if (text.includes('```')) return false                                  // code block
  if (/^\s*#{1,6}\s/m.test(text)) return false                            // markdown heading
  if (/(?:[a-z]+:\/\/|mailto:|tel:|data:|javascript:|file:|ftp:)/i.test(text)) return false // URL / URI
  if (/(^|\s)[@#]\w+/.test(text)) return false                            // @mention / hashtag
  if (text.includes('\n\n')) return false                                 // multi-paragraph
  if (/^\s*[{[]/.test(text)) return false                                 // JSON-shaped (leading)
  if (/"[^"]+"\s*:/.test(text) && /[{}]/.test(text)) return false         // JSON-shaped (embedded "k":… braces)
  return true
}
