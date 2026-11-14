import { siteConfig } from '@site/core/config';
import { buildCanonicalPath } from '@site/core/seo';

import type { SiteConfig } from '@site/core/config';
import type { Locale } from '@site/core/i18n';
import type { JsonLdData } from '@site/core/seo';

const PRIVACY_BREADCRUMB_TEXT: Record<Locale, { home: string; title: string }> = {
  uk: { home: 'Головна', title: 'Політика конфіденційності' },
  ru: { home: 'Главная', title: 'Политика конфиденциальности' },
};

/** Visible home and privacy breadcrumbs; Organization remains owned by the root layout. */
export function buildPrivacyBreadcrumbJsonLd(
  locale: Locale,
  config: SiteConfig = siteConfig,
): JsonLdData {
  const text = PRIVACY_BREADCRUMB_TEXT[locale];
  const items = [
    { name: text.home, path: '/' },
    { name: text.title, path: '/privacy-policy' },
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
