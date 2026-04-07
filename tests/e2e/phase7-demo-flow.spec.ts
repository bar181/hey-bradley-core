import { test, expect } from '@playwright/test'

test.describe('Phase 7: Demo Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/builder')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
  })

  // ─── PW1: Chat example dialog has demo presets ───
  test('PW1: chat quick-demo buttons are visible', async ({ page }) => {
    // Switch to Chat tab in the left panel
    await page.locator('button').filter({ hasText: 'Chat' }).first().click()
    await page.waitForTimeout(300)

    // Click "Try an Example" to open the examples dialog
    await page.locator('[data-testid="try-example-btn"]').click()
    await page.waitForTimeout(300)

    // Dialog should show example categories with chat commands
    const dialog = page.locator('[role="dialog"]')
    await expect(dialog.getByText('Site Templates')).toBeVisible()
    await expect(dialog.getByText('Build me a bakery website')).toBeVisible()
    await expect(dialog.getByText('Create a SaaS landing page')).toBeVisible()
    await expect(dialog.getByText('Multi-step Presets')).toBeVisible()
  })

  // ─── PW2: Demo button triggers typewriter captions ───
  test('PW2: clicking demo button triggers typewriter captions', async ({ page }) => {
    await page.locator('button').filter({ hasText: 'Chat' }).first().click()
    await page.waitForTimeout(300)

    // Open examples dialog and click a demo
    await page.locator('[data-testid="try-example-btn"]').click()
    await page.waitForTimeout(300)
    await page.locator('[role="dialog"]').getByText('Build me a bakery website').click()

    // Wait for a bradley message to appear (typewriter effect produces these)
    await expect(
      page.locator('[data-testid="chat-msg-bradley"]').first()
    ).toBeVisible({ timeout: 10000 })
  })

  // ─── PW3: Preview mode toggles with exit button ───
  test('PW3: preview mode toggles with exit button', async ({ page }) => {
    // The preview button in TopBar has aria-label "Preview site"
    const previewBtn = page.locator('button[aria-label="Preview site"]')
    await previewBtn.first().click()
    await page.waitForTimeout(300)

    // In preview mode, "Exit Preview" button should appear in the layout overlay
    await expect(page.locator('text=Exit Preview')).toBeVisible()

    // Click Exit Preview
    await page.locator('button', { hasText: 'Exit Preview' }).first().click()
    await page.waitForTimeout(300)

    // Builder left panel should be visible again
    await expect(page.locator('aside[aria-label="Builder tools"]')).toBeVisible()
  })

  // ─── PW4: Listen tab shows orb controls ───
  test('PW4: listen tab shows orb and start listening button', async ({ page }) => {
    await page.locator('button').filter({ hasText: 'Listen' }).first().click()
    await page.waitForTimeout(300)

    await expect(page.locator('text=Start Listening')).toBeVisible()
  })

  // ─── PW5: Center tabs visible (Preview + Blueprints in simple mode) ───
  test('PW5: center tabs are visible', async ({ page }) => {
    // In SIMPLE mode, only Preview + Blueprints are shown; Data/Pipeline are expert-only
    const tabBar = page.locator('.flex.flex-row.gap-0.border-b')

    await expect(tabBar.locator('button', { hasText: 'Preview' })).toBeVisible()
    await expect(tabBar.locator('button', { hasText: 'Blueprints' })).toBeVisible()
  })

  // ─── PW6: 404 page for unknown routes ───
  test('PW6: 404 page shows for unknown routes', async ({ page }) => {
    await page.goto('/nonexistent-page')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('text=Page not found')).toBeVisible()
    await expect(page.locator('text=Back to Home')).toBeVisible()
  })

  // ─── PW7: Blueprints tab shows spec generators ───
  test('PW7: blueprints tab shows spec generators', async ({ page }) => {
    // Click the Blueprints tab in the center canvas
    const blueprintsBtn = page.locator('button').filter({ hasText: 'Blueprints' }).first()
    await blueprintsBtn.click()
    await page.waitForTimeout(500)

    // The Blueprints tab has sub-tabs including North Star and Build Plan
    await expect(page.getByRole('button', { name: 'North Star' })).toBeVisible({ timeout: 3000 })
    await expect(page.getByRole('button', { name: 'Build Plan' })).toBeVisible({ timeout: 3000 })
  })
})
