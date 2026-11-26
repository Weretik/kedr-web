import { expect, test } from '@playwright/test';

test('a site model is created from a product without one', async ({ page }) => {
  await page.goto('/site-review?tab=lone');
  const row = page.getByRole('row').filter({ hasText: 'Ручка-кноб E2E Другий' }).first();
  await row.getByRole('button', { name: 'Нова модель' }).click();

  await page.getByLabel('Назва моделі').fill('Кноб E2E');
  await page.getByRole('button', { name: 'Створити модель' }).click();

  await expect(page.getByText('Модель створено')).toBeVisible();
  await expect(page).toHaveURL(/\/site-models\/\d+/u);
  // TEMP diagnostics.
  page.on('framenavigated', (frame) => console.log('E2E-DIAG nav', frame.url()));
  page.on('pageerror', (error) => console.log('E2E-DIAG pageerror', error.message));
  for (const wait of [500, 1500, 3000]) {
    await page.waitForTimeout(wait);
    console.log('E2E-DIAG', wait, JSON.stringify(await page.evaluate(() => ({
      text: document.body.innerText.slice(0, 900),
      hidden: [...document.querySelectorAll('[aria-hidden="true"]')].length,
      dialogs: [...document.querySelectorAll('[role="dialog"]')].map((node) => (node as HTMLElement).innerText.slice(0, 80)),
      h1: [...document.querySelectorAll('h1')].map((node) => node.outerHTML.slice(0, 200)),
    }))));
  }
  await expect(page.getByRole('heading', { name: 'Кноб E2E' })).toBeVisible();
});
