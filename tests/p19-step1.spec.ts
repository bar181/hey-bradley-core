import { test, expect, Page } from '@playwright/test'

// Phase 19 Step 1 — Real Listen acceptance tests (capture-only).
// See plans/implementation/mvp-plan/05-phase-19-real-listen.md §0 / §3.7.
// Mirrors p18-step1.spec.ts / persistence.spec.ts (selector + console-error
// idioms). The transcript-drives-pipeline assertion belongs to Step 2; this
// file proves PTT capture only.

// Filter app-irrelevant console errors (CDN failures, dev-mode CJS warnings).
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

// Mock SpeechRecognition factory installed via page.addInitScript BEFORE any
// module import. Keeps the result-shape identical to what webSpeechAdapter.ts
// reads: e.results[i][0].transcript + e.results[i].isFinal (per W3C spec).
//
// `mode` controls the emitted sequence:
//   - 'happy'    → emit interim then final, then onend
//   - 'denied'   → onerror({error:'not-allowed'}) immediately (no onend)
const mockSRScript = (mode: 'happy' | 'denied') => `
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
        if (${JSON.stringify(mode)} === 'denied') {
          setTimeout(() => {
            this.onerror && this.onerror({ error: 'not-allowed' })
          }, 20)
          return
        }
        setTimeout(() => {
          // interim event
          this.onresult && this.onresult({
            results: [
              Object.assign([{ transcript: 'Make the hero ' }], { isFinal: false, length: 1 }),
            ],
          })
          setTimeout(() => {
            // final event
            this.onresult && this.onresult({
              results: [
                Object.assign([{ transcript: 'Make the hero say hello' }], { isFinal: true, length: 1 }),
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

const unsupportedScript = `
  (() => {
    try { delete window.SpeechRecognition } catch (_) {}
    try { delete window.webkitSpeechRecognition } catch (_) {}
    Object.defineProperty(window, 'SpeechRecognition', { value: undefined, configurable: true })
    Object.defineProperty(window, 'webkitSpeechRecognition', { value: undefined, configurable: true })
  })()
`

// Click the "Stories from the kitchen" starter and wait for the builder.
async function loadBlogStarter(page: Page): Promise<void> {
  await page.goto('/new-project')
  await page.waitForTimeout(800)
  await page.locator('button', { hasText: 'Examples' }).first().click()
  await page.waitForTimeout(300)
  await page.locator('button', { hasText: 'Stories from the kitchen' }).first().click()
  await page.waitForURL('**/builder')
  await page.waitForSelector('[data-section-id]', { timeout: 10000 })
}

// Switch to the Listen tab in the LeftPanel (role="tab", label "Listen").
async function openListenTab(page: Page): Promise<void> {
  await page.getByRole('tab', { name: /Listen/ }).click()
  await page.waitForTimeout(200)
}

// Press-and-hold the PTT button for `holdMs` then release.
// We dispatch synthetic mousedown/mouseup directly on the element rather than
// driving the page mouse: A2's PTT button uses `scale-95` while recording, and
// page-mouse driving can fire a spurious `mouseleave` (which the PTT handler
// treats as a release) when the button shrinks under a static cursor.
async function holdPtt(page: Page, holdMs: number): Promise<void> {
  await page.locator('[data-testid="listen-ptt"]').dispatchEvent('mousedown')
  await page.waitForTimeout(holdMs)
  await page.locator('[data-testid="listen-ptt"]').dispatchEvent('mouseup')
}

test.describe('Phase 19 Step 1: Real Listen capture', () => {
  test('happy path — hold + speak + release shows final transcript', async ({ page }) => {
    const errors = trackErrors(page)
    await page.addInitScript(mockSRScript('happy'))

    await loadBlogStarter(page)
    await openListenTab(page)

    await expect(page.getByTestId('listen-ptt')).toBeVisible()
    // Hold long enough for the mock to emit interim AND final BEFORE release.
    // 250 ms hold gate + 30 ms interim + 80 ms final = ~360 ms minimum from
    // mousedown. We use 1500 ms to absorb dev-server jitter (Vite + React
    // StrictMode double-mount can delay the hold-gate setTimeout firing).
    await holdPtt(page, 1500)

    await expect(page.getByTestId('listen-transcript')).toContainText(
      'Make the hero say hello',
      { timeout: 3000 },
    )
    expect(errors).toHaveLength(0)
  })

  test('tap under 250 ms does NOT start recording', async ({ page }) => {
    const errors = trackErrors(page)
    await page.addInitScript(mockSRScript('happy'))

    await loadBlogStarter(page)
    await openListenTab(page)

    await expect(page.getByTestId('listen-ptt')).toBeVisible()
    await holdPtt(page, 100) // below 250 ms hold gate
    await page.waitForTimeout(1000)

    // Transcript region either absent or empty of the spoken phrase.
    const transcript = page.getByTestId('listen-transcript')
    const count = await transcript.count()
    if (count > 0) {
      const text = (await transcript.first().textContent()) ?? ''
      expect(text.includes('Make the hero say hello')).toBe(false)
    }
    // No error banner should appear from a sub-threshold tap either.
    expect(await page.getByTestId('listen-error-banner').count()).toBe(0)
    expect(errors).toHaveLength(0)
    // NOTE: the spec asks for `useListenStore.getState().recording === false`
    // via page.evaluate. listenStore is not exposed on window in Step 1, so we
    // verify the same invariant via the absence of a recorded transcript.
  })

  test('unsupported browser shows banner and hides PTT', async ({ page }) => {
    const errors = trackErrors(page)
    await page.addInitScript(unsupportedScript)

    await loadBlogStarter(page)
    await openListenTab(page)

    await expect(page.getByTestId('listen-unsupported-banner')).toBeVisible()
    expect(await page.getByTestId('listen-ptt').count()).toBe(0)
    expect(errors).toHaveLength(0)
  })

  test('permission denied shows error banner', async ({ page }) => {
    const errors = trackErrors(page)
    await page.addInitScript(mockSRScript('denied'))

    await loadBlogStarter(page)
    await openListenTab(page)

    await expect(page.getByTestId('listen-ptt')).toBeVisible()
    await holdPtt(page, 350)

    const banner = page.getByTestId('listen-error-banner')
    await expect(banner).toBeVisible({ timeout: 3000 })
    await expect(banner).toContainText(/(microphone|permission|denied|not allowed)/i)
    expect(errors).toHaveLength(0)
  })
})
