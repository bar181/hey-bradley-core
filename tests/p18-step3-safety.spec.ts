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

  // FIX 12 — prototype-pollution regression. Malicious adapter returns a patch
  // whose VALUE contains `{ "__proto__": { "polluted": true } }` as an own key.
  // The validator's containsForbiddenKey walker must reject it; Object.prototype
  // must remain un-polluted.
  test('object-key __proto__ in patch value is rejected; Object.prototype is clean', async ({ page }) => {
    const errors = trackErrors(page)
    await loadBlogStarter(page)
    await resetToDefaultConfig(page, 'P18 Step3 Proto-Pollution')
    const before = await getHeroHeading(page)

    await page.evaluate(() => {
      const intel = (window as unknown as { __intelligenceStore: { setState: (s: unknown) => void } }).__intelligenceStore
      // JSON.parse is the only reliable way to materialise an OWN-key named
      // `__proto__` in JS — object literals treat `__proto__` as a prototype
      // setter. This mimics what an LLM-returned JSON envelope would look
      // like after responseParser.ts → JSON.parse.
      const maliciousValue = JSON.parse('{"__proto__":{"polluted":true},"text":"Pwn Joy Daily"}')
      const malicious = {
        name: () => 'simulated' as const,
        label: () => 'malicious-protokeys',
        model: () => 'malicious-v1',
        testConnection: async () => true,
        complete: async () => ({
          ok: true,
          json: {
            patches: [{
              op: 'replace',
              path: '/sections/1/components/1/props/text',
              value: maliciousValue,
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
    await input.fill('proto-pollute-trigger-1234567890')
    await page.getByRole('button', { name: /Send message/i }).click()

    await expect(page.getByTestId('chat-msg-bradley').first()).toBeVisible({ timeout: 6000 })

    // Config is unchanged.
    expect(await getHeroHeading(page)).toBe(before)

    // Object.prototype must NOT have been polluted.
    const polluted = await page.evaluate(() => {
      return (Object.prototype as unknown as Record<string, unknown>).polluted
    })
    expect(polluted).toBeUndefined()

    expect(errors).toHaveLength(0)
  })

  // FIX 13 — image URL allow-list regression (ADR-044 §5).
  test('image URL with javascript: scheme is rejected; config unchanged', async ({ page }) => {
    const errors = trackErrors(page)
    await loadBlogStarter(page)
    await resetToDefaultConfig(page, 'P18 Step3 Image js:')
    const before = await getHeroHeading(page)

    await page.evaluate(() => {
      const intel = (window as unknown as { __intelligenceStore: { setState: (s: unknown) => void } }).__intelligenceStore
      intel.setState({ adapter: {
        name: () => 'simulated' as const, label: () => 'img-js', model: () => 'img-js-v1',
        testConnection: async () => true,
        complete: async () => ({ ok: true,
          json: { patches: [
            { op: 'replace', path: '/sections/0/content/heroImage', value: 'javascript:alert(1)' },
          ], summary: 'evil img' }, tokens: { in: 1, out: 1 }, cost_usd: 0 }),
      } })
    })

    const chatTab = page.getByRole('tab', { name: /^Chat$/ }).first()
    await chatTab.click()
    const input = page.getByTestId('chat-input')
    await input.click(); await input.fill('img-bad-trigger-1234567890')
    await page.getByRole('button', { name: /Send message/i }).click()

    await expect(page.getByTestId('chat-msg-bradley').first()).toBeVisible({ timeout: 6000 })
    expect(await getHeroHeading(page)).toBe(before)
    expect(errors).toHaveLength(0)
  })

  test('image URL on disallowed host is rejected; config unchanged', async ({ page }) => {
    const errors = trackErrors(page)
    await loadBlogStarter(page)
    await resetToDefaultConfig(page, 'P18 Step3 Image bad-host')
    const before = await getHeroHeading(page)

    await page.evaluate(() => {
      const intel = (window as unknown as { __intelligenceStore: { setState: (s: unknown) => void } }).__intelligenceStore
      intel.setState({ adapter: {
        name: () => 'simulated' as const, label: () => 'img-bad-host', model: () => 'img-bad-host-v1',
        testConnection: async () => true,
        complete: async () => ({ ok: true,
          json: { patches: [
            { op: 'replace', path: '/sections/0/content/heroImage', value: 'https://evil.example.com/x.jpg' },
          ], summary: 'evil host' }, tokens: { in: 1, out: 1 }, cost_usd: 0 }),
      } })
    })

    const chatTab = page.getByRole('tab', { name: /^Chat$/ }).first()
    await chatTab.click()
    const input = page.getByTestId('chat-input')
    await input.click(); await input.fill('img-host-trigger-1234567890')
    await page.getByRole('button', { name: /Send message/i }).click()

    await expect(page.getByTestId('chat-msg-bradley').first()).toBeVisible({ timeout: 6000 })
    expect(await getHeroHeading(page)).toBe(before)
    expect(errors).toHaveLength(0)
  })

  test('image URL on images.unsplash.com is allowed; patch applied', async ({ page }) => {
    const errors = trackErrors(page)
    await loadBlogStarter(page)
    // NOTE: do NOT reset to default-config — blog-standard already has an
    // existing /sections/1/components/0/props/featuredImage to replace.
    // Activate the project so auditedComplete can attach a session row.
    await page.evaluate(() => {
      const cfg = (window as unknown as { __configStore: { getState: () => { config: unknown } } }).__configStore
      const proj = (window as unknown as { __projectStore: { getState: () => { saveProject: (n: string, c: unknown) => void } } }).__projectStore
      proj.getState().saveProject('P18 Step3 Image good-host', cfg.getState().config as never)
    })

    const goodUrl = 'https://images.unsplash.com/photo-1.jpg'

    // blog-standard has the article at sections[1].components[0]; props.featuredImage
    // exists, so `replace` resolves cleanly. The path matches the dynamic
    // /sections/<n>/components/<m>/props/featuredImage pattern in patchPaths.
    await page.evaluate((url) => {
      const intel = (window as unknown as { __intelligenceStore: { setState: (s: unknown) => void } }).__intelligenceStore
      intel.setState({ adapter: {
        name: () => 'simulated' as const, label: () => 'img-good', model: () => 'img-good-v1',
        testConnection: async () => true,
        complete: async () => ({ ok: true,
          json: { patches: [
            { op: 'replace', path: '/sections/1/components/0/props/featuredImage', value: url },
          ], summary: 'good image' }, tokens: { in: 1, out: 1 }, cost_usd: 0 }),
      } })
    }, goodUrl)

    const chatTab = page.getByRole('tab', { name: /^Chat$/ }).first()
    await chatTab.click()
    const input = page.getByTestId('chat-input')
    await input.click(); await input.fill('img-good-trigger-1234567890')
    await page.getByRole('button', { name: /Send message/i }).click()

    await expect.poll(async () => {
      return await page.evaluate(() => {
        type Comp = { id: string; type: string; props?: { featuredImage?: string } }
        type Sec = { type: string; components?: Comp[] }
        const cfg = (window as unknown as { __configStore: { getState: () => { config: { sections: Sec[] } } } }).__configStore
        return cfg.getState().config.sections[1]?.components?.[0]?.props?.featuredImage ?? ''
      })
    }, { timeout: 6000 }).toBe(goodUrl)

    expect(errors).toHaveLength(0)
  })
})
