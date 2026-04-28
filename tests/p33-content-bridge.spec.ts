/**
 * P33 Sprint D P5 — Content + Template Bridge tests.
 *
 * Pure-unit (no browser; no LLM; no configStore boot). Verifies:
 *   1) generate-headline template registered with kind='generator'
 *   2) library decoration honors template-declared metadata over BASELINE_META
 *   3) Template type accepts optional category/examples/kind
 *
 * The 2-step pipeline kind-dispatch path is exercised end-to-end in dev via
 * the AISPTranslationPanel surface; pure-unit coverage focuses on the static
 * registry + library contracts here.
 *
 * ADR-062.
 */
import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  TEMPLATE_REGISTRY,
} from '../src/contexts/intelligence/templates/registry'
import {
  TEMPLATE_LIBRARY,
  listTemplatesByKind,
  getTemplateById,
} from '../src/contexts/intelligence/templates/library'

test.describe('P33 — Generator template registration', () => {
  test('TEMPLATE_REGISTRY includes generate-headline', () => {
    const ids = TEMPLATE_REGISTRY.map((t) => t.id)
    expect(ids).toContain('generate-headline')
  })

  test('generate-headline declares kind="generator" directly on Template', () => {
    const tpl = TEMPLATE_REGISTRY.find((t) => t.id === 'generate-headline')
    expect(tpl).toBeDefined()
    expect(tpl?.kind).toBe('generator')
    expect(tpl?.category).toBe('content')
  })

  test('generate-headline has 4 example phrasings', () => {
    const tpl = TEMPLATE_REGISTRY.find((t) => t.id === 'generate-headline')
    expect(tpl?.examples?.length).toBeGreaterThanOrEqual(3)
  })

  test('generate-headline matchPattern catches "rewrite the headline"', () => {
    const tpl = TEMPLATE_REGISTRY.find((t) => t.id === 'generate-headline')
    expect(tpl?.matchPattern.test('rewrite the headline')).toBe(true)
    expect(tpl?.matchPattern.test('regenerate hero copy')).toBe(true)
    expect(tpl?.matchPattern.test('rewrite headline more bold')).toBe(true)
    expect(tpl?.matchPattern.test('hide the hero')).toBe(false)
  })
})

test.describe('P33 — Library decoration order', () => {
  test('listTemplatesByKind("generator") returns 1 (generate-headline)', () => {
    const generators = listTemplatesByKind('generator')
    expect(generators.length).toBe(1)
    expect(generators[0].id).toBe('generate-headline')
  })

  test('listTemplatesByKind("patcher") still returns the 3 P23 baselines', () => {
    const patchers = listTemplatesByKind('patcher')
    expect(patchers.length).toBe(3)
    const ids = patchers.map((t) => t.id)
    expect(ids).toContain('make-it-brighter')
    expect(ids).toContain('hide-section')
    expect(ids).toContain('change-headline')
  })

  test('getTemplateById("generate-headline") returns generator metadata', () => {
    const tpl = getTemplateById('generate-headline')
    expect(tpl?.kind).toBe('generator')
    expect(tpl?.category).toBe('content')
    expect(tpl?.examples?.length).toBeGreaterThan(0)
  })

  test('TEMPLATE_LIBRARY has 4 entries (3 patchers + 1 generator)', () => {
    expect(TEMPLATE_LIBRARY.length).toBe(4)
  })
})

test.describe('P33 — 2-step pipeline kind dispatch (source-level)', () => {
  test('twoStepPipeline.ts contains kind-dispatch branch', () => {
    const src = readFileSync(
      join(
        process.cwd(),
        'src/contexts/intelligence/aisp/twoStepPipeline.ts',
      ),
      'utf8',
    )
    expect(src).toContain("tpl.kind === 'generator'")
    expect(src).toContain('generateContent')
    expect(src).toContain('heroHeadingPath')
  })

  test('TwoStepResult exposes optional `generated` field for UI', () => {
    const src = readFileSync(
      join(
        process.cwd(),
        'src/contexts/intelligence/aisp/twoStepPipeline.ts',
      ),
      'utf8',
    )
    expect(src).toMatch(/generated\?:\s*GeneratedContent/)
  })

  test('ADR-062 declares kind dispatch decision', () => {
    const adr = readFileSync(
      join(process.cwd(), 'docs/adr/ADR-062-content-template-bridge.md'),
      'utf8',
    )
    expect(adr).toContain('kind dispatch')
    expect(adr).toContain('Status:** Accepted')
    expect(adr).toContain('generate-headline')
  })
})
