import { test, expect } from '@playwright/test'

test.describe('Phase 5: Simulated Chat', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/builder')
    await page.waitForTimeout(2000)
    // Switch to Chat tab in left panel
    await page.locator('button:has-text("Chat")').first().click()
    await page.waitForTimeout(500)
  })

  test('send "dark" toggles to dark mode', async ({ page }) => {
    // Start in SaaS dark, toggle to light first so we can verify dark toggle
    const chatInput = page.locator('[data-testid="chat-input"]')

    await chatInput.fill('light')
    await chatInput.press('Enter')
    await page.waitForTimeout(1000)

    // Now send dark
    await chatInput.fill('dark')
    await chatInput.press('Enter')
    await page.waitForTimeout(1000)

    // Verify Bradley responded
    const bradleyMsg = page.locator('[data-testid="chat-msg-bradley"]').last()
    await expect(bradleyMsg).toContainText('dark')
  })

  test('send "headline Test Title" updates hero text', async ({ page }) => {
    const chatInput = page.locator('[data-testid="chat-input"]')
    await chatInput.fill('headline Hello Playwright')
    await chatInput.press('Enter')
    await page.waitForTimeout(1000)

    // Verify Bradley responded
    const bradleyMsg = page.locator('[data-testid="chat-msg-bradley"]').last()
    await expect(bradleyMsg).toContainText('updated headline')

    // Verify hero text changed in preview
    const heroText = page.locator('text=Hello Playwright').first()
    await expect(heroText).toBeVisible()
  })

  test('send gibberish shows fallback message', async ({ page }) => {
    const chatInput = page.locator('[data-testid="chat-input"]')
    await chatInput.fill('xyzzy nonsense')
    await chatInput.press('Enter')
    await page.waitForTimeout(1000)

    const bradleyMsg = page.locator('[data-testid="chat-msg-bradley"]').last()
    await expect(bradleyMsg).toContainText('hmm')
    await expect(bradleyMsg).toContainText('try')
  })

  test('send "add testimonials" enables section', async ({ page }) => {
    const chatInput = page.locator('[data-testid="chat-input"]')
    await chatInput.fill('add testimonials')
    await chatInput.press('Enter')
    await page.waitForTimeout(1000)

    const bradleyMsg = page.locator('[data-testid="chat-msg-bradley"]').last()
    await expect(bradleyMsg).toContainText('added testimonials')
  })

  test('send "theme agency" switches theme', async ({ page }) => {
    const chatInput = page.locator('[data-testid="chat-input"]')
    await chatInput.fill('theme agency')
    await chatInput.press('Enter')
    await page.waitForTimeout(1000)

    const bradleyMsg = page.locator('[data-testid="chat-msg-bradley"]').last()
    await expect(bradleyMsg).toContainText('applying agency')
  })

  test('user and bradley messages are visually distinct', async ({ page }) => {
    const chatInput = page.locator('[data-testid="chat-input"]')
    await chatInput.fill('hello')
    await chatInput.press('Enter')
    await page.waitForTimeout(1000)

    const userMsg = page.locator('[data-testid="chat-msg-user"]').last()
    const bradleyMsg = page.locator('[data-testid="chat-msg-bradley"]').last()

    await expect(userMsg).toBeVisible()
    await expect(bradleyMsg).toBeVisible()

    // User messages should contain "you:" prefix, Bradley messages should not
    const userText = await userMsg.textContent() || ''
    const bradleyText = await bradleyMsg.textContent() || ''
    expect(userText).toContain('you:')
    expect(bradleyText).not.toContain('you:')
  })
})
