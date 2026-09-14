import { defineConfig, devices } from '@playwright/test';

const baseURL = 'http://localhost:4200';

export default defineConfig({
  testDir: './src',
  outputDir: '../../dist/.playwright/apps/admin-e2e/test-output',
  reporter: process.env['CI']
    ? [
        ['github'],
        ['html', { outputFolder: '../../dist/.playwright/apps/admin-e2e/report', open: 'never' }],
      ]
    : 'list',
  retries: process.env['CI'] ? 2 : 0,
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npx nx run admin:serve',
    url: baseURL,
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
