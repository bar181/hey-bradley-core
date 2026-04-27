import { test, expect, Page } from '@playwright/test'

// Phase 18 Step 3 — multi-patch + atomic abort acceptance test.
// Spec: plans/implementation/mvp-plan/04-phase-18-real-chat.md §0 Step 3.

function trackErrors(page: Page): string[] {
  const errs: string[] = []
  page.on('pageerror', (e) => errs.push(e.message))
  page.on('console', (m) => {
    if (m.type() !== 'error') return
    const t = m.text()
    if (t.includes('Failed to load resource') || t.includes('CJS') || t.includes('CommonJS')) return
    errs.push(t)
  })
  return errs
}

// blog-standard active: article at /sections/1/components/0/props.*
async function loadBlogStarter(page: Page): Promise<void> {
  await page.goto('/new-project'); await page.waitForTimeout(800)
  await page.locator('button', { hasText: 'Examples' }).first().click()
  await page.waitForTimeout(300)
  await page.locator('button', { hasText: 'Stories from the kitchen' }).first().click()
  await page.waitForURL('**/builder')
  await page.waitForSelector('[data-section-id]', { timeout: 10000 })
}

async function activateProject(page: Page, name: string): Promise<string> {
  return await page.evaluate((n) => {
    const cfg = (window as unknown as { __configStore: { getState: () => { config: unknown } } }).__configStore
    const proj = (window as unknown as { __projectStore: { getState: () => { saveProject: (n: string, c: unknown) => void; activeProject: string | null } } }).__projectStore
    proj.getState().saveProject(n, cfg.getState().config as never)
    return proj.getState().activeProject ?? ''
  }, name)
}

interface ArticleProps { title?: string; excerpt?: string; author?: string }

async function getArticleProps(page: Page): Promise<ArticleProps> {
  return await page.evaluate(() => {
    type S = { type: string; components?: Array<{ id: string; props?: ArticleProps }> }
    const cfg = (window as unknown as { __configStore: { getState: () => { config: { sections: S[] } } } }).__configStore
    const blog = cfg.getState().config.sections.find((s) => s.type === 'blog')
    const a = blog?.components?.find((c) => c.id === 'article-1')
    return { title: a?.props?.title ?? '', excerpt: a?.props?.excerpt ?? '', author: a?.props?.author ?? '' }
  })
}

async function llmCallCount(page: Page): Promise<number> {
  return await page.evaluate(async () => {
    const sess: { activeSession: (pid: string) => { id: string } | undefined } =
      await import('/src/contexts/persistence/repositories/sessions.ts' as never)
    const calls: { listLLMCalls: (sid: string) => unknown[] } =
      await import('/src/contexts/persistence/repositories/llmCalls.ts' as never)
    const proj = (window as unknown as { __projectStore: { getState: () => { activeProject: string | null } } }).__projectStore
    const pid = proj.getState().activeProject
    const s = pid ? sess.activeSession(pid) : undefined
    return s ? calls.listLLMCalls(s.id).length : 0
  })
}

async function sendChat(page: Page, text: string): Promise<void> {
  await page.getByRole('tab', { name: /^Chat$/ }).first().click()
  await expect(page.getByTestId('chat-input')).toBeVisible({ timeout: 5000 })
  const input = page.getByTestId('chat-input')
  await input.click(); await input.fill(text)
  await page.getByRole('button', { name: /Send message/i }).click()
}

test.describe('Phase 18 Step 3: multi-patch + atomic abort', () => {
  test('happy path — 3-patch fixture mutates all 3 fields, one audit row', async ({ page }) => {
    const errors = trackErrors(page)
    await loadBlogStarter(page)
    expect(await activateProject(page, 'P18 Step3 Multi Happy')).toBeTruthy()

    const before = await getArticleProps(page)
    const beforeRows = await llmCallCount(page)

    await sendChat(page, 'Write a short blog article about sourdough bread')

    await expect.poll(async () => (await getArticleProps(page)).title, { timeout: 6000 })
      .toBe('A short story about sourdough bread')
    const after = await getArticleProps(page)
    expect(after.excerpt).not.toBe(before.excerpt)
    expect(after.excerpt).toContain('sourdough bread')
    expect(after.author).toBe('Bradley')

    expect(await llmCallCount(page)).toBe(beforeRows + 1)
    expect(errors).toHaveLength(0)
  })

  test('atomic abort — fixture with one bad path leaves config untouched', async ({ page }) => {
    const errors = trackErrors(page)
    await loadBlogStarter(page)
    await activateProject(page, 'P18 Step3 Multi Abort')
    const before = await getArticleProps(page)
    expect(before.title).toBeTruthy()

    // Test-only fixture: 2 patches, 2nd has illegal prototype-pollution segment.
    await page.evaluate(() => {
      const intel = (window as unknown as { __intelligenceStore: { setState: (s: unknown) => void } }).__intelligenceStore
      intel.setState({ adapter: {
        name: () => 'simulated' as const, label: () => 'multi-bad', model: () => 'multi-bad-v1',
        testConnection: async () => true,
        complete: async () => ({ ok: true,
          json: { patches: [
            { op: 'replace', path: '/sections/1/components/0/props/title', value: 'REVERT_ME' },
            { op: 'replace', path: '/sections/0/__proto__/polluted', value: 'pwn' },
          ], summary: 'two patches; second is illegal' },
          tokens: { in: 10, out: 10 }, cost_usd: 0 }),
      } })
    })

    await sendChat(page, 'multi-bad-trigger-1234567890')
    await expect(page.getByTestId('chat-msg-bradley').first()).toBeVisible({ timeout: 6000 })

    const after = await getArticleProps(page)
    expect(after.title).toBe(before.title)
    expect(after.excerpt).toBe(before.excerpt)
    expect(after.author).toBe(before.author)
    expect(errors).toHaveLength(0)
  })
})
