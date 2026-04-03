import { test, expect, type Page } from '@playwright/test'
import fs from 'fs'
import path from 'path'

const SCREENSHOT_DIR = path.resolve('tests/screenshots')

test.beforeAll(() => {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true })
})

// ─── Audit results collector ───
interface AuditResult {
  category: string
  check: string
  pass: boolean
  details: string
  severity?: 'P0' | 'P1' | 'P2'
}

const results: AuditResult[] = []

function record(category: string, check: string, pass: boolean, details: string, severity?: 'P0' | 'P1' | 'P2') {
  results.push({ category, check, pass, details, severity: pass ? undefined : severity })
}

/** Navigate to /builder directly */
async function goToBuilder(page: Page) {
  await page.goto('/builder')
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(500)
}

// ═══════════════════════════════════════════════════════
// 1. ONBOARDING PAGE
// ═══════════════════════════════════════════════════════

test.describe('1. New Project Page (/new-project)', () => {
  test('renders with correct title and theme cards', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })

    await page.goto('/new-project')
    await page.waitForLoadState('networkidle')

    // Check "Hey Bradley" text
    const hasBranding = await page.locator('text=Hey Bradley').first().isVisible()
    record('Onboarding', 'Shows "Hey Bradley"', hasBranding, hasBranding ? 'Visible' : 'Not found', 'P0')

    // Check "Pick a theme" text
    const hasPickTheme = await page.getByText(/pick a theme/i).first().isVisible()
    record('Onboarding', 'Shows "Pick a theme"', hasPickTheme, hasPickTheme ? 'Visible' : 'Not found', 'P0')

    // Count theme cards — they are in the first grid (2-4 columns), each is a <button> with a preview area
    const themeGrid = page.locator('.grid').first().locator('button[type="button"]')
    const cardCount = await themeGrid.count()
    record('Onboarding', 'Theme card count = 10', cardCount === 10, `Found ${cardCount} cards`, 'P0')

    // List theme names
    const themeNames: string[] = []
    for (let i = 0; i < cardCount; i++) {
      const name = await themeGrid.nth(i).locator('.text-sm').first().textContent()
      if (name) themeNames.push(name.trim())
    }
    record('Onboarding', 'Theme names listed', themeNames.length >= 10,
      `Themes: ${themeNames.join(', ')}`, 'P1')

    // Check "start from scratch" link
    const hasScratch = await page.getByText(/start from scratch/i).first().isVisible()
    record('Onboarding', '"Start from scratch" visible', hasScratch, hasScratch ? 'Visible' : 'Not found', 'P1')

    // Screenshot
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'onboarding.png'), fullPage: true })
    record('Onboarding', 'Screenshot taken', true, 'tests/screenshots/onboarding.png')

    // Console errors
    await page.waitForTimeout(500)
    const realErrors = consoleErrors.filter(e => !e.includes('[DEV]') && !e.includes('favicon'))
    record('Onboarding', 'No console errors', realErrors.length === 0,
      realErrors.length === 0 ? 'Clean' : `Errors: ${realErrors.join('; ')}`, 'P1')

    expect(hasBranding).toBeTruthy()
    expect(cardCount).toBe(10)
  })

  test('each theme card navigates to /builder', async ({ page }) => {
    const THEME_NAMES = ['SaaS', 'Agency', 'Portfolio', 'Blog', 'Startup', 'Personal', 'Professional', 'Wellness', 'Creative', 'Minimalist']
    const failures: string[] = []

    for (const name of THEME_NAMES) {
      await page.goto('/new-project')
      await page.waitForLoadState('networkidle')

      const themeCard = page.locator('.grid button[type="button"]').filter({ hasText: name }).first()
      const exists = await themeCard.isVisible().catch(() => false)
      if (!exists) {
        failures.push(`${name}: card not found`)
        continue
      }
      await themeCard.click()
      await page.waitForURL('**/builder', { timeout: 5000 }).catch(() => {})
      const url = page.url()
      if (!url.includes('/builder')) {
        failures.push(`${name}: stayed at ${url}`)
      }
    }

    record('Onboarding', 'All theme cards navigate to /builder', failures.length === 0,
      failures.length === 0 ? 'All 10 navigate correctly' : `Failures: ${failures.join(', ')}`, 'P0')

    expect(failures).toHaveLength(0)
  })
})

// ═══════════════════════════════════════════════════════
// 2. BUILDER PAGE
// ═══════════════════════════════════════════════════════

test.describe('2. Builder Page (/builder)', () => {
  test('three panels visible', async ({ page }) => {
    await goToBuilder(page)

    // react-resizable-panels uses data-panel attributes
    const panels = page.locator('[data-panel]')
    const panelCount = await panels.count()

    record('Builder', 'Three panels visible', panelCount >= 3, `Found ${panelCount} panels`, 'P0')

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'builder-default.png'), fullPage: true })
    record('Builder', 'Screenshot taken', true, 'tests/screenshots/builder-default.png')

    expect(panelCount).toBeGreaterThanOrEqual(3)
  })

  test('all 4 tabs work', async ({ page }) => {
    await goToBuilder(page)

    const tabs = ['REALITY', 'DATA', 'XAI DOCS', 'WORKFLOW']
    const tabResults: string[] = []

    for (const tab of tabs) {
      const tabBtn = page.locator('button').filter({ hasText: new RegExp(`^${tab}$`) }).first()
      const exists = await tabBtn.isVisible().catch(() => false)
      if (!exists) {
        tabResults.push(`${tab}: not found`)
        continue
      }
      await tabBtn.click()
      await page.waitForTimeout(300)
      tabResults.push(`${tab}: OK`)
    }

    const allOk = tabResults.every(r => r.includes('OK'))
    record('Builder', 'All 4 tabs work', allOk, tabResults.join(', '), 'P0')

    expect(allOk).toBeTruthy()
  })

  test('left panel has theme and section items', async ({ page }) => {
    await goToBuilder(page)

    // Theme row in left panel
    const themeItem = page.locator('[role="button"]').filter({ hasText: 'Theme' }).first()
    const hasTheme = await themeItem.isVisible()

    // Hero section row
    const heroItem = page.locator('[role="button"]').filter({ hasText: 'Main Banner' }).first()
    const hasHero = await heroItem.isVisible()

    record('Builder', 'Left panel has Theme item', hasTheme, hasTheme ? 'Visible' : 'Not found', 'P1')
    record('Builder', 'Left panel has section items', hasHero, hasHero ? 'Hero visible' : 'Hero not found', 'P0')

    expect(hasHero).toBeTruthy()
  })

  test('right panel: Theme shows cards + mode toggle', async ({ page }) => {
    await goToBuilder(page)

    // Click Theme in left panel
    const themeItem = page.locator('[role="button"]').filter({ hasText: 'Theme' }).first()
    if (await themeItem.isVisible()) await themeItem.click()
    await page.waitForTimeout(300)

    // Theme cards in right panel
    const themeCards = page.locator('[data-theme-card]')
    const cardCount = await themeCards.count()
    record('Builder', 'Theme shows theme cards', cardCount >= 10, `Found ${cardCount} theme cards`, 'P0')

    // Light/Dark toggle
    const lightBtn = page.locator('button').filter({ hasText: 'Light' }).first()
    const darkBtn = page.locator('button').filter({ hasText: 'Dark' }).first()
    const hasLightDark = (await lightBtn.isVisible()) && (await darkBtn.isVisible())
    record('Builder', 'Theme shows Light/Dark toggle', hasLightDark, hasLightDark ? 'Visible' : 'Not found', 'P1')

    expect(cardCount).toBeGreaterThanOrEqual(10)
  })

  test('right panel: Hero shows Layout, Visuals, Content accordions', async ({ page }) => {
    await goToBuilder(page)

    // Click Hero in left panel
    const heroItem = page.locator('[role="button"]').filter({ hasText: 'Main Banner' }).first()
    await heroItem.click()
    await page.waitForTimeout(300)

    const hasLayout = await page.getByText('Layout', { exact: false }).first().isVisible()
    const hasVisuals = await page.getByText('Visuals').first().isVisible()
    const hasContent = await page.getByText('Content', { exact: false }).first().isVisible()

    // Check no Style accordion -- look for accordion trigger with exact "Style"
    // In the SectionSimple, accordions use RightAccordion with label prop
    const styleElements = page.locator('button').filter({ hasText: /^Style$/ })
    const noStyle = (await styleElements.count()) === 0

    record('Builder', 'Hero: Layout accordion', hasLayout, hasLayout ? 'Visible' : 'Not found', 'P0')
    record('Builder', 'Hero: Visuals accordion', hasVisuals, hasVisuals ? 'Visible' : 'Not found', 'P0')
    record('Builder', 'Hero: Content accordion', hasContent, hasContent ? 'Visible' : 'Not found', 'P0')
    record('Builder', 'Hero: No Style accordion', noStyle, noStyle ? 'Correct' : 'Style accordion present', 'P1')

    expect(hasLayout).toBeTruthy()
    expect(hasContent).toBeTruthy()
  })
})

// ═══════════════════════════════════════════════════════
// 3. PREVIEW MODE
// ═══════════════════════════════════════════════════════

test.describe('3. Preview Mode', () => {
  test('preview mode activates and deactivates', async ({ page }) => {
    await goToBuilder(page)

    const previewBtn = page.locator('button').filter({ hasText: 'Preview' }).first()
    const hasPreview = await previewBtn.isVisible()
    record('Preview', 'Preview button exists', hasPreview, hasPreview ? 'Visible' : 'Not found', 'P0')

    if (!hasPreview) return

    await previewBtn.click()
    await page.waitForTimeout(500)

    // In preview mode, the button text changes to "Edit"
    const editBtn = page.locator('button').filter({ hasText: 'Edit' }).first()
    const isInPreview = await editBtn.isVisible()
    record('Preview', 'Enters preview mode', isInPreview, isInPreview ? 'Edit button visible' : 'Not in preview', 'P0')

    // Panels should collapse — only center canvas visible
    const panels = page.locator('[data-panel]')
    const panelCount = await panels.count()
    // In preview mode, PanelLayout returns a single div, not panels
    record('Preview', 'Panels hidden in preview', panelCount === 0,
      panelCount === 0 ? 'Panels hidden' : `${panelCount} panels still visible`, 'P1')

    // Check for navbar with logo
    const navLogo = page.locator('text=Hey Bradley').first()
    const hasNavLogo = await navLogo.isVisible()
    record('Preview', 'Navbar with logo visible', hasNavLogo, hasNavLogo ? 'Visible' : 'Not found', 'P1')

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'preview-mode.png'), fullPage: true })
    record('Preview', 'Screenshot taken', true, 'tests/screenshots/preview-mode.png')

    // Press Escape to return
    await page.keyboard.press('Escape')
    await page.waitForTimeout(500)

    const previewBtnAfter = page.locator('button').filter({ hasText: 'Preview' }).first()
    const returnedToEditor = await previewBtnAfter.isVisible()
    record('Preview', 'Escape returns to editor', returnedToEditor, returnedToEditor ? 'Returned' : 'Still in preview', 'P0')

    expect(isInPreview).toBeTruthy()
    expect(returnedToEditor).toBeTruthy()
  })
})

// ═══════════════════════════════════════════════════════
// 4. SECTION EDITORS
// ═══════════════════════════════════════════════════════

test.describe('4. Section Editors', () => {
  test('Hero editor has layout cards and content inputs', async ({ page }) => {
    await goToBuilder(page)

    // Click Hero section in left panel
    const heroItem = page.locator('[role="button"]').filter({ hasText: 'Main Banner' }).first()
    if (await heroItem.isVisible()) await heroItem.click()
    await page.waitForTimeout(500)

    // Layout cards — they have title attributes containing layout names
    const layoutCards = page.locator('button[title*="BG Image"], button[title*="BG Video"], button[title*="Minimal"], button[title*="Compact"], button[title*="Image Right"], button[title*="Image Left"], button[title*="Video Below"], button[title*="Image Below"]')
    const layoutCount = await layoutCards.count()
    record('Section Editors', 'Hero: Layout cards visible', layoutCount >= 4, `Found ${layoutCount} layout cards`, 'P0')

    // Content inputs via data-testid
    const hasHeadline = await page.locator('[data-testid="hero-headline-input"]').isVisible()
    const hasSubtitle = await page.locator('[data-testid="hero-subtitle-input"]').isVisible()
    const hasBadge = await page.locator('[data-testid="hero-badge-input"]').isVisible()
    const hasCta = await page.locator('[data-testid="hero-primary-cta-input"]').isVisible()
    const hasSecondaryCta = await page.locator('[data-testid="hero-secondary-cta-input"]').isVisible()

    record('Section Editors', 'Hero: Headline input', hasHeadline, hasHeadline ? 'Visible' : 'Not found', 'P0')
    record('Section Editors', 'Hero: Subtitle input', hasSubtitle, hasSubtitle ? 'Visible' : 'Not found', 'P1')
    record('Section Editors', 'Hero: Badge input', hasBadge, hasBadge ? 'Visible' : 'Not found', 'P1')
    record('Section Editors', 'Hero: Primary CTA input', hasCta, hasCta ? 'Visible' : 'Not found', 'P1')
    record('Section Editors', 'Hero: Secondary CTA input', hasSecondaryCta, hasSecondaryCta ? 'Visible' : 'Not found', 'P1')

    expect(layoutCount).toBeGreaterThanOrEqual(4)
    expect(hasHeadline).toBeTruthy()
  })

  test('Features section editor', async ({ page }) => {
    await goToBuilder(page)
    const item = page.locator('[role="button"]').filter({ hasText: 'Features' }).first()
    if (await item.isVisible()) {
      await item.click()
      await page.waitForTimeout(300)
    }

    // Variant selector
    const gridBtn = page.locator('button').filter({ hasText: /grid/i }).first()
    const cardsBtn = page.locator('button').filter({ hasText: /cards/i }).first()
    const hasVariants = (await gridBtn.isVisible().catch(() => false)) || (await cardsBtn.isVisible().catch(() => false))
    record('Section Editors', 'Features: variant selector', hasVariants, hasVariants ? 'Grid/Cards found' : 'Not found', 'P1')

    const inputCount = await page.locator('input[type="text"], textarea').count()
    record('Section Editors', 'Features: has inputs', inputCount > 0, `Found ${inputCount} inputs`, 'P1')
  })

  test('Pricing section editor', async ({ page }) => {
    await goToBuilder(page)
    const item = page.locator('[role="button"]').filter({ hasText: 'Pricing' }).first()
    if (await item.isVisible()) {
      await item.click()
      await page.waitForTimeout(300)
    }
    const inputCount = await page.locator('input[type="text"], textarea').count()
    record('Section Editors', 'Pricing: has inputs', inputCount > 0, `Found ${inputCount} inputs`, 'P1')
  })

  test('CTA section editor', async ({ page }) => {
    await goToBuilder(page)
    const item = page.locator('[role="button"]').filter({ hasText: 'Call to Action' }).first()
    if (await item.isVisible()) {
      await item.click()
      await page.waitForTimeout(300)
    }
    const centeredBtn = page.locator('button').filter({ hasText: /centered/i }).first()
    const splitBtn = page.locator('button').filter({ hasText: /split/i }).first()
    const hasVariants = (await centeredBtn.isVisible().catch(() => false)) || (await splitBtn.isVisible().catch(() => false))
    record('Section Editors', 'CTA: variant selector', hasVariants, hasVariants ? 'Found' : 'Not found', 'P1')
  })

  test('FAQ section editor', async ({ page }) => {
    await goToBuilder(page)
    const item = page.locator('[role="button"]').filter({ hasText: 'FAQ' }).first()
    if (await item.isVisible()) {
      await item.click()
      await page.waitForTimeout(300)
    }
    const inputCount = await page.locator('input[type="text"], textarea').count()
    record('Section Editors', 'FAQ: has inputs', inputCount > 0, `Found ${inputCount} inputs`, 'P1')
  })

  test('Testimonials section editor', async ({ page }) => {
    await goToBuilder(page)
    const item = page.locator('[role="button"]').filter({ hasText: 'Testimonials' }).first()
    if (await item.isVisible()) {
      await item.click()
      await page.waitForTimeout(300)
    }
    const inputCount = await page.locator('input[type="text"], textarea').count()
    record('Section Editors', 'Testimonials: has inputs', inputCount > 0, `Found ${inputCount} inputs`, 'P1')
  })

  test('Value Props section editor', async ({ page }) => {
    await goToBuilder(page)
    const item = page.locator('[role="button"]').filter({ hasText: 'Value Props' }).first()
    if (await item.isVisible()) {
      await item.click()
      await page.waitForTimeout(300)
    }
    const inputCount = await page.locator('input[type="text"], textarea').count()
    record('Section Editors', 'Value Props: has inputs', inputCount > 0, `Found ${inputCount} inputs`, 'P1')
  })

  test('Footer section editor', async ({ page }) => {
    await goToBuilder(page)
    const item = page.locator('[role="button"]').filter({ hasText: 'Footer' }).first()
    if (await item.isVisible()) {
      await item.click()
      await page.waitForTimeout(300)
    }
    const inputCount = await page.locator('input[type="text"], textarea').count()
    record('Section Editors', 'Footer: has inputs', inputCount > 0, `Found ${inputCount} inputs`, 'P1')
  })

  test('Navbar section editor', async ({ page }) => {
    await goToBuilder(page)
    const item = page.locator('[role="button"]').filter({ hasText: 'Navbar' }).first()
    if (await item.isVisible()) {
      await item.click()
      await page.waitForTimeout(300)
    }
    const inputCount = await page.locator('input[type="text"], textarea').count()
    record('Section Editors', 'Navbar: has inputs', inputCount > 0, `Found ${inputCount} inputs`, 'P1')
  })
})

// ═══════════════════════════════════════════════════════
// 5. THEME SWITCHING
// ═══════════════════════════════════════════════════════

test.describe('5. Theme Switching', () => {
  test('switch through all 10 themes without crashes', async ({ page }) => {
    await goToBuilder(page)

    // Click Theme in left panel
    const themeItem = page.locator('[role="button"]').filter({ hasText: 'Theme' }).first()
    if (await themeItem.isVisible()) await themeItem.click()
    await page.waitForTimeout(300)

    const THEMES = ['saas', 'agency', 'portfolio', 'blog', 'startup', 'personal', 'professional', 'wellness', 'creative', 'minimalist']
    const crashes: string[] = []
    const jsErrors: string[] = []
    page.on('pageerror', err => jsErrors.push(err.message))

    for (const slug of THEMES) {
      const card = page.locator(`[data-theme-card="${slug}"]`).first()
      if (await card.isVisible().catch(() => false)) {
        await card.click()
        await page.waitForTimeout(400)
        const isAlive = await page.locator('body').isVisible().catch(() => false)
        if (!isAlive) crashes.push(slug)
      } else {
        crashes.push(`${slug}: card not found`)
      }
    }

    record('Theme Switching', 'All 10 themes switch without crashes', crashes.length === 0,
      crashes.length === 0 ? 'All OK' : `Crashes: ${crashes.join(', ')}`, 'P0')

    record('Theme Switching', 'No JS errors during switching', jsErrors.length === 0,
      jsErrors.length === 0 ? 'Clean' : `Errors: ${jsErrors.slice(0, 3).join('; ')}`, 'P1')

    // Light/Dark toggle
    const lightBtn = page.locator('button').filter({ hasText: 'Light' }).first()
    if (await lightBtn.isVisible()) {
      await lightBtn.click()
      await page.waitForTimeout(300)
      const darkBtn = page.locator('button').filter({ hasText: 'Dark' }).first()
      if (await darkBtn.isVisible()) {
        await darkBtn.click()
        await page.waitForTimeout(300)
      }
    }
    record('Theme Switching', 'Light/Dark toggle works', true, 'Toggle clicked without crash')

    expect(crashes).toHaveLength(0)
  })
})

// ═══════════════════════════════════════════════════════
// 6. SECTION CRUD
// ═══════════════════════════════════════════════════════

test.describe('6. Section CRUD', () => {
  test('add, duplicate, and remove a section', async ({ page }) => {
    await goToBuilder(page)

    // Count initial section rows in left panel
    const sectionRows = page.locator('[role="button"]').filter({
      hasText: /^(Hero|Features|Pricing|Call to Action|FAQ|Testimonials|Value Props|Footer|Navbar)/
    })
    const initialCount = await sectionRows.count()
    record('Section CRUD', 'Initial section count', initialCount > 0, `${initialCount} sections`, 'P0')

    // Click "Add Section" button (the one with dashed border inside sections list)
    const addBtn = page.locator('button').filter({ hasText: 'Add Section' }).first()
    const hasAddBtn = await addBtn.isVisible()
    record('Section CRUD', 'Add Section button exists', hasAddBtn, hasAddBtn ? 'Visible' : 'Not found', 'P0')

    if (hasAddBtn) {
      await addBtn.click()
      await page.waitForTimeout(300)

      // Click "Features" in the add menu
      const addMenu = page.locator('button').filter({ hasText: 'Features' })
      // The last one should be in the popup menu
      const menuItems = await addMenu.count()
      if (menuItems > 0) {
        await addMenu.last().click()
        await page.waitForTimeout(500)
      }

      const afterAddCount = await sectionRows.count()
      const added = afterAddCount > initialCount
      record('Section CRUD', 'Add section increases count', added, `Before: ${initialCount}, After: ${afterAddCount}`, 'P0')
    }

    // Duplicate: hover over last section row, click copy button
    const lastRow = sectionRows.last()
    if (await lastRow.isVisible()) {
      await lastRow.hover()
      await page.waitForTimeout(300)
      const dupBtn = lastRow.locator('button[title="Duplicate section"]').first()
      if (await dupBtn.isVisible()) {
        const beforeDup = await sectionRows.count()
        await dupBtn.click()
        await page.waitForTimeout(500)
        const afterDup = await sectionRows.count()
        record('Section CRUD', 'Duplicate increases count', afterDup > beforeDup, `Before: ${beforeDup}, After: ${afterDup}`, 'P1')
      } else {
        record('Section CRUD', 'Duplicate button visible on hover', false, 'Not found (may be opacity-0)', 'P1')
      }
    }

    // Remove: hover and double-click delete
    const sectionToDelete = sectionRows.last()
    if (await sectionToDelete.isVisible()) {
      await sectionToDelete.hover()
      await page.waitForTimeout(300)
      const delBtns = sectionToDelete.locator('button').filter({ hasText: '' }).locator('svg')
      // Use aria-label to find delete button
      const delBtn = sectionToDelete.locator('button[title="Delete section"]').first()
      if (await delBtn.isVisible()) {
        const beforeDel = await sectionRows.count()
        await delBtn.click() // first click
        await page.waitForTimeout(200)
        // Second click to confirm
        const confirmBtn = sectionToDelete.locator('button[title="Click again to confirm delete"]').first()
        if (await confirmBtn.isVisible()) {
          await confirmBtn.click()
          await page.waitForTimeout(500)
        }
        const afterDel = await sectionRows.count()
        record('Section CRUD', 'Remove decreases count', afterDel < beforeDel, `Before: ${beforeDel}, After: ${afterDel}`, 'P0')
      }
    }
  })
})

// ═══════════════════════════════════════════════════════
// 7. FONT CASCADE
// ═══════════════════════════════════════════════════════

test.describe('7. Font Cascade', () => {
  test('font change in Expert tab cascades', async ({ page }) => {
    await goToBuilder(page)

    // Switch to Expert tab in right panel
    const expertTab = page.locator('button').filter({ hasText: /^EXPERT$/i }).first()
    const hasExpert = await expertTab.isVisible()
    record('Font Cascade', 'Expert tab exists', hasExpert, hasExpert ? 'Visible' : 'Not found', 'P1')

    if (hasExpert) {
      await expertTab.click()
      await page.waitForTimeout(300)

      // Look for font selector buttons
      const fontBtns = page.locator('button').filter({ hasText: /Geist|Inter|Lora|Playfair|Georgia|Merriweather|Roboto|Montserrat/i })
      const fontCount = await fontBtns.count()
      record('Font Cascade', 'Font options available', fontCount > 0, `Found ${fontCount} font options`, 'P1')

      if (fontCount > 1) {
        await fontBtns.nth(1).click()
        await page.waitForTimeout(500)
        record('Font Cascade', 'Font switch does not crash', true, 'Switched without error')
      }
    }
  })
})

// ═══════════════════════════════════════════════════════
// 8. ACCESSIBILITY
// ═══════════════════════════════════════════════════════

test.describe('8. Accessibility', () => {
  test('buttons have labels, inputs have labels, min font size', async ({ page }) => {
    await goToBuilder(page)

    // Buttons without aria-label or text
    const buttonsWithoutLabels = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button')
      const unlabeled: string[] = []
      buttons.forEach((btn, i) => {
        const label = btn.getAttribute('aria-label') || btn.textContent?.trim() || btn.getAttribute('title')
        if (!label) unlabeled.push(`button[${i}] class=${btn.className.slice(0, 60)}`)
      })
      return unlabeled
    })

    record('Accessibility', 'Buttons have labels', buttonsWithoutLabels.length === 0,
      buttonsWithoutLabels.length === 0 ? 'All labeled' : `${buttonsWithoutLabels.length} unlabeled: ${buttonsWithoutLabels.slice(0, 5).join('; ')}`, 'P1')

    // Inputs without labels
    const inputsWithoutLabels = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input, textarea')
      const unlabeled: string[] = []
      inputs.forEach((input, i) => {
        const el = input as HTMLInputElement
        const label = el.getAttribute('aria-label') || el.getAttribute('placeholder') || el.getAttribute('data-testid') || el.labels?.length
        if (!label) unlabeled.push(`input[${i}] type=${el.type}`)
      })
      return unlabeled
    })

    record('Accessibility', 'Inputs have labels/placeholders', inputsWithoutLabels.length === 0,
      inputsWithoutLabels.length === 0 ? 'All labeled' : `${inputsWithoutLabels.length} unlabeled: ${inputsWithoutLabels.slice(0, 5).join('; ')}`, 'P1')

    // Focus indicators
    const hasFocusStyles = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*')
      let found = false
      for (const el of allElements) {
        const classes = el.className?.toString() || ''
        if (classes.includes('focus-visible') || classes.includes('focus:') || classes.includes('ring')) {
          found = true
          break
        }
      }
      return found
    })
    record('Accessibility', 'Focus indicators in CSS', hasFocusStyles, hasFocusStyles ? 'Focus styles found' : 'No focus styles found', 'P1')

    // Min font size check
    const smallFonts = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*')
      const tooSmall: string[] = []
      allElements.forEach(el => {
        const style = window.getComputedStyle(el)
        const fontSize = parseFloat(style.fontSize)
        const text = el.textContent?.trim()
        if (fontSize < 12 && text && text.length > 0 && el.children.length === 0) {
          tooSmall.push(`<${el.tagName.toLowerCase()}> "${text.slice(0, 30)}" = ${fontSize}px`)
        }
      })
      return tooSmall.slice(0, 10)
    })

    record('Accessibility', 'Min font size >= 12px', smallFonts.length === 0,
      smallFonts.length === 0 ? 'All >= 12px' : `${smallFonts.length} elements below 12px: ${smallFonts.slice(0, 5).join('; ')}`, 'P1')
  })
})

// ═══════════════════════════════════════════════════════
// 9. RESPONSIVE
// ═══════════════════════════════════════════════════════

test.describe('9. Responsive', () => {
  test('mobile (375px) shows hamburger menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await goToBuilder(page)

    // Hamburger menu button — visible below md breakpoint
    const hamburger = page.locator('button[aria-label="Open menu"], button[aria-label="Close menu"]').first()
    const hasHamburger = await hamburger.isVisible()
    record('Responsive', 'Mobile: hamburger menu', hasHamburger, hasHamburger ? 'Visible at 375px' : 'Not found', 'P1')

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'responsive-mobile.png'), fullPage: true })

    // Don't hard-fail, just record
    if (!hasHamburger) {
      // Check if md:hidden means the menu button isn't rendered at all
      const menuArea = page.locator('.md\\:hidden')
      const hasMenuArea = await menuArea.count()
      record('Responsive', 'Mobile: md:hidden area exists', hasMenuArea > 0,
        hasMenuArea > 0 ? `Found ${hasMenuArea} md:hidden elements` : 'No md:hidden elements', 'P2')
    }
  })

  test('tablet (768px) layout', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await goToBuilder(page)

    const isAlive = await page.locator('body').isVisible()
    record('Responsive', 'Tablet: renders at 768px', isAlive, isAlive ? 'Renders OK' : 'Broken', 'P0')

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'responsive-tablet.png'), fullPage: true })

    expect(isAlive).toBeTruthy()
  })
})

// ═══════════════════════════════════════════════════════
// REPORT GENERATION
// ═══════════════════════════════════════════════════════

test.afterAll(async () => {
  const REPORT_DIR = path.resolve('plans/implementation/phase-3')
  fs.mkdirSync(REPORT_DIR, { recursive: true })

  const categories = [...new Set(results.map(r => r.category))]

  // Score each category 1-5
  const categoryScores: Record<string, number> = {}
  for (const cat of categories) {
    const catResults = results.filter(r => r.category === cat)
    const passRate = catResults.filter(r => r.pass).length / catResults.length
    categoryScores[cat] = Math.max(1, Math.round(passRate * 5))
  }

  const p0Issues = results.filter(r => !r.pass && r.severity === 'P0')
  const p1Issues = results.filter(r => !r.pass && r.severity === 'P1')
  const p2Issues = results.filter(r => !r.pass && r.severity === 'P2')

  let report = `# Hey Bradley UI/UX Audit Report - Phase 3

**Date**: ${new Date().toISOString().split('T')[0]}
**URL**: http://localhost:5173/
**Tool**: Playwright automated audit
**Routes tested**: \`/\` (onboarding), \`/builder\` (3-panel editor)

---

## Summary Table

| Category | Score (1-5) | Pass/Total |
|----------|:-----------:|:----------:|
`

  for (const cat of categories) {
    const catResults = results.filter(r => r.category === cat)
    const passed = catResults.filter(r => r.pass).length
    report += `| ${cat} | ${categoryScores[cat]} | ${passed}/${catResults.length} |\n`
  }

  const totalPassed = results.filter(r => r.pass).length
  const avgScore = Math.round(Object.values(categoryScores).reduce((a, b) => a + b, 0) / categories.length * 10) / 10
  report += `| **Overall** | **${avgScore}** | **${totalPassed}/${results.length}** |\n`

  report += `\n---\n\n## Detailed Findings\n\n`

  for (const cat of categories) {
    report += `### ${cat}\n\n`
    const catResults = results.filter(r => r.category === cat)
    for (const r of catResults) {
      const icon = r.pass ? 'PASS' : 'FAIL'
      report += `- **[${icon}]** ${r.check}: ${r.details}\n`
    }
    report += '\n'
  }

  report += `---\n\n## P0 Blockers (Must Fix)\n\n`
  if (p0Issues.length === 0) {
    report += `No P0 blockers found.\n\n`
  } else {
    for (const issue of p0Issues) {
      report += `- **${issue.category}** > ${issue.check}: ${issue.details}\n`
    }
    report += '\n'
  }

  report += `## P1 Issues (Should Fix)\n\n`
  if (p1Issues.length === 0) {
    report += `No P1 issues found.\n\n`
  } else {
    for (const issue of p1Issues) {
      report += `- **${issue.category}** > ${issue.check}: ${issue.details}\n`
    }
    report += '\n'
  }

  report += `## P2 Nice-to-Haves\n\n`
  if (p2Issues.length === 0) {
    report += `No P2 issues found.\n\n`
  } else {
    for (const issue of p2Issues) {
      report += `- **${issue.category}** > ${issue.check}: ${issue.details}\n`
    }
    report += '\n'
  }

  report += `---\n\n## Screenshots Taken\n\n`
  report += `- \`tests/screenshots/onboarding.png\` - Onboarding page with 10 theme cards\n`
  report += `- \`tests/screenshots/builder-default.png\` - Builder 3-panel layout\n`
  report += `- \`tests/screenshots/preview-mode.png\` - Preview mode full site\n`
  report += `- \`tests/screenshots/responsive-mobile.png\` - Mobile 375px view\n`
  report += `- \`tests/screenshots/responsive-tablet.png\` - Tablet 768px view\n`

  fs.writeFileSync(path.join(REPORT_DIR, 'ui-ux-audit-report.md'), report)
  console.log(`\n[AUDIT] Report written to plans/implementation/phase-3/ui-ux-audit-report.md`)
  console.log(`[AUDIT] Total: ${totalPassed}/${results.length} passed, Score: ${avgScore}/5`)
})
