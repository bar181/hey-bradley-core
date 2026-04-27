import { test, expect, Page } from '@playwright/test'

// P19 Fix-Pass 2 (F2) regression test.
// Spec: plans/implementation/phase-19/deep-dive/02-functionality-findings.md §5.
// 6 sub-cases — one per ChatErrorKind. We force the active adapter to throw or
// return an error of a specific kind, then assert ChatInput renders the
// kind-specific copy from mapChatError().

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

// Ensures auditedComplete has a session (otherwise it short-circuits with
// precondition_failed before the test can inject an error kind).
async function ensureProject(page: Page, name: string): Promise<void> {
  await page.evaluate((n) => {
    const cfg = (window as unknown as { __configStore: { getState: () => { config: unknown } } }).__configStore
    const proj = (window as unknown as { __projectStore: { getState: () => { saveProject: (n: string, c: unknown) => void } } }).__projectStore
    proj.getState().saveProject(n, cfg.getState().config as never)
  }, name)
}

async function injectAdapterError(page: Page, kind: string): Promise<void> {
  await page.evaluate((errKind) => {
    const intel = (window as unknown as { __intelligenceStore: { setState: (s: unknown) => void } }).__intelligenceStore
    intel.setState({
      adapter: {
        name: () => 'simulated' as const,
        label: () => `err-${errKind}`,
        model: () => `err-${errKind}-v1`,
        testConnection: async () => true,
        complete: async () => ({ ok: false, error: { kind: errKind, detail: `forced ${errKind}` } }),
      },
    })
  }, kind)
}

// Inject an adapter that throws — exercises the chatPipeline catch path which
// records unknown errorKind.
async function injectThrowingAdapter(page: Page): Promise<void> {
  await page.evaluate(() => {
    const intel = (window as unknown as { __intelligenceStore: { setState: (s: unknown) => void } }).__intelligenceStore
    intel.setState({
      adapter: {
        name: () => 'simulated' as const,
        label: () => 'throwing-adapter',
        model: () => 'throw-v1',
        testConnection: async () => true,
        complete: async () => { throw new Error('forced throw') },
      },
    })
  })
}

async function sendChat(page: Page, text: string): Promise<void> {
  const chatTab = page.getByRole('tab', { name: /^Chat$/ }).first()
  await chatTab.click()
  await expect(page.getByTestId('chat-input')).toBeVisible({ timeout: 5000 })
  const input = page.getByTestId('chat-input')
  await input.click()
  await input.fill(text)
  await page.getByRole('button', { name: /Send message/i }).click()
}

// Only "infrastructure" kinds are surfaced as kind-specific copy. invalid_response
// (a.k.a. validation_failed) intentionally falls through to the canned fallback —
// it's semantically the same as "I didn't catch that" since no patch was applied.
const KIND_TO_COPY: Array<{ kind: string; copyFragment: RegExp }> = [
  { kind: 'cost_cap', copyFragment: /spending cap/i },
  { kind: 'timeout', copyFragment: /timed out/i },
  { kind: 'precondition_failed', copyFragment: /not configured|missing API key/i },
  { kind: 'rate_limit', copyFragment: /rate-limiting|wait a few seconds/i },
]

test.describe('P19 Fix-Pass 2 — F2: mapChatError', () => {
  for (const { kind, copyFragment } of KIND_TO_COPY) {
    test(`error kind "${kind}" surfaces kind-specific copy`, async ({ page }) => {
      const errors = trackErrors(page)
      await loadBlogStarter(page)
      await ensureProject(page, `P19 mapChatError ${kind}`)
      await injectAdapterError(page, kind)
      await sendChat(page, `force ${kind} ${Date.now()}`)

      const reply = page.getByTestId('chat-msg-bradley')
      await expect(reply.first()).toBeVisible({ timeout: 6000 })
      await expect(reply.first()).toContainText(copyFragment, { timeout: 6000 })
      expect(errors).toHaveLength(0)
    })
  }

  test('validation_failed (no-fixture-match) falls through to canned fallback hint', async ({ page }) => {
    const errors = trackErrors(page)
    await loadBlogStarter(page)
    await ensureProject(page, 'P19 mapChatError validation_failed')
    await injectAdapterError(page, 'invalid_response')
    // Prompt won't match canned either — both pipelines fail; we expect the
    // FALLBACK_HINT (not "wasn't safe to apply").
    await sendChat(page, 'force validation 0987654321')

    const reply = page.getByTestId('chat-msg-bradley')
    await expect(reply.first()).toBeVisible({ timeout: 6000 })
    await expect(reply.first()).toContainText(/didn't catch that/i, { timeout: 6000 })
    expect(errors).toHaveLength(0)
  })

  test('unknown error (adapter throw) surfaces the conversational fallback hint', async ({ page }) => {
    const errors = trackErrors(page)
    await loadBlogStarter(page)
    await ensureProject(page, 'P19 mapChatError unknown')
    await injectThrowingAdapter(page)
    // Use a prompt that won't match a fixture and won't match a canned-chat
    // command, so the pipeline drops through to the FALLBACK_HINT path.
    await sendChat(page, 'asdfqwerty zxcv unknownkind 9876543210')

    const reply = page.getByTestId('chat-msg-bradley')
    await expect(reply.first()).toBeVisible({ timeout: 6000 })
    await expect(reply.first()).toContainText(/didn't catch that/i, { timeout: 6000 })
    expect(errors).toHaveLength(0)
  })
})
