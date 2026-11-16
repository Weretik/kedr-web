import { expect, test } from '@playwright/test';

const siteUrl = 'http://localhost:3000';
// A new heading on every run, so a saved form always has a change to send.
const heading = `Ручки-кноби для перевірки E2E ${Date.now()}`;

test('a category heading saved in the Admin reaches the site after «Оновити сайт зараз»', async ({
  page,
}) => {
  await page.goto('/categories/6488?category=6488');
  await page.getByRole('button', { name: 'Редагувати' }).first().click();

  const panel = page.getByRole('dialog');
  await panel.getByLabel('Заголовок H1').first().fill(heading);
  const saved = page.waitForResponse(
    (response) => response.url().includes('/api/categories/6488/content/uk') && response.ok(),
  );
  await panel.getByRole('button', { name: 'Зберегти', exact: true }).click();
  await saved;

  await page.goto('/dashboard');
  await page.getByRole('button', { name: 'Оновити сайт зараз' }).click();
  await expect(page.getByText('Сайт оновлено')).toBeVisible();

  await page.goto(`${siteUrl}/uk/catalog/ruchky-knoby`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
});
