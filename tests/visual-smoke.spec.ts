import { test, expect } from '@playwright/test';

test.describe('Visual Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(2000);
  });

  test('Data Tab renders valid JSON without raw HTML', async ({ page }) => {
    // Navigate to Data Tab
    const dataBtn = page.locator('button').filter({ hasText: 'DATA' }).first();
    await dataBtn.click();
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'tests/screenshots/data-tab.png' });

    // CRITICAL: No raw HTML class names visible
    const bodyText = await page.textContent('body');
    expect(bodyText).not.toContain('text-blue-400');
    expect(bodyText).not.toContain('text-green-400');
    expect(bodyText).not.toContain('class=');
    expect(bodyText).not.toContain('400">');

    // Actual Data Tab content IS visible (section headers always visible even when collapsed)
    expect(bodyText).toContain('Project Data Schema');
    expect(bodyText).toContain('hero');
  });

  test('Reality Tab renders hero section', async ({ page }) => {
    const heroText = await page.textContent('body');
    expect(heroText).toContain('Build Websites');

    await page.screenshot({ path: 'tests/screenshots/reality-tab.png' });
  });

  test('All 4 tabs navigable without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));

    for (const tabName of ['REALITY', 'DATA', 'XAI DOCS', 'WORKFLOW']) {
      const tab = page.locator('button').filter({ hasText: tabName }).first();
      if (await tab.count() > 0) {
        await tab.click();
        await page.waitForTimeout(500);
      }
      await page.screenshot({ path: `tests/screenshots/tab-${tabName.toLowerCase().replace(' ', '-')}.png` });
    }

    expect(errors).toHaveLength(0);
  });

  test('Left panel navigation updates right panel', async ({ page }) => {
    // Click Theme
    await page.locator('text=Theme').first().click();
    await page.waitForTimeout(300);
    let rightText = await page.textContent('body');
    expect(rightText).toContain('THEME');

    // Click Hero
    await page.locator('text=Hero').first().click();
    await page.waitForTimeout(300);
    rightText = await page.textContent('body');
    expect(rightText).toContain('HEADLINE');

    await page.screenshot({ path: 'tests/screenshots/nav-wiring.png' });
  });

  test('No placeholder or debug text in rendered output', async ({ page }) => {
    const bodyText = await page.textContent('body');
    expect(bodyText).not.toContain('lorem');
    expect(bodyText).not.toContain('TODO');
    expect(bodyText).not.toContain('FIXME');
  });
});
