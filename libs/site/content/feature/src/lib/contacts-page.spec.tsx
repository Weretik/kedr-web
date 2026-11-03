import { COMPANY, siteConfig } from '@site/core/config';
import { renderToStaticMarkup } from 'react-dom/server';

import { ContactsPage } from './contacts-page';

describe.each([
  { locale: 'uk' as const, title: 'Контакти' },
  { locale: 'ru' as const, title: 'Контакты' },
])('contacts server composition: $locale', ({ locale, title }) => {
  it('renders configured company facts and contact links before hydration without a nested main', () => {
    const container = document.createElement('div');
    container.innerHTML = renderToStaticMarkup(<ContactsPage locale={locale} />);

    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(container.querySelector('h1')?.textContent).toBe(title);
    expect(container.textContent).toContain(COMPANY.phone.display);
    expect(container.textContent).toContain(COMPANY.email);
    expect(container.textContent).toContain(COMPANY.address.city[locale]);
    expect(container.querySelector('main')).toBeNull();

    const hrefs = [...container.querySelectorAll('a')].map((link) => link.getAttribute('href'));
    for (const href of [
      `tel:${COMPANY.phone.e164}`,
      `mailto:${COMPANY.email}`,
      COMPANY.links.telegram,
      COMPANY.links.viber,
      COMPANY.links.map,
      `/${locale}/delivery-and-payment`,
      `/${locale}/returns-exchanges`,
    ]) {
      expect(hrefs).toContain(href);
    }
  });

  it('renders one localized breadcrumb graph and leaves the organization to the layout', () => {
    const container = document.createElement('div');
    container.innerHTML = renderToStaticMarkup(<ContactsPage locale={locale} />);
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
