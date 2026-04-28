/**
 * P23 Sprint B Phase 1 — Templates barrel export.
 * ADR-050 (Template-First Chat Architecture).
 */
export { TEMPLATE_REGISTRY } from './registry'
export { tryMatchTemplate, CONFIDENCE_THRESHOLD } from './router'
export { parseSectionScope, resolveScopedSectionIndex } from './scoping'
export type { Template, TemplateMatchResult, TemplateEnvelope, TemplateMatchContext } from './types'
export type { SectionScope, ScopedInput } from './scoping'
