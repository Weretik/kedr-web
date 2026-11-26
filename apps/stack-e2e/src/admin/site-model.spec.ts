import { expect, test } from '@playwright/test';

test('a site model is created from a product without one', async ({ page }) => {
  // TEMP diagnostics for the CI failure; removed once it passes.
  page.on('response', async (response) => {
    if (response.url().includes('/api/admin/site-models') && response.request().method() !== 'GET')
      console.log('E2E-DIAG', response.request().method(), response.url(), response.status(), await response.text().catch(() => ''));
  });
  page.on('pageerror', (error) => console.log('E2E-DIAG pageerror', error.message, error.stack));
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') console.log('E2E-DIAG console', message.text());
  });
  await page.goto('/site-review?tab=lone');
  const row = page.getByRole('row').filter({ hasText: 'Ручка-кноб E2E Другий' }).first();
  await row.getByRole('button', { name: 'Нова модель' }).click();

  await page.getByLabel('Назва моделі').fill('Кноб E2E');
  const create = page.getByRole('button', { name: 'Створити модель' });
  console.log('E2E-DIAG enabled', await create.isEnabled(), await page.getByRole('dialog').innerText());
  await create.click();
  await page.waitForTimeout(2000);
  console.log('E2E-DIAG after', page.url(), await page.locator('body').innerText().catch(() => ''));

  await expect(page.getByText('Модель створено')).toBeVisible();
  await expect(page).toHaveURL(/\/site-models\/\d+/u);
  await expect(page.getByRole('heading', { name: 'Кноб E2E' })).toBeVisible();
});
