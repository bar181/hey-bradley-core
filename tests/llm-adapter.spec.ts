import { test, expect, Page } from '@playwright/test'

// Phase 17 — LLM adapter tests. See plans/implementation/mvp-plan/03-phase-17-llm-provider.md §5 DoD.
// Mirrors persistence.spec.ts pattern: dynamic-import app modules from inside the page.

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

test.describe('Phase 17: LLM Adapter', () => {
  test('cost.usd math against fixed examples', async ({ page }) => {
    const errors = trackErrors(page)
    await page.goto('/new-project')
    await page.waitForTimeout(500)

    const results = await page.evaluate(async () => {
      const m: { usd: (model: string, inT: number, outT: number) => number } =
        await import('/src/contexts/intelligence/llm/cost.ts' as never)
      return {
        haiku: m.usd('claude-haiku-4-5-20251001', 1_000_000, 1_000_000),
        gemini: m.usd('gemini-2.5-flash', 1_000_000, 1_000_000),
        simulated: m.usd('simulated-v1', 100, 100),
        unknown: m.usd('unknown-model', 1, 1),
      }
    })

    expect(results.haiku).toBeCloseTo(1.50, 6)
    expect(results.gemini).toBeCloseTo(0.375, 6)
    expect(results.simulated).toBe(0)
    expect(results.unknown).toBe(0)
    expect(errors).toHaveLength(0)
  })

  test('pickAdapter falls back to a keyless adapter when no key', async ({ page }) => {
    const errors = trackErrors(page)
    await page.goto('/new-project')
    await page.waitForTimeout(500)

    const result = await page.evaluate(async () => {
      const m: { pickAdapter: (a: { provider: string; apiKey: string }) => Promise<{ adapter: { name: () => string }; status: string; detail?: string }> } =
        await import('/src/contexts/intelligence/llm/pickAdapter.ts' as never)
      const r = await m.pickAdapter({ provider: 'claude', apiKey: '' })
      return { name: r.adapter.name(), status: r.status, detail: r.detail ?? '' }
    })

    // Phase 18b FIX 2: in DEV the keyless fallback is AgentProxyAdapter (name='mock');
    // in prod it's SimulatedAdapter (name='simulated'). Either is acceptable here.
    expect(['simulated', 'mock']).toContain(result.name)
    expect(result.status).toBe('no_key')
    expect(result.detail).toContain('claude requires a key')
    expect(errors).toHaveLength(0)
  })

  test('pickAdapter respects explicit args (simulated, no key)', async ({ page }) => {
    const errors = trackErrors(page)
    await page.goto('/new-project')
    await page.waitForTimeout(500)

    const result = await page.evaluate(async () => {
      const m: { pickAdapter: (a: { provider: string }) => Promise<{ adapter: { name: () => string }; status: string }> } =
        await import('/src/contexts/intelligence/llm/pickAdapter.ts' as never)
      const r = await m.pickAdapter({ provider: 'simulated' })
      return { name: r.adapter.name(), status: r.status }
    })

    // Phase 18b FIX 2: keyless picker returns AgentProxyAdapter (DEV) or
    // SimulatedAdapter (prod). Both are valid keyless paths here.
    expect(['simulated', 'mock']).toContain(result.name)
    expect(result.status).toBe('ok')
    expect(errors).toHaveLength(0)
  })

  test('auditedComplete writes llm_calls row + updates session counters', async ({ page }) => {
    const errors = trackErrors(page)
    await loadBlogStarter(page)
    const projectId = await ensureActiveProject(page, 'P17 LLM Adapter Test')
    expect(projectId).toBeTruthy()

    const outcome = await page.evaluate(async () => {
      const sim: { SimulatedAdapter: new () => { name: () => string; model: () => string; complete: (r: unknown) => Promise<unknown>; testConnection: () => Promise<boolean>; label: () => string } } =
        await import('/src/contexts/intelligence/llm/simulatedAdapter.ts' as never)
      const audit: { auditedComplete: (a: unknown, r: { systemPrompt: string; userPrompt: string }, c: { source: 'test' }) => Promise<{ ok: boolean }> } =
        await import('/src/contexts/intelligence/llm/auditedComplete.ts' as never)
      const sessions: { activeSession: (pid: string) => { id: string } | undefined } =
        await import('/src/contexts/persistence/repositories/sessions.ts' as never)
      const calls: { listLLMCalls: (sid: string) => Array<{ provider: string; model: string; status: string }> } =
        await import('/src/contexts/persistence/repositories/llmCalls.ts' as never)
      const proj = (window as unknown as { __projectStore: { getState: () => { activeProject: string | null } } }).__projectStore
      const intel = (window as unknown as { __intelligenceStore: { getState: () => { sessionTokens: { in: number; out: number }; sessionUsd: number; resetSession: () => void } } }).__intelligenceStore

      intel.getState().resetSession()
      const adapter = new sim.SimulatedAdapter()
      const res = await audit.auditedComplete(adapter, { systemPrompt: 'sys', userPrompt: 'hello' }, { source: 'test' })

      const pid = proj.getState().activeProject as string
      const s = sessions.activeSession(pid)
      const rows = s ? calls.listLLMCalls(s.id) : []
      const tokens = intel.getState().sessionTokens
      const usd = intel.getState().sessionUsd
      return {
        ok: res.ok,
        rowCount: rows.length,
        firstProvider: rows[0]?.provider ?? '',
        firstModel: rows[0]?.model ?? '',
        firstStatus: rows[0]?.status ?? '',
        tokensIn: tokens.in,
        tokensOut: tokens.out,
        sessionUsd: usd,
      }
    })

    expect(outcome.ok).toBe(true)
    expect(outcome.rowCount).toBeGreaterThanOrEqual(1)
    expect(outcome.firstProvider).toBe('simulated')
    expect(outcome.firstModel).toBe('simulated-v1')
    expect(outcome.firstStatus).toBe('ok')
    expect(outcome.tokensIn).toBe(0)
    expect(outcome.tokensOut).toBe(0)
    expect(outcome.sessionUsd).toBe(0)
    expect(errors).toHaveLength(0)
  })

  test('cost-cap fires when sessionUsd >= cap', async ({ page }) => {
    const errors = trackErrors(page)
    await loadBlogStarter(page)
    const projectId = await ensureActiveProject(page, 'P17 Cost Cap Test')
    expect(projectId).toBeTruthy()

    const outcome = await page.evaluate(async () => {
      const sim: { SimulatedAdapter: new () => unknown } =
        await import('/src/contexts/intelligence/llm/simulatedAdapter.ts' as never)
      const audit: { auditedComplete: (a: unknown, r: { systemPrompt: string; userPrompt: string }, c: { source: 'test' }) => Promise<{ ok: boolean; error?: { kind: string } }> } =
        await import('/src/contexts/intelligence/llm/auditedComplete.ts' as never)
      const intel = (window as unknown as { __intelligenceStore: { getState: () => { recordUsage: (i: number, o: number, c: number) => void; resetSession: () => void } } }).__intelligenceStore

      intel.getState().resetSession()
      // Push the in-memory cost above the default $1.00 cap.
      intel.getState().recordUsage(0, 0, 1.5)
      const adapter = new sim.SimulatedAdapter()
      const res = await audit.auditedComplete(adapter, { systemPrompt: 'sys', userPrompt: 'hi' }, { source: 'test' })
      // Clean up so subsequent tests in the suite see a fresh session.
      intel.getState().resetSession()
      return { ok: res.ok, kind: res.error?.kind ?? '' }
    })

    expect(outcome.ok).toBe(false)
    expect(outcome.kind).toBe('cost_cap')
    expect(errors).toHaveLength(0)
  })

  test('redactKeyShapes scrubs sk-ant- / AIza shapes', async ({ page }) => {
    const errors = trackErrors(page)
    await page.goto('/new-project')
    await page.waitForTimeout(500)

    const result = await page.evaluate(async () => {
      const m: { redactKeyShapes: (s: string) => string } =
        await import('/src/contexts/intelligence/llm/keys.ts' as never)
      return {
        bearer: m.redactKeyShapes('Authorization: Bearer sk-ant-abcdef1234567890abcdef'),
        google: m.redactKeyShapes('key=AIzaSyA' + 'B'.repeat(34)),
        plain: m.redactKeyShapes('hello world'),
      }
    })

    expect(result.bearer).toContain('[REDACTED]')
    expect(result.bearer).not.toContain('sk-ant-')
    expect(result.bearer).not.toContain('Bearer ')
    expect(result.google).toContain('[REDACTED]')
    expect(result.google).not.toContain('AIza')
    expect(result.plain).toBe('hello world')
    expect(errors).toHaveLength(0)
  })
})
