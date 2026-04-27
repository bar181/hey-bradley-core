import { test, expect, Page } from '@playwright/test'

// Phase 19 Step 2 — Listen-mode final transcript drives the same chat pipeline.
// Spec: plans/implementation/mvp-plan/05-phase-19-real-listen.md §0 Step 2, §3.5.
// Mirrors p19-step1.spec.ts: SpeechRecognition is mocked via addInitScript so
// the test never needs real mic hardware. The pipeline path itself (auditedComplete
// → AgentProxyAdapter / FixtureAdapter → applyPatches) is the same one P18
// tests cover from the chat surface; here we prove voice triggers it identically.

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

// Mirrors p19-step1.spec.ts mock — emits one interim then one final result.
// `transcript` is the final phrase the test wants the page to "hear".
const mockSRScript = (transcript: string) => `
  (() => {
    class MockSR {
      constructor() {
        this.continuous = false
        this.interimResults = true
        this.lang = 'en-US'
        this.onresult = null
        this.onend = null
        this.onerror = null
      }
      start() {
        setTimeout(() => {
          this.onresult && this.onresult({
            results: [
              Object.assign([{ transcript: ${JSON.stringify(transcript.slice(0, 8))} }], { isFinal: false, length: 1 }),
            ],
          })
          setTimeout(() => {
            this.onresult && this.onresult({
              results: [
                Object.assign([{ transcript: ${JSON.stringify(transcript)} }], { isFinal: true, length: 1 }),
              ],
            })
            this.onend && this.onend()
          }, 80)
        }, 30)
      }
      stop() { setTimeout(() => { this.onend && this.onend() }, 20) }
      abort() { this.onend && this.onend() }
    }
    Object.defineProperty(window, 'SpeechRecognition', { value: MockSR, configurable: true, writable: true })
    Object.defineProperty(window, 'webkitSpeechRecognition', { value: MockSR, configurable: true, writable: true })
  })()
`

async function loadBlogStarter(page: Page): Promise<void> {
  await page.goto('/new-project')
  await page.waitForTimeout(800)
  await page.locator('button', { hasText: 'Examples' }).first().click()
  await page.waitForTimeout(300)
  await page.locator('button', { hasText: 'Stories from the kitchen' }).first().click()
  await page.waitForURL('**/builder')
  await page.waitForSelector('[data-section-id]', { timeout: 10000 })
}

// Reset to default-config so the seeded "make the hero say ..." patch lands on
// the right node (sections[1].components[1].props.text). Mirrors p18-step2-chat.
async function resetToDefaultConfig(page: Page, projectName: string): Promise<string> {
  return await page.evaluate(async ({ name }) => {
    const m: { default: unknown } = await import('/src/data/default-config.json' as never)
    const cfg = (window as unknown as { __configStore: { getState: () => { loadConfig: (c: unknown) => void } } }).__configStore
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

async function openListenTab(page: Page): Promise<void> {
  await page.getByRole('tab', { name: /Listen/ }).click()
  await page.waitForTimeout(200)
}

async function holdPtt(page: Page, holdMs: number): Promise<void> {
  await page.locator('[data-testid="listen-ptt"]').dispatchEvent('mousedown')
  await page.waitForTimeout(holdMs)
  await page.locator('[data-testid="listen-ptt"]').dispatchEvent('mouseup')
}

// Count llm_calls rows for the active session — used to prove the listen path
// went through auditedComplete just like the chat path.
async function llmCallProvidersForActiveSession(page: Page): Promise<string[]> {
  return await page.evaluate(async () => {
    const sessions: { activeSession: (pid: string) => { id: string } | undefined } =
      await import('/src/contexts/persistence/repositories/sessions.ts' as never)
    const calls: { listLLMCalls: (sid: string) => Array<{ provider: string }> } =
      await import('/src/contexts/persistence/repositories/llmCalls.ts' as never)
    const proj = (window as unknown as { __projectStore: { getState: () => { activeProject: string | null } } }).__projectStore
    const pid = proj.getState().activeProject
    if (!pid) return []
    const s = sessions.activeSession(pid)
    return s ? calls.listLLMCalls(s.id).map((c) => c.provider) : []
  })
}

async function listenTranscriptsForActiveSession(page: Page): Promise<string[]> {
  return await page.evaluate(async () => {
    const sessions: { activeSession: (pid: string) => { id: string } | undefined } =
      await import('/src/contexts/persistence/repositories/sessions.ts' as never)
    const tx: { listListenTranscripts: (sid: string) => Array<{ text: string }> } =
      await import('/src/contexts/persistence/repositories/messages.ts' as never)
    const proj = (window as unknown as { __projectStore: { getState: () => { activeProject: string | null } } }).__projectStore
    const pid = proj.getState().activeProject
    if (!pid) return []
    const s = sessions.activeSession(pid)
    return s ? tx.listListenTranscripts(s.id).map((r) => r.text) : []
  })
}

test.describe('Phase 19 Step 2: voice → chat pipeline', () => {
  test('voice transcript drives same JSON patch as text chat', async ({ page }) => {
    const errors = trackErrors(page)
    await page.addInitScript(mockSRScript('Make the hero say Hello Voice'))

    await loadBlogStarter(page)
    await resetToDefaultConfig(page, 'P19 Step2 Voice Happy')
    await page.waitForSelector('[data-section-id]', { timeout: 10000 })
    expect(await getHeroHeading(page)).toBe('Welcome to Your Website')

    await openListenTab(page)
    await expect(page.getByTestId('listen-ptt')).toBeVisible()
    await holdPtt(page, 1500)

    // The seeded `starter-hero-text-bake` example_prompt + STEP2_FIXTURES both
    // match `make the hero say ...`. AgentProxyAdapter (DEV default) returns
    // the seeded "Bake Joy Daily" envelope; FixtureAdapter would echo "Hello
    // Voice" back. Either lands a real patch on the same hero text node, so
    // we assert the heading changed off the default — that's the load-bearing
    // invariant ("voice drives a real patch through the LLM pipeline").
    await expect.poll(async () => getHeroHeading(page), { timeout: 6000 }).not.toBe('Welcome to Your Website')

    // At least one llm_calls row landed for this session — provider is 'mock'
    // for AgentProxyAdapter or 'simulated' for FixtureAdapter; both are valid
    // pipeline paths.
    const providers = await llmCallProvidersForActiveSession(page)
    expect(providers.length).toBeGreaterThanOrEqual(1)
    expect(providers.some((p) => p === 'mock' || p === 'simulated')).toBe(true)

    // listen_transcripts persisted the final transcript verbatim.
    const transcripts = await listenTranscriptsForActiveSession(page)
    expect(transcripts.some((t) => t.includes('Hello Voice'))).toBe(true)

    expect(errors).toHaveLength(0)
  })

  test('voice transcript with no fixture match falls back to canned hint', async ({ page }) => {
    const errors = trackErrors(page)
    await page.addInitScript(mockSRScript('qzwxcv9999'))

    await loadBlogStarter(page)
    await resetToDefaultConfig(page, 'P19 Step2 Voice Fallback')
    const before = await getHeroHeading(page)
    expect(before).toBe('Welcome to Your Website')

    await openListenTab(page)
    await expect(page.getByTestId('listen-ptt')).toBeVisible()
    await holdPtt(page, 1500)

    // Canned-fallback hint surfaces in the listen reply banner.
    const reply = page.getByTestId('listen-reply')
    await expect(reply).toBeVisible({ timeout: 6000 })
    await expect(reply).toContainText(/hmm,? (try|i didn't catch)/i)

    // Config is unchanged — hero heading still the default.
    expect(await getHeroHeading(page)).toBe(before)

    // Documented choice: the listen pipeline does NOT persist a
    // listen_transcripts row for canned-fallback turns. Garbage utterances
    // would otherwise pollute the audit trail; the pipeline still wrote an
    // llm_calls row (so cost/audit are correct) but skipped persistence.
    const transcripts = await listenTranscriptsForActiveSession(page)
    expect(transcripts.some((t) => t.includes('qzwxcv9999'))).toBe(false)

    expect(errors).toHaveLength(0)
  })
})
