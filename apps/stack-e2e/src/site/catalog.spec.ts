import { expect, test } from '@playwright/test';

test('the catalog leads to a category with prices and an in-stock filter', async ({ page }) => {
  await page.goto('/uk/catalog');
  await page
    .getByRole('link', { name: /Ручки-кноби/ })
    .first()
    .click();

  await expect(page).toHaveURL(/\/uk\/catalog\/ruchky-knoby/);
  const inStock = page.getByRole('article').filter({ hasText: 'Ручка-кноб E2E Тест' });
  const outOfStock = page.getByRole('article').filter({ hasText: 'Ручка-кноб E2E Другий' });
  await expect(inStock).toContainText('350 грн');
  await expect(outOfStock).toContainText('Немає в наявності');

  const filters = page.getByRole('form', { name: 'Фільтри' });
  await filters.getByText('Тільки в наявності').click();
  await filters.getByRole('button', { name: 'Застосувати' }).click();
  await expect(inStock).toBeVisible();
  await expect(outOfStock).toHaveCount(0);
});
