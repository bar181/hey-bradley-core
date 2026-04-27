import { test, expect } from '@playwright/test'

test.describe('Phase 15: Blog Page starter', () => {
  test('loads Stories from the kitchen and shows article title in preview', async ({ page }) => {
    await page.goto('/new-project')
    await page.waitForTimeout(1000)

    // Switch to Examples tab and click the blog-standard card
    await page.locator('button', { hasText: 'Examples' }).first().click()
    await page.waitForTimeout(300)
    await page.locator('button', { hasText: 'Stories from the kitchen' }).first().click()

    await page.waitForURL('**/builder')
    await page.waitForSelector('[data-section-id]', { timeout: 10000 })

    await expect(page.getByText('How sourdough taught me patience').first()).toBeVisible({ timeout: 10000 })
  })
})
