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
 * Decorated registry — the same templates with library metadata.
 *
 * Post-fix-pass (R4 architecture review F1): all 4 templates declare their
 * own `category` / `examples` / `kind` fields directly on the Template.
 * The legacy `BASELINE_META` lookup table was deleted; new templates that
 * omit metadata fall back to the conservative defaults below. New templates
 * SHOULD always declare metadata explicitly.
 */
export const TEMPLATE_LIBRARY: readonly TemplateMeta[] = TEMPLATE_REGISTRY.map((t) => ({
  ...t,
  category: t.category ?? ('content' as TemplateCategory),
  // R2 L5 — Array.isArray guard so an accidental `examples: 'foo'` (string)
  // doesn't slip past `??` (truthy short-circuit) and break .filter() at runtime.
  examples: Array.isArray(t.examples) ? t.examples : [],
  kind: t.kind ?? ('patcher' as TemplateKind),
}))

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
 * Registry IDs win over colliding user IDs (R2 functionality review F1):
 * a user-authored row with the same id as a registry template is silently
 * filtered out so React lists don't get duplicate keys and "Apply" actions
 * stay unambiguous. The user template is still in the DB (deleting it is
 * a separate decision); this is just the browse projection.
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
  const registryIds = new Set(registry.map((t) => t.id))
  const userRows = loadUserRows()
  const userBrowse: BrowseTemplate[] = userRows
    .filter((r) => !registryIds.has(r.id))
    .map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      kind: r.kind,
      examples: r.examples,
      source: 'user',
    }))
  return [...registry, ...userBrowse]
}
