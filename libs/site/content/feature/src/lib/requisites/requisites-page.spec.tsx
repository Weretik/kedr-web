import { siteConfig } from '@site/core/config';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToStaticMarkup } from 'react-dom/server';

import { RequisitesPage } from './requisites-page';

const { contacts, requisites } = vi.hoisted(() => ({
  requisites: {
    legalName: 'ФОП Тестовий Тест Тестович',
    code: '1234567890',
    registrationExtractNumber: '111222',
    iban: 'UA213223130000026007233566001',
    bankName: 'Тест Банк',
    bankCode: '322313',
  },
  contacts: {
    phone: { display: '(067) 111-22-33', e164: '+380671112233' },
    email: 'sales@example.test',
    city: { uk: 'Київ', ru: 'Киев' },
    links: {
      telegram: 'https://t.me/kedr_sales',
      viber: 'viber://chat?number=%2B380671112233',
      map: 'https://maps.app.goo.gl/abc',
    },
  },
}));

vi.mock('@site/shared/company', () => ({
  getCompanyContacts: vi.fn(async () => contacts),
  getCompanyRequisites: vi.fn(async () => requisites),
}));

const clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  if (clipboardDescriptor) Object.defineProperty(navigator, 'clipboard', clipboardDescriptor);
  else Reflect.deleteProperty(navigator, 'clipboard');
});

describe.each([
  {
    locale: 'uk' as const,
    title: 'Реквізити',
    home: 'Головна',
    payment: 'Погодьте з менеджером наявність, остаточну суму та реквізити для вашого замовлення.',
  },
  {
    locale: 'ru' as const,
    title: 'Реквизиты',
    home: 'Главная',
    payment: 'Согласуйте с менеджером наличие, окончательную сумму и реквизиты для вашего заказа.',
  },
])('requisites server composition: $locale', ({ locale, title, home, payment }) => {
  it('renders the requisites from the API, the sales phone and localized links before hydration', async () => {
    const container = document.createElement('div');
    container.innerHTML = renderToStaticMarkup(await RequisitesPage({ locale }));

    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(container.querySelector('h1')?.textContent).toBe(title);
    for (const value of Object.values(requisites)) {
      expect(container.textContent).toContain(value);
    }
    expect(container.textContent).toContain(payment);
    expect(container.textContent).toContain(contacts.phone.display);
    expect(container.querySelector('main, form, iframe')).toBeNull();

    const hrefs = [...container.querySelectorAll('a')].map((link) => link.getAttribute('href'));
    for (const href of [
      `tel:${contacts.phone.e164}`,
      `/${locale}`,
      `/${locale}/delivery-and-payment`,
      `/${locale}/public-offer`,
      `/${locale}/privacy-policy`,
    ]) {
      expect(hrefs).toContain(href);
    }
  });

  it('renders one absolute localized breadcrumb graph without duplicating layout structured data', async () => {
    const container = document.createElement('div');
    container.innerHTML = renderToStaticMarkup(await RequisitesPage({ locale }));
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');

    expect(scripts).toHaveLength(1);
    const graph = JSON.parse(scripts[0].textContent ?? '{}');
    expect(graph['@type']).toBe('BreadcrumbList');
    expect(graph.itemListElement).toEqual([
      {
        '@type': 'ListItem',
        position: 1,
        name: home,
        item: `${siteConfig.siteUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: title,
        item: `${siteConfig.siteUrl}/${locale}/requisites`,
      },
    ]);
    expect(container.innerHTML).not.toContain('"@type":"Organization"');
    expect(container.innerHTML).not.toContain('"@type":"WebSite"');
  });
});

it('passes the loaded IBAN and six-field localized payload through the real copy controls', async () => {
  const user = userEvent.setup();
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  });
  render(await RequisitesPage({ locale: 'ru' }));

  expect(writeText).not.toHaveBeenCalled();
  await user.click(screen.getByRole('button', { name: 'Скопировать IBAN' }));
  await waitFor(() => expect(writeText).toHaveBeenNthCalledWith(1, requisites.iban));

  await user.click(screen.getByRole('button', { name: 'Скопировать все реквизиты' }));
  await waitFor(() =>
    expect(writeText).toHaveBeenNthCalledWith(
      2,
      [
        `Наименование: ${requisites.legalName}`,
        `Код: ${requisites.code}`,
        `Выписка: № ${requisites.registrationExtractNumber}`,
        `IBAN: ${requisites.iban}`,
        `Банк: ${requisites.bankName}`,
        `МФО: ${requisites.bankCode}`,
      ].join('\n'),
    ),
  );
  expect(writeText).toHaveBeenCalledTimes(2);
});
