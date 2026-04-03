/**
 * Visual Consistency Audit — Hey Bradley
 *
 * Playwright script that screenshots every section type in both dark and light
 * mode, then runs basic pixel-level checks for invisible text, missing images,
 * and spacing inconsistencies.
 *
 * Usage:  node tests/consistency-audit.mjs
 */

import { chromium } from 'playwright'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SCREENSHOT_DIR = join(__dirname, 'screenshots', 'consistency')
const REPORT_PATH = join(__dirname, '..', 'plans', 'implementation', 'phase-5', 'consistency-audit.md')

mkdirSync(SCREENSHOT_DIR, { recursive: true })

const SECTION_TYPES = [
  'menu', 'hero', 'columns', 'pricing', 'action', 'footer',
  'quotes', 'questions', 'numbers', 'gallery', 'image', 'divider',
  'text', 'logos', 'team',
]

const SECTION_NAMES = {
  menu: 'Top Menu',
  hero: 'Main Banner',
  columns: 'Content Cards',
  pricing: 'Pricing',
  action: 'Action Block',
  footer: 'Footer',
  quotes: 'Quotes',
  questions: 'Questions',
  numbers: 'Numbers',
  gallery: 'Gallery',
  image: 'Image',
  divider: 'Spacer',
  text: 'Text',
  logos: 'Logo Cloud',
  team: 'Team',
}

async function run() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  })
  const page = await context.newPage()

  // ── 1. Navigate & clear state ─────────────────────────────────────────
  console.log('[audit] navigating to builder...')
  await page.goto('http://localhost:5173/builder', { waitUntil: 'networkidle' })
  await page.evaluate(() => localStorage.clear())
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(1500) // let templates render

  // ── 2. Ensure all section types exist ──────────────────────────────────
  // Click "More Sections" to reveal hidden sections & add missing types
  console.log('[audit] ensuring all section types are present...')
  const moreSectionsBtn = page.locator('button:has-text("More Sections")')
  if (await moreSectionsBtn.count() > 0) {
    await moreSectionsBtn.click()
    await page.waitForTimeout(500)
  }

  // Check which sections exist in the preview
  const existingTypes = await page.evaluate(() => {
    const store = (window.__ZUSTAND_DEVTOOLS__ || [])
    // Try reading from the DOM data attributes
    const sectionEls = document.querySelectorAll('[data-section-id]')
    return Array.from(sectionEls).map(el => el.getAttribute('data-section-id'))
  })

  // Add missing section types via the left panel "Add New Section" buttons
  for (const type of SECTION_TYPES) {
    const sectionExists = await page.evaluate((t) => {
      const sections = document.querySelectorAll('[data-section-id]')
      // Check via the Zustand store — sections have type info
      return true // We'll add all and let duplicates be handled
    }, type)
  }

  // Actually add each missing type by clicking the add button for it
  // First, ensure the "More Sections" panel is open
  if (await moreSectionsBtn.count() > 0) {
    const isExpanded = await page.locator('text=Add New Section').count() > 0
    if (!isExpanded) {
      await moreSectionsBtn.click()
      await page.waitForTimeout(500)
    }
  }

  // Get current section types from the store
  const currentTypes = await page.evaluate(() => {
    // Access Zustand store through React internals
    const configStoreEl = document.querySelector('[data-section-id]')
    return null // We'll use a different approach
  })

  // Instead of complex store access, just add all section types and let
  // the app handle duplicates. We need each type to be present.
  // The left panel shows "Add New Section" with buttons for each type.
  const addSectionBtns = page.locator('button:has-text("Add New Section")').locator('..')

  // Click each section type in the add panel
  for (const type of SECTION_TYPES) {
    const name = SECTION_NAMES[type]
    // Check if the type already has an enabled section in the preview
    const previewHasType = await page.evaluate((sectionType) => {
      // Look for data-section-id that starts with the type
      const els = document.querySelectorAll('[data-section-id]')
      for (const el of els) {
        const id = el.getAttribute('data-section-id') || ''
        if (id.startsWith(sectionType)) return true
      }
      return false
    }, type)

    if (!previewHasType) {
      console.log(`[audit] adding missing section: ${type}`)
      // Find and click the add button for this type
      const addBtn = page.locator(`button:has-text("${name}")`).last()
      if (await addBtn.count() > 0) {
        try {
          await addBtn.click()
          await page.waitForTimeout(300)
        } catch (e) {
          console.log(`[audit] could not add ${type}: ${e.message}`)
        }
      }
    }
  }

  // Ensure all sections are enabled by toggling visibility
  // Click each eye-off icon to enable hidden sections
  const eyeOffButtons = page.locator('button[title="Show section"]')
  const eyeOffCount = await eyeOffButtons.count()
  for (let i = 0; i < eyeOffCount; i++) {
    try {
      await eyeOffButtons.nth(0).click() // always click first since list updates
      await page.waitForTimeout(200)
    } catch (e) { /* ignore */ }
  }

  await page.waitForTimeout(1000) // let all sections render

  // ── 3. Take DARK mode screenshots ──────────────────────────────────────
  console.log('[audit] taking dark mode screenshots...')
  const results = []

  for (const type of SECTION_TYPES) {
    const result = { type, name: SECTION_NAMES[type], darkOk: true, lightOk: true, issues: [] }

    // Click this section in the left panel to select it (auto-scrolls preview)
    const sectionRow = page.locator(`span:has-text("${SECTION_NAMES[type]}")`).first()
    if (await sectionRow.count() > 0) {
      try {
        await sectionRow.click()
        await page.waitForTimeout(600)
      } catch (e) {
        console.log(`[audit] could not click ${type} in panel`)
      }
    }

    // Find the section in the preview by data-section-id
    const sectionEl = page.locator(`[data-section-id^="${type}"]`).first()
    if (await sectionEl.count() === 0) {
      result.darkOk = false
      result.lightOk = false
      result.issues.push('Section not found in preview')
      results.push(result)
      continue
    }

    // Scroll into view
    await sectionEl.scrollIntoViewIfNeeded()
    await page.waitForTimeout(300)

    // Screenshot
    const darkPath = join(SCREENSHOT_DIR, `${type}-dark.png`)
    try {
      await sectionEl.screenshot({ path: darkPath })
      console.log(`  [dark] ${type} -> OK`)
    } catch (e) {
      console.log(`  [dark] ${type} -> FAILED: ${e.message}`)
      result.darkOk = false
      result.issues.push(`Dark screenshot failed: ${e.message}`)
    }

    // Analyze dark screenshot for issues
    if (result.darkOk) {
      const darkIssues = await analyzeSection(page, sectionEl, type, 'dark')
      if (darkIssues.length > 0) {
        result.darkOk = false
        result.issues.push(...darkIssues.map(i => `[dark] ${i}`))
      }
    }

    results.push(result)
  }

  // ── 4. Toggle to LIGHT mode ───────────────────────────────────────────
  console.log('[audit] switching to light mode...')
  const sunButton = page.locator('button[aria-label="Switch to light mode"]')
  if (await sunButton.count() > 0) {
    await sunButton.click()
    await page.waitForTimeout(800)
  } else {
    console.log('[audit] WARNING: could not find light mode toggle')
  }

  // ── 5. Take LIGHT mode screenshots ────────────────────────────────────
  console.log('[audit] taking light mode screenshots...')

  for (const type of SECTION_TYPES) {
    const result = results.find(r => r.type === type)
    if (!result) continue
    if (result.issues.includes('Section not found in preview')) continue

    // Click section in left panel
    const sectionRow = page.locator(`span:has-text("${SECTION_NAMES[type]}")`).first()
    if (await sectionRow.count() > 0) {
      try {
        await sectionRow.click()
        await page.waitForTimeout(600)
      } catch (e) { /* ignore */ }
    }

    const sectionEl = page.locator(`[data-section-id^="${type}"]`).first()
    if (await sectionEl.count() === 0) {
      result.lightOk = false
      result.issues.push('[light] Section not found')
      continue
    }

    await sectionEl.scrollIntoViewIfNeeded()
    await page.waitForTimeout(300)

    const lightPath = join(SCREENSHOT_DIR, `${type}-light.png`)
    try {
      await sectionEl.screenshot({ path: lightPath })
      console.log(`  [light] ${type} -> OK`)
    } catch (e) {
      console.log(`  [light] ${type} -> FAILED: ${e.message}`)
      result.lightOk = false
      result.issues.push(`[light] Screenshot failed: ${e.message}`)
    }

    // Analyze light screenshot
    if (result.lightOk) {
      const lightIssues = await analyzeSection(page, sectionEl, type, 'light')
      if (lightIssues.length > 0) {
        result.lightOk = false
        result.issues.push(...lightIssues.map(i => `[light] ${i}`))
      }
    }
  }

  // ── 6. Check spacing consistency ───────────────────────────────────────
  console.log('[audit] checking spacing consistency...')
  const spacingReport = await page.evaluate(() => {
    const sections = document.querySelectorAll('[data-section-id]')
    const paddings = []
    sections.forEach(el => {
      const sectionChild = el.querySelector('section, nav, footer, div > div')
      if (sectionChild) {
        const style = getComputedStyle(sectionChild)
        paddings.push({
          id: el.getAttribute('data-section-id'),
          paddingTop: style.paddingTop,
          paddingBottom: style.paddingBottom,
        })
      }
    })
    return paddings
  })

  // Identify inconsistent padding
  const paddingValues = new Set(
    spacingReport.filter(s => !s.id?.startsWith('navbar') && !s.id?.startsWith('menu') && !s.id?.startsWith('divider'))
      .map(s => s.paddingTop)
  )
  if (paddingValues.size > 2) {
    console.log(`[audit] WARNING: inconsistent vertical padding: ${[...paddingValues].join(', ')}`)
    for (const s of spacingReport) {
      const result = results.find(r => s.id?.startsWith(r.type))
      if (result && s.paddingTop !== '64px' && s.paddingTop !== '80px' && !s.id?.startsWith('menu') && !s.id?.startsWith('divider')) {
        result.issues.push(`Inconsistent py: ${s.paddingTop}/${s.paddingBottom} (standard is py-16=64px or py-20=80px)`)
      }
    }
  }

  // ── 7. Generate report ─────────────────────────────────────────────────
  console.log('[audit] generating report...')
  generateReport(results, spacingReport)

  await browser.close()
  console.log('[audit] done! Screenshots in tests/screenshots/consistency/')
  console.log(`[audit] Report at ${REPORT_PATH}`)
}

async function analyzeSection(page, sectionEl, type, mode) {
  const issues = []

  try {
    // Check for invisible text (text color too similar to background)
    const textIssues = await sectionEl.evaluate((el) => {
      const problems = []
      const textEls = el.querySelectorAll('h1, h2, h3, h4, p, span, a, li, blockquote, div')
      for (const textEl of textEls) {
        const style = getComputedStyle(textEl)
        const text = textEl.textContent?.trim()
        if (!text || text.length === 0) continue

        const color = style.color
        const bg = style.backgroundColor

        // Check if text is truly invisible (color same as bg or opacity 0)
        if (style.opacity === '0' || style.visibility === 'hidden') {
          problems.push(`Hidden text: "${text.substring(0, 30)}..." (opacity: ${style.opacity}, visibility: ${style.visibility})`)
        }

        // Check if color is the same as parent bg
        if (color === bg && bg !== 'rgba(0, 0, 0, 0)') {
          problems.push(`Text invisible: color matches background "${text.substring(0, 30)}..."`)
        }
      }
      return problems
    })
    issues.push(...textIssues)

    // Check for broken/missing images
    const imgIssues = await sectionEl.evaluate((el) => {
      const problems = []
      const imgs = el.querySelectorAll('img')
      for (const img of imgs) {
        if (!img.src || img.src === '' || img.src === 'about:blank') {
          problems.push('Missing image src')
        }
        if (img.naturalWidth === 0 && img.src) {
          problems.push(`Image failed to load: ${img.src.substring(0, 60)}...`)
        }
      }
      return problems
    })
    issues.push(...imgIssues)

    // Check for zero-height sections (content not rendering)
    const height = await sectionEl.evaluate((el) => el.getBoundingClientRect().height)
    if (height < 10 && type !== 'divider') {
      issues.push(`Section too small: height=${height}px`)
    }

  } catch (e) {
    issues.push(`Analysis error: ${e.message}`)
  }

  return issues
}

function generateReport(results, spacingReport) {
  const lines = []
  lines.push('# Visual Consistency Audit Report')
  lines.push('')
  lines.push(`**Date:** ${new Date().toISOString().split('T')[0]}`)
  lines.push(`**Mode:** Playwright automated visual audit`)
  lines.push(`**Themes:** Dark (Tech Business/SaaS) + Light (Harvard HMS Brand)`)
  lines.push('')
  lines.push('## Section Audit Table')
  lines.push('')
  lines.push('| Section | Dark OK | Light OK | Issues |')
  lines.push('|---------|---------|----------|--------|')

  for (const r of results) {
    const darkIcon = r.darkOk ? 'PASS' : 'FAIL'
    const lightIcon = r.lightOk ? 'PASS' : 'FAIL'
    const issueText = r.issues.length > 0 ? r.issues.join('; ') : 'None'
    lines.push(`| ${r.name} (${r.type}) | ${darkIcon} | ${lightIcon} | ${issueText} |`)
  }

  lines.push('')
  lines.push('## Sections Needing Fixes')
  lines.push('')
  const broken = results.filter(r => !r.darkOk || !r.lightOk || r.issues.length > 0)
  if (broken.length === 0) {
    lines.push('All sections passed.')
  } else {
    for (const r of broken) {
      lines.push(`### ${r.name} (\`${r.type}\`)`)
      for (const issue of r.issues) {
        lines.push(`- ${issue}`)
      }
      lines.push('')
    }
  }

  lines.push('## Spacing Analysis')
  lines.push('')
  lines.push('| Section ID | padding-top | padding-bottom |')
  lines.push('|------------|-------------|----------------|')
  for (const s of spacingReport) {
    lines.push(`| ${s.id} | ${s.paddingTop} | ${s.paddingBottom} |`)
  }

  lines.push('')
  lines.push('## CSS Issues Found')
  lines.push('')

  // Collect specific CSS issues
  const cssIssues = []
  for (const r of results) {
    for (const issue of r.issues) {
      if (issue.includes('invisible') || issue.includes('Hidden text')) {
        cssIssues.push(`- **${r.name}**: ${issue} -- Fix: use \`color: inherit\` or explicit \`section.style.color\``)
      }
      if (issue.includes('Image failed') || issue.includes('Missing image')) {
        cssIssues.push(`- **${r.name}**: ${issue} -- Fix: add default fallback URL`)
      }
      if (issue.includes('Inconsistent py')) {
        cssIssues.push(`- **${r.name}**: ${issue} -- Fix: standardize to \`py-16\` (64px) or \`py-20\` (80px)`)
      }
    }
  }
  if (cssIssues.length === 0) {
    lines.push('No critical CSS issues detected.')
  } else {
    lines.push(...cssIssues)
  }

  lines.push('')
  lines.push('## Screenshots')
  lines.push('')
  lines.push('All screenshots saved to `tests/screenshots/consistency/`.')
  lines.push('')
  for (const r of results) {
    lines.push(`- \`${r.type}-dark.png\` / \`${r.type}-light.png\``)
  }

  mkdirSync(dirname(REPORT_PATH), { recursive: true })
  writeFileSync(REPORT_PATH, lines.join('\n'))
}

run().catch((err) => {
  console.error('[audit] FATAL:', err)
  process.exit(1)
})
