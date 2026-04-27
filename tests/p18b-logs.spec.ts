import { test, expect, Page } from '@playwright/test'

// Phase 18b Wave 2 — llm_logs observability + example_prompt_runs idempotency.
// Spec: plans/implementation/phase-18b/wave-1.md (Agent A4 + comprehensive fix-pass).
// Decision record: docs/adr/ADR-047-llm-logging-observability.md
//
// Each test installs an AgentProxyAdapter so the chat path is deterministic
// (DB-backed mock LLM, no network) and asserts the post-call invariants:
//   1. one llm_logs row per adapter-call decision (status='ok')
//   2. hashPrompt determinism (same inputs => same hash)
//   3. example_prompt_runs idempotency (one baseline per prompt × provider × model)
//   4. cost-cap path writes an llm_logs row with status='cost_cap'

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

test.describe('Phase 18b: llm_logs observability + example_prompt_runs idempotency', () => {
  test('llm_logs row written on AgentProxy success (status=ok, provider=mock)', async ({ page }) => {
    const errors = trackErrors(page)
    await loadBlogStarter(page)
    const projectId = await ensureActiveProject(page, 'P18b Logs Success')
    expect(projectId).toBeTruthy()

    const result = await page.evaluate(async () => {
      const proxyMod: { AgentProxyAdapter: new () => unknown } =
        await import('/src/contexts/intelligence/llm/agentProxyAdapter.ts' as never)
      const audit: { auditedComplete: (a: unknown, r: { systemPrompt: string; userPrompt: string }, c: { source: 'test' }) => Promise<{ ok: boolean; auditCallId?: number }> } =
        await import('/src/contexts/intelligence/llm/auditedComplete.ts' as never)
      const sessions: { activeSession: (pid: string) => { id: string } | undefined } =
        await import('/src/contexts/persistence/repositories/sessions.ts' as never)
      const logs: { listLLMLogs: (sid: string, limit?: number) => Array<{ status: string; provider: string; prompt_hash: string | null }> } =
        await import('/src/contexts/persistence/repositories/llmLogs.ts' as never)
      const proj = (window as unknown as { __projectStore: { getState: () => { activeProject: string | null } } }).__projectStore
      const intel = (window as unknown as { __intelligenceStore: { getState: () => { resetSession: () => void } } }).__intelligenceStore

      intel.getState().resetSession()
      const adapter = new proxyMod.AgentProxyAdapter()
      const res = await audit.auditedComplete(
        adapter,
        { systemPrompt: 'sys', userPrompt: 'Make the hero say "Bake Joy Daily"' },
        { source: 'test' },
      )
      const pid = proj.getState().activeProject as string
      const sess = sessions.activeSession(pid)
      const rows = sess ? logs.listLLMLogs(sess.id, 50) : []
      return {
        ok: res.ok,
        rows: rows.map((r) => ({ status: r.status, provider: r.provider, hashPresent: !!r.prompt_hash && r.prompt_hash.length > 0 })),
      }
    })

    expect(result.ok).toBe(true)
    expect(result.rows.length).toBeGreaterThanOrEqual(1)
    const last = result.rows[result.rows.length - 1]
    expect(last.status).toBe('ok')
    expect(last.provider).toBe('mock')
    expect(last.hashPresent).toBe(true)
    expect(errors).toHaveLength(0)
  })

  test('hashPrompt determinism — equal inputs produce equal hash', async ({ page }) => {
    const errors = trackErrors(page)
    await loadBlogStarter(page)

    const result = await page.evaluate(async () => {
      const keys: { hashPrompt: (s: string, u: string) => Promise<string> } =
        await import('/src/contexts/intelligence/llm/keys.ts' as never)
      const a = await keys.hashPrompt('sys-P18b', 'user-P18b')
      const b = await keys.hashPrompt('sys-P18b', 'user-P18b')
      const different = await keys.hashPrompt('sys-P18b', 'different-user')
      return { a, b, different }
    })

    expect(result.a).toBeTruthy()
    expect(result.a).toBe(result.b)
    expect(result.a).not.toBe(result.different)
    expect(errors).toHaveLength(0)
  })

  test('example_prompt_runs idempotency — exactly 1 baseline row across 3 calls', async ({ page }) => {
    const errors = trackErrors(page)
    await loadBlogStarter(page)
    const projectId = await ensureActiveProject(page, 'P18b Logs Idempotent')
    expect(projectId).toBeTruthy()

    const result = await page.evaluate(async () => {
      const proxyMod: { AgentProxyAdapter: new () => { complete: (r: { systemPrompt: string; userPrompt: string }) => Promise<unknown> } } =
        await import('/src/contexts/intelligence/llm/agentProxyAdapter.ts' as never)
      const ex: {
        findExamplePromptForUserPrompt: (s: string) => { id: number } | null;
        listExamplePromptRuns: (id: number) => Array<{ provider: string; model: string }>;
      } = await import('/src/contexts/persistence/repositories/examplePrompts.ts' as never)

      const userPrompt = 'Make the hero say "Bake Joy Daily"'
      const adapter = new proxyMod.AgentProxyAdapter()
      // Three identical calls — the adapter writes a baseline once.
      await adapter.complete({ systemPrompt: 'sys', userPrompt })
      await adapter.complete({ systemPrompt: 'sys', userPrompt })
      await adapter.complete({ systemPrompt: 'sys', userPrompt })

      const row = ex.findExamplePromptForUserPrompt(userPrompt)
      if (!row) return { matched: false, baselineCount: 0 }
      const runs = ex.listExamplePromptRuns(row.id)
      const baselines = runs.filter((r) => r.provider === 'mock' && r.model === 'agent-proxy-v1')
      return { matched: true, baselineCount: baselines.length }
    })

    expect(result.matched).toBe(true)
    expect(result.baselineCount).toBe(1)
    expect(errors).toHaveLength(0)
  })

  test('cost-cap path writes llm_logs row with status=cost_cap', async ({ page }) => {
    const errors = trackErrors(page)
    await loadBlogStarter(page)
    const projectId = await ensureActiveProject(page, 'P18b Logs CostCap')
    expect(projectId).toBeTruthy()

    const result = await page.evaluate(async () => {
      const fix: { FixtureAdapter: new (entries: Array<{ matchExact: string; envelope: { patches: unknown[] } }>) => unknown } =
        await import('/src/contexts/intelligence/llm/fixtureAdapter.ts' as never)
      const audit: { auditedComplete: (a: unknown, r: { systemPrompt: string; userPrompt: string }, c: { source: 'test' }) => Promise<{ ok: boolean; error?: { kind: string } }> } =
        await import('/src/contexts/intelligence/llm/auditedComplete.ts' as never)
      const sessions: { activeSession: (pid: string) => { id: string } | undefined } =
        await import('/src/contexts/persistence/repositories/sessions.ts' as never)
      const logs: { listLLMLogs: (sid: string, limit?: number) => Array<{ status: string; provider: string; error_kind: string | null }> } =
        await import('/src/contexts/persistence/repositories/llmLogs.ts' as never)
      const proj = (window as unknown as { __projectStore: { getState: () => { activeProject: string | null } } }).__projectStore
      const intel = (window as unknown as { __intelligenceStore: { getState: () => { recordUsage: (i: number, o: number, c: number) => void; resetSession: () => void } } }).__intelligenceStore

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
          return await (inner as { complete: (r: unknown) => Promise<unknown> }).complete(r)
        },
      }

      intel.getState().resetSession()
      intel.getState().recordUsage(0, 0, 0.99)

      const longPrompt = 'x'.repeat(200_000)
      const res = await audit.auditedComplete(
        adapter as unknown as Parameters<typeof audit.auditedComplete>[0],
        { systemPrompt: longPrompt, userPrompt: 'hi' },
        { source: 'test' },
      )

      const pid = proj.getState().activeProject as string
      const sess = sessions.activeSession(pid)
      const rows = sess ? logs.listLLMLogs(sess.id, 50) : []
      const capRows = rows.filter((r) => r.status === 'cost_cap')

      intel.getState().resetSession()

      return {
        ok: res.ok,
        kind: res.error?.kind ?? '',
        adapterHit,
        capRowCount: capRows.length,
        lastCapErrorKind: capRows.length ? capRows[capRows.length - 1].error_kind : null,
      }
    })

    expect(result.ok).toBe(false)
    expect(result.kind).toBe('cost_cap')
    expect(result.adapterHit).toBe(false)
    expect(result.capRowCount).toBeGreaterThanOrEqual(1)
    expect(result.lastCapErrorKind).toBe('cost_cap')
    expect(errors).toHaveLength(0)
  })
})
