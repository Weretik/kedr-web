import { expect, test } from '@playwright/test';

test('serves the React application shell in Chromium', async ({ page }) => {
  const response = await page.goto('/');

  expect(response?.ok()).toBe(true);
  await expect(page).toHaveTitle('Kedr Admin');
  await expect(page.locator('#root')).toBeAttached();
});
