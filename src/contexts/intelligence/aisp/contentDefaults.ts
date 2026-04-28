/**
 * P32 Sprint D P4 — Multi-section Content Pipeline.
 *
 * Section-aware default tone + length for `generateContent`. Hero copy
 * defaults to bold/short; blog body defaults to neutral/medium; footer
 * stays warm/short; etc. User cue words still override (cue extraction
 * runs BEFORE these defaults take effect).
 *
 * ADR-061. Mirrors INTENT_ATOM ALLOWED_TARGET_TYPES (P26) — section types
 * are the same enum across both atoms so dispatch stays type-aligned.
 */
import type { ContentLength, ContentTone } from './contentAtom'

export type SectionType =
  | 'hero'
  | 'blog'
  | 'footer'
  | 'features'
  | 'pricing'
  | 'cta'
  | 'testimonials'
  | 'faq'
  | 'value-props'
  | 'gallery'
  | 'team'
  | 'columns'
  | 'action'
  | 'quotes'
  | 'questions'
  | 'numbers'
  | 'text'
  | 'logos'
  | 'menu'

export interface SectionContentDefaults {
  tone: ContentTone
  length: ContentLength
}

/**
 * Per-section defaults. Choices are intentionally conservative — bold for
 * hero/cta where impact matters; neutral elsewhere. Each entry is one ADR
 * amendment away from change so brand-voice tuning is easy to adopt.
 */
export const SECTION_CONTENT_DEFAULTS: Record<SectionType, SectionContentDefaults> = {
  hero: { tone: 'bold', length: 'short' },
  blog: { tone: 'neutral', length: 'medium' },
  footer: { tone: 'warm', length: 'short' },
  features: { tone: 'authoritative', length: 'short' },
  pricing: { tone: 'authoritative', length: 'short' },
  cta: { tone: 'bold', length: 'short' },
  testimonials: { tone: 'warm', length: 'medium' },
  faq: { tone: 'neutral', length: 'medium' },
  'value-props': { tone: 'authoritative', length: 'short' },
  gallery: { tone: 'neutral', length: 'short' },
  team: { tone: 'warm', length: 'medium' },
  columns: { tone: 'neutral', length: 'short' },
  action: { tone: 'bold', length: 'short' },
  quotes: { tone: 'warm', length: 'medium' },
  questions: { tone: 'playful', length: 'short' },
  numbers: { tone: 'authoritative', length: 'short' },
  text: { tone: 'neutral', length: 'medium' },
  logos: { tone: 'neutral', length: 'short' },
  menu: { tone: 'neutral', length: 'short' },
}

/** Lookup defaults for a section type; falls back to neutral/short on unknown type. */
export function getSectionDefaults(sectionType: string | null | undefined): SectionContentDefaults {
  if (!sectionType) return { tone: 'neutral', length: 'short' }
  const known = SECTION_CONTENT_DEFAULTS[sectionType as SectionType]
  return known ?? { tone: 'neutral', length: 'short' }
}
