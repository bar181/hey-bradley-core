import { test, expect, Page } from '@playwright/test'

// Phase 18 Step 2 — chat round-trip golden + fallback acceptance test.
// Spec: plans/implementation/mvp-plan/04-phase-18-real-chat.md §0 Step 2.
// Mirrors p18-step1.spec.ts / persistence.spec.ts (selector idioms, console-error filter).
//
// COORDINATION NOTE: A3 wires the chat input through `auditedComplete`, so each
// chat call writes a row to `llm_calls` (per Phase 18 §5 DoD). Test 1 asserts the
// happy-path round-trip yields exactly one new row for the active session.

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

// STEP2_FIXTURES (A3) hardcodes the default-config hero path
// (/sections/1/components/1/props/text). Reset the configStore to default-config
// so the patch lands on the right node, then ensure an active project so any
// audit writes have a valid session_id.
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

async function getHeroHeading(page: Page): Promise<string> {
  return await page.evaluate(() => {
    const cfg = (window as unknown as { __configStore: { getState: () => { config: { sections: Array<{ type: string; components?: Array<{ id: string; type: string; props?: { text?: string } }> }> } } } }).__configStore
    const hero = cfg.getState().config.sections.find((s) => s.type === 'hero')
    const headline = hero?.components?.find((c) => c.id === 'headline' || c.type === 'heading')
    return headline?.props?.text ?? ''
  })
}

async function llmCallCountForActiveSession(page: Page): Promise<number> {
  return await page.evaluate(async () => {
    const sessions: { activeSession: (pid: string) => { id: string } | undefined } =
      await import('/src/contexts/persistence/repositories/sessions.ts' as never)
    const calls: { listLLMCalls: (sid: string) => unknown[] } =
      await import('/src/contexts/persistence/repositories/llmCalls.ts' as never)
    const proj = (window as unknown as { __projectStore: { getState: () => { activeProject: string | null } } }).__projectStore
    const pid = proj.getState().activeProject
    if (!pid) return 0
    const s = sessions.activeSession(pid)
    return s ? calls.listLLMCalls(s.id).length : 0
  })
}

// Open the Chat tab in the LeftPanel (default is "builder"). Idempotent.
async function openChatTab(page: Page): Promise<void> {
  const chatTab = page.getByRole('tab', { name: /^Chat$/ }).first()
  await chatTab.click()
  await expect(page.getByTestId('chat-input')).toBeVisible({ timeout: 5000 })
}

async function sendChat(page: Page, text: string): Promise<void> {
  await openChatTab(page)
  const input = page.getByTestId('chat-input')
  await input.click()
  await input.fill(text)
  await page.getByRole('button', { name: /Send message/i }).click()
}

test.describe('Phase 18 Step 2: chat round-trip', () => {
  test('happy path — "Make the hero say \'Bake Joy Daily\'" updates preview', async ({ page }) => {
    const errors = trackErrors(page)
    await loadBlogStarter(page)
    const pid = await resetToDefaultConfig(page, 'P18 Step2 Happy')
    expect(pid).toBeTruthy()
    await page.waitForSelector('[data-section-id]', { timeout: 10000 })
    await expect(page.getByText('Welcome to Your Website').first()).toBeVisible()

    const beforeRows = await llmCallCountForActiveSession(page)

    await sendChat(page, "Make the hero say 'Bake Joy Daily'")

    // Within 6 s the visible heading reflects the new text. Wait on configStore
    // (source of truth) — `getByText` would also match the chat-reply summary.
    await expect.poll(async () => getHeroHeading(page), { timeout: 6000 }).toBe('Bake Joy Daily')
    await expect(page.getByText('Bake Joy Daily').first()).toBeVisible({ timeout: 6000 })

    // Audit-row check: ChatInput routes through auditedComplete, so the happy
    // path must add exactly one llm_calls row for the active session.
    const afterRows = await llmCallCountForActiveSession(page)
    expect(afterRows).toBe(beforeRows + 1)

    expect(errors).toHaveLength(0)
  })

  test('fallback — unknown phrase falls back without mutating config', async ({ page }) => {
    const errors = trackErrors(page)
    await loadBlogStarter(page)
    await resetToDefaultConfig(page, 'P18 Step2 Fallback A')
    const before = await getHeroHeading(page)
    expect(before).toBe('Welcome to Your Website')

    // No fixture matches; cannedChat.parseChatCommand also has no rule for this.
    await sendChat(page, 'qzwxecrv9999')

    // Wait for the typewriter to settle into a Bradley reply.
    const reply = page.getByTestId('chat-msg-bradley')
    await expect(reply.first()).toBeVisible({ timeout: 6000 })
    // cannedChat fallback for unrecognised input — see lib/cannedChat.ts §Fallback.
    await expect(reply.first()).toContainText(/hmm,? try/i, { timeout: 6000 })

    expect(await getHeroHeading(page)).toBe(before)
    expect(errors).toHaveLength(0)
  })

  test('fallback — adapter returns non-envelope JSON triggers canned fallback', async ({ page }) => {
    const errors = trackErrors(page)
    await loadBlogStarter(page)
    await resetToDefaultConfig(page, 'P18 Step2 Fallback B')
    const before = await getHeroHeading(page)

    // Swap the live adapter for one that always returns a malformed envelope.
    await page.evaluate(() => {
      const intel = (window as unknown as { __intelligenceStore: { setState: (s: unknown) => void } }).__intelligenceStore
      const badAdapter = {
        name: () => 'simulated' as const,
        label: () => 'bad-shape',
        model: () => 'bad-shape-v1',
        testConnection: async () => true,
        complete: async () => ({ ok: true, json: { wrong: 'shape' }, tokens: { in: 1, out: 1 }, cost_usd: 0 }),
      }
      intel.setState({ adapter: badAdapter })
    })

    // Use a phrase the LLM-pipeline matches via the (now-bad) adapter; cannedChat
    // also has nothing for it, so the user sees the canned fallback hint.
    await sendChat(page, 'totallyunmatchableprompt9999')
    const reply = page.getByTestId('chat-msg-bradley')
    await expect(reply.first()).toBeVisible({ timeout: 6000 })
    await expect(reply.first()).toContainText(/hmm,? try/i, { timeout: 6000 })

    expect(await getHeroHeading(page)).toBe(before)
    expect(errors).toHaveLength(0)
  })

  // eslint-disable-next-line playwright/no-skipped-test
  test.skip('cost-cap fallback — covered by p18-step2-cap.spec.ts (A4)', async () => {
    // Intentional skip: A4 owns the cost-cap acceptance test. Keeping a placeholder
    // here documents the coverage handoff.
  })
})
