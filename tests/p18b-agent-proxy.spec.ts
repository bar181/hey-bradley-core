import { test, expect, Page } from '@playwright/test'

// Phase 18b Wave 1 — AgentProxyAdapter (DB-backed mock LLM) acceptance test.
// Spec: plans/implementation/phase-18b/wave-1.md (Agent A1).
// Decision record: docs/adr/ADR-046-multi-provider-llm-architecture.md
//
// COORDINATION: A1b seeds the `example_prompts` table via migration
// 001-example-prompts.sql with the slug 'starter-hero-text-bake'
// (user_prompt = "Make the hero say \"Bake Joy Daily\"") returning a single
// replace patch on /sections/1/components/1/props/text. This file uses that
// seeded row to drive the happy-path assertion below.

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

async function resetToDefaultConfig(page: Page, projectName: string): Promise<string> {
  return await page.evaluate(async ({ name }) => {
    const m: { default: unknown } = await import('/src/data/default-config.json' as never)
    const cfg = (window as unknown as { __configStore: { getState: () => { loadConfig: (c: unknown) => void; config: { site: Record<string, unknown> } } } }).__configStore
    const cleaned = JSON.parse(JSON.stringify(m.default)) as { site: Record<string, unknown> }
    delete cleaned.site.purpose
    delete cleaned.site.audience
    delete cleaned.site.tone
    cfg.getState().loadConfig(cleaned)
    const proj = (window as unknown as { __projectStore: { getState: () => { saveProject: (n: string, c: unknown) => void; activeProject: string | null } } }).__projectStore
    proj.getState().saveProject(name, cleaned as never)
    return proj.getState().activeProject ?? ''
  }, { name: projectName })
}

// Replace the live adapter with a fresh AgentProxyAdapter so this test asserts
// the DB-backed path regardless of any other agent's pickAdapter precedence.
async function installAgentProxyAdapter(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const mod: { AgentProxyAdapter: new () => unknown } =
      await import('/src/contexts/intelligence/llm/agentProxyAdapter.ts' as never)
    const intel = (window as unknown as { __intelligenceStore: { setState: (s: unknown) => void } }).__intelligenceStore
    intel.setState({ adapter: new mod.AgentProxyAdapter() })
  })
}

async function getHeroHeading(page: Page): Promise<string> {
  return await page.evaluate(() => {
    const cfg = (window as unknown as { __configStore: { getState: () => { config: { sections: Array<{ type: string; components?: Array<{ id: string; type: string; props?: { text?: string } }> }> } } } }).__configStore
    const hero = cfg.getState().config.sections.find((s) => s.type === 'hero')
    const headline = hero?.components?.find((c) => c.id === 'headline' || c.type === 'heading')
    return headline?.props?.text ?? ''
  })
}

async function sendChat(page: Page, text: string): Promise<void> {
  await page.getByRole('tab', { name: /^Chat$/ }).first().click()
  await expect(page.getByTestId('chat-input')).toBeVisible({ timeout: 5000 })
  const input = page.getByTestId('chat-input')
  await input.click()
  await input.fill(text)
  await page.getByRole('button', { name: /Send message/i }).click()
}

test.describe('Phase 18b Wave 1: AgentProxyAdapter (DB fixtures)', () => {
  test('happy path — seeded example_prompt updates hero heading', async ({ page }) => {
    const errors = trackErrors(page)
    await loadBlogStarter(page)
    expect(await resetToDefaultConfig(page, 'P18b AgentProxy Happy')).toBeTruthy()
    await page.waitForSelector('[data-section-id]', { timeout: 10000 })
    await expect(page.getByText('Welcome to Your Website').first()).toBeVisible()

    await installAgentProxyAdapter(page)

    // Seeded user_prompt for slug 'starter-hero-text-bake'.
    await sendChat(page, 'Make the hero say "Bake Joy Daily"')

    await expect.poll(async () => getHeroHeading(page), { timeout: 6000 }).toBe('Bake Joy Daily')
    await expect(page.getByText('Bake Joy Daily').first()).toBeVisible({ timeout: 6000 })
    expect(errors).toHaveLength(0)
  })

  test('miss path — unmatched prompt returns invalid_response and falls back', async ({ page }) => {
    const errors = trackErrors(page)
    await loadBlogStarter(page)
    expect(await resetToDefaultConfig(page, 'P18b AgentProxy Miss')).toBeTruthy()
    const before = await getHeroHeading(page)
    expect(before).toBe('Welcome to Your Website')

    await installAgentProxyAdapter(page)

    // Direct adapter probe: assert the typed `invalid_response` shape.
    const probe = await page.evaluate(async () => {
      const mod: { AgentProxyAdapter: new () => { complete: (r: { systemPrompt: string; userPrompt: string }) => Promise<unknown> } } =
        await import('/src/contexts/intelligence/llm/agentProxyAdapter.ts' as never)
      const a = new mod.AgentProxyAdapter()
      return await a.complete({ systemPrompt: 'sys', userPrompt: 'qzwxecrv9999-no-match' })
    }) as { ok: boolean; error?: { kind: string } }
    expect(probe.ok).toBe(false)
    expect(probe.error?.kind).toBe('invalid_response')

    // End-to-end: chat falls back to canned reply, config is unchanged.
    await sendChat(page, 'qzwxecrv9999-no-match')
    const reply = page.getByTestId('chat-msg-bradley')
    await expect(reply.first()).toBeVisible({ timeout: 6000 })
    await expect(reply.first()).toContainText(/hmm,? (try|i didn't catch)/i, { timeout: 6000 })

    expect(await getHeroHeading(page)).toBe(before)
    expect(errors).toHaveLength(0)
  })
})
