import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ssDir = path.join(__dirname, 'screenshots');

const BASE = 'http://localhost:5173';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  // --- Desktop 1440x900 dark mode screenshots ---
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  // 1. Home (dark)
  try {
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 15000 });
    await page.screenshot({ path: path.join(ssDir, 'phase4-home-dark.png'), fullPage: false });
    results.push('phase4-home-dark.png  OK');
  } catch (e) {
    results.push(`phase4-home-dark.png  FAIL: ${e.message}`);
  }

  // 2. New Project (dark)
  try {
    await page.goto(`${BASE}/new-project`, { waitUntil: 'networkidle', timeout: 15000 });
    await page.screenshot({ path: path.join(ssDir, 'phase4-newproject-dark.png'), fullPage: false });
    results.push('phase4-newproject-dark.png  OK');
  } catch (e) {
    results.push(`phase4-newproject-dark.png  FAIL: ${e.message}`);
  }

  // 3. Builder (dark) — wait 2s for rendering
  try {
    await page.goto(`${BASE}/builder`, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(ssDir, 'phase4-builder-dark.png'), fullPage: false });
    results.push('phase4-builder-dark.png  OK');
  } catch (e) {
    results.push(`phase4-builder-dark.png  FAIL: ${e.message}`);
  }

  // 4. Builder (light) — click the Sun/Moon toggle
  try {
    const toggle = page.locator('button[aria-label="Switch to light mode"]');
    await toggle.click({ timeout: 5000 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(ssDir, 'phase4-builder-light.png'), fullPage: false });
    results.push('phase4-builder-light.png  OK');
  } catch (e) {
    results.push(`phase4-builder-light.png  FAIL: ${e.message}`);
  }

  // 5. Listen tab (dark) — fresh builder page so we're back to dark
  try {
    // Switch back to dark if needed by reloading
    await page.goto(`${BASE}/builder`, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1000);
    // Click the Listen tab
    const listenTab = page.locator('button:has-text("Listen"), [role="tab"]:has-text("Listen"), div:has-text("Listen")').first();
    await listenTab.click({ timeout: 5000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(ssDir, 'phase4-listen-dark.png'), fullPage: false });
    results.push('phase4-listen-dark.png  OK');
  } catch (e) {
    results.push(`phase4-listen-dark.png  FAIL: ${e.message}`);
  }

  await ctx.close();

  // --- Mobile 375x812 ---
  const mCtx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const mPage = await mCtx.newPage();

  try {
    await mPage.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 15000 });
    await mPage.screenshot({ path: path.join(ssDir, 'phase4-home-mobile.png'), fullPage: false });
    results.push('phase4-home-mobile.png  OK');
  } catch (e) {
    results.push(`phase4-home-mobile.png  FAIL: ${e.message}`);
  }

  await mCtx.close();
  await browser.close();

  console.log('\n=== Screenshot Results ===');
  for (const r of results) console.log(r);
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
