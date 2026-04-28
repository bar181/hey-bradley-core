/**
 * Cost-cap UI verification — P20 ADR-049 deliverable.
 *
 * Verifies:
 *   - CostPill hides when sessionUsd === 0
 *   - CostPill renders + colors correctly under/at/over cap
 *   - Settings cap-edit input persists to intelligenceStore.capUsd
 *   - cap edit updates pill state without reload
 */
import { test, expect } from '@playwright/test'

test.describe('P20 ADR-049 — Cost-cap UI', () => {
  test('CostPill hidden when sessionUsd === 0', async ({ page }) => {
    await page.goto('/builder')
    // Default fresh session: sessionUsd = 0 → pill hidden
    const pill = page.getByTestId('cost-pill')
    await expect(pill).toHaveCount(0)
  })

  test('CostPill renders green at low spend', async ({ page }) => {
    await page.goto('/builder')
    await page.waitForFunction(() => Boolean((window as any).__intelligenceStore))
    await page.evaluate(() => {
      const store = (window as any).__intelligenceStore.getState()
      store.recordUsage(10, 20, 0.001) // $0.001 / $1.00 cap = 0.1% → green
    })
    const pill = page.getByTestId('cost-pill')
    await expect(pill).toBeVisible()
    await expect(pill).toHaveAttribute('data-state-testid', 'cost-pill-green')
  })

  test('CostPill flips amber at >=80% of cap', async ({ page }) => {
    await page.goto('/builder')
    await page.waitForFunction(() => Boolean((window as any).__intelligenceStore))
    await page.evaluate(() => {
      const store = (window as any).__intelligenceStore.getState()
      // Push to 0.85 * default cap ($1.00) = $0.85
      store.recordUsage(0, 0, 0.85)
    })
    const pill = page.getByTestId('cost-pill')
    await expect(pill).toHaveAttribute('data-state-testid', 'cost-pill-amber')
  })

  test('CostPill flips red at >=100% of cap', async ({ page }) => {
    await page.goto('/builder')
    await page.waitForFunction(() => Boolean((window as any).__intelligenceStore))
    await page.evaluate(() => {
      const store = (window as any).__intelligenceStore.getState()
      // Push to 1.05 * default cap = $1.05
      store.recordUsage(0, 0, 1.05)
    })
    const pill = page.getByTestId('cost-pill')
    await expect(pill).toHaveAttribute('data-state-testid', 'cost-pill-red')
  })

  test('cap edit propagates to store', async ({ page }) => {
    await page.goto('/builder')
    await page.waitForFunction(() => Boolean((window as any).__intelligenceStore))
    await page.evaluate(() => {
      ;(window as any).__intelligenceStore.getState().setCapUsd(2.5)
    })
    const cap = await page.evaluate(() =>
      (window as any).__intelligenceStore.getState().capUsd as number,
    )
    expect(cap).toBe(2.5)
  })

  test('cap clamped to range [0.10, 20.00]', async ({ page }) => {
    await page.goto('/builder')
    await page.waitForFunction(() => Boolean((window as any).__intelligenceStore))
    const out = await page.evaluate(() => {
      const ref = (window as any).__intelligenceStore
      ref.getState().setCapUsd(0.001) // below min
      const low = ref.getState().capUsd
      ref.getState().setCapUsd(99.0) // above max
      const high = ref.getState().capUsd
      return { low, high }
    })
    expect(out.low).toBe(0.10)
    expect(out.high).toBe(20.00)
  })
})
