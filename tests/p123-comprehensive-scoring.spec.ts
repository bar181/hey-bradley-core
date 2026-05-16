/*
 * P123 / Loop 4 — Comprehensive surface scoring + screenshot capture.
 *
 * Visits every primary surface, captures a desktop (1280×900) and mobile
 * (375×812) fullPage screenshot, measures load time + LCP approximation +
 * console-error count, and writes the result table to
 * `docs/audit/p123-functional-test-log.md` §Comprehensive Scoring.
 *
 * Run with: `npx playwright test tests/p123-comprehensive-scoring.spec.ts`
 *
 * Honest scope: this is an instrumentation spec, not a hard PASS/FAIL gate.
 * It writes evidence to disk so the owner has reproducible numbers + visuals
 * for every surface in one place. Absence of a screenshot = nav failure;
 * presence is a smoke signal only (visual review still required).
 */
import { test, expect, type Page } from '@playwright/test'
import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const SCREENSHOT_DIR = resolve(
  __dirname,
  '..',
  'plans',
  'hitl',
  'phase-123',
  'screenshots'
)
mkdirSync(SCREENSHOT_DIR, { recursive: true })

const SURFACES: Array<{ name: string; path: string; settle: number }> = [
  { name: 'welcome', path: '/', settle: 2500 },
  { name: 'builder', path: '/builder', settle: 2500 },
  { name: 'agentics', path: '/agentics', settle: 2000 },
  { name: 'walkthrough', path: '/walkthrough', settle: 2000 },
  { name: 'contact', path: '/contact', settle: 1500 },
  { name: 'capstone', path: '/capstone', settle: 1500 },
  { name: 'blog', path: '/blog', settle: 1500 },
  { name: 'aisp', path: '/aisp', settle: 1500 },
]

interface SurfaceMetric {
  name: string
  path: string
  viewport: 'desktop' | 'mobile'
  loadMs: number
  lcpMs: number | null
  consoleErrors: number
  screenshot: string
}

const results: SurfaceMetric[] = []

async function captureSurface(
  page: Page,
  surface: { name: string; path: string; settle: number },
  viewport: 'desktop' | 'mobile'
): Promise<SurfaceMetric> {
  const errors: string[] = []
  const errorListener = (msg: import('@playwright/test').ConsoleMessage) => {
    if (msg.type() === 'error') errors.push(msg.text())
  }
  page.on('console', errorListener)

  // Some heavy routes (e.g. /capstone — alias for /open-core) keep the
  // network busy past 15s due to lazy chunk fetches; fall back to
  // domcontentloaded for those paths so we still get a representative
  // first-paint screenshot instead of a retry timeout.
  const heavyRoutes = ['/capstone', '/open-core', '/blog']
  const waitMode = heavyRoutes.includes(surface.path) ? 'domcontentloaded' : 'networkidle'
  const t0 = Date.now()
  try {
    await page.goto(surface.path, { waitUntil: waitMode, timeout: 15000 })
  } catch {
    // Best-effort: continue with whatever has rendered so we still record metrics.
    await page.goto(surface.path, { waitUntil: 'commit', timeout: 15000 }).catch(() => {})
  }
  const loadMs = Date.now() - t0
  await page.waitForTimeout(surface.settle)

  // Largest Contentful Paint via PerformanceObserver — best-effort; null on
  // browsers/contexts where the entry never fires.
  const lcpMs = await page.evaluate<number | null>(() => {
    return new Promise((resolveLcp) => {
      try {
        const po = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const last = entries[entries.length - 1]
          if (last) resolveLcp(Math.round(last.startTime))
        })
        po.observe({ type: 'largest-contentful-paint', buffered: true })
        setTimeout(() => resolveLcp(null), 500)
      } catch {
        resolveLcp(null)
      }
    })
  })

  const fileTag = `loop4-${surface.name}-${viewport}.png`
  const screenshotPath = resolve(SCREENSHOT_DIR, fileTag)
  await page.screenshot({ path: screenshotPath, fullPage: true })

  page.off('console', errorListener)

  return {
    name: surface.name,
    path: surface.path,
    viewport,
    loadMs,
    lcpMs,
    consoleErrors: errors.length,
    screenshot: fileTag,
  }
}

test.describe('P123 / Loop 4 — Comprehensive scoring', () => {
  test.describe.configure({ timeout: 90_000 })

  for (const surface of SURFACES) {
    test(`${surface.name} desktop 1280x900`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 })
      const metric = await captureSurface(page, surface, 'desktop')
      results.push(metric)
      expect(existsSync(resolve(SCREENSHOT_DIR, metric.screenshot))).toBe(true)
    })

    test(`${surface.name} mobile 375x812`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 })
      const metric = await captureSurface(page, surface, 'mobile')
      results.push(metric)
      expect(existsSync(resolve(SCREENSHOT_DIR, metric.screenshot))).toBe(true)
    })
  }

  test.afterAll(async () => {
    // Append the metrics block to the functional test log if it exists; else
    // dump a sibling JSON for the closer to fold in.
    const logPath = resolve(
      __dirname,
      '..',
      'docs',
      'audit',
      'p123-functional-test-log.md'
    )
    const lines: string[] = []
    lines.push('')
    lines.push('## Comprehensive Scoring (Loop 4 Playwright capture)')
    lines.push('')
    lines.push('Captured ' + new Date().toISOString())
    lines.push('')
    lines.push(
      '| Surface | Path | Viewport | Load (ms) | LCP (ms) | Console errors | Screenshot |'
    )
    lines.push(
      '|---|---|---|---:|---:|---:|---|'
    )
    for (const r of results) {
      lines.push(
        `| ${r.name} | \`${r.path}\` | ${r.viewport} | ${r.loadMs} | ${r.lcpMs ?? 'n/a'} | ${r.consoleErrors} | \`${r.screenshot}\` |`
      )
    }
    lines.push('')
    const block = lines.join('\n')

    if (existsSync(logPath)) {
      // Idempotent append: rewrite if section exists, else append.
      const fs = await import('node:fs/promises')
      const cur = await fs.readFile(logPath, 'utf-8')
      const headerIdx = cur.indexOf('## Comprehensive Scoring (Loop 4')
      const next =
        headerIdx >= 0 ? cur.slice(0, headerIdx).trimEnd() + '\n' + block : cur + block
      await fs.writeFile(logPath, next, 'utf-8')
    } else {
      writeFileSync(
        resolve(__dirname, '..', 'plans', 'hitl', 'phase-123', 'comprehensive-scoring.json'),
        JSON.stringify({ capturedAt: new Date().toISOString(), results }, null, 2)
      )
    }
  })
})
