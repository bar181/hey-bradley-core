import { chromium } from 'playwright'

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
const page = await ctx.newPage()

const isAfter = process.env.AFTER === '1'
const tag = isAfter ? 'after-fix' : 'before-fix'

await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 15000 })
await page.waitForTimeout(2500)
await page.screenshot({ path: `plans/hitl/phase-123/screenshots/welcome-${tag}.png`, fullPage: true })
console.log(`Saved welcome-${tag}.png`)

if (isAfter) {
  // Capture mid-cycle frames so the typewriter progression is visible.
  await page.waitForTimeout(5000)
  await page.screenshot({ path: 'plans/hitl/phase-123/screenshots/welcome-after-fix-cycle1.png', fullPage: false })
  console.log('Saved welcome-after-fix-cycle1.png')
  await page.waitForTimeout(10000)
  await page.screenshot({ path: 'plans/hitl/phase-123/screenshots/welcome-after-fix-cycle2.png', fullPage: false })
  console.log('Saved welcome-after-fix-cycle2.png')
}

await page.goto('http://localhost:5173/builder', { waitUntil: 'networkidle', timeout: 15000 })
await page.waitForTimeout(2500)
await page.screenshot({ path: `plans/hitl/phase-123/screenshots/builder-${tag}.png`, fullPage: true })
console.log(`Saved builder-${tag}.png`)

await page.goto('http://localhost:5173/agentics', { waitUntil: 'networkidle', timeout: 15000 })
await page.waitForTimeout(2000)
await page.screenshot({ path: `plans/hitl/phase-123/screenshots/agentics-${tag}.png`, fullPage: true })
console.log(`Saved agentics-${tag}.png`)

await browser.close()
