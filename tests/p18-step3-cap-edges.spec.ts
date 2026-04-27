import { test, expect, Page } from '@playwright/test'

// Phase 18 Step 3 — cost-cap edge cases.
// Spec: plans/implementation/mvp-plan/04-phase-18-real-chat.md §0 Step 3.
// FixtureAdapter only — NO real LLM.

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

test.describe('Phase 18 Step 3: cost-cap edge cases', () => {
  test('refuses when sessionUsd is exactly at cap (>= comparison)', async ({ page }) => {
    const errors = trackErrors(page)
    await loadBlogStarter(page)
    expect(await ensureActiveProject(page, 'P18S3 Exact')).toBeTruthy()

    const outcome = await page.evaluate(async () => {
      const fix: typeof import('/src/contexts/intelligence/llm/fixtureAdapter.ts') =
        await import('/src/contexts/intelligence/llm/fixtureAdapter.ts' as never)
      const audit: typeof import('/src/contexts/intelligence/llm/auditedComplete.ts') =
        await import('/src/contexts/intelligence/llm/auditedComplete.ts' as never)
      const intel = (window as unknown as { __intelligenceStore: { getState: () => { resetSession: () => void; recordUsage: (i: number, o: number, c: number) => void } } }).__intelligenceStore
      let hit = false
      const inner = new fix.FixtureAdapter([{ matchExact: 'hi', envelope: { patches: [] } }])
      const adapter = {
        name() { return 'simulated' as const }, label() { return 'edge-exact' },
        model() { return 'simulated-v1' }, async testConnection() { return true },
        async complete(r: { systemPrompt: string; userPrompt: string }) { hit = true; return await inner.complete(r) },
      }
      intel.getState().resetSession()
      intel.getState().recordUsage(0, 0, 1.0)
      const res = await audit.auditedComplete(adapter as never, { systemPrompt: '', userPrompt: 'hi' }, { source: 'test' })
      intel.getState().resetSession()
      return { ok: res.ok, kind: res.error?.kind ?? '', hit }
    })

    expect(outcome.ok).toBe(false)
    expect(outcome.kind).toBe('cost_cap')
    expect(outcome.hit).toBe(false)
    expect(errors).toHaveLength(0)
  })

  test('single-call projection alone refuses pre-call when sessionUsd=0', async ({ page }) => {
    const errors = trackErrors(page)
    await loadBlogStarter(page)
    expect(await ensureActiveProject(page, 'P18S3 Single')).toBeTruthy()

    const outcome = await page.evaluate(async () => {
      const fix: typeof import('/src/contexts/intelligence/llm/fixtureAdapter.ts') =
        await import('/src/contexts/intelligence/llm/fixtureAdapter.ts' as never)
      const audit: typeof import('/src/contexts/intelligence/llm/auditedComplete.ts') =
        await import('/src/contexts/intelligence/llm/auditedComplete.ts' as never)
      const intel = (window as unknown as { __intelligenceStore: { getState: () => { resetSession: () => void } } }).__intelligenceStore
      let hit = false
      const inner = new fix.FixtureAdapter([{ matchExact: 'hi', envelope: { patches: [] } }])
      const adapter = {
        name() { return 'claude' as const }, label() { return 'edge-single' },
        model() { return 'claude-haiku-4-5-20251001' }, async testConnection() { return true },
        async complete(r: { systemPrompt: string; userPrompt: string }) { hit = true; return await inner.complete(r) },
      }
      intel.getState().resetSession()
      // ~17M-char prompt → ~4.25M tokens × $0.25/Mtok ≈ $1.06 projected, alone exceeds $1 cap.
      const longPrompt = 'x'.repeat(17_000_000)
      const res = await audit.auditedComplete(adapter as never, { systemPrompt: longPrompt, userPrompt: 'hi' }, { source: 'test' })
      intel.getState().resetSession()
      return { ok: res.ok, kind: res.error?.kind ?? '', hit }
    })

    expect(outcome.ok).toBe(false)
    expect(outcome.kind).toBe('cost_cap')
    expect(outcome.hit).toBe(false)
    expect(errors).toHaveLength(0)
  })

  test('cost helper math underpins env-override + clamp behavior', async ({ page }) => {
    // VITE_LLM_MAX_USD is statically inlined by Vite — cannot mutate at runtime
    // from page.evaluate. The cap clamp lives in auditedComplete.getCapUsd():
    //   Math.min(MAX_CAP_USD=20, Math.max(MIN_CAP_USD=0.10, parsed))
    // We assert the cost math the cap relies on; clamp itself is verified by
    // code review (see auditedComplete.ts L24-30).
    const errors = trackErrors(page)
    await loadBlogStarter(page)
    const r = await page.evaluate(async () => {
      const cost: typeof import('/src/contexts/intelligence/llm/cost.ts') =
        await import('/src/contexts/intelligence/llm/cost.ts' as never)
      return {
        big: cost.estimateMaxCostForModel('claude-haiku-4-5-20251001', 4_000_000, 1024),
        free: cost.estimateMaxCostForModel('simulated-v1', 1_000_000, 1024),
        unknown: cost.estimateMaxCostForModel('not-a-model', 1_000_000, 1024),
      }
    })
    expect(r.big).toBeGreaterThan(1.0)
    expect(r.free).toBe(0)
    expect(r.unknown).toBe(0)
    expect(errors).toHaveLength(0)
  })

  test.skip('VITE_LLM_MAX_USD = 50.00 clamps to MAX_CAP_USD=$20 (xskip: env inlined at build)', async () => {
    // To exercise: spawn a separate Playwright project with .env override, or
    // refactor getCapUsd to accept an injected value. Both out of scope here.
  })
})
