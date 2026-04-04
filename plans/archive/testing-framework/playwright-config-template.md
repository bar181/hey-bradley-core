# Playwright Configuration Template

When the project is ready for testing, create this configuration:

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Test Selectors Convention
All testable elements should use `data-testid` attributes:
```
data-testid="left-panel"
data-testid="center-canvas"
data-testid="right-panel"
data-testid="mode-draft"
data-testid="mode-expert"
data-testid="mode-listen"
data-testid="mode-build"
data-testid="tab-reality"
data-testid="tab-data"
data-testid="tab-xai-docs"
data-testid="tab-workflow"
data-testid="status-bar"
data-testid="chat-input"
data-testid="vibe-cards"
data-testid="section-list"
data-testid="property-inspector"
data-testid="json-editor"
data-testid="red-orb"
data-testid="listen-overlay"
data-testid="headline-input"
data-testid="hero-section"
data-testid="features-section"
data-testid="pricing-section"
... etc
```

This convention ensures Playwright tests are stable and not dependent on CSS classes or text content that may change.
