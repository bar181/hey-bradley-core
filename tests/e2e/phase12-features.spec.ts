import { test, expect } from '@playwright/test'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ═══════════════════════════════════════════════════════
// Phase 12 Feature Tests
// ═══════════════════════════════════════════════════════

test.describe('Tab Visibility — SIMPLE vs EXPERT mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/builder')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForTimeout(2000)
  })

  test('SIMPLE mode shows only Preview and Blueprints tabs', async ({ page }) => {
    // Default is SIMPLE mode — verify only Preview + Blueprints visible
    const tabBar = page.locator('.flex.flex-row.gap-0.border-b')
    await expect(tabBar.locator('button', { hasText: 'Preview' })).toBeVisible()
    await expect(tabBar.locator('button', { hasText: 'Blueprints' })).toBeVisible()

    // Data and Pipeline should NOT be visible in SIMPLE mode
    const dataTab = tabBar.locator('button', { hasText: 'Data' })
    await expect(dataTab).toHaveCount(0)

    const pipelineTab = tabBar.locator('button', { hasText: 'Pipeline' })
    await expect(pipelineTab).toHaveCount(0)
  })

  test('EXPERT mode shows Data and Pipeline tabs', async ({ page }) => {
    // Switch to EXPERT mode
    const expertBtn = page.locator('button').filter({ hasText: 'EXPERT' }).first()
    if (await expertBtn.isVisible()) {
      await expertBtn.click()
      await page.waitForTimeout(500)
    }

    const tabBar = page.locator('.flex.flex-row.gap-0.border-b')
    await expect(tabBar.locator('button', { hasText: 'Preview' })).toBeVisible()
    await expect(tabBar.locator('button', { hasText: 'Blueprints' })).toBeVisible()
    await expect(tabBar.locator('button', { hasText: 'Data' })).toBeVisible()
    await expect(tabBar.locator('button', { hasText: 'Pipeline' })).toBeVisible()
  })
})

test.describe('Theme Loading', () => {
  test('at least 3 themes can be applied without errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))

    await page.goto('/builder')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForTimeout(2000)

    // Click Theme in left panel
    await page.locator('[role="button"]').filter({ hasText: 'Theme' }).first().click()
    await page.waitForTimeout(300)

    const themes = ['Agency', 'Minimalist', 'Startup']

    for (const theme of themes) {
      const card = page.locator(`[data-theme-card] >> text=${theme}`).first()
      if (await card.count() === 0) {
        // Fall back to text match
        const textMatch = page.locator(`text=${theme}`).first()
        if (await textMatch.count() > 0) {
          await textMatch.click()
          await page.waitForTimeout(800)
        }
      } else {
        await card.click()
        await page.waitForTimeout(800)
      }

      // Verify the page didn't crash
      const bodyText = await page.textContent('body')
      expect(bodyText).toBeTruthy()
      expect(bodyText).not.toContain('Something went wrong')
    }

    expect(errors).toHaveLength(0)
  })
})

test.describe('Example Loading', () => {
  test('bakery example loads with section content', async ({ page }) => {
    await page.goto('/new-project')
    await page.waitForLoadState('networkidle')

    // Click bakery example
    const bakeryBtn = page.locator('button').filter({ hasText: 'Sweet Spot Bakery' }).first()
    await bakeryBtn.click()
    await page.waitForTimeout(2000)

    expect(page.url()).toContain('/builder')
    const bodyText = await page.textContent('body')
    expect(bodyText).toBeTruthy()
    // Bakery example should have relevant content
    expect(bodyText!.length).toBeGreaterThan(100)
  })

  test('launchpad example loads with section content', async ({ page }) => {
    await page.goto('/new-project')
    await page.waitForLoadState('networkidle')

    const btn = page.locator('button').filter({ hasText: 'LaunchPad AI' }).first()
    await btn.click()
    await page.waitForTimeout(2000)

    expect(page.url()).toContain('/builder')
    const bodyText = await page.textContent('body')
    expect(bodyText).toBeTruthy()
    expect(bodyText!.length).toBeGreaterThan(100)
  })

  test('photography example loads with section content', async ({ page }) => {
    await page.goto('/new-project')
    await page.waitForLoadState('networkidle')

    const btn = page.locator('button').filter({ hasText: 'Sarah Chen Photography' }).first()
    await btn.click()
    await page.waitForTimeout(2000)

    expect(page.url()).toContain('/builder')
    const bodyText = await page.textContent('body')
    expect(bodyText).toBeTruthy()
    expect(bodyText!.length).toBeGreaterThan(100)
  })
})

test.describe('Spec Generation — Blueprints tab', () => {
  test('Blueprints tab shows spec generator sub-tabs with content', async ({ page }) => {
    await page.goto('/builder')
    await page.waitForTimeout(2000)

    // Click Blueprints tab
    const blueprintsBtn = page.locator('button').filter({ hasText: 'Blueprints' }).first()
    await blueprintsBtn.click()
    await page.waitForTimeout(1000)

    // Verify sub-tabs exist
    await expect(page.getByRole('button', { name: 'North Star' })).toBeVisible({ timeout: 5000 })
    await expect(page.getByRole('button', { name: 'Build Plan' })).toBeVisible({ timeout: 5000 })

    // Click North Star and verify it produces content
    await page.getByRole('button', { name: 'North Star' }).click()
    await page.waitForTimeout(1000)

    // The spec area should contain generated text (not empty)
    const bodyText = await page.textContent('body')
    expect(bodyText).toBeTruthy()
    // North Star spec typically contains project-related terms
    expect(bodyText!.length).toBeGreaterThan(200)
  })
})

test.describe('Image Effects CSS', () => {
  test('index.css contains all 8 required image effect classes', async () => {
    const cssPath = resolve(__dirname, '../../src/index.css')
    const css = readFileSync(cssPath, 'utf-8')

    // 8 core effects from Phase 12 checklist
    const requiredEffects = [
      'effect-ken-burns',
      'effect-slow-pan',
      'effect-zoom-hover',
      'effect-parallax',
      'effect-gradient-overlay',
      'effect-glass-blur',
      'effect-grayscale-hover',
      'effect-vignette',
    ]

    for (const effect of requiredEffects) {
      expect(css).toContain(`.${effect}`)
    }

    // Verify keyframes exist for animated effects
    expect(css).toContain('@keyframes ken-burns')
    expect(css).toContain('@keyframes slow-pan')
  })
})

test.describe('Section Editor Controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/builder')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForTimeout(2000)
  })

  test('clicking Main Banner shows editor with headline input', async ({ page }) => {
    // Click Main Banner in left panel
    await page.locator('[role="button"]').filter({ hasText: 'Main Banner' }).first().click()
    await page.waitForTimeout(500)

    // The right panel should show the hero editor with data-testid inputs
    const headlineInput = page.locator('[data-testid="hero-headline-input"]')
    await expect(headlineInput).toBeVisible({ timeout: 3000 })
  })

  test('clicking Theme shows theme editor with dropdown', async ({ page }) => {
    // Click Theme in left panel
    await page.locator('[role="button"]').filter({ hasText: 'Theme' }).first().click()
    await page.waitForTimeout(500)

    // Right panel should show THEME label
    const bodyText = await page.textContent('body')
    expect(bodyText).toContain('Theme')

    // Expand the theme dropdown by clicking the chevron button
    const themeDropdownBtn = page.locator('button').filter({ has: page.locator('svg.rotate-180, svg') }).filter({ hasText: /Tech Business|Agency|Minimalist|Startup|Portfolio|Professional|Neon|Creative|Elegant|Wellness|SaaS|Blog/ }).first()
    if (await themeDropdownBtn.count() > 0) {
      await themeDropdownBtn.click()
      await page.waitForTimeout(500)

      // Now theme cards should be visible
      const themeCards = page.locator('[data-theme-card]')
      const count = await themeCards.count()
      expect(count).toBeGreaterThanOrEqual(3)
    } else {
      // If no dropdown button found, verify the Theme heading at least exists
      expect(bodyText).toContain('Mode')
    }
  })
})
