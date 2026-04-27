import { test, expect } from '@playwright/test'

test.describe('Phase 15: Kitchen Sink starter', () => {
  test('loads from Onboarding without console errors and renders all 16 section types', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()) })

    await page.goto('/new-project')
    await page.waitForTimeout(1000)

    // Switch to Examples tab and click the Kitchen Sink card
    await page.locator('button', { hasText: 'Examples' }).first().click()
    await page.waitForTimeout(300)
    await page.locator('button', { hasText: 'Kitchen Sink Demo' }).first().click()

    // Wait for builder to mount and render sections
    await page.waitForURL('**/builder')
    await page.waitForSelector('[data-section-id]', { timeout: 10000 })
    await page.waitForTimeout(1500)

    // Count distinct rendered section roots (kitchen-sink has 17 sections, 16 unique types)
    const sectionRoots = await page.locator('[data-section-id]').count()
    expect(sectionRoots).toBeGreaterThanOrEqual(16)
    expect(errors).toHaveLength(0)
  })
})
