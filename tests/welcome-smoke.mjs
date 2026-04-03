import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const checks = [];

// Test 1: Home page loads
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
const title = await page.textContent('body');
checks.push({
  name: 'Home loads with "Hey Bradley"',
  pass: title.includes('Hey Bradley')
});
checks.push({
  name: 'Home has splash heading',
  pass: title.includes('TELL BRADLEY') || title.includes('WHITEBOARD')
});
checks.push({
  name: 'Home has "Get Started" CTA',
  pass: title.includes('Get Started')
});

// Test 2: Showcase dots exist
const dots = await page.locator('button.rounded-full').count();
checks.push({
  name: 'Showcase indicator dots exist (6+)',
  pass: dots >= 6
});

// Test 3: Navigate to /new-project
await page.goto('http://localhost:5173/new-project', { waitUntil: 'networkidle' });
const npText = await page.textContent('body');
checks.push({
  name: '/new-project has theme grid',
  pass: npText.includes('Pick a theme')
});

// Test 4: Navigate to /builder
await page.goto('http://localhost:5173/builder', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
const builderText = await page.textContent('body');
checks.push({
  name: '/builder loads with Builder/Chat/Listen tabs',
  pass: builderText.includes('Builder') && builderText.includes('Listen')
});

// Test 5: Listen tab has Simulate Input button
await page.click('button:has-text("Listen")');
await page.waitForTimeout(500);
const listenText = await page.textContent('body');
checks.push({
  name: 'Listen tab has Watch a Demo button',
  pass: listenText.includes('Watch a Demo')
});
checks.push({
  name: 'Listen tab has Start Listening button',
  pass: listenText.includes('Start Listening')
});

await browser.close();

// Report
console.log('\n=== Welcome Smoke Test Results ===\n');
let passed = 0, failed = 0;
for (const c of checks) {
  const status = c.pass ? 'PASS' : 'FAIL';
  if (c.pass) passed++; else failed++;
  console.log(`[${status}] ${c.name}`);
}
console.log(`\nTotal: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
