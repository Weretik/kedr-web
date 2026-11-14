import { createSiteConfig, siteConfig } from '@site/core/config';

import { buildRequisitesBreadcrumbJsonLd } from './requisites-json-ld';

const config = createSiteConfig({ SITE_URL: 'https://requisites.example.test/' });
const pages = [
  { locale: 'uk', home: 'Головна', requisites: 'Реквізити' },
  { locale: 'ru', home: 'Главная', requisites: 'Реквизиты' },
] as const;

describe('requisites breadcrumb JSON-LD', () => {
  it.each(pages)(
    'describes only the two visible $locale breadcrumbs at the configured origin',
    (page) => {
      expect(buildRequisitesBreadcrumbJsonLd(page.locale, config)).toEqual({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: page.home,
            item: `https://requisites.example.test/${page.locale}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: page.requisites,
            item: `https://requisites.example.test/${page.locale}/requisites`,
          },
        ],
      });
    },
  );

  it('uses the active site origin when no configuration is supplied', () => {
    expect(buildRequisitesBreadcrumbJsonLd('uk')).toMatchObject({
      itemListElement: [
        { item: `${siteConfig.siteUrl}/uk` },
        { item: `${siteConfig.siteUrl}/uk/requisites` },
      ],
    });
  });
});
