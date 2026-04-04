/**
 * Generate preview screenshots for all themes and examples.
 * Uses fresh browser contexts and clicks through the onboarding UI.
 * Usage: node scripts/generate-previews.mjs
 */
import { chromium } from 'playwright'
import { readFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const BASE = 'http://localhost:5173'
const OUTPUT = resolve(ROOT, 'public/previews')

mkdirSync(OUTPUT, { recursive: true })

const THEMES = [
  'saas', 'agency', 'portfolio', 'startup', 'personal',
  'professional', 'wellness', 'minimalist', 'creative', 'blog',
]

const EXAMPLE_MAP = {
  'bakery': 'Sweet Spot Bakery',
  'launchpad': 'LaunchPad AI',
  'photography': 'Sarah Chen Photography',
  'consulting': 'GreenLeaf Consulting',
  'fitforge': 'FitForge Fitness',
  'florist': 'Bloom & Petal',
  'kitchen-sink': 'Kitchen Sink Demo',
  'blank': 'Blank Canvas',
}

async function screenshotViaClick(browser, label, clickFn, outputPath) {
  // Fresh context = fresh localStorage
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  try {
    await page.goto(`${BASE}/new-project`, { waitUntil: 'networkidle', timeout: 15000 })
    await page.waitForTimeout(600)

    // Perform the click action (theme or example selection)
    await clickFn(page)

    // Wait for builder to load and render
    await page.waitForURL(/\/builder/, { timeout: 10000 })
    await page.waitForTimeout(2000)

    // Enter preview mode — hides panels, shows clean website
    await page.evaluate(() => {
      // Find Zustand store on React fiber tree
      const root = document.getElementById('root')
      if (!root || !root._reactRootContainer && !root.__reactFiber$) {
        // Direct approach: dispatch via store module
      }
      // The uiStore is imported as a module - we need to access it through the app
      // Simpler: hide panels via CSS
      document.querySelectorAll('aside, header, footer, nav').forEach(el => {
        if (el.closest('[data-preview]')) return
        el.style.display = 'none'
      })
      // Find the section container and make it full width
      const container = document.querySelector('.overflow-auto') || document.querySelector('main')
      if (container) {
        container.style.position = 'fixed'
        container.style.inset = '0'
        container.style.zIndex = '9999'
        container.style.width = '100vw'
        container.style.height = '100vh'
        container.style.overflow = 'auto'
      }
    })
    await page.waitForTimeout(1000)

    // Full viewport screenshot — now shows clean preview
    await page.screenshot({
      path: outputPath,
      clip: { x: 0, y: 0, width: 1440, height: 900 },
    })
    console.log(`  ✓ ${label}`)
    return true
  } catch (err) {
    console.error(`  ✗ ${label}: ${err.message}`)
    return false
  } finally {
    await context.close()
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true })

  // THEMES
  for (const slug of THEMES) {
    const themeJson = JSON.parse(readFileSync(resolve(ROOT, `src/data/themes/${slug}.json`), 'utf8'))
    const themeName = themeJson.meta.name
    console.log(`Theme: ${slug} (${themeName})`)

    await screenshotViaClick(
      browser,
      `theme-${slug}.png`,
      async (page) => {
        // Theme cards are in the right panel — find by exact theme name text
        const card = page.locator('button').filter({ hasText: themeName }).first()
        await card.waitFor({ state: 'visible', timeout: 5000 })
        await card.click()
      },
      resolve(OUTPUT, `theme-${slug}.png`)
    )
  }

  // EXAMPLES
  for (const [slug, name] of Object.entries(EXAMPLE_MAP)) {
    console.log(`Example: ${slug} (${name})`)

    await screenshotViaClick(
      browser,
      `example-${slug}.png`,
      async (page) => {
        // Click Examples tab first
        const exTab = page.locator('button').filter({ hasText: 'Examples' })
        if (await exTab.count() > 0) {
          await exTab.click()
          await page.waitForTimeout(400)
        }
        // Click the example card
        const card = page.locator('button').filter({ hasText: name }).first()
        await card.waitFor({ state: 'visible', timeout: 5000 })
        await card.click()
      },
      resolve(OUTPUT, `example-${slug}.png`)
    )
  }

  await browser.close()
  console.log('\nDone! Generated 18 preview screenshots.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
