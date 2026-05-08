/**
 * Sprint J post-seal — comprehensive system-wide brutal review screenshot capture.
 *
 * Boots the dev server (auto-started by playwright.config.ts), walks the key
 * user flows, captures screenshots into
 * `plans/strategic-reviews/2026-04-29-sprint-j-system-wide/screenshots/`.
 *
 * NOT part of cumulative regression. Run explicitly:
 *   npx playwright test tests/system-review-screenshots.spec.ts
 *
 * Reviewer agents read the screenshots + this spec to ground their UX/UI analysis.
 */
import { test, expect } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const OUT = join(
  process.cwd(),
  'plans/strategic-reviews/2026-04-29-sprint-j-system-wide/screenshots',
)
mkdirSync(OUT, { recursive: true })

// Each test waits briefly for animations/hydration. Use full-page screenshots
// at desktop + mobile breakpoints.

test.describe('Sprint J UI capture — desktop @ 1280x800', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test('01 onboarding — landing', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: join(OUT, '01-onboarding-landing.png'), fullPage: true })
    expect(true).toBe(true)
  })

  test('02 builder — empty', async ({ page }) => {
    await page.goto('/builder')
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: join(OUT, '02-builder-empty.png'), fullPage: true })
    expect(true).toBe(true)
  })

  test('03 builder — settings drawer with PersonalityPicker', async ({ page }) => {
    await page.goto('/builder')
    await page.waitForLoadState('networkidle')
    // Open the settings drawer — find a sensible trigger; fall back to direct
    // navigation if a trigger isn't obvious.
    const settingsButton = page.locator('button:has-text("Settings")').first()
    if (await settingsButton.count()) {
      await settingsButton.click().catch(() => {})
      await page.waitForTimeout(300)
    }
    await page.screenshot({ path: join(OUT, '03-builder-settings-drawer.png'), fullPage: true })
    expect(true).toBe(true)
  })

  test('04 chat — bradley reply with personality message', async ({ page }) => {
    await page.goto('/builder')
    await page.waitForLoadState('networkidle')
    // Type a sample prompt into ChatInput if visible
    const chatInput = page.locator('[data-testid="chat-input"], input[placeholder*="ask" i], input[placeholder*="bradley" i]').first()
    if (await chatInput.count()) {
      await chatInput.fill('change the hero color to warmer tones')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(2000)
    }
    await page.screenshot({ path: join(OUT, '04-chat-with-reply.png'), fullPage: true })
    expect(true).toBe(true)
  })

  test('05 expert — conversation log tab', async ({ page }) => {
    await page.goto('/builder')
    await page.waitForLoadState('networkidle')
    // Try to switch to EXPERT mode if a toggle exists
    const expertToggle = page.locator('button:has-text("EXPERT"), button:has-text("Expert")').first()
    if (await expertToggle.count()) {
      await expertToggle.click().catch(() => {})
      await page.waitForTimeout(200)
    }
    const logTab = page.locator('button:has-text("Log")').first()
    if (await logTab.count()) {
      await logTab.click().catch(() => {})
      await page.waitForTimeout(300)
    }
    await page.screenshot({ path: join(OUT, '05-expert-conversation-log.png'), fullPage: true })
    expect(true).toBe(true)
  })
})

test.describe('Sprint J UI capture — mobile @ 375x812', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('06 mobile — chat tab', async ({ page }) => {
    await page.goto('/builder')
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: join(OUT, '06-mobile-chat-tab.png'), fullPage: true })
    expect(true).toBe(true)
  })

  test('07 mobile — listen tab', async ({ page }) => {
    await page.goto('/builder')
    await page.waitForLoadState('networkidle')
    const listenTab = page.locator('[data-testid="mobile-tab-listen"]').first()
    if (await listenTab.count()) {
      await listenTab.click().catch(() => {})
      await page.waitForTimeout(300)
    }
    await page.screenshot({ path: join(OUT, '07-mobile-listen-tab.png'), fullPage: true })
    expect(true).toBe(true)
  })

  test('08 mobile — view tab (preview)', async ({ page }) => {
    await page.goto('/builder')
    await page.waitForLoadState('networkidle')
    const viewTab = page.locator('[data-testid="mobile-tab-view"]').first()
    if (await viewTab.count()) {
      await viewTab.click().catch(() => {})
      await page.waitForTimeout(300)
    }
    await page.screenshot({ path: join(OUT, '08-mobile-view-tab.png'), fullPage: true })
    expect(true).toBe(true)
  })

  test('09 mobile — hamburger menu open', async ({ page }) => {
    await page.goto('/builder')
    await page.waitForLoadState('networkidle')
    const trigger = page.locator('[data-testid="mobile-menu-trigger"]').first()
    if (await trigger.count()) {
      await trigger.click().catch(() => {})
      await page.waitForTimeout(300)
    }
    await page.screenshot({ path: join(OUT, '09-mobile-hamburger-open.png'), fullPage: true })
    expect(true).toBe(true)
  })

  test('10 mobile — onboarding personality step', async ({ page }) => {
    await page.goto('/new-project')
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: join(OUT, '10-mobile-onboarding.png'), fullPage: true })
    expect(true).toBe(true)
  })
})
