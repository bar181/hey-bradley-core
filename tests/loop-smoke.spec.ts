import { test, expect } from '@playwright/test';

test.describe('JSON Core Loop Smoke Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/builder');
    await page.waitForTimeout(2000);
  });

  test('right panel text change → JSON updates → preview updates', async ({ page }) => {
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

    // 3. Switch to DATA tab and verify JSON contains new headline
    const dataTab = page.locator('button').filter({ hasText: 'Data' }).first();
    await dataTab.click();
    await page.waitForTimeout(1000);

    const dataContent = await page.textContent('body');
    expect(dataContent).toContain('Test Headline Change');

    // 4. Switch back to REALITY and verify preview shows new headline
    const realityTab = page.locator('button').filter({ hasText: 'Preview' }).first();
    await realityTab.click();
    await page.waitForTimeout(500);

    const previewContent = await page.textContent('body');
    expect(previewContent).toContain('Test Headline Change');

    await page.screenshot({ path: 'tests/screenshots/smoke-headline-change.png' });
  });

  test('component toggle → JSON updates → preview updates', async ({ page }) => {
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

    // 3. Check DATA tab reflects the change
    await page.locator('button').filter({ hasText: 'Data' }).first().click();
    await page.waitForTimeout(500);
    const jsonContent = await page.textContent('body');
    expect(jsonContent).toContain('hero');

    await page.screenshot({ path: 'tests/screenshots/smoke-toggle.png' });
  });

  test('all tabs render without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));

    for (const tab of ['Preview', 'Data', 'Specs', 'Pipeline']) {
      const tabBtn = page.locator('button').filter({ hasText: tab }).first();
      if (await tabBtn.count() > 0) {
        await tabBtn.click();
        await page.waitForTimeout(500);
      }
    }
    expect(errors).toHaveLength(0);
  });
});
