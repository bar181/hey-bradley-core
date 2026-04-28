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

/**
 * P30 Sprint D P2 — Browse view: registry-baked templates ∪ user-authored rows.
 *
 * BrowseTemplate is a metadata-only projection (id + name + category + kind +
 * examples + source). It does NOT carry runtime fields (`matchPattern`,
 * `envelope`) because user-authored rows are persisted as JSON and cannot
 * trivially re-hydrate function bodies. Runtime materialization for user
 * templates lands at P31+ when content generators provide the structured
 * dispatch path.
 *
 * ADR-059.
 */
export interface BrowseTemplate {
  id: string
  name: string
  category: TemplateCategory
  kind: TemplateKind
  examples: readonly string[]
  source: 'registry' | 'user'
}

/**
 * Return the merged browse-list (registry + user_templates rows).
 *
 * `loadUserRows` is injected for testability + to keep this module free of a
 * direct DB dependency at module-load (the DB is only initialized post-boot
 * and pure-unit tests must not touch sql.js).
 */
export function listAllForBrowse(
  loadUserRows: () => readonly { id: string; name: string; category: TemplateCategory; kind: TemplateKind; examples: readonly string[] }[] = () => [],
): readonly BrowseTemplate[] {
  const registry: BrowseTemplate[] = TEMPLATE_LIBRARY.map((t) => ({
    id: t.id,
    name: t.label,
    category: t.category,
    kind: t.kind,
    examples: t.examples,
    source: 'registry',
  }))
  const userRows = loadUserRows()
  const userBrowse: BrowseTemplate[] = userRows.map((r) => ({
    id: r.id,
    name: r.name,
    category: r.category,
    kind: r.kind,
    examples: r.examples,
    source: 'user',
  }))
  return [...registry, ...userBrowse]
}
