import { test, expect } from '@playwright/test'

/**
 * Phase 16 — Image Effects Audit
 *
 * Uses the Zustand store (exposed on window.__configStore in dev mode) to:
 *   1. Add an Image section
 *   2. Set each effect via setSectionConfig
 *   3. Verify .effect-{id} CSS class renders in preview
 *   4. Check computed styles
 *   5. Screenshot for visual evidence
 */

const EFFECTS: Array<{
  id: string
  label: string
  cssCheck: 'animation' | 'filter' | 'pseudo' | 'transition' | 'opacity' | 'bgAttach'
  cssExpect: string
  description: string
}> = [
  { id: 'gradient-overlay',  label: 'Gradient Overlay',    cssCheck: 'pseudo',     cssExpect: 'content',     description: '::after linear-gradient overlay' },
  { id: 'ken-burns',         label: 'Ken Burns',           cssCheck: 'animation',  cssExpect: 'ken-burns',   description: '20s zoom animation' },
  { id: 'slow-pan',          label: 'Slow Pan',            cssCheck: 'animation',  cssExpect: 'slow-pan',    description: '30s horizontal pan' },
  { id: 'zoom-hover',        label: 'Zoom on Hover',       cssCheck: 'transition', cssExpect: 'transform',   description: 'transform hover scale' },
  { id: 'parallax',          label: 'Parallax Scroll',     cssCheck: 'bgAttach',   cssExpect: 'fixed',       description: 'background-attachment: fixed' },
  { id: 'glass-blur',        label: 'Glass Blur',          cssCheck: 'pseudo',     cssExpect: 'content',     description: '::after backdrop-filter blur' },
  { id: 'grayscale-hover',   label: 'Color on Hover',      cssCheck: 'filter',     cssExpect: 'grayscale',   description: 'filter: grayscale(100%)' },
  { id: 'vignette',          label: 'Vignette',            cssCheck: 'pseudo',     cssExpect: 'content',     description: '::after radial-gradient edges' },
  { id: 'holographic',       label: 'Holographic Shimmer', cssCheck: 'transition', cssExpect: 'transform',   description: 'scale + box-shadow transition' },
  { id: 'tilt-3d',           label: '3D Tilt',             cssCheck: 'transition', cssExpect: 'transform',   description: 'perspective rotate transition' },
  { id: 'sepia-to-color',    label: 'Sepia to Color',      cssCheck: 'filter',     cssExpect: 'sepia',       description: 'filter: sepia(100%)' },
  { id: 'reveal-slide',      label: 'Reveal Slide',        cssCheck: 'pseudo',     cssExpect: 'content',     description: '::after overlay slides on hover' },
  { id: 'fade-in-scroll',    label: 'Fade In on Scroll',   cssCheck: 'opacity',    cssExpect: '0',           description: 'opacity: 0 initial' },
]

// Helper: access the Zustand store exposed on window in dev mode
async function storeEval(page: import('@playwright/test').Page, fn: string) {
  return page.evaluate(fn)
}

test.describe('Image Effects Audit — All 13 Effects', () => {

  test('All 13 effect CSS rules exist in stylesheet', async ({ page }) => {
    await page.goto('/builder')
    await page.waitForLoadState('networkidle')

    const missing = await page.evaluate(() => {
      const ids = [
        'gradient-overlay','ken-burns','slow-pan','zoom-hover','parallax',
        'glass-blur','grayscale-hover','vignette','holographic','tilt-3d',
        'sepia-to-color','reveal-slide','fade-in-scroll',
      ]
      const sels: string[] = []
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          for (const rule of Array.from(sheet.cssRules))
            if (rule instanceof CSSStyleRule) sels.push(rule.selectorText)
        } catch { /* cross-origin */ }
      }
      const all = sels.join(' ')
      return ids.filter(id => !all.includes(`.effect-${id}`))
    })

    console.log('\n=== CSS Rule Audit ===')
    for (const e of EFFECTS) {
      console.log(`  .effect-${e.id}: ${missing.includes(e.id) ? '❌ MISSING' : '✅ FOUND'}`)
    }
    expect(missing, `Missing CSS: ${missing.join(', ')}`).toHaveLength(0)
  })

  for (const effect of EFFECTS) {
    test(`Effect renders: ${effect.label} (${effect.id})`, async ({ page }) => {
      await page.goto('/builder')
      await page.waitForLoadState('networkidle')

      // Step 1: Add an Image section and set the effect via the store
      const sectionId = await page.evaluate((eid) => {
        const store = (window as Record<string, unknown>).__configStore as {
          getState: () => {
            config: { sections: Array<{ id: string; type: string; style: Record<string, unknown> }> }
            addSection: (type: string) => void
            setSectionConfig: (id: string, patch: Record<string, unknown>) => void
          }
        }
        if (!store) return null

        const state = store.getState()
        state.addSection('image')

        // Find the newly added image section (last one of type 'image')
        const updated = store.getState()
        const imageSections = updated.config.sections.filter(s => s.type === 'image')
        const imgSection = imageSections[imageSections.length - 1]
        if (!imgSection) return null

        // Set the effect
        updated.setSectionConfig(imgSection.id, {
          style: { ...imgSection.style, imageEffect: eid }
        })

        return imgSection.id
      }, effect.id)

      expect(sectionId, 'Store should be available and section added').toBeTruthy()

      // Wait for React to re-render
      await page.waitForTimeout(500)

      // Step 2: Verify .effect-{id} class is in the DOM
      const effectEl = page.locator(`.effect-${effect.id}`).first()
      const classApplied = await effectEl.isVisible().catch(() => false)

      // Step 3: Check computed styles
      let styleResult = 'SKIP (element not found)'
      if (classApplied) {
        styleResult = await effectEl.evaluate((el, chk) => {
          const cs = window.getComputedStyle(el)
          const after = window.getComputedStyle(el, '::after')
          switch (chk.cssCheck) {
            case 'animation':
              return cs.animationName.includes(chk.cssExpect) ? 'PASS' : `FAIL (animation: ${cs.animationName})`
            case 'filter':
              return cs.filter.includes(chk.cssExpect) ? 'PASS' : `FAIL (filter: ${cs.filter})`
            case 'pseudo':
              return after.content && after.content !== 'none' ? 'PASS' : `FAIL (::after content: ${after.content})`
            case 'transition':
              return cs.transition.includes(chk.cssExpect) ? 'PASS' : `FAIL (transition: ${cs.transition})`
            case 'opacity':
              return cs.opacity === chk.cssExpect ? 'PASS' : `FAIL (opacity: ${cs.opacity})`
            case 'bgAttach':
              return cs.backgroundAttachment === chk.cssExpect ? 'PASS' : `FAIL (bgAttach: ${cs.backgroundAttachment})`
            default:
              return 'UNKNOWN'
          }
        }, effect)
      }

      // Step 4: Screenshot
      await page.screenshot({
        path: `tests/screenshots/effects/effect-${effect.id}.png`,
        fullPage: false,
      })

      // Checklist output
      console.log(`\n┌─ ${effect.label} (${effect.id})`)
      console.log(`│  CSS class .effect-${effect.id}: ${classApplied ? '✅ APPLIED' : '❌ MISSING'}`)
      console.log(`│  Computed style (${effect.cssCheck}): ${styleResult}`)
      console.log(`│  Expected: ${effect.description}`)
      console.log(`└─ Screenshot: tests/screenshots/effects/effect-${effect.id}.png`)

      expect(classApplied, `.effect-${effect.id} should be visible`).toBe(true)
      expect(styleResult).toBe('PASS')
    })
  }
})
