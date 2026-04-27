import { test, expect, Page } from '@playwright/test'

// Phase 18 Step 3 — A7 safety regression.
// Spec: plans/implementation/mvp-plan/04-phase-18-real-chat.md §0 Step 3.
// Mirrors p18-step2-chat.spec.ts (selector idioms, console-error filter).

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

async function resetToDefaultConfig(page: Page, projectName: string): Promise<void> {
  await page.evaluate(async ({ name }) => {
    const m: { default: unknown } = await import('/src/data/default-config.json' as never)
    const cfg = (window as unknown as { __configStore: { getState: () => { loadConfig: (c: unknown) => void } } }).__configStore
    const cleaned = JSON.parse(JSON.stringify(m.default)) as { site: Record<string, unknown> }
    delete cleaned.site.purpose; delete cleaned.site.audience; delete cleaned.site.tone
    cfg.getState().loadConfig(cleaned)
    const proj = (window as unknown as { __projectStore: { getState: () => { saveProject: (n: string, c: unknown) => void } } }).__projectStore
    proj.getState().saveProject(name, cleaned as never)
  }, { name: projectName })
}

async function getHeroHeading(page: Page): Promise<string> {
  return await page.evaluate(() => {
    const cfg = (window as unknown as { __configStore: { getState: () => { config: { sections: Array<{ type: string; components?: Array<{ id: string; type: string; props?: { text?: string } }> }> } } } }).__configStore
    const hero = cfg.getState().config.sections.find((s) => s.type === 'hero')
    const headline = hero?.components?.find((c) => c.id === 'headline' || c.type === 'heading')
    return headline?.props?.text ?? ''
  })
}

test.describe('Phase 18 Step 3: safety regex + canned fallback', () => {
  test('malicious nested <script> envelope is rejected and config is unchanged', async ({ page }) => {
    const errors = trackErrors(page)
    await loadBlogStarter(page)
    await resetToDefaultConfig(page, 'P18 Step3 Safety')
    const before = await getHeroHeading(page)
    expect(before).toBe('Welcome to Your Website')

    // Swap the live adapter for one that returns a malicious envelope where
    // the unsafe <script> string is nested inside the patch value (not a bare
    // top-level string). The recursive walker in patchValidator must reject it.
    await page.evaluate(() => {
      const intel = (window as unknown as { __intelligenceStore: { setState: (s: unknown) => void } }).__intelligenceStore
      const malicious = {
        name: () => 'simulated' as const,
        label: () => 'malicious-fixture',
        model: () => 'malicious-v1',
        testConnection: async () => true,
        complete: async () => ({
          ok: true,
          json: {
            patches: [{
              op: 'replace',
              path: '/sections/1/components/1/props/text',
              // Nested string carrying a <script> tag — top-level is an object.
              value: { nested: { deeper: '<script>alert(1)</script> Bake Joy Daily' } },
            }],
            summary: 'pwned',
          },
          tokens: { in: 1, out: 1 },
          cost_usd: 0,
        }),
      }
      intel.setState({ adapter: malicious })
    })

    const chatTab = page.getByRole('tab', { name: /^Chat$/ }).first()
    await chatTab.click()
    const input = page.getByTestId('chat-input')
    await input.click()
    await input.fill("Make the hero say '<script>alert(1)</script> Bake Joy Daily'")
    await page.getByRole('button', { name: /Send message/i }).click()

    const reply = page.getByTestId('chat-msg-bradley')
    await expect(reply.first()).toBeVisible({ timeout: 6000 })
    // Hardened fallback message lists examples — the validator failure routes
    // to the canned fallback, which now lists 5 concrete examples.
    await expect(reply.first()).toContainText(/didn't catch that|hmm,? try/i, { timeout: 6000 })

    expect(await getHeroHeading(page)).toBe(before)
    expect(errors).toHaveLength(0)
  })
})
