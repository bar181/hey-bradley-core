/**
 * P29 Sprint D P1 — Template Library: browse + apply + filter.
 *
 * Extends the P23 TEMPLATE_REGISTRY with metadata for user-facing browsing:
 *   - category (theme | section | content)
 *   - examples (list of user phrasings the template covers)
 *   - kind ('patcher' = direct patches | 'generator' = LLM content; placeholder for P31)
 *
 * Sprint D opens the content-generation arc; P29 ships the LIBRARY surface
 * (browse + apply via list/filter APIs) so future phases plug content
 * generators into the same registry without API churn.
 *
 * ADR-058 (Template Library API).
 */
import { TEMPLATE_REGISTRY } from './registry'
import type { Template } from './types'

export type TemplateCategory = 'theme' | 'section' | 'content'
export type TemplateKind = 'patcher' | 'generator'

export interface TemplateMeta extends Template {
  category: TemplateCategory
  examples: readonly string[]
  kind: TemplateKind
}

/**
 * Categorize the P23 baseline registry. Categories are derived from template
 * IDs (KISS) — no schema migration required. Future templates added to
 * TEMPLATE_REGISTRY should declare category/examples/kind explicitly.
 */
const BASELINE_META: Record<string, { category: TemplateCategory; examples: string[]; kind: TemplateKind }> = {
  'make-it-brighter': {
    category: 'theme',
    examples: ['make it brighter', 'brighten the page', 'lighten everything'],
    kind: 'patcher',
  },
  'hide-section': {
    category: 'section',
    examples: ['hide the hero', 'hide /footer', 'remove the blog section'],
    kind: 'patcher',
  },
  'change-headline': {
    category: 'content',
    examples: ['change the headline to "Welcome"', 'set the headline to "X"', 'update headline to Y'],
    kind: 'patcher',
  },
}

/** Decorated registry — the same templates with library metadata. */
export const TEMPLATE_LIBRARY: readonly TemplateMeta[] = TEMPLATE_REGISTRY.map((t) => {
  const meta = BASELINE_META[t.id] ?? { category: 'content' as TemplateCategory, examples: [], kind: 'patcher' as TemplateKind }
  return { ...t, ...meta }
})

/** List all templates (no filter). Returns frozen array; safe to share. */
export function listTemplates(): readonly TemplateMeta[] {
  return TEMPLATE_LIBRARY
}

/** Filter by category. Returns empty array on unknown category. */
export function listTemplatesByCategory(cat: TemplateCategory): readonly TemplateMeta[] {
  return TEMPLATE_LIBRARY.filter((t) => t.category === cat)
}

/** Lookup by id. Returns null on miss. */
export function getTemplateById(id: string): TemplateMeta | null {
  return TEMPLATE_LIBRARY.find((t) => t.id === id) ?? null
}

/** Filter by kind ('patcher' = direct patches; 'generator' = LLM content). */
export function listTemplatesByKind(kind: TemplateKind): readonly TemplateMeta[] {
  return TEMPLATE_LIBRARY.filter((t) => t.kind === kind)
}
