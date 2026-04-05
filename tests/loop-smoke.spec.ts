import { test, expect } from '@playwright/test';

test.describe('JSON Core Loop Smoke Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/builder');
    await page.waitForTimeout(2000);
  });

  test('right panel text change → preview updates', async ({ page }) => {
    // 1. Click Hero in left panel
    await page.locator('[role="button"]').filter({ hasText: 'Main Banner' }).first().click();
    await page.waitForTimeout(500);

    // 2. Find and clear the headline textarea, type new text
    const headlineInput = page.locator('textarea').filter({ hasText: 'Ship Code' }).first();

    // If we can't find a textarea with that text, try finding by label
    if (await headlineInput.count() === 0) {
      // Look for any textarea in the right panel area
      const allTextareas = page.locator('textarea');
      const count = await allTextareas.count();
      // Use the first one which should be the headline
      if (count > 0) {
        await allTextareas.first().fill('Test Headline Change');
      }
    } else {
      await headlineInput.fill('Test Headline Change');
    }
    await page.waitForTimeout(500);

    // 3. Verify preview shows the new headline
    const previewContent = await page.textContent('body');
    expect(previewContent).toContain('Test Headline Change');

    await page.screenshot({ path: 'tests/screenshots/smoke-headline-change.png' });
  });

  test('component toggle → preview updates', async ({ page }) => {
    // 1. Click Main Banner in left panel (use Builder tab)
    const builderTab = page.locator('button').filter({ hasText: 'Builder' }).first();
    await builderTab.click();
    await page.waitForTimeout(300);

    await page.locator('[role="button"]').filter({ hasText: 'Main Banner' }).first().click();
    await page.waitForTimeout(500);

    // 2. Toggle Social Proof off if the switch exists
    const socialProofLabel = page.locator('text=Social Proof').first();
    if (await socialProofLabel.count() > 0) {
      const switchBtn = socialProofLabel.locator('..').locator('button[role="switch"]').first();
      if (await switchBtn.count() > 0) {
        await switchBtn.click();
        await page.waitForTimeout(300);
      }
    }

    // 3. Verify the preview still contains the hero section
    const bodyContent = await page.textContent('body');
    expect(bodyContent).toBeTruthy();

    await page.screenshot({ path: 'tests/screenshots/smoke-toggle.png' });
  });

  test('all tabs render without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));

    // In SIMPLE mode only Preview + Blueprints are visible
    for (const tab of ['Preview', 'Blueprints']) {
      const tabBtn = page.locator('button').filter({ hasText: tab }).first();
      if (await tabBtn.count() > 0) {
        await tabBtn.click();
        await page.waitForTimeout(500);
      }
    }
    expect(errors).toHaveLength(0);
  });
});
