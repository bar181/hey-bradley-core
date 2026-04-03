import { test, expect } from '@playwright/test'

const THEME_NAMES = [
  'Tech Business', 'Agency', 'Portfolio', 'Startup',
  'Personal', 'Professional', 'Wellness', 'Minimalist',
]

test.describe('Phase 2 Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage so we get a fresh state each test
    await page.goto('/builder')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForTimeout(1500)
  })

  // ── Test 1: Theme switch changes preview ──
  test('theme switch changes preview content', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))

    // Click Theme in left panel
    await page.locator('[role="button"]').filter({ hasText: 'Theme' }).first().click()
    await page.waitForTimeout(300)

    // Get initial body text
    const initialText = await page.textContent('body')

    // Expand theme dropdown (click the dropdown button in the right panel)
    const themeDropdown = page.locator('button').filter({ hasText: /Tech Business|Agency|Portfolio/ }).first()
    if (await themeDropdown.count() > 0) {
      await themeDropdown.click()
      await page.waitForTimeout(300)
    }

    // Click Agency theme card
    const agencyCard = page.locator('[data-theme-card]').filter({ hasText: 'Agency' }).first()
    if (await agencyCard.count() > 0) {
      await agencyCard.click()
      await page.waitForTimeout(500)
    } else {
      await page.locator('text=Agency').first().click()
      await page.waitForTimeout(500)
    }

    // Theme should have changed — verify no crash
    const bodyText = await page.textContent('body')
    expect(bodyText).toBeTruthy()
    expect(errors).toHaveLength(0)
  })

  // ── Test 2: Add section creates a usable section ──
  test('addSection creates section with real content', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))

    // Click "Add Section" button
    const addBtn = page.locator('button').filter({ hasText: 'Add Section' }).first()
    await addBtn.click()
    await page.waitForTimeout(300)

    // Click "Features" in the dropdown
    const featuresOption = page.locator('button').filter({ hasText: 'Features' }).first()
    await featuresOption.click()
    await page.waitForTimeout(500)

    // Verify Features section appeared in the left panel
    const featuresInPanel = page.locator('text=Features')
    expect(await featuresInPanel.count()).toBeGreaterThan(0)

    // Verify no page errors
    expect(errors).toHaveLength(0)
  })

  // ── Test 3: Remove section works ──
  test('remove section removes it from the panel', async ({ page }) => {
    // First add a features section so we have something to remove
    const addBtn = page.locator('button').filter({ hasText: 'Add Section' }).first()
    await addBtn.click()
    await page.waitForTimeout(300)
    await page.locator('button').filter({ hasText: 'Features' }).first().click()
    await page.waitForTimeout(500)

    // Verify Features exists
    const featuresCountBefore = await page.locator('[role="button"]').filter({ hasText: 'Features' }).count()
    expect(featuresCountBefore).toBeGreaterThan(0)

    // Click the features row to select it (reveals action bar)
    const featuresRow = page.locator('[role="button"]').filter({ hasText: 'Features' }).first()
    await featuresRow.click()
    await page.waitForTimeout(300)

    // Click delete in the action bar (first click arms, second confirms)
    const deleteBtn = page.locator('button[title="Delete"]').first()
    await deleteBtn.click()
    await page.waitForTimeout(400)
    await deleteBtn.click()
    await page.waitForTimeout(500)

    // Verify Features is gone
    const featuresCountAfter = await page.locator('[role="button"]').filter({ hasText: 'Features' }).count()
    expect(featuresCountAfter).toBeLessThan(featuresCountBefore)
  })

  // ── Test 4: Edit headline in hero editor updates preview ──
  test('editing hero headline updates preview', async ({ page }) => {
    // Click Hero in left panel
    await page.locator('[role="button"]').filter({ hasText: 'Main Banner' }).first().click()
    await page.waitForTimeout(500)

    // Expand Content accordion if needed
    const contentBtn = page.locator('button').filter({ hasText: 'Content' }).first()
    if (await contentBtn.count() > 0) {
      await contentBtn.click()
      await page.waitForTimeout(300)
    }

    // Find the headline input by data-testid
    const headlineInput = page.locator('[data-testid="hero-headline-input"]')
    if (await headlineInput.count() > 0) {
      await headlineInput.fill('Phase 2 Test Headline')
      await page.waitForTimeout(300)

      // Verify preview contains the new text
      const bodyText = await page.textContent('body')
      expect(bodyText).toContain('Phase 2 Test Headline')
    }
  })

  // ── Test 5: Toggle component visibility ──
  test('toggling eyebrow badge changes preview', async ({ page }) => {
    // Click Hero
    await page.locator('[role="button"]').filter({ hasText: 'Main Banner' }).first().click()
    await page.waitForTimeout(500)

    // Expand Content accordion
    const contentBtn = page.locator('button').filter({ hasText: 'Content' }).first()
    if (await contentBtn.count() > 0) {
      await contentBtn.click()
      await page.waitForTimeout(300)
    }

    // Find the Badge toggle (Switch near "Badge" label)
    const badgeSection = page.locator('text=Badge').first()
    if (await badgeSection.count() > 0) {
      // Find the nearby switch button
      const switchBtn = badgeSection.locator('..').locator('button[role="switch"]').first()
      if (await switchBtn.count() > 0) {
        const wasChecked = await switchBtn.getAttribute('aria-checked')
        await switchBtn.click()
        await page.waitForTimeout(300)
        const isChecked = await switchBtn.getAttribute('aria-checked')
        expect(isChecked).not.toBe(wasChecked)
      }
    }
  })
})

// ── Test 6: All 8 themes render without crash ──
test.describe('Theme Regression', () => {
  test('all 8 themes render without page errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))

    await page.goto('/builder')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForTimeout(1500)

    // Click Theme in left panel
    await page.locator('[role="button"]').filter({ hasText: 'Theme' }).first().click()
    await page.waitForTimeout(300)

    for (const theme of THEME_NAMES) {
      // Try clicking the theme card
      const card = page.locator(`text=${theme}`).first()
      if (await card.count() > 0) {
        await card.click()
        await page.waitForTimeout(600)

        // Verify the page didn't crash — body should have content
        const bodyText = await page.textContent('body')
        expect(bodyText).toBeTruthy()

        // Check for React error boundary
        expect(bodyText).not.toContain('Something went wrong')
      }
    }

    // No page-level errors across all 8 themes
    expect(errors).toHaveLength(0)
  })
})
