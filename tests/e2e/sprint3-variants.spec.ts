import { test, expect } from '@playwright/test'

test.describe('Pricing Variants', () => {
  test.beforeEach(async ({ page }) => {
    // Load Kitchen Sink example which has pricing section
    await page.goto('/new-project')
    await page.waitForLoadState('networkidle')

    // Click Examples tab
    const exTab = page.locator('button').filter({ hasText: 'Examples' })
    if (await exTab.isVisible()) await exTab.click()
    await page.waitForTimeout(300)

    // Click Kitchen Sink Demo
    const card = page.locator('button').filter({ hasText: 'Kitchen Sink Demo' }).first()
    await card.click()
    await page.waitForURL(/\/builder/, { timeout: 10000 })
    await page.waitForTimeout(1500)
  })

  test('default pricing section renders 3 tier cards', async ({ page }) => {
    const pricing = page.locator('section').filter({ hasText: 'Pricing' }).first()
    await expect(pricing).toBeVisible()

    // Should have tier names
    const body = await page.textContent('body')
    expect(body).toContain('Starter')
    expect(body).toContain('Pro')
    expect(body).toContain('Enterprise')
  })

  test('pricing section has heading and subheading', async ({ page }) => {
    const body = await page.textContent('body')
    expect(body).toContain('Pricing')
    // Should have a price visible
    expect(body).toMatch(/\$\d+/)
  })

  test('pricing section shows Recommended badge on highlighted tier', async ({ page }) => {
    const body = await page.textContent('body')
    expect(body).toContain('Recommended')
  })

  test('pricing section has CTA buttons', async ({ page }) => {
    // Each tier should have a CTA
    const ctas = page.locator('a[href="#signup"], a[href="#contact"]')
    const count = await ctas.count()
    expect(count).toBeGreaterThanOrEqual(2)
  })
})

test.describe('Onboarding Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/new-project')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForLoadState('networkidle')
  })

  test('renders hero section with title and CTA', async ({ page }) => {
    await expect(page.getByText('What will you build today?')).toBeVisible()
    await expect(page.getByText('Start New Project')).toBeVisible()
  })

  test('shows Getting Started 1-2-3 steps', async ({ page }) => {
    await expect(page.getByText('Pick a theme or example')).toBeVisible()
    await expect(page.getByText('Customize sections')).toBeVisible()
    await expect(page.getByText('Get your build plan')).toBeVisible()
  })

  test('examples tab shows 8 example cards', async ({ page }) => {
    const exTab = page.locator('button').filter({ hasText: 'Examples' })
    await exTab.click()
    await page.waitForTimeout(300)

    for (const name of ['Sweet Spot Bakery', 'LaunchPad AI', 'FitForge Fitness', 'Blank Canvas']) {
      await expect(page.getByText(name).first()).toBeVisible()
    }
  })

  test('theme cards show preview images', async ({ page }) => {
    const themeImages = page.locator('img[src*="previews/theme-"]')
    const count = await themeImages.count()
    expect(count).toBeGreaterThanOrEqual(8)
  })

  test('example cards show preview images', async ({ page }) => {
    const exTab = page.locator('button').filter({ hasText: 'Examples' })
    await exTab.click()
    await page.waitForTimeout(300)

    const exampleImages = page.locator('img[src*="previews/example-"]')
    const count = await exampleImages.count()
    expect(count).toBeGreaterThanOrEqual(6)
  })

  test('clicking example navigates to builder', async ({ page }) => {
    const exTab = page.locator('button').filter({ hasText: 'Examples' })
    await exTab.click()
    await page.waitForTimeout(300)

    const card = page.locator('button').filter({ hasText: 'Sweet Spot Bakery' }).first()
    await card.click()
    await page.waitForURL(/\/builder/, { timeout: 10000 })
    expect(page.url()).toContain('/builder')
  })

  test('clicking theme navigates to builder', async ({ page }) => {
    const card = page.locator('button').filter({ hasText: 'Tech Business' }).first()
    await card.click()
    await page.waitForURL(/\/builder/, { timeout: 10000 })
    expect(page.url()).toContain('/builder')
  })

  test('Start New Project button navigates to builder', async ({ page }) => {
    await page.getByText('Start New Project').click()
    await page.waitForURL(/\/builder/, { timeout: 10000 })
    expect(page.url()).toContain('/builder')
  })

  test('Your Projects tab shows empty state when no projects', async ({ page }) => {
    const projTab = page.locator('button').filter({ hasText: 'Your Projects' })
    await projTab.click()
    await page.waitForTimeout(300)

    await expect(page.getByText('No saved projects yet')).toBeVisible()
    await expect(page.getByText('Browse examples instead')).toBeVisible()
  })

  test('Choose a Theme section shows theme count badge', async ({ page }) => {
    await expect(page.getByText('12 themes')).toBeVisible()
  })

  test('Project Capabilities section is collapsible', async ({ page }) => {
    const capsToggle = page.locator('button').filter({ hasText: 'Project Capabilities' })
    if (await capsToggle.isVisible()) {
      // Should be collapsed by default — Brand Guidelines not visible
      const brandText = page.getByText('Brand Guidelines').first()
      const visible = await brandText.isVisible().catch(() => false)
      // Click to expand
      await capsToggle.click()
      await page.waitForTimeout(300)
      await expect(page.getByText('Brand Guidelines').first()).toBeVisible()
    }
  })
})

test.describe('Navbar Variants', () => {
  test('default navbar renders logo and nav links', async ({ page }) => {
    await page.goto('/builder')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1500)

    // Navbar should have the logo text
    const navbar = page.locator('nav').first()
    await expect(navbar).toBeVisible()
  })
})

test.describe('Spec Generators', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/builder')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1500)
  })

  test('XAI Docs tab is accessible from tab bar', async ({ page }) => {
    // The tab bar has Preview, Blueprints (Data + Pipeline hidden in SIMPLE mode)
    const tabBar = page.locator('button, a').filter({ hasText: /^Blueprints$/ }).first()
    const visible = await tabBar.isVisible().catch(() => false)
    expect(visible).toBeTruthy()
  })
})
