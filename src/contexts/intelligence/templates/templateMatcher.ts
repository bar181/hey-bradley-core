/**
 * templateMatcher.ts — P72 / OC-TI / A4
 *
 * Authority: ADR-098 (Template Intelligence Architecture)
 *
 * Composes the 3 template libraries (theme + section + content) into a single
 * `TemplateMatch` envelope. Open-core deterministic ranking — each layer's
 * `findX(query)` returns a ranked list; we score the top result by tag-overlap
 * and substring-hit signals, then either include it as the match (≥ threshold)
 * or surface alternatives (< threshold) for ASSUMPTIONS_ATOM to clarify.
 *
 * HNSW activation (Tier-2 per CLAUDE.md ruvector note) is a future swap of the
 * scoring step ONLY — the envelope shape and the public API stay identical.
 *
 * Strict scope (per A4 hard rules):
 *  - NO new dependencies
 *  - TypeScript-strict; no `any`
 *  - ≤ 250 LOC total
 *  - DOES NOT touch the 3 library files (A1/A2/A3 own them) or the
 *    SELECTION_ATOM starter-pack flow (library.ts / registry.ts / router.ts)
 */

import type { ThemeTemplate } from './themeLibrary'
import { findThemes } from './themeLibrary'
import type { SectionTemplate } from './sectionLibrary'
import { findSectionArrangements } from './sectionLibrary'
import type { ContentTemplate } from './contentLibrary'
import { findContentStyle } from './contentLibrary'
import type { MasterConfig } from '@/lib/schemas'

// ─────────────────────────────────────────────────────────────────────────────
// Public types
// ─────────────────────────────────────────────────────────────────────────────

export interface TemplateMatch {
  /** Best-match template per layer (undefined if no match scored ≥ threshold). */
  theme?: ThemeTemplate
  sectionArrangement?: SectionTemplate
  contentStyle?: ContentTemplate
  /** Aggregate confidence across the layers that matched (0..1). */
  confidence: number
  /** Per-layer alternatives for ASSUMPTIONS_ATOM if confidence < threshold. */
  alternatives: {
    theme: ThemeTemplate[]
    sectionArrangement: SectionTemplate[]
    contentStyle: ContentTemplate[]
  }
  /** Human-readable rationale for the match. */
  rationale: string
}

export const TEMPLATE_CONFIDENCE_THRESHOLD = 0.8

export interface TemplateMatcher {
  match(query: string, config: MasterConfig): TemplateMatch
}

// ─────────────────────────────────────────────────────────────────────────────
// Scoring helpers (deterministic; ADR-098 §"Out of scope" — HNSW deferred)
// ─────────────────────────────────────────────────────────────────────────────

/** Ladder per A4 spec:
 *    3+ tag matches → 0.9
 *    2 tag matches  → 0.7
 *    1 tag match    → 0.4
 *    0 tags but vector substring hit → 0.5
 *    none → 0.0
 */
function scoreFromHits(tagHits: number, substringHit: boolean): number {
  if (tagHits >= 3) return 0.9
  if (tagHits === 2) return 0.7
  if (tagHits === 1) return 0.4
  if (substringHit) return 0.5
  return 0.0
}

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^a-z0-9]+/u)
    .filter((token) => token.length > 0)
}

interface LayerEntry {
  searchTags: readonly string[]
  vectorDescription: string
}

function scoreEntry(entry: LayerEntry, queryTokens: readonly string[]): number {
  if (queryTokens.length === 0) return 0
  const tagSet = new Set(entry.searchTags.map((t) => t.toLowerCase()))
  let tagHits = 0
  for (const tok of queryTokens) {
    if (tagSet.has(tok)) tagHits += 1
  }
  const description = entry.vectorDescription.toLowerCase()
  const substringHit = queryTokens.some((tok) => description.includes(tok))
  return scoreFromHits(tagHits, substringHit)
}

// ─────────────────────────────────────────────────────────────────────────────
// matchTemplates — public entry
// ─────────────────────────────────────────────────────────────────────────────

const ALT_LIMIT = 3

/**
 * Match a free-text query against all three template layers and return the
 * combined envelope. See ADR-098 for the architecture rationale.
 *
 * Empty query → returns all-undefined match with confidence 0 and the top 3
 * of each library as alternatives, so ASSUMPTIONS_ATOM has something to surface.
 *
 * `config` is currently unused by the deterministic ranker (kept for API
 * stability — Tier-2 HNSW activation may use it for context-aware re-ranking).
 */
export function matchTemplates(query: string, config: MasterConfig): TemplateMatch {
  // Reference `config` to keep the signature stable; deterministic ranker is
  // text-only today, but Tier-2 HNSW will consume site-context features.
  void config
  const trimmed = query.trim()
  const tokens = tokenize(trimmed)

  // Empty query — surface top-of-library options for clarification.
  if (tokens.length === 0) {
    return {
      confidence: 0,
      alternatives: {
        theme: findThemes('').slice(0, ALT_LIMIT),
        sectionArrangement: findSectionArrangements('').slice(0, ALT_LIMIT),
        contentStyle: findContentStyle('').slice(0, ALT_LIMIT),
      },
      rationale: 'empty query — alternatives surfaced for clarification',
    }
  }

  // Layer rankings.
  const themeRanked = findThemes(trimmed)
  const sectionRanked = findSectionArrangements(trimmed)
  const contentRanked = findContentStyle(trimmed)

  // Score top-of-list for each layer.
  const themeTop = themeRanked[0]
  const sectionTop = sectionRanked[0]
  const contentTop = contentRanked[0]

  const themeScore = themeTop ? scoreEntry(themeTop, tokens) : 0
  const sectionScore = sectionTop ? scoreEntry(sectionTop, tokens) : 0
  const contentScore = contentTop ? scoreEntry(contentTop, tokens) : 0

  // Pick layers above threshold; rest go to alternatives.
  const themeMatched = themeScore >= TEMPLATE_CONFIDENCE_THRESHOLD ? themeTop : undefined
  const sectionMatched =
    sectionScore >= TEMPLATE_CONFIDENCE_THRESHOLD ? sectionTop : undefined
  const contentMatched =
    contentScore >= TEMPLATE_CONFIDENCE_THRESHOLD ? contentTop : undefined

  // Aggregate confidence = mean across layers that scored ≥ threshold.
  const matchedScores: number[] = []
  if (themeMatched) matchedScores.push(themeScore)
  if (sectionMatched) matchedScores.push(sectionScore)
  if (contentMatched) matchedScores.push(contentScore)
  const confidence =
    matchedScores.length === 0
      ? 0
      : matchedScores.reduce((sum, s) => sum + s, 0) / matchedScores.length

  // Build alternatives for layers that did NOT match (top 3 each).
  const alternatives: TemplateMatch['alternatives'] = {
    theme: themeMatched ? [] : themeRanked.slice(0, ALT_LIMIT),
    sectionArrangement: sectionMatched ? [] : sectionRanked.slice(0, ALT_LIMIT),
    contentStyle: contentMatched ? [] : contentRanked.slice(0, ALT_LIMIT),
  }

  // Rationale string lists the layers that contributed to the match.
  const parts: string[] = []
  if (themeMatched) parts.push(`theme=${themeMatched.id} (${themeScore.toFixed(2)})`)
  if (sectionMatched)
    parts.push(`section=${sectionMatched.id} (${sectionScore.toFixed(2)})`)
  if (contentMatched)
    parts.push(`content=${contentMatched.id} (${contentScore.toFixed(2)})`)
  const rationale =
    parts.length > 0
      ? `matched ${parts.join(', ')}`
      : `no layer scored ≥ ${TEMPLATE_CONFIDENCE_THRESHOLD} — surfacing alternatives`

  return {
    theme: themeMatched,
    sectionArrangement: sectionMatched,
    contentStyle: contentMatched,
    confidence,
    alternatives,
    rationale,
  }
}

/** Class-shaped facade for callers that prefer DI over the bare function. */
export const templateMatcher: TemplateMatcher = {
  match: matchTemplates,
}
