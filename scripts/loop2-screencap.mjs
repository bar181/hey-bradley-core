// Loop 2 — visual escalation screen capture for the 4 surfaces.
// Captures full-page PNGs at 1280×900 for builder/agentics/walkthrough/contact
// after the loop-2 fixes land. Mirrors `scripts/p123-screencap.mjs` shape so
// the artifact folder convention stays consistent.
import { chromium } from 'playwright'

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
const page = await ctx.newPage()

const targets = [
  { url: '/builder', file: 'builder-loop2-after.png' },
  { url: '/agentics', file: 'agentics-loop2-after.png' },
  { url: '/walkthrough', file: 'walkthrough-loop2-after.png' },
  { url: '/contact', file: 'contact-loop2-after.png' },
]

for (const t of targets) {
  await page.goto(`http://localhost:5173${t.url}`, { waitUntil: 'networkidle', timeout: 20000 })
  // Allow walkthrough to advance past the typewriter empty frame on first load.
  await page.waitForTimeout(t.url === '/walkthrough' ? 3000 : 2200)
  await page.screenshot({
    path: `plans/hitl/phase-123/screenshots/${t.file}`,
    fullPage: true,
  })
  console.log(`Saved ${t.file}`)
}

await browser.close()
