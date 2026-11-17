import { test as setup } from '@playwright/test';

import { adminCredentials, adminSessionFile, expectDashboard, signIn } from './admin-session';

setup('signs in the administrator once for the Admin tests', async ({ page }) => {
  const { email, password } = adminCredentials();
  await signIn(page, email, password);
  await expectDashboard(page);
  await page.context().storageState({ path: adminSessionFile });
});
