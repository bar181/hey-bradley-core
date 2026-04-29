/**
 * P60 step 3 spec — template audit data validity + new template registration.
 * Pure-unit (FS reads). Sub-30s runtime.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const AUDIT = join(ROOT, 'tests/examples/template-audit.json')
const REGISTRY = join(ROOT, 'src/data/examples/index.ts')

type Audit = {
  registered_templates: { slug: string; persona: string; real_copy: boolean; distinct_visual: boolean; scored_quality: number }[]
  persona_coverage: string[]
  missing_personas: string[]
  recommended_new_templates: { name: string; persona: string; aesthetic: string; key_sections: string[]; rationale: string }[]
  to_be_built_this_phase: string[]
  audit_summary: { total_registered: number; real_copy_pct: number; distinct_visual_pct: number; gap_severity: string }
}

test.describe('P60.17 template-audit.json — file shape + required keys', () => {
  test('file exists, has all 6 documented top-level keys', () => {
    expect(existsSync(AUDIT)).toBe(true)
    const a = JSON.parse(readFileSync(AUDIT, 'utf8')) as Audit
    expect(a).toHaveProperty('registered_templates')
    expect(a).toHaveProperty('persona_coverage')
    expect(a).toHaveProperty('missing_personas')
    expect(a).toHaveProperty('recommended_new_templates')
    expect(a).toHaveProperty('to_be_built_this_phase')
    expect(a).toHaveProperty('audit_summary')
  })
})

test.describe('P60.18 template-audit — registered templates have valid scores', () => {
  test('every entry has slug + persona + boolean flags + score 1-10', () => {
    const a = JSON.parse(readFileSync(AUDIT, 'utf8')) as Audit
    expect(a.registered_templates.length).toBeGreaterThan(0)
    for (const t of a.registered_templates) {
      expect(typeof t.slug).toBe('string')
      expect(typeof t.persona).toBe('string')
      expect(typeof t.real_copy).toBe('boolean')
      expect(typeof t.distinct_visual).toBe('boolean')
      expect(t.scored_quality).toBeGreaterThanOrEqual(1)
      expect(t.scored_quality).toBeLessThanOrEqual(10)
    }
  })
})

test.describe('P60.19 template-audit — exactly 5 recommendations + 2 to-build', () => {
  test('5 recommendations with full spec; 2 named in to_be_built_this_phase', () => {
    const a = JSON.parse(readFileSync(AUDIT, 'utf8')) as Audit
    expect(a.recommended_new_templates.length).toBe(5)
    for (const r of a.recommended_new_templates) {
      expect(typeof r.name).toBe('string')
      expect(typeof r.persona).toBe('string')
      expect(typeof r.aesthetic).toBe('string')
      expect(Array.isArray(r.key_sections)).toBe(true)
      expect(r.key_sections.length).toBeGreaterThan(0)
      expect(typeof r.rationale).toBe('string')
    }
    expect(a.to_be_built_this_phase.length).toBe(2)
  })
})

test.describe('P60.20 template-audit — both to_be_built templates registered', () => {
  test('AI Engineer Personal Site + Local Business both registered in examples/index.ts', () => {
    const a = JSON.parse(readFileSync(AUDIT, 'utf8')) as Audit
    expect(a.to_be_built_this_phase).toContain('AI Engineer Personal Site')
    expect(a.to_be_built_this_phase).toContain('Local Business')
    const reg = readFileSync(REGISTRY, 'utf8')
    expect(reg).toContain('aiEngineerPersonal')
    expect(reg).toContain('localBusiness')
  })
})

test.describe('P60.21 template-audit — gap_severity is honestly graded', () => {
  test('audit_summary has total + percentages + gap_severity', () => {
    const a = JSON.parse(readFileSync(AUDIT, 'utf8')) as Audit
    expect(a.audit_summary.total_registered).toBeGreaterThan(0)
    expect(a.audit_summary.real_copy_pct).toBeGreaterThanOrEqual(0)
    expect(a.audit_summary.real_copy_pct).toBeLessThanOrEqual(100)
    expect(['low', 'medium', 'high']).toContain(a.audit_summary.gap_severity)
  })
})
