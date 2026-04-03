import { test, expect } from '@playwright/test'

test.describe('Phase 7: Demo Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/builder')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
  })

  // ─── PW1: Chat quick-demo buttons ───
  test('PW1: chat quick-demo buttons are visible', async ({ page }) => {
    // Switch to Chat tab in the left panel
    await page.locator('button').filter({ hasText: 'Chat' }).first().click()
    await page.waitForTimeout(300)

    // Quick demo buttons should be visible inside the chat area
    const chatMessages = page.locator('[data-testid="chat-messages"]')
    await expect(chatMessages.locator('text=Sweet Spot Bakery')).toBeVisible()
    await expect(chatMessages.locator('text=LaunchPad AI')).toBeVisible()
    await expect(chatMessages.locator('text=Sarah Chen Photography')).toBeVisible()
    await expect(chatMessages.locator('text=GreenLeaf Consulting')).toBeVisible()
  })

  // ─── PW2: Demo button triggers typewriter captions ───
  test('PW2: clicking demo button triggers typewriter captions', async ({ page }) => {
    await page.locator('button').filter({ hasText: 'Chat' }).first().click()
    await page.waitForTimeout(300)

    // Click the bakery demo button
    const chatMessages = page.locator('[data-testid="chat-messages"]')
    await chatMessages.locator('button', { hasText: 'Sweet Spot Bakery' }).click()

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
  test('PW4: listen tab shows orb and demo button', async ({ page }) => {
    await page.locator('button').filter({ hasText: 'Listen' }).first().click()
    await page.waitForTimeout(300)

    await expect(page.locator('text=Watch a Demo')).toBeVisible()
    await expect(page.locator('text=Start Listening')).toBeVisible()
  })

  // ─── PW5: All 4 center tabs visible ───
  test('PW5: all 4 center tabs are visible', async ({ page }) => {
    // These are button tabs in the center canvas TabBar
    const tabBar = page.locator('.flex.flex-row.gap-0.border-b')

    await expect(tabBar.locator('button', { hasText: 'Preview' })).toBeVisible()
    await expect(tabBar.locator('button', { hasText: 'Data' })).toBeVisible()
    await expect(tabBar.locator('button', { hasText: 'Specs' })).toBeVisible()
    await expect(tabBar.locator('button', { hasText: 'Pipeline' })).toBeVisible()
  })

  // ─── PW6: 404 page for unknown routes ───
  test('PW6: 404 page shows for unknown routes', async ({ page }) => {
    await page.goto('/nonexistent-page')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('text=Page not found')).toBeVisible()
    await expect(page.locator('text=Back to Home')).toBeVisible()
  })

  // ─── PW7: Specs tab shows AISP output ───
  test('PW7: specs tab shows AISP output', async ({ page }) => {
    // Click the Specs tab in the center canvas
    const specsBtn = page.locator('button').filter({ hasText: 'Specs' }).first()
    await specsBtn.click()
    await page.waitForTimeout(500)

    // The Specs tab has a Human / AISP toggle; both buttons should be visible
    await expect(page.getByRole('button', { name: 'Human', exact: true })).toBeVisible({ timeout: 3000 })
    await expect(page.getByRole('button', { name: 'AISP', exact: true })).toBeVisible({ timeout: 3000 })
  })
})
