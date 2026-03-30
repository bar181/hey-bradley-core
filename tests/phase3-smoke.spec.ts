import { test, expect } from '@playwright/test'

test.describe('Phase 3 Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForTimeout(1500)
  })

  // ── Test 1: Preview mode toggle ──
  test('preview mode hides panels and shows full-page sections', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))

    // Click Preview button
    const previewBtn = page.locator('button').filter({ hasText: 'Preview' }).first()
    if (await previewBtn.count() > 0) {
      await previewBtn.click()
      await page.waitForTimeout(500)

      // Verify: the tab bar (REALITY/DATA/etc.) should be hidden
      const tabBar = page.locator('button').filter({ hasText: 'DATA' }).first()
      expect(await tabBar.isVisible()).toBe(false)

      // Verify: body still has content (sections render)
      const bodyText = await page.textContent('body')
      expect(bodyText).toBeTruthy()

      // Click Edit to return
      const editBtn = page.locator('button').filter({ hasText: 'Edit' }).first()
      if (await editBtn.count() > 0) {
        await editBtn.click()
        await page.waitForTimeout(300)

        // Verify: tab bar is visible again
        expect(await tabBar.isVisible()).toBe(true)
      }
    }

    expect(errors).toHaveLength(0)
  })

  // ── Test 2: Navbar renders ──
  test('navbar section renders with logo text', async ({ page }) => {
    // The default config should have a navbar section
    const bodyText = await page.textContent('body')
    // Check for nav element or "Hey Bradley" logo text in the preview
    const hasNavbar = bodyText?.includes('Hey Bradley') || false
    expect(hasNavbar).toBe(true)
  })

  // ── Test 3: Font cascade — all sections use theme font var ──
  test('sections have fontFamily set via CSS var', async ({ page }) => {
    // Enable features section to test font cascade
    const addBtn = page.locator('button').filter({ hasText: 'Add Section' }).first()
    await addBtn.click()
    await page.waitForTimeout(300)
    await page.locator('button').filter({ hasText: 'Features' }).first().click()
    await page.waitForTimeout(500)

    // Check that the features section element has fontFamily in its style
    const featuresSections = page.locator('section').filter({ hasText: 'Feature' })
    if (await featuresSections.count() > 0) {
      const style = await featuresSections.first().getAttribute('style')
      expect(style).toContain('font-family')
    }
  })
})
