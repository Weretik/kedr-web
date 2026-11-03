import { siteConfig } from '@site/core/config';
import { buildCanonicalPath } from '@site/core/seo';

import type { SiteConfig } from '@site/core/config';
import type { Locale } from '@site/core/i18n';
import type { JsonLdData } from '@site/core/seo';

const PUBLIC_OFFER_BREADCRUMB_TEXT: Record<Locale, { home: string; title: string }> = {
  uk: { home: 'Головна', title: 'Публічна оферта' },
  ru: { home: 'Главная', title: 'Публичная оферта' },
};

/** Visible home and offer breadcrumbs; Organization remains owned by the root layout. */
export function buildPublicOfferBreadcrumbJsonLd(
  locale: Locale,
  config: SiteConfig = siteConfig,
): JsonLdData {
  const text = PUBLIC_OFFER_BREADCRUMB_TEXT[locale];
  const items = [
    { name: text.home, path: '/' },
    { name: text.title, path: '/public-offer' },
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
