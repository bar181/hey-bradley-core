// Spec: plans/implementation/phase-113/preflight.md §A4 (Voice extraction in
// chat pipeline). Closes the chat-built (7.0) vs listen-built (9.5) blog
// quality gap from the P113 website-eval audit by populating
// `site.voiceAttributes` from chat-mode prompt cues.
//
// Pure rules-based extractor — no LLM, no I/O, no store, no React. Stopgap
// until CF#4 BYOK live-LLM-enriched path lands.
//
// Atom-purity preserved per ADR-134 — module lives at
// src/contexts/intelligence/ (sibling to chatPipeline.ts), NOT in
// src/contexts/intelligence/aisp/ (atom-folder reservation).
//
// Idempotent; deterministic.

export interface VoiceExtractionResult {
  /** 0-5 extracted voice attributes (deduped, capped). */
  voiceAttributes: string[]
  /** [0,1] — heuristic confidence; 0 when no cues fired. */
  confidence: number
}

/** Single-keyword cues → voice attributes. Whole-word match, case-insensitive. */
const VOICE_CUES: Record<string, readonly string[]> = {
  punchy: ['punchy', 'urgent', 'specific'],
  dry: ['dry', 'understated', 'specific'],
  warm: ['warm', 'plain-spoken', 'encouraging'],
  professional: ['confident', 'professional', 'restrained'],
  formal: ['formal', 'precise', 'thorough'],
  casual: ['casual', 'real', 'specific'],
  playful: ['playful', 'specific', 'energetic'],
  contrarian: ['contrarian', 'sharp', 'opinionated'],
  academic: ['precise', 'evidence-based', 'thorough'],
  founder: ['confident', 'direct', 'understated'],
  bold: ['bold', 'direct', 'punchy'],
  technical: ['technical', 'precise', 'no-fluff'],
  artisan: ['warm', 'craft', 'specific'],
  minimalist: ['restrained', 'specific', 'precise'],
  authoritative: ['authoritative', 'evidence-based', 'confident'],
  conversational: ['conversational', 'real', 'specific'],
}

/** Bigram cues → voice attributes. Lowercased substring match on space-normalized text. */
const BIGRAM_CUES: ReadonlyArray<readonly [string, readonly string[]]> = [
  ['founder voice', ['confident', 'direct', 'understated']],
  ['personal blog', ['warm', 'specific', 'first-person']],
  ['thought leadership', ['precise', 'evidence-based', 'authoritative']],
  ['sharp opinions', ['sharp', 'opinionated', 'contrarian']],
  ['no fluff', ['no-fluff', 'specific', 'direct']],
  ['plain spoken', ['plain-spoken', 'warm', 'specific']],
]

/**
 * Heuristic voice-attribute extraction from chat prompts.
 * Pure rules-based — no LLM. Returns 0-5 attributes deduped.
 * Empty + confidence 0 when no cues match.
 */
export function extractVoice(text: string): VoiceExtractionResult {
  const normalized = text.toLowerCase().replace(/\s+/g, ' ').trim()
  if (!normalized) return { voiceAttributes: [], confidence: 0 }
  const hits = new Set<string>()
  let cueCount = 0
  // Bigram pass first (captures multi-word cues before single words).
  for (const [phrase, attrs] of BIGRAM_CUES) {
    if (normalized.includes(phrase)) {
      cueCount += 1
      for (const a of attrs) hits.add(a)
    }
  }
  // Single-keyword pass — whole-word match.
  for (const [keyword, attrs] of Object.entries(VOICE_CUES)) {
    const re = new RegExp(`\\b${keyword}\\b`, 'i')
    if (re.test(normalized)) {
      cueCount += 1
      for (const a of attrs) hits.add(a)
    }
  }
  if (cueCount === 0) return { voiceAttributes: [], confidence: 0 }
  // Cap at 5 attributes; confidence ramps with cue count (0.7 → 0.9).
  const voiceAttributes = Array.from(hits).slice(0, 5)
  const confidence = Math.min(0.9, 0.7 + cueCount * 0.05)
  return { voiceAttributes, confidence }
}
