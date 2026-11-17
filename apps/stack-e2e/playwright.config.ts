import { defineConfig, devices } from '@playwright/test';

import { adminSessionFile } from './src/admin/admin-session';

// Full-stack checks: the Admin and the site run against a real KedrStore API and a seeded test database.
// The API must already listen on KEDR_API_URL; CI starts it in `.github/workflows/e2e.yml`.
const apiUrl = process.env['KEDR_API_URL'] ?? 'http://localhost:5081';
const adminUrl = 'http://localhost:4200';
const siteUrl = 'http://localhost:3000';
const revalidateSecret = process.env['KEDR_REVALIDATE_SECRET'] ?? 'e2e-revalidate-secret';
const isCi = Boolean(process.env['CI']);

export default defineConfig({
  testDir: './src',
  outputDir: '../../dist/.playwright/apps/stack-e2e/test-output',
  // One database for all tests: run them one at a time so no test sees another's half-done change.
  workers: 1,
  forbidOnly: isCi,
  // No retries: a repeat would meet the data the first attempt already changed. Reset the database to rerun.
  retries: 0,
  reporter: isCi
    ? [
        ['github'],
        ['html', { outputFolder: '../../dist/.playwright/apps/stack-e2e/report', open: 'never' }],
      ]
    : 'list',
  use: {
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'admin-session',
      testMatch: /admin-session\.setup\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: adminUrl },
    },
    {
      name: 'admin',
      testDir: './src/admin',
      dependencies: ['admin-session'],
      use: { ...devices['Desktop Chrome'], baseURL: adminUrl, storageState: adminSessionFile },
    },
    {
      name: 'site',
      testDir: './src/site',
      // The Admin tests change category texts and refresh the site, so the site runs after them.
      dependencies: ['admin'],
      use: { ...devices['Desktop Chrome'], baseURL: siteUrl },
    },
  ],
  webServer: [
    {
      command: 'npx nx run admin:serve',
      url: adminUrl,
      env: { VITE_API_BASE_URL: apiUrl },
      reuseExistingServer: !isCi,
      timeout: 180_000,
    },
    {
      // A production build, as on Cloudflare: `nx build site` runs before this in CI.
      command: 'npx next start -p 3000',
      cwd: '../site',
      url: `${siteUrl}/uk`,
      env: { KEDR_API_URL: apiUrl, SITE_URL: siteUrl, KEDR_REVALIDATE_SECRET: revalidateSecret },
      reuseExistingServer: !isCi,
      timeout: 120_000,
    },
  ],
});
