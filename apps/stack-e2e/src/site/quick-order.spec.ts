import { expect, test } from '@playwright/test';

test('a visitor orders a product from its page without signing in', async ({ page }) => {
  await page.goto('/uk/product/ruchka-knob-e2e-test');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Ручка-кноб E2E Тест');
  await expect(page.getByText('350 грн').first()).toBeVisible();

  await page.getByRole('button', { name: 'У кошик' }).click();
  await page.goto('/uk/checkout');
  await expect(page.getByText('Артикул 700001')).toBeVisible();

  await page.getByLabel(/Ім’я/).fill('Тест E2E');
  await page.getByLabel(/Телефон/).fill('0671234567');
  await page.getByRole('button', { name: 'Надіслати замовлення' }).click();

  await expect(page.getByText('Замовлення прийнято')).toBeVisible();
  await expect(page.getByText('Номер замовлення')).toBeVisible();
});
