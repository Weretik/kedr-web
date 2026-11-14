import { siteConfig } from '@site/core/config';
import { buildCanonicalPath } from '@site/core/seo';

import type { SiteConfig } from '@site/core/config';
import type { Locale } from '@site/core/i18n';
import type { JsonLdData } from '@site/core/seo';

const CONTACTS_BREADCRUMB_TEXT: Record<Locale, { home: string; contacts: string }> = {
  uk: { home: 'Головна', contacts: 'Контакти' },
  ru: { home: 'Главная', contacts: 'Контакты' },
};

/** Only the visible home and contacts breadcrumbs; the root layout owns Organization data. */
export function buildContactsBreadcrumbJsonLd(
  locale: Locale,
  config: SiteConfig = siteConfig,
): JsonLdData {
  const text = CONTACTS_BREADCRUMB_TEXT[locale];
  const items = [
    { name: text.home, path: '/' },
    { name: text.contacts, path: '/contacts' },
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
