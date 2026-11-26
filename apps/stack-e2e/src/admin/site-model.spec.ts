import { expect, test } from '@playwright/test';

test('a site model is created from a product without one', async ({ page }) => {
  page.on('pageerror', (error) => console.log('E2E-DIAG pageerror', error.message, error.stack));
  page.on('console', (message) => {
    if (message.type() !== 'info') console.log('E2E-DIAG console', message.type(), message.text());
  });
  page.on('framenavigated', (frame) => console.log('E2E-DIAG nav', frame.url()));
  await page.goto('/site-review?tab=lone');
  const row = page.getByRole('row').filter({ hasText: 'Ручка-кноб E2E Другий' }).first();
  await row.getByRole('button', { name: 'Нова модель' }).click();

  await page.getByLabel('Назва моделі').fill('Кноб E2E');
  await page.getByRole('button', { name: 'Створити модель' }).click();
  for (const wait of [100, 400, 800, 1500, 2500]) {
    await page.waitForTimeout(wait);
    const text = await page.evaluate(() => document.body.innerText.slice(0, 600));
    console.log('E2E-DIAG text', wait, page.url(), JSON.stringify(text));
  }

  await expect(page.getByText('Модель створено')).toBeVisible();
  await expect(page).toHaveURL(/\/site-models\/\d+/u);
  await expect(page.getByRole('heading', { name: 'Кноб E2E' })).toBeVisible();
});
