import { createSiteConfig } from '@site/core/config';

import { buildGalleryBreadcrumbJsonLd } from './gallery-json-ld';

const config = createSiteConfig({ SITE_URL: 'https://gallery.example.test/' });
const pages = [
  { locale: 'uk', home: 'Головна', gallery: 'Галерея та відео' },
  { locale: 'ru', home: 'Главная', gallery: 'Галерея и видео' },
] as const;

describe('gallery breadcrumb JSON-LD', () => {
  it.each(pages)(
    'describes only the two visible $locale breadcrumbs at the configured origin',
    (page) => {
      expect(buildGalleryBreadcrumbJsonLd(page.locale, config)).toEqual({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: page.home,
            item: `https://gallery.example.test/${page.locale}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: page.gallery,
            item: `https://gallery.example.test/${page.locale}/galleria`,
          },
        ],
      });
    },
  );
});
