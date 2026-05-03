import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    navigationTimeout: 15000,
    actionTimeout: 10000,
  },
  projects: [
    // Desktop project — runs all existing specs EXCEPT the P108 mobile smoke
    // (mobile smoke is opt-in across the 3 mobile-* projects below).
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /p108-mobile-smoke\.spec\.ts/,
    },
    // P108 / D4 — opt-in mobile viewport projects (375 / 390 / 428).
    // Only the p108-mobile-smoke spec runs here; existing specs are
    // unaffected so cumulative regression stays Desktop-only.
    {
      name: 'mobile-375',
      use: { ...devices['iPhone SE'] },
      testMatch: /p108-mobile-smoke\.spec\.ts/,
    },
    {
      name: 'mobile-390',
      use: { ...devices['iPhone 13'] },
      testMatch: /p108-mobile-smoke\.spec\.ts/,
    },
    {
      name: 'mobile-428',
      use: { ...devices['iPhone 13 Pro Max'] },
      testMatch: /p108-mobile-smoke\.spec\.ts/,
    },
  ],
  webServer: {
    command: 'npx vite --host 0.0.0.0 --port 5173',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 30000,
  },
});
