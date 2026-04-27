import { test, expect, Page } from '@playwright/test'

// Phase 18 Step 2 — projected-cost cap pre-check.
// Spec: plans/implementation/mvp-plan/04-phase-18-real-chat.md §0 Step 2 +
//       §5 DoD ("Cost-cap pre-check refuses calls above ceiling").
// Mirrors llm-adapter.spec.ts conventions (selector idioms, console-error filter).

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

test.describe('Phase 18 Step 2: cost-cap projected pre-check', () => {
  test('projected pre-check refuses BEFORE adapter is hit, no audit row written', async ({ page }) => {
    const errors = trackErrors(page)
    await loadBlogStarter(page)
    const projectId = await ensureActiveProject(page, 'P18 Step 2 Cap Test')
    expect(projectId).toBeTruthy()

    const outcome = await page.evaluate(async () => {
      const fix: { FixtureAdapter: new (entries: Array<{ matchExact: string; envelope: { patches: unknown[] } }>) => {
        name: () => string;
        model: () => string;
        complete: (r: { systemPrompt: string; userPrompt: string }) => Promise<unknown>;
        testConnection: () => Promise<boolean>;
        label: () => string;
      } } =
        await import('/src/contexts/intelligence/llm/fixtureAdapter.ts' as never)
      const audit: { auditedComplete: (a: unknown, r: { systemPrompt: string; userPrompt: string }, c: { source: 'test' }) => Promise<{ ok: boolean; error?: { kind: string; detail?: string } }> } =
        await import('/src/contexts/intelligence/llm/auditedComplete.ts' as never)
      const sessions: { activeSession: (pid: string) => { id: string } | undefined } =
        await import('/src/contexts/persistence/repositories/sessions.ts' as never)
      const calls: { listLLMCalls: (sid: string) => Array<{ status: string }> } =
        await import('/src/contexts/persistence/repositories/llmCalls.ts' as never)
      const proj = (window as unknown as { __projectStore: { getState: () => { activeProject: string | null } } }).__projectStore
      const intel = (window as unknown as { __intelligenceStore: { getState: () => { recordUsage: (i: number, o: number, c: number) => void; resetSession: () => void; sessionUsd: number } } }).__intelligenceStore

      // Wrap a real FixtureAdapter but report the Claude Haiku model so the
      // projected-cost math is non-zero (simulated-v1's $0 rate would defeat
      // the projected pre-check by rendering it identical to the post-hoc
      // sessionUsd >= cap branch). The sentinel proves the pre-check fires.
      const inner = new fix.FixtureAdapter([
        { matchExact: 'hi', envelope: { patches: [] } },
      ])
      let adapterHit = false
      const adapter = {
        name() { return 'claude' as const },
        label() { return 'Capped Fixture' },
        model() { return 'claude-haiku-4-5-20251001' },
        async testConnection() { return true },
        async complete(r: { systemPrompt: string; userPrompt: string }) {
          adapterHit = true
          return await inner.complete(r)
        },
      }

      // Reset, then set sessionUsd just under the $1.00 default cap. With a
      // long enough prompt, the projected upper bound (1024 out tokens at
      // Haiku output rate $1.25/Mtok = $0.00128) is small but ANY positive
      // number pushes 0.99 + projected >= 1.00 only when the input prompt
      // adds enough token cost too. Use a long-ish prompt to exceed the cap.
      intel.getState().resetSession()
      intel.getState().recordUsage(0, 0, 0.99)

      const pid = proj.getState().activeProject as string
      const beforeRows = (() => {
        const s = sessions.activeSession(pid)
        return s ? calls.listLLMCalls(s.id).length : 0
      })()

      // Long systemPrompt forces input-token cost above the projected slack.
      // Haiku rates: $0.25/Mtok in, $1.25/Mtok out. Output ceiling 1024 toks
      // = $0.00128. Need projected >= $0.01 to push 0.99 + projected >= 1.00.
      // (0.01 - 0.00128) / 0.25e-6 = ~34,880 input tokens. At 4 chars/token
      // => ~140k chars. Use 200k for headroom but keep the test fast.
      const longPrompt = 'x'.repeat(200_000)

      const res = await audit.auditedComplete(
        adapter as unknown as Parameters<typeof audit.auditedComplete>[0],
        { systemPrompt: longPrompt, userPrompt: 'hi' },
        { source: 'test' },
      )

      const afterRows = (() => {
        const s = sessions.activeSession(pid)
        return s ? calls.listLLMCalls(s.id).length : 0
      })()

      // Clean up so subsequent tests see a fresh session.
      intel.getState().resetSession()

      return {
        ok: res.ok,
        kind: res.error?.kind ?? '',
        detail: res.error?.detail ?? '',
        beforeRows,
        afterRows,
        adapterHit,
      }
    })

    expect(outcome.ok).toBe(false)
    expect(outcome.kind).toBe('cost_cap')
    // Detail should mention "cap" (per spec Step 5).
    expect(outcome.detail.toLowerCase()).toContain('cap')
    // The pre-check short-circuited BEFORE adapter.complete was invoked.
    expect(outcome.adapterHit).toBe(false)
    // No new audit row was written — refusal short-circuits before DB I/O.
    expect(outcome.afterRows).toBe(outcome.beforeRows)
    expect(errors).toHaveLength(0)
  })
})
