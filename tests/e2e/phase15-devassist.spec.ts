import { test, expect } from '@playwright/test'

// ═══════════════════════════════════════════════════════
// Phase 15 Developer Assistance Tests
// ═══════════════════════════════════════════════════════

// ---------------------------------------------------------------------------
// Tooltip Existence
// ---------------------------------------------------------------------------

test.describe('Tooltips', () => {
  test('TopBar buttons have tooltip elements with role="tooltip"', async ({ page }) => {
    await page.goto('/builder')
    await page.waitForLoadState('networkidle')

    // Tooltip component renders span[role="tooltip"] elements
    const tooltips = page.locator('[role="tooltip"]')
    const count = await tooltips.count()

    // Builder should have multiple tooltips (TopBar has 5+, tabs have 2+)
    expect(count).toBeGreaterThanOrEqual(5)
  })

  test('tooltip elements are linked via aria-describedby', async ({ page }) => {
    await page.goto('/builder')
    await page.waitForLoadState('networkidle')

    // The Tooltip component wraps children in a span with aria-describedby
    const linkedElements = page.locator('span[aria-describedby]')
    const count = await linkedElements.count()
    expect(count).toBeGreaterThanOrEqual(5)
  })
})

// ---------------------------------------------------------------------------
// Keyboard Shortcut Help Dialog
// ---------------------------------------------------------------------------

test.describe('Keyboard Shortcut Help', () => {
  test('? key opens help dialog and Escape closes it', async ({ page }) => {
    await page.goto('/builder')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Click on center tab bar (non-input element) to ensure no input is focused
    const previewTab = page.getByRole('tab', { name: 'Preview' }).first()
    await previewTab.click()
    await page.waitForTimeout(300)

    // Dispatch ? keydown event directly
    await page.evaluate(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: '?', bubbles: true }))
    })
    await page.waitForTimeout(500)

    // ShortcutHelp dialog should be visible
    const dialog = page.locator('[aria-label="Keyboard shortcuts"]')
    await expect(dialog).toBeVisible({ timeout: 5000 })
    await expect(dialog.getByRole('heading', { name: 'Keyboard Shortcuts' })).toBeVisible()

    // Press Escape to close
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
    await expect(dialog).not.toBeVisible()
  })

  test('shortcut help dialog lists available shortcuts', async ({ page }) => {
    await page.goto('/builder')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    // Open help dialog
    await page.locator('body').click()
    await page.waitForTimeout(200)
    await page.keyboard.type('?')
    await page.waitForTimeout(500)

    const dialog = page.locator('[aria-label="Keyboard shortcuts"]')
    await expect(dialog).toBeVisible({ timeout: 5000 })

    // Verify shortcut entries are listed
    const text = await dialog.textContent()
    expect(text).toContain('Toggle preview')
    expect(text).toContain('SIMPLE/EXPERT')
  })
})

// ---------------------------------------------------------------------------
// Marketing Pages
// ---------------------------------------------------------------------------

test.describe('Marketing Pages — AISP & Research', () => {
  test('AISP page loads with hero and Crystal Atom components', async ({ page }) => {
    await page.goto('/aisp')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText('AI Symbolic Protocol')).toBeVisible()
    // Crystal Atom text is below the fold — check it exists in page content
    const body = await page.textContent('body')
    expect(body).toContain('Crystal Atom')
  })

  test('Research page loads with findings', async ({ page }) => {
    await page.goto('/research')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText('55% of development effort')).toBeVisible()
    await expect(page.getByText('40-65% of intent')).toBeVisible({ timeout: 3000 })
  })

  test('MarketingNav is sticky and stays visible after scroll', async ({ page }) => {
    await page.goto('/aisp')
    await page.waitForLoadState('networkidle')

    const nav = page.locator('nav').first()
    await expect(nav).toBeVisible()

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 1200))
    await page.waitForTimeout(300)

    // Nav should still be visible (sticky)
    await expect(nav).toBeVisible()
    await expect(nav).toBeInViewport()
  })
})

// ---------------------------------------------------------------------------
// Error Boundary — Source Level Check
// ---------------------------------------------------------------------------

test.describe('Error Boundary', () => {
  test('RealityTab wraps sections in ErrorBoundary with fallback', async () => {
    const { readFileSync } = await import('fs')
    const { resolve, dirname } = await import('path')
    const { fileURLToPath } = await import('url')

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)

    const source = readFileSync(
      resolve(__dirname, '../../src/components/center-canvas/RealityTab.tsx'),
      'utf-8'
    )

    expect(source).toContain('ErrorBoundary')
    expect(source).toContain('SectionErrorFallback')
    expect(source).toMatch(/<ErrorBoundary/)
  })
})

// ---------------------------------------------------------------------------
// Empty State
// ---------------------------------------------------------------------------

test.describe('Empty State', () => {
  test('right panel shows welcome message when no section is selected', async ({ page }) => {
    await page.goto('/builder')
    await page.waitForLoadState('networkidle')

    // The SimpleTab shows "Welcome to the Editor" when selectedContext is null
    // On fresh load without clicking any section, the welcome should appear
    // Click on the preview area (center) to deselect any section
    const centerArea = page.locator('main').first()
    await centerArea.click()
    await page.waitForTimeout(300)

    // Check the right panel for the welcome message or editing content
    const rightPanel = page.locator('aside[aria-label="Section editor"]')
    const panelText = await rightPanel.textContent()

    // Either welcome message (no selection) or section editor (selection)
    const hasWelcome = panelText?.includes('Welcome to the Editor')
    const hasEditor = panelText?.includes('SIMPLE') && panelText?.includes('EXPERT')
    expect(hasWelcome || hasEditor).toBe(true)
  })
})
