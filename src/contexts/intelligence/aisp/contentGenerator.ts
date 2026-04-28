/**
 * P31 Sprint D Phase 3 — Content Generator (CONTENT_ATOM consumer).
 *
 * `generateContent(request)` is the deterministic stub that:
 *   1) extracts a quoted phrase from user text (if any) — that's the new copy
 *   2) infers tone from cue words (e.g. 'fun' → playful; 'professional' → authoritative)
 *   3) infers length from explicit cues (e.g. 'short', 'punchy', 'long') or from text-length
 *   4) verifies output against CONTENT_ATOM Γ rules
 *   5) returns Σ-shaped GeneratedContent OR null when verification fails
 *
 * Real LLM-call generation arrives at P33 (AISPTranslationPanel ChatInput
 * bridge). Until then, the generator is rule-driven so the surface contract
 * is testable without burning tokens.
 *
 * ADR-060.
 */
import {
  ALLOWED_TONES,
  CONTENT_CONFIDENCE_THRESHOLD,
  type ContentLength,
  type ContentTone,
  type GeneratedContent,
  isCleanContent,
  LENGTH_MAX_CHARS,
} from './contentAtom'
import { getSectionDefaults } from './contentDefaults'

export interface ContentRequest {
  /** Raw user text (post intent-classify). */
  text: string
  /** P32 — Section type hint; drives tone/length defaults when no cue words. */
  sectionType?: string | null
  /** Default tone when no cue words present; 'neutral' per Λ. Section default takes precedence if sectionType set. */
  defaultTone?: ContentTone
  /** Default length when no cue words present; 'short' per Λ. Section default takes precedence if sectionType set. */
  defaultLength?: ContentLength
}

const QUOTED_PHRASE_RE = /["'""]([^"'""]{1,400})["'""]/

const TONE_CUES: Record<ContentTone, readonly string[]> = {
  neutral: [],
  playful: ['fun', 'playful', 'funny', 'casual', 'cheeky', 'witty'],
  authoritative: ['professional', 'serious', 'authoritative', 'formal', 'corporate'],
  warm: ['warm', 'friendly', 'welcoming', 'inviting', 'cozy'],
  bold: ['bold', 'punchy', 'strong', 'confident', 'powerful'],
}

const LENGTH_CUES: Record<ContentLength, readonly string[]> = {
  short: ['short', 'brief', 'punchy', 'one-liner', 'tagline'],
  medium: ['medium', 'paragraph'],
  long: ['long', 'detailed', 'expanded', 'longer'],
}

function inferTone(textLower: string, fallback: ContentTone): ContentTone {
  for (const tone of ALLOWED_TONES) {
    if (TONE_CUES[tone].some((c) => textLower.includes(c))) return tone
  }
  return fallback
}

function inferLength(textLower: string, fallback: ContentLength): ContentLength {
  for (const length of ['long', 'medium', 'short'] as const) {
    if (LENGTH_CUES[length].some((c) => textLower.includes(c))) return length
  }
  return fallback
}

/**
 * Extract a candidate copy phrase. Quoted phrase wins; otherwise null
 * (caller decides — no LLM in this stub will hallucinate copy from thin air).
 */
function extractCopy(text: string): string | null {
  const m = QUOTED_PHRASE_RE.exec(text)
  if (m) return m[1].trim()
  return null
}

/**
 * Generate content per CONTENT_ATOM. Returns null on Γ-rule failure or when
 * no candidate copy can be extracted.
 */
export function generateContent(request: ContentRequest): GeneratedContent | null {
  if (!request.text || request.text.trim().length === 0) return null
  const lower = request.text.toLowerCase()

  // P32 — Section defaults (when sectionType set) layered under explicit caller defaults.
  const sectionDefaults = getSectionDefaults(request.sectionType)
  const fallbackTone = request.defaultTone ?? sectionDefaults.tone
  const fallbackLength = request.defaultLength ?? sectionDefaults.length

  const tone = inferTone(lower, fallbackTone)
  const length = inferLength(lower, fallbackLength)
  const copy = extractCopy(request.text)
  if (copy === null) return null

  // Γ R1: length cap
  const cap = LENGTH_MAX_CHARS[length]
  if (copy.length > cap) return null

  // Γ R3: clean-content scan
  if (!isCleanContent(copy)) return null

  // Confidence: high when quoted phrase + tone cue both present; else medium
  const hasToneCue = TONE_CUES[tone].some((c) => lower.includes(c))
  const confidence = hasToneCue ? 0.85 : 0.75

  if (confidence < CONTENT_CONFIDENCE_THRESHOLD) return null

  return {
    text: copy,
    tone,
    length,
    confidence,
    rationale: `extracted quoted copy (${copy.length} chars) + ${
      hasToneCue ? 'tone cue matched' : 'default tone'
    }`,
  }
}
