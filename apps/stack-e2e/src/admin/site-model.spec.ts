import { expect, test } from '@playwright/test';

test('a site model is created from a product without one', async ({ page }) => {
  await page.goto('/site-showcase?view=lone');
  await page.getByText('Ручка-кноб E2E Другий').first().click();

  await page.getByLabel('Назва моделі').fill('Кноб E2E');
  await page.getByRole('button', { name: 'Створити модель' }).click();

  await expect(page.getByText('Модель створено')).toBeVisible();
  await expect(page.getByText('Товари моделі (1)')).toBeVisible();
});
