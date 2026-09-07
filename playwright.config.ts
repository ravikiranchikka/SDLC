import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end test configuration.
 *
 * The Home page specs navigate with relative paths (for example
 * `page.goto('/')`), so a `baseURL` is required. The `webServer` block starts
 * the application automatically and reuses an already running dev server
 * locally, so `npm run test:e2e` works from a clean checkout.
 *
 * Browsers are not installed by `npm install`. Run `npx playwright install`
 * once before the first end-to-end run.
 */
export default defineConfig({
  testDir: './tests/e2e',
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
