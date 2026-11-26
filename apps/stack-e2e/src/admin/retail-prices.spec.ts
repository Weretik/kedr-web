import { join } from 'node:path';

import { expect, test } from '@playwright/test';

// The same price as the fixture, so the site checks still see 350 грн whatever runs first.
// Playwright loads specs as CommonJS, so `import.meta` is not available here.
const priceFile = join(__dirname, '../../fixtures/retail-prices.xlsx');

test('retail prices are loaded from a file and given back to 1C', async ({ page }) => {
  await page.goto('/catalog');
  await page.getByRole('button', { name: 'Завантажити роздрібні ціни' }).click();
  await expect(page.getByText('Тип ціни: «Розница халтмаг 30%»')).toBeVisible();

  await page.getByLabel('Файл з цінами').setInputFiles(priceFile);
  await page.getByRole('button', { name: 'Завантажити', exact: true }).click();

  await expect(page.getByText(/Без змін: 1/u)).toBeVisible();
  await expect(page.getByText(/799999/u)).toBeVisible();
  await expect(page.getByText(/З 1С не оновлюється 1 ціна/u)).toBeVisible();

  await page.getByRole('button', { name: 'Повернути ціни під 1С' }).click();
  await page.getByRole('button', { name: 'Повернути', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Повернути ціни під 1С' })).toBeHidden();
});
