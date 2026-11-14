import { createSiteConfig } from '@site/core/config';

import { buildContactsBreadcrumbJsonLd } from './contacts-json-ld';

const config = createSiteConfig({ SITE_URL: 'https://contacts.example.test/' });
const pages = [
  { locale: 'uk', home: 'Головна', contacts: 'Контакти' },
  { locale: 'ru', home: 'Главная', contacts: 'Контакты' },
] as const;

describe('contacts breadcrumb JSON-LD', () => {
  it.each(pages)('describes only the two visible $locale breadcrumbs', (page) => {
    expect(buildContactsBreadcrumbJsonLd(page.locale, config)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: page.home,
          item: `https://contacts.example.test/${page.locale}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: page.contacts,
          item: `https://contacts.example.test/${page.locale}/contacts`,
        },
      ],
    });
  });
});
