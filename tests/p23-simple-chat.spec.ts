/**
 * P23 Sprint B Phase 1 — Simple Chat (template-first routing).
 *
 * Verifies:
 *   - 3 template matches short-circuit the LLM and apply patches directly
 *   - Friendly empty-patch envelope when target absent (e.g. hide a section that doesn't exist)
 *   - Unknown intent falls through to LLM pipeline (FixtureAdapter in DEV)
 *   - Template hits include "_(template: <id>)_" suffix in summary
 *
 * ADR-050 (Template-First Chat Architecture).
 */
import { test, expect } from '@playwright/test'

async function ensureFreshProject(page: import('@playwright/test').Page) {
  await page.waitForFunction(() => Boolean((window as any).__projectStore))
  // Fresh default config each test so template patches apply against known state.
  await page.evaluate(() => {
    const cs = (window as any).__configStore.getState()
    cs.resetToDefaults()
    const ps = (window as any).__projectStore.getState()
    if (!ps.activeProject) {
      ps.saveProject('p23-test', cs.config)
    }
  })
}

test.describe('P23 — Template-First Chat', () => {
  test('Template 1: "make it brighter" applies theme patches and short-circuits LLM', async ({ page }) => {
    await page.goto('/builder')
    await ensureFreshProject(page)
    const result = await page.evaluate(async () => {
      const cp = await import('/src/contexts/intelligence/chatPipeline.ts')
      return cp.submit({ source: 'chat', text: 'make it brighter' })
    })
    expect(result.ok).toBe(true)
    expect(result.appliedPatchCount).toBe(2)
    expect(result.summary).toContain('(template: make-it-brighter)')
    expect(result.fellBackToCanned).toBe(false)
  })

  test('Template 2: "hide the hero" applies enabled:false and short-circuits LLM', async ({ page }) => {
    await page.goto('/builder')
    await ensureFreshProject(page)
    const result = await page.evaluate(async () => {
      const cp = await import('/src/contexts/intelligence/chatPipeline.ts')
      return cp.submit({ source: 'chat', text: 'hide the hero' })
    })
    expect(result.ok).toBe(true)
    expect(result.appliedPatchCount).toBe(1)
    expect(result.summary).toContain('(template: hide-section)')
  })

  test('Template 3: "change the headline to ..." applies hero text patch', async ({ page }) => {
    await page.goto('/builder')
    await ensureFreshProject(page)
    const result = await page.evaluate(async () => {
      const cp = await import('/src/contexts/intelligence/chatPipeline.ts')
      return cp.submit({
        source: 'chat',
        text: 'change the headline to "Welcome to Bradley\'s Bakery"',
      })
    })
    expect(result.ok).toBe(true)
    expect(result.appliedPatchCount).toBe(1)
    expect(result.summary).toContain('(template: change-headline)')
    expect(result.summary).toContain("Bradley's Bakery")
  })

  test('Template miss-with-friendly-message: hide a non-existent section', async ({ page }) => {
    await page.goto('/builder')
    await ensureFreshProject(page)
    const result = await page.evaluate(async () => {
      const cp = await import('/src/contexts/intelligence/chatPipeline.ts')
      return cp.submit({
        source: 'chat',
        text: 'hide the nonexistent-section-type',
      })
    })
    // Pattern matches but section absent → friendly empty-patch summary; skip LLM
    expect(result.appliedPatchCount).toBe(0)
    expect(result.summary).toContain('(template: hide-section)')
    expect(result.summary.toLowerCase()).toContain("can't find")
    expect(result.fellBackToCanned).toBe(true)
  })

  test('Unknown intent falls through to LLM pipeline (FixtureAdapter canned hint)', async ({ page }) => {
    await page.goto('/builder')
    await ensureFreshProject(page)
    const result = await page.evaluate(async () => {
      const cp = await import('/src/contexts/intelligence/chatPipeline.ts')
      return cp.submit({
        source: 'chat',
        text: 'do something the templates and fixtures will not match XYZ123',
      })
    })
    // Templates miss → LLM tries → FixtureAdapter has no match → canned fallback
    expect(result.fellBackToCanned).toBe(true)
    // Summary should NOT include template suffix (LLM/fallback path)
    expect(result.summary).not.toContain('(template:')
  })
})
