# Hey Bradley — End-of-Phase Testing Framework

## Overview
Each phase concludes with a Playwright-based retrospective that validates UI, UX, and functionality. Test results feed into the phase rubric scores and inform the next phase's approach.

## Testing Stack
- **Playwright** — Browser automation for e2e testing
- **@playwright/test** — Test runner with assertions
- **Screenshot comparison** — Visual regression for design system compliance
- **Performance timing** — Measure render times and interaction latency

## Setup
```bash
# Install Playwright (when ready to test)
npm install -D @playwright/test
npx playwright install chromium

# Run tests
npx playwright test

# Run specific phase tests
npx playwright test tests/e2e/level-1/

# Generate report
npx playwright show-report
```

## Test Organization
```
tests/
├── e2e/
│   ├── level-1/
│   │   ├── phase-1.0-shell.spec.ts      # Shell & Navigation
│   │   ├── phase-1.1-hero-json.spec.ts   # Hero + JSON Core Loop
│   │   ├── phase-1.2-tabs-listen.spec.ts # All Tabs + Listen Visual
│   │   └── phase-1.3-polish.spec.ts      # Hero Polish + Presets
│   ├── level-2/
│   │   ├── phase-2.1-onboarding.spec.ts
│   │   ├── phase-2.2-sections.spec.ts
│   │   └── phase-2.3-ux-polish.spec.ts
│   ├── level-3/
│   │   ├── phase-3.1-pillar-docs.spec.ts
│   │   └── phase-3.2-detail-specs.spec.ts
│   ├── level-4/
│   │   ├── phase-4.1-auth-db.spec.ts
│   │   ├── phase-4.2-templates.spec.ts
│   │   └── phase-4.3-llm-pillar.spec.ts
│   ├── level-5/
│   │   ├── phase-5.1-chat-bot.spec.ts
│   │   ├── phase-5.2-copy.spec.ts
│   │   ├── phase-5.3-inference.spec.ts
│   │   └── phase-5.4-onboarding.spec.ts
│   ├── level-6/
│   │   ├── phase-6.1-microphone.spec.ts
│   │   ├── phase-6.2-listen-mode.spec.ts
│   │   └── phase-6.3-whiteboard.spec.ts
│   ├── level-7/
│   │   ├── phase-7.1-aisp-mode.spec.ts
│   │   ├── phase-7.2-changelogs.spec.ts
│   │   ├── phase-7.3-human-specs.spec.ts
│   │   └── phase-7.4-aisp-export.spec.ts
│   ├── fixtures/
│   │   ├── mock-config.json              # Standard test config
│   │   ├── mock-llm-responses.json       # Mock LLM responses for CI
│   │   └── screenshot-baselines/         # Visual regression baselines
│   └── helpers/
│       ├── selectors.ts                  # Shared CSS selectors
│       ├── actions.ts                    # Common test actions
│       └── assertions.ts                 # Custom assertions
├── playwright.config.ts
└── tsconfig.test.json
```

## Test Categories

### 1. UI Structure Tests
Verify DOM structure, element presence, and correct rendering.
```typescript
// Example: Shell structure test
test('three-panel layout renders', async ({ page }) => {
  await page.goto('/builder');
  await expect(page.locator('[data-testid="left-panel"]')).toBeVisible();
  await expect(page.locator('[data-testid="center-canvas"]')).toBeVisible();
  await expect(page.locator('[data-testid="right-panel"]')).toBeVisible();
});
```

### 2. UX Interaction Tests
Verify user interactions produce expected state changes.
```typescript
// Example: Mode toggle test
test('DRAFT/EXPERT toggle switches panels', async ({ page }) => {
  await page.goto('/builder');
  await page.click('[data-testid="mode-expert"]');
  await expect(page.locator('[data-testid="property-inspector"]')).toBeVisible();
  await page.click('[data-testid="mode-draft"]');
  await expect(page.locator('[data-testid="vibe-cards"]')).toBeVisible();
});
```

### 3. Functionality Tests
Verify core business logic works correctly.
```typescript
// Example: JSON bidirectional sync
test('editing JSON updates preview', async ({ page }) => {
  await page.goto('/builder');
  await page.click('[data-testid="tab-data"]');
  // Modify JSON
  await page.fill('[data-testid="json-editor"]', '...');
  await page.click('[data-testid="tab-reality"]');
  // Verify preview updated
  await expect(page.locator('.hero-heading')).toHaveText('New Heading');
});
```

### 4. Visual Regression Tests
Compare screenshots against baselines for design system compliance.
```typescript
// Example: Design system check
test('warm cream color scheme applied', async ({ page }) => {
  await page.goto('/builder');
  await expect(page).toHaveScreenshot('builder-default.png', {
    maxDiffPixelRatio: 0.01,
  });
});
```

### 5. Performance Tests
Measure timing for critical interactions.
```typescript
// Example: Render performance
test('config change renders in < 100ms', async ({ page }) => {
  await page.goto('/builder');
  const start = Date.now();
  await page.fill('[data-testid="headline-input"]', 'New Heading');
  await page.waitForSelector('.hero-heading:has-text("New Heading")');
  const duration = Date.now() - start;
  expect(duration).toBeLessThan(100);
});
```

## Retrospective Process

After each phase:

1. **Run Playwright tests** for the completed phase
2. **Generate report** with pass/fail results and screenshots
3. **Update rubric scores** based on test results
4. **Document findings** in the phase's retrospective.md:
   - What Went Well
   - What Didn't Go Well
   - Key Decisions Made
   - Rubric Score Update
   - Screenshots (stored in phase folder)
   - Recommendations for next phase
5. **Human review** — present results to Bradley + UI designer SME

## CI Integration (Future)
```yaml
# .github/workflows/e2e.yml (when GitHub Actions is set up)
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

## Mock Strategy for LLM Tests (Levels 5-7)
For phases involving LLM calls, use mock responses:
```typescript
// Intercept LLM API calls with predetermined responses
await page.route('**/api/llm/**', route => {
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(mockLLMResponse),
  });
});
```
