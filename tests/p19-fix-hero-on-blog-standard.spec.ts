import { test, expect, Page } from '@playwright/test'

// P19 Fix-Pass 2 (F1) regression test.
// Spec: plans/implementation/phase-19/deep-dive/02-functionality-findings.md §2.2.
// Repro: load blog-standard.json (where the hero is at sections[0], NOT
// sections[1] like default-config). Send "Make the hero say 'Test Hero Text'".
// Before fix-pass the fixture wrote into sections[1] (the BLOG section), silently
// corrupting the article's first child. After fix-pass the resolvePath helper
// walks the active config and finds the hero at sections[0]; we assert hero
// updated AND blog section is unchanged.

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

async function loadBlogStarter(page: Page): Promise<void> {
  await page.goto('/new-project')
  await page.waitForTimeout(800)
  await page.locator('button', { hasText: 'Examples' }).first().click()
  await page.waitForTimeout(300)
  await page.locator('button', { hasText: 'Stories from the kitchen' }).first().click()
  await page.waitForURL('**/builder')
  await page.waitForSelector('[data-section-id]', { timeout: 10000 })
}

async function ensureProject(page: Page, name: string): Promise<void> {
  await page.evaluate((n) => {
    const cfg = (window as unknown as { __configStore: { getState: () => { config: unknown } } }).__configStore
    const proj = (window as unknown as { __projectStore: { getState: () => { saveProject: (n: string, c: unknown) => void } } }).__projectStore
    proj.getState().saveProject(n, cfg.getState().config as never)
  }, name)
}

// Install an adapter that piggybacks on the STEP2_FIXTURES library — same code
// path as the FixtureAdapter, so the resolvePath helper runs. AgentProxyAdapter
// (the boot-time DEV adapter when DB is ready) uses DB-seeded hardcoded paths
// that bypass the helper; updating the seed is P20 carryforward.
async function installFixtureAdapter(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const fixturesMod = await import('/src/data/llm-fixtures/step-2.ts' as never) as { STEP2_FIXTURES: unknown[] }
    const fixtureAdapterMod = await import('/src/contexts/intelligence/llm/fixtureAdapter.ts' as never) as { FixtureAdapter: new (f: unknown[]) => unknown }
    const adapter = new fixtureAdapterMod.FixtureAdapter(fixturesMod.STEP2_FIXTURES)
    const intel = (window as unknown as { __intelligenceStore: { setState: (s: unknown) => void } }).__intelligenceStore
    intel.setState({ adapter })
  })
}

test.describe('P19 Fix-Pass 2 — F1: hero update on blog-standard', () => {
  test('hero heading updates AND blog article is unchanged', async ({ page }) => {
    const errors = trackErrors(page)
    await loadBlogStarter(page)
    await ensureProject(page, 'P19 F1 hero-on-blog-standard')
    await installFixtureAdapter(page)

    // Snapshot the blog article title BEFORE the patch. blog-standard has the
    // article at sections[1].components[0].props.title.
    const beforeBlogTitle = await page.evaluate(() => {
      type Comp = { id: string; type: string; props?: { title?: string } }
      type Sec = { type: string; components?: Comp[] }
      const cfg = (window as unknown as { __configStore: { getState: () => { config: { sections: Sec[] } } } }).__configStore
      const blog = cfg.getState().config.sections.find((s) => s.type === 'blog')
      return blog?.components?.[0]?.props?.title ?? ''
    })
    expect(beforeBlogTitle).toBeTruthy()

    // Send the hero-update prompt via the chat surface.
    const chatTab = page.getByRole('tab', { name: /^Chat$/ }).first()
    await chatTab.click()
    await expect(page.getByTestId('chat-input')).toBeVisible({ timeout: 5000 })
    const input = page.getByTestId('chat-input')
    await input.click()
    await input.fill("Make the hero say 'Test Hero Text'")
    await page.getByRole('button', { name: /Send message/i }).click()

    // Hero heading must update.
    await expect.poll(async () => {
      return await page.evaluate(() => {
        type Comp = { id: string; type: string; props?: { text?: string } }
        type Sec = { type: string; components?: Comp[] }
        const cfg = (window as unknown as { __configStore: { getState: () => { config: { sections: Sec[] } } } }).__configStore
        const hero = cfg.getState().config.sections.find((s) => s.type === 'hero')
        const heading = hero?.components?.find((c) => c.type === 'heading')
        return heading?.props?.text ?? ''
      })
    }, { timeout: 6000 }).toBe('Test Hero Text')

    // Blog article title must NOT have been corrupted.
    const afterBlogTitle = await page.evaluate(() => {
      type Comp = { id: string; type: string; props?: { title?: string } }
      type Sec = { type: string; components?: Comp[] }
      const cfg = (window as unknown as { __configStore: { getState: () => { config: { sections: Sec[] } } } }).__configStore
      const blog = cfg.getState().config.sections.find((s) => s.type === 'blog')
      return blog?.components?.[0]?.props?.title ?? ''
    })
    expect(afterBlogTitle).toBe(beforeBlogTitle)

    expect(errors).toHaveLength(0)
  })
})
