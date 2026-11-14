import { siteConfig } from '@site/core/config';
import { renderToStaticMarkup } from 'react-dom/server';

import { ContactsPage } from './contacts-page';

const { contacts } = vi.hoisted(() => ({
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

vi.mock('@site/shared/company', () => ({ getCompanyContacts: vi.fn(async () => contacts) }));

describe.each([
  { locale: 'uk' as const, title: 'Контакти' },
  { locale: 'ru' as const, title: 'Контакты' },
])('contacts server composition: $locale', ({ locale, title }) => {
  it('renders configured company facts and contact links before hydration without a nested main', async () => {
    const container = document.createElement('div');
    container.innerHTML = renderToStaticMarkup(await ContactsPage({ locale }));

    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(container.querySelector('h1')?.textContent).toBe(title);
    expect(container.textContent).toContain(contacts.phone.display);
    expect(container.textContent).toContain(contacts.email);
    expect(container.textContent).toContain(contacts.city[locale]);
    expect(container.querySelector('main')).toBeNull();

    const hrefs = [...container.querySelectorAll('a')].map((link) => link.getAttribute('href'));
    for (const href of [
      `tel:${contacts.phone.e164}`,
      `mailto:${contacts.email}`,
      contacts.links.telegram,
      contacts.links.viber,
      contacts.links.map,
      `/${locale}/delivery-and-payment`,
      `/${locale}/returns-exchanges`,
    ]) {
      expect(hrefs).toContain(href);
    }
  });

  it('renders one localized breadcrumb graph and leaves the organization to the layout', async () => {
    const container = document.createElement('div');
    container.innerHTML = renderToStaticMarkup(await ContactsPage({ locale }));
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');

    expect(scripts).toHaveLength(1);
    const graph = JSON.parse(scripts[0].textContent ?? '{}');
    expect(graph['@type']).toBe('BreadcrumbList');
    expect(graph.itemListElement).toHaveLength(2);
    expect(graph.itemListElement[0]).toMatchObject({
      position: 1,
      item: `${siteConfig.siteUrl}/${locale}`,
    });
    expect(graph.itemListElement[1]).toMatchObject({
      position: 2,
      name: title,
      item: `${siteConfig.siteUrl}/${locale}/contacts`,
    });
    expect(container.innerHTML).not.toContain('"@type":"Organization"');
  });
});
