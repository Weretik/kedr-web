import { expect, test } from '@playwright/test';

test('a site model is created from a product without one', async ({ page }) => {
  await page.goto('/site-review?tab=lone');
  const row = page.getByRole('row').filter({ hasText: 'Ручка-кноб E2E Другий' }).first();
  await row.getByRole('button', { name: 'Нова модель' }).click();

  await page.getByLabel('Назва моделі').fill('Кноб E2E');
  await page.getByRole('button', { name: 'Створити модель' }).click();

  await expect(page.getByText('Модель створено')).toBeVisible();
  await expect(page).toHaveURL(/\/site-models\/\d+/u);
  await expect(page.getByRole('heading', { name: 'Кноб E2E' })).toBeVisible();
});
