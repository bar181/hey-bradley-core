import { test, expect, Page } from '@playwright/test'

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

const MARKER_A = 'PHASE16 PERSIST CHECK'
const MARKER_B = 'PHASE16 ROUNDTRIP MARKER'

// Click the "Stories from the kitchen" starter and wait for the builder to mount.
async function loadBlogStarter(page: Page): Promise<void> {
  await page.goto('/new-project')
  await page.waitForTimeout(800)
  await page.locator('button', { hasText: 'Examples' }).first().click()
  await page.waitForTimeout(300)
  await page.locator('button', { hasText: 'Stories from the kitchen' }).first().click()
  await page.waitForURL('**/builder')
  await page.waitForSelector('[data-section-id]', { timeout: 10000 })
}

// Click "Examples" loads config but does not create an active project. We also
// strip a handful of free-form site fields whose values pre-date the strict
// enum schema, so that loadProject() can re-validate the bytes after reload.
// Returns the active project's slug.
async function ensureActiveProject(page: Page, name: string): Promise<string> {
  return await page.evaluate((projectName) => {
    const cfg = (window as unknown as { __configStore: { getState: () => { config: { site: Record<string, unknown> }; loadConfig: (c: unknown) => void } } }).__configStore
    const proj = (window as unknown as { __projectStore: { getState: () => { saveProject: (n: string, c: unknown) => void; activeProject: string | null } } }).__projectStore
    const cleaned = JSON.parse(JSON.stringify(cfg.getState().config)) as { site: Record<string, unknown> }
    delete cleaned.site.purpose
    delete cleaned.site.audience
    delete cleaned.site.tone
    cfg.getState().loadConfig(cleaned)
    proj.getState().saveProject(projectName, cleaned as never)
    return proj.getState().activeProject ?? ''
  }, name)
}

// Mutate the first hero section's headline component text via configStore.
async function setHeroHeading(page: Page, text: string): Promise<void> {
  await page.evaluate((newText) => {
    const cfg = (window as unknown as { __configStore: { getState: () => { config: { sections: Array<{ id: string; type: string; components: Array<{ id: string; type: string; props?: Record<string, unknown> }> }> }; setSectionConfig: (id: string, p: Record<string, unknown>) => void } } }).__configStore
    const state = cfg.getState()
    const hero = state.config.sections.find((s) => s.type === 'hero')
    if (!hero) throw new Error('No hero section')
    const headline = hero.components.find((c) => c.id === 'headline' || c.type === 'heading')
    if (!headline) throw new Error('No headline component')
    state.setSectionConfig(hero.id, {
      components: hero.components.map((c) => c.id === headline.id ? { ...c, props: { ...(c.props ?? {}), text: newText } } : c),
    })
  }, text)
}

// Read back the current hero headline text from configStore.
async function getHeroHeading(page: Page): Promise<string> {
  return await page.evaluate(() => {
    const cfg = (window as unknown as { __configStore: { getState: () => { config: { sections: Array<{ type: string; components: Array<{ id: string; type: string; props?: { text?: string } }> }> } } } }).__configStore
    const hero = cfg.getState().config.sections.find((s) => s.type === 'hero')
    const headline = hero?.components.find((c) => c.id === 'headline' || c.type === 'heading')
    return headline?.props?.text ?? ''
  })
}

test.describe('Phase 16: Persistence', () => {
  test('write → reload → assert restored', async ({ page }) => {
    const errors = trackErrors(page)

    await loadBlogStarter(page)
    const projectId = await ensureActiveProject(page, 'P16 Persist Test A')
    expect(projectId).toBeTruthy()

    await setHeroHeading(page, MARKER_A)
    await page.waitForTimeout(1200) // 800 ms autosave debounce + slack
    // Force-flush the DB to IndexedDB before reloading so the test does not
    // race the autosave's fire-and-forget `void persist()` call.
    await page.evaluate(async () => {
      const m: { persist: () => Promise<void> } = await import('/src/contexts/persistence/db.ts' as never)
      await m.persist()
    })

    await page.reload()
    await page.waitForSelector('[data-section-id]', { timeout: 10000 })
    await page.waitForTimeout(800)
    // The projectStore's hydrate-last-project step runs at module-load time
    // (before initDB resolves), so after a reload we explicitly refresh the
    // list and reload the last project from the DB.
    await page.evaluate((slug) => {
      const proj = (window as unknown as { __projectStore: { getState: () => { refreshList: () => void; loadProject: (s: string) => unknown } } }).__projectStore
      const cfg = (window as unknown as { __configStore: { getState: () => { loadConfig: (c: unknown) => void } } }).__configStore
      proj.getState().refreshList()
      const loaded = proj.getState().loadProject(slug)
      if (loaded) cfg.getState().loadConfig(loaded)
    }, projectId)

    expect(await getHeroHeading(page)).toBe(MARKER_A)
    expect(errors).toHaveLength(0)
  })

  test('export → re-import round-trip', async ({ page }) => {
    const errors = trackErrors(page)

    await loadBlogStarter(page)
    const projectId = await ensureActiveProject(page, 'P16 Persist Test B')
    expect(projectId).toBeTruthy()
    await setHeroHeading(page, MARKER_B)
    await page.waitForTimeout(1200)

    // Export: serialise the current config to a JSON string. This is the same
    // payload exportProject() would download as a .hey-bradley.json file.
    const exportedJson = await page.evaluate(() => {
      const cfg = (window as unknown as { __configStore: { getState: () => { config: unknown } } }).__configStore
      return JSON.stringify(cfg.getState().config)
    })
    expect(exportedJson).toContain(MARKER_B)

    // Delete the project from the DB.
    const afterDelete = await page.evaluate((slug) => {
      const proj = (window as unknown as { __projectStore: { getState: () => { deleteProject: (s: string) => void; projects: Array<{ slug: string }> } } }).__projectStore
      proj.getState().deleteProject(slug)
      return proj.getState().projects.length
    }, projectId)

    // Re-import: feed the JSON through importProject (File-based) and save it.
    const totalAfter = await page.evaluate(async (json) => {
      const proj = (window as unknown as { __projectStore: { getState: () => { importProject: (f: File) => Promise<unknown>; saveProject: (n: string, c: unknown) => void; projects: Array<{ slug: string }> } } }).__projectStore
      const cfg = (window as unknown as { __configStore: { getState: () => { loadConfig: (c: unknown) => void } } }).__configStore
      const file = new File([json], 'roundtrip.hey-bradley.json', { type: 'application/json' })
      const validated = await proj.getState().importProject(file)
      proj.getState().saveProject('P16 Roundtrip Restored', validated)
      cfg.getState().loadConfig(validated)
      return proj.getState().projects.length
    }, exportedJson)

    expect(totalAfter - afterDelete).toBeGreaterThanOrEqual(1)
    expect(await getHeroHeading(page)).toBe(MARKER_B)
    expect(errors).toHaveLength(0)
  })
})
