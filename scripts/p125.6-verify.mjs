// P125.6 verification — load Welcome in real browser, inspect rendered DOM,
// track image loads, capture console + network errors, screenshot at 4
// scroll positions. Reports a structured pass/fail summary.

import { chromium } from 'playwright'
import { writeFileSync, statSync } from 'node:fs'

const URL = 'http://localhost:5173/'
const SHOTS_DIR = 'plans/hitl/phase-123/screenshots'

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
})
const page = await ctx.newPage()

const consoleErrors = []
const failedRequests = []
const okRequests = []

page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text())
})
page.on('requestfailed', (req) => {
  failedRequests.push({ url: req.url(), failure: req.failure()?.errorText })
})
page.on('response', (res) => {
  const u = res.url()
  if (u.includes('unsplash.com') || u.includes('picsum.photos')) {
    okRequests.push({ url: u, status: res.status() })
  }
})

console.log(`[verify] navigating to ${URL}`)
await page.goto(URL, { waitUntil: 'networkidle', timeout: 25000 })
await page.waitForTimeout(2500) // settle animations

// Scroll the entire page first so all loading="lazy" images fire their
// IntersectionObserver and hit the network. Then return to top.
const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight)
for (let y = 0; y <= scrollHeight; y += 600) {
  await page.evaluate((py) => window.scrollTo(0, py), y)
  await page.waitForTimeout(150)
}
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(2000) // wait for late image decodes

// Inspect <img> elements
const imgReport = await page.evaluate(() => {
  const imgs = Array.from(document.querySelectorAll('img'))
  return imgs.map((img) => ({
    src: img.currentSrc || img.src,
    alt: img.alt,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
    complete: img.complete,
    visible: img.getBoundingClientRect().width > 0,
  }))
})

const totalImgs = imgReport.length
const loadedImgs = imgReport.filter((i) => i.complete && i.naturalWidth > 0).length
const brokenImgs = imgReport.filter((i) => i.complete && i.naturalWidth === 0)
const unsplashImgs = imgReport.filter((i) => i.src.includes('unsplash.com'))

// Page metrics
const docHeight = await page.evaluate(() => document.documentElement.scrollHeight)
const heroHeight = await page.evaluate(() => {
  const h = document.querySelector('section')
  return h ? h.getBoundingClientRect().height : 0
})

// Scroll positions for screenshots
const positions = [
  { name: 'verify-1-top', y: 0 },
  { name: 'verify-2-cinematic', y: 800 },
  { name: 'verify-3-stats-aisp', y: 2200 },
  { name: 'verify-4-features-cta', y: Math.max(3500, docHeight - 1200) },
]

for (const p of positions) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), p.y)
  await page.waitForTimeout(900)
  const path = `${SHOTS_DIR}/${p.name}.png`
  await page.screenshot({ path, fullPage: false })
  const sz = statSync(path).size
  console.log(`[shot] ${p.name}.png (scroll y=${p.y}) → ${(sz / 1024).toFixed(1)} KB`)
}

// Full-page screenshot
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(800)
await page.screenshot({ path: `${SHOTS_DIR}/verify-0-fullpage.png`, fullPage: true })
const fullSz = statSync(`${SHOTS_DIR}/verify-0-fullpage.png`).size
console.log(`[shot] verify-0-fullpage.png → ${(fullSz / 1024).toFixed(1)} KB`)

await browser.close()

const report = {
  url: URL,
  ts: new Date().toISOString(),
  pageMetrics: {
    docHeight,
    heroHeight,
  },
  imageReport: {
    total: totalImgs,
    loaded: loadedImgs,
    broken: brokenImgs.length,
    unsplash: unsplashImgs.length,
    brokenList: brokenImgs.map((i) => ({ src: i.src, alt: i.alt })),
    unsplashList: unsplashImgs.map((i) => ({
      src: i.src.split('?')[0].split('/').pop(),
      naturalWidth: i.naturalWidth,
      naturalHeight: i.naturalHeight,
      visible: i.visible,
    })),
  },
  network: {
    okRequests: okRequests.length,
    failedRequests: failedRequests.length,
    failedList: failedRequests,
    statusBreakdown: okRequests.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1
      return acc
    }, {}),
  },
  consoleErrors: consoleErrors.slice(0, 10),
}

writeFileSync(
  `${SHOTS_DIR}/../verify-report.json`,
  JSON.stringify(report, null, 2),
)
console.log('\n[REPORT]')
console.log(JSON.stringify(report, null, 2))
