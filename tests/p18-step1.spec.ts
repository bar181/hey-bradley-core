import { test, expect, Page } from '@playwright/test'

// Phase 18 Step 1 — wire-the-loop acceptance test.
// See plans/implementation/mvp-plan/04-phase-18-real-chat.md §0 Step 1.
// Mirrors persistence.spec.ts / llm-adapter.spec.ts (selector idioms, console-error filter).

// Filter out app-irrelevant console errors (CDN failures, dev-mode CJS interop warnings).
function trackErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return
    const t = msg.text()
    if (t.includes('Failed to load resource')) return
    if (t.includes('CJS') || t.includes('CommonJS')) return
    errors.push(t)
  })
  return errors
}

// Click the "Stories from the kitchen" starter and wait for builder to mount.
async function loadBlogStarter(page: Page): Promise<void> {
  await page.goto('/new-project')
  await page.waitForTimeout(800)
  await page.locator('button', { hasText: 'Examples' }).first().click()
  await page.waitForTimeout(300)
  await page.locator('button', { hasText: 'Stories from the kitchen' }).first().click()
  await page.waitForURL('**/builder')
  await page.waitForSelector('[data-section-id]', { timeout: 10000 })
}

test.describe('Phase 18 Step 1: wire the loop', () => {
  test('Phase 18 Step 1 — wire test button mutates hero heading', async ({ page }) => {
    const errors = trackErrors(page)

    // 1. Load the blog-standard starter via the Examples tab (per spec).
    await loadBlogStarter(page)

    // 2. The hero heading "Stories from the kitchen" should be visible in the preview.
    await expect(
      page.getByText('Stories from the kitchen', { exact: true }).first(),
    ).toBeVisible()

    // 3. STEP1_FIXTURES (authored by A1) targets the default-config layout
    //    (sections[1] = hero, components[1] = headline). Reset the store to
    //    default-config so the fixture patch path lands on the right node.
    await page.evaluate(async () => {
      const m: { default: unknown } = await import('/src/data/default-config.json' as never)
      const cfg = (window as unknown as { __configStore: { getState: () => { loadConfig: (c: unknown) => void } } }).__configStore
      cfg.getState().loadConfig(m.default)
    })
    await page.waitForSelector('[data-section-id]', { timeout: 10000 })
    await expect(page.getByText('Welcome to Your Website').first()).toBeVisible()

    // 4. Open the Settings drawer (cog icon in TopBar).
    await page.getByRole('button', { name: /Open settings/i }).first().click()
    await page.waitForSelector('[role="dialog"][aria-label="Settings"]', { timeout: 5000 })

    // 5. Find the DEV-only [Run Step 1 wire test] button. Gated by import.meta.env.DEV;
    //    visible because Playwright's vite dev server runs in DEV mode.
    const wireBtn = page.getByRole('button', { name: /Run Step 1 wire test/i })
    if ((await wireBtn.count()) === 0) {
      // Failure-detection guard: do not silently pass.
      test.fail(
        true,
        '[Run Step 1 wire test] button is not present in LLMSettings.tsx — A1 has not landed yet, or DEV-mode flag is not set.',
      )
      return
    }
    await wireBtn.first().click()

    // 6. Within 8 s the hero heading must read "Hello from LLM" (per Phase 18 §0 Step 1 acceptance).
    await expect(page.getByText('Hello from LLM').first()).toBeVisible({ timeout: 8000 })

    // 7. (Bonus) Verify configStore is the actual source of the new heading text.
    const storeHeading = await page.evaluate(() => {
      const cfg = (window as unknown as { __configStore: { getState: () => { config: { sections: Array<{ type: string; components?: Array<{ id: string; type: string; props?: { text?: string } }> }> } } } }).__configStore
      const hero = cfg.getState().config.sections.find((s) => s.type === 'hero')
      const headline = hero?.components?.find((c) => c.id === 'headline' || c.type === 'heading')
      return headline?.props?.text ?? ''
    })
    expect(storeHeading).toBe('Hello from LLM')

    expect(errors).toHaveLength(0)
  })
})
