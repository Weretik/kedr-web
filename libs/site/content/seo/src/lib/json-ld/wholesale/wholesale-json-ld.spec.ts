import { createSiteConfig } from '@site/core/config';

import { buildWholesaleBreadcrumbJsonLd } from './wholesale-json-ld';

const config = createSiteConfig({ SITE_URL: 'https://wholesale.example.test/' });
const pages = [
  { locale: 'uk', home: 'Головна', wholesale: 'Співпраця' },
  { locale: 'ru', home: 'Главная', wholesale: 'Сотрудничество' },
] as const;

describe('wholesale breadcrumb JSON-LD', () => {
  it.each(pages)('describes only the two visible $locale breadcrumbs', (page) => {
    expect(buildWholesaleBreadcrumbJsonLd(page.locale, config)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: page.home,
          item: `https://wholesale.example.test/${page.locale}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: page.wholesale,
          item: `https://wholesale.example.test/${page.locale}/wholesale`,
        },
      ],
    });
  });
});
