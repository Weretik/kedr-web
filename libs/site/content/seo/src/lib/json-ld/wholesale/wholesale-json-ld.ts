import { siteConfig } from '@site/core/config';
import { buildCanonicalPath } from '@site/core/seo';

import type { SiteConfig } from '@site/core/config';
import type { Locale } from '@site/core/i18n';
import type { JsonLdData } from '@site/core/seo';

const WHOLESALE_BREADCRUMB_TEXT: Record<Locale, { home: string; wholesale: string }> = {
  uk: { home: 'Головна', wholesale: 'Співпраця' },
  ru: { home: 'Главная', wholesale: 'Сотрудничество' },
};

/** Only the visible home and wholesale breadcrumbs; the root layout owns Organization data. */
export function buildWholesaleBreadcrumbJsonLd(
  locale: Locale,
  config: SiteConfig = siteConfig,
): JsonLdData {
  const text = WHOLESALE_BREADCRUMB_TEXT[locale];
  const items = [
    { name: text.home, path: '/' },
    { name: text.wholesale, path: '/wholesale' },
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
