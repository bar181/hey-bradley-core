/**
 * P29 Sprint D P1 — Template Library API tests.
 *
 * Pure-unit (no browser; no LLM). Verifies list/filter/lookup contracts.
 * ADR-058.
 */
import { test, expect } from '@playwright/test'
import {
  listTemplates,
  listTemplatesByCategory,
  listTemplatesByKind,
  getTemplateById,
} from '../src/contexts/intelligence/templates/library'

test.describe('P29 — Template Library API', () => {
  test('listTemplates returns all 3 baseline templates', () => {
    const all = listTemplates()
    expect(all.length).toBeGreaterThanOrEqual(3)
    const ids = all.map((t) => t.id)
    expect(ids).toContain('make-it-brighter')
    expect(ids).toContain('hide-section')
    expect(ids).toContain('change-headline')
  })

  test('listTemplatesByCategory("theme") returns make-it-brighter', () => {
    const themes = listTemplatesByCategory('theme')
    expect(themes.length).toBeGreaterThanOrEqual(1)
    expect(themes.some((t) => t.id === 'make-it-brighter')).toBe(true)
  })

  test('listTemplatesByCategory("section") returns hide-section', () => {
    const sections = listTemplatesByCategory('section')
    expect(sections.some((t) => t.id === 'hide-section')).toBe(true)
  })

  test('listTemplatesByCategory("content") returns change-headline', () => {
    const content = listTemplatesByCategory('content')
    expect(content.some((t) => t.id === 'change-headline')).toBe(true)
  })

  test('getTemplateById returns the template OR null on miss', () => {
    const ok = getTemplateById('make-it-brighter')
    expect(ok?.id).toBe('make-it-brighter')
    expect(ok?.category).toBe('theme')
    expect(ok?.examples.length).toBeGreaterThan(0)

    const miss = getTemplateById('does-not-exist')
    expect(miss).toBeNull()
  })

  test('listTemplatesByKind("patcher") returns all 3 baselines', () => {
    const patchers = listTemplatesByKind('patcher')
    expect(patchers.length).toBe(3)
  })

  test('listTemplatesByKind("generator") returns empty in P29 baseline', () => {
    const generators = listTemplatesByKind('generator')
    expect(generators.length).toBe(0) // P31 ships first generator
  })

  test('every TemplateMeta has examples + category + kind populated', () => {
    const all = listTemplates()
    for (const t of all) {
      expect(t.category).toBeDefined()
      expect(t.kind).toBeDefined()
      expect(Array.isArray(t.examples)).toBe(true)
    }
  })
})
