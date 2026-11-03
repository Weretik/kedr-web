import { siteConfig } from '@site/core/config';
import { buildCanonicalPath } from '@site/core/seo';

import type { SiteConfig } from '@site/core/config';
import type { Locale } from '@site/core/i18n';
import type { JsonLdData } from '@site/core/seo';

const GALLERY_BREADCRUMB_TEXT: Record<Locale, { home: string; gallery: string }> = {
  uk: { home: 'Головна', gallery: 'Галерея та відео' },
  ru: { home: 'Главная', gallery: 'Галерея и видео' },
};

/** Only the visible home and gallery breadcrumbs; the root layout owns Organization data. */
export function buildGalleryBreadcrumbJsonLd(
  locale: Locale,
  config: SiteConfig = siteConfig,
): JsonLdData {
  const text = GALLERY_BREADCRUMB_TEXT[locale];
  const items = [
    { name: text.home, path: '/' },
    { name: text.gallery, path: '/galleria' },
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${config.siteUrl}${buildCanonicalPath(locale, item.path)}`,
    })),
  };
}
