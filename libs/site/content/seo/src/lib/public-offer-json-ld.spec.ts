import { createSiteConfig } from '@site/core/config';

import { buildPublicOfferBreadcrumbJsonLd } from './public-offer-json-ld';

const config = createSiteConfig({ SITE_URL: 'https://public-offer.example.test/' });
const pages = [
  { locale: 'uk', home: 'Головна', title: 'Публічна оферта' },
  { locale: 'ru', home: 'Главная', title: 'Публичная оферта' },
] as const;

describe('public offer breadcrumb JSON-LD', () => {
  it.each(pages)(
    'describes only the two visible $locale breadcrumbs at the configured origin',
    (page) => {
      expect(buildPublicOfferBreadcrumbJsonLd(page.locale, config)).toEqual({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: page.home,
            item: `https://public-offer.example.test/${page.locale}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: page.title,
            item: `https://public-offer.example.test/${page.locale}/public-offer`,
          },
        ],
      });
    },
  );
});
