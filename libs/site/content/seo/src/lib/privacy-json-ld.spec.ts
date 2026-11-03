import { createSiteConfig } from '@site/core/config';

import { buildPrivacyBreadcrumbJsonLd } from './privacy-json-ld';

const config = createSiteConfig({ SITE_URL: 'https://privacy.example.test/' });
const pages = [
  { locale: 'uk', home: 'Головна', title: 'Політика конфіденційності' },
  { locale: 'ru', home: 'Главная', title: 'Политика конфиденциальности' },
] as const;

describe('privacy breadcrumb JSON-LD', () => {
  it.each(pages)(
    'emits only the two visible $locale breadcrumbs at the configured origin',
    (page) => {
      expect(buildPrivacyBreadcrumbJsonLd(page.locale, config)).toEqual({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: page.home,
            item: `https://privacy.example.test/${page.locale}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: page.title,
            item: `https://privacy.example.test/${page.locale}/privacy-policy`,
          },
        ],
      });
    },
  );
});
