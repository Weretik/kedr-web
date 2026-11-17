import { expect, test } from '@playwright/test';

import { adminCredentials, expectDashboard, signIn } from './admin-session';

// A fresh browser: this test checks the sign-in form itself, not the saved session.
test.use({ storageState: { cookies: [], origins: [] } });

test('a wrong password is refused and the right one opens the dashboard', async ({ page }) => {
  const { email, password } = adminCredentials();

  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/login/);

  await signIn(page, email, `${password}-wrong`);
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole('alert')).toBeVisible();

  await signIn(page, email, password);
  await expectDashboard(page);
});
