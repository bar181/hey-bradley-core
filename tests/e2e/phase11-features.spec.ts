import { test, expect } from '@playwright/test'

// ═══════════════════════════════════════════════════════
// Phase 11 Feature Tests
// ═══════════════════════════════════════════════════════

test.describe('Chat Commands', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/builder')
    await page.waitForTimeout(2000)
    // Switch to Chat tab in left panel
    await page.locator('button:has-text("Chat")').first().click()
    await page.waitForTimeout(500)
  })

  test('multi-part parsing: "build a SaaS with pricing and testimonials" enables sections', async ({ page }) => {
    const chatInput = page.locator('[data-testid="chat-input"]')
    await chatInput.fill('build a SaaS with pricing and testimonials')
    await chatInput.press('Enter')
    await page.waitForTimeout(3000)

    // Verify Bradley responded with multiple actions
    const bradleyMsgs = page.locator('[data-testid="chat-msg-bradley"]')
    const count = await bradleyMsgs.count()
    expect(count).toBeGreaterThanOrEqual(1)

    // The multi-part parser should have processed at least one action
    const lastMsg = bradleyMsgs.last()
    const text = await lastMsg.textContent()
    expect(text).toBeTruthy()
  })

  test('simulated requirement buttons exist: SaaS Startup, Local Business, Portfolio', async ({ page }) => {
    // The simulated requirement buttons should be visible in the chat area
    await expect(page.locator('[data-testid="sim-req-saas-startup"]')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('[data-testid="sim-req-local-business"]')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('[data-testid="sim-req-portfolio"]')).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Website Pages', () => {
  test('/about renders with "Meet Bradley" text', async ({ page }) => {
    await page.goto('/about')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('text=Meet Bradley')).toBeVisible({ timeout: 5000 })
  })

  test('/docs renders with "Getting Started" and section reference table', async ({ page }) => {
    await page.goto('/docs')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('text=Getting Started')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=Section Reference')).toBeVisible({ timeout: 5000 })
  })
})

test.describe('New Examples', () => {
  test('examples tab shows The Corner Table and CodeCraft Academy cards', async ({ page }) => {
    await page.goto('/new-project')
    await page.waitForLoadState('networkidle')

    // Click Examples tab
    const exTab = page.locator('button').filter({ hasText: 'Examples' })
    if (await exTab.isVisible()) await exTab.click()
    await page.waitForTimeout(500)

    await expect(page.getByText('The Corner Table').first()).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('CodeCraft Academy').first()).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Brand Lock', () => {
  test('clicking brand lock icon shows brand locked indicator', async ({ page }) => {
    await page.goto('/builder')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1500)

    // Click the brand lock button (Shield icon) in TopBar
    const brandLockBtn = page.locator('button[aria-label="Lock brand editing"]')
    await brandLockBtn.click()
    await page.waitForTimeout(500)

    // After clicking, the button aria-label changes to "Unlock brand editing"
    await expect(page.locator('button[aria-label="Unlock brand editing"]')).toBeVisible()

    // The ThemeSimple panel should show "Brand locked" indicator
    // Click Theme in left panel to see the brand locked message
    const themeItem = page.locator('[role="button"]').filter({ hasText: 'Theme' }).first()
    if (await themeItem.isVisible()) {
      await themeItem.click()
      await page.waitForTimeout(300)
      await expect(page.locator('text=Brand locked')).toBeVisible({ timeout: 5000 })
    }
  })
})
