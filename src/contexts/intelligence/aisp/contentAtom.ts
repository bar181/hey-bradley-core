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
 *
 * P44 Sprint H Wave 1 (A2) — Brand-voice constraint extension. Λ now carries
 * an OPTIONAL `brand_voice` channel: when the caller supplies brand context
 * (Settings upload from A1), the LLM-side prompt is biased toward that voice
 * profile. Σ width is unchanged (output contract is identical) — this is a
 * purely additive logistics-layer signal so Σ-level validators stay strict.
 * ADR-067.
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
    default_length := 'short',
    brand_voice ?: {                                        ⟵ P44 (A2 / ADR-067)
      present:𝔹,                                            optional channel
      profile:𝕊≤4096,                                       caller-supplied voice notes
      bias: { tone_preference?:Tone, lexicon_hints?:𝕊≤512 } LLM-side soft bias only
    }
  }
  Ε := {
    V1: VERIFY length(text) ≤ max_chars(length),
    V2: VERIFY tone ∈ Σ.Tone.value,
    V3: VERIFY text passes Γ R3 forbidden-content scan,
    V4: VERIFY confidence ∈ [0,1],
    V5: IF Λ.brand_voice.present THEN VERIFY tone ∈ Σ.Tone.value          ⟵ P44 (A2)
        (Σ width unchanged — V5 only re-asserts V2 when brand active so
         downstream traces can flag brand-aware runs without breaking
         the strict P31 output contract)
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

/**
 * P44 Sprint H Wave 1 (A2) — Σ Λ.brand_voice cap. The voice profile is a
 * caller-opaque blob (Settings upload from A1); we only enforce a hard upper
 * bound so a runaway profile can't dominate the LLM context window.
 * ADR-067.
 */
export const BRAND_CONTEXT_MAX_CHARS = 4096

/**
 * P44 Sprint H Wave 1 (A2) — `validateGeneratedContent`.
 *
 * Strict Σ-validator over a `GeneratedContent` payload. Stays strict on the
 * P31 output contract (length cap, allowed tone, allowed length, R3 clean
 * scan, confidence range). When `brandContext` is supplied (Λ.brand_voice
 * present per CONTENT_ATOM Ε V5), the validator re-asserts the tone is one
 * of the canonical Tone enum values — Σ width is intentionally unchanged so
 * tests that assert P31 output shape stay green.
 *
 * This is purposely conservative: brand-voice text alignment lives on the
 * LLM-side prompt (see `contentGenerator.generateContent`); the validator's
 * only brand-active job is to confirm the tone field is well-formed so a
 * brand-active trace can be rendered without leaking malformed enum values.
 */
export function validateGeneratedContent(
  out: GeneratedContent,
  brandContext?: string | null,
): { ok: true } | { ok: false; reason: string } {
  // V1 — length cap
  const cap = LENGTH_MAX_CHARS[out.length]
  if (cap === undefined) return { ok: false, reason: 'V1: unknown length' }
  if (out.text.length > cap) return { ok: false, reason: 'V1: length > cap' }
  // V2 — tone enum
  if (!ALLOWED_TONES.includes(out.tone)) return { ok: false, reason: 'V2: tone ∉ Σ.Tone.value' }
  // V3 — Γ R3 clean scan
  if (!isCleanContent(out.text)) return { ok: false, reason: 'V3: forbidden content' }
  // V4 — confidence ∈ [0,1]
  if (
    typeof out.confidence !== 'number' ||
    Number.isNaN(out.confidence) ||
    out.confidence < 0 ||
    out.confidence > 1
  ) {
    return { ok: false, reason: 'V4: confidence ∉ [0,1]' }
  }
  // V5 — brand-active re-assertion (Σ width unchanged; tone must remain enum-clean
  //       so brand-aware traces don't surface free-form strings).
  if (brandContext != null && brandContext.length > 0) {
    if (brandContext.length > BRAND_CONTEXT_MAX_CHARS) {
      return { ok: false, reason: 'V5: brand_voice.profile > max_chars' }
    }
    if (!ALLOWED_TONES.includes(out.tone)) {
      return { ok: false, reason: 'V5: brand-active tone ∉ Σ.Tone.value' }
    }
  }
  return { ok: true }
}
