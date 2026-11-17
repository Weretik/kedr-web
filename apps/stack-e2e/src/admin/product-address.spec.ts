import { expect, test } from '@playwright/test';

test('a product address is changed in the right-side panel', async ({ page }) => {
  await page.goto('/catalog');
  await page
    .getByRole('button', { name: 'Редагувати товар Ручка-кноб E2E Другий, ID 700002' })
    .click();

  const panel = page.getByRole('dialog');
  await expect(panel.getByText('Редагування товару')).toBeVisible();
  await panel.getByRole('textbox', { name: 'Адреса' }).fill('ruchka-knob-e2e-nova-adresa');
  await panel.getByRole('button', { name: 'Зберегти адресу' }).click();

  await expect(panel.getByText('/uk/product/ruchka-knob-e2e-nova-adresa')).toBeVisible();
});
