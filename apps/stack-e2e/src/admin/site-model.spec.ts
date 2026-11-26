import { expect, test } from '@playwright/test';

test('a site model is created from a product without one', async ({ page }) => {
  // TEMPORARY diagnostics
  page.on('response', (response) => {
    if (response.url().includes('/api/') && response.request().method() !== 'GET')
      console.log(
        '[diag] response',
        response.request().method(),
        response.url(),
        response.status(),
      );
  });
  page.on('pageerror', (error) => console.log('[diag] pageerror', error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' || message.text().includes('vite'))
      console.log('[diag] console', message.type(), message.text());
  });
  page.on('framenavigated', (frame) => {
    if (frame === page.mainFrame()) console.log('[diag] navigated', frame.url());
  });

  await page.goto('/site-review?tab=lone');
  const row = page.getByRole('row').filter({ hasText: 'Ручка-кноб E2E Другий' }).first();
  await row.getByRole('button', { name: 'Нова модель' }).click();

  await page.getByLabel('Назва моделі').fill('Кноб E2E');
  await page.getByRole('button', { name: 'Створити модель' }).click();

  try {
    await expect(page.getByText('Модель створено')).toBeVisible();
  } catch (error) {
    console.log('[diag] url', page.url());
    console.log('[diag] alerts', await page.getByRole('alert').allInnerTexts());
    console.log('[diag] dialog', await page.locator('.MuiDrawer-root').allInnerTexts());
    console.log('[diag] body', (await page.locator('body').innerText()).slice(0, 1500));
    throw error;
  }
  await expect(page).toHaveURL(/\/site-models\/\d+/u);
  await expect(page.getByRole('heading', { name: 'Кноб E2E' })).toBeVisible();
});
