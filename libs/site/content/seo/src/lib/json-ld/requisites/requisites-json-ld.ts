import { siteConfig } from '@site/core/config';
import { buildCanonicalPath } from '@site/core/seo';

import type { SiteConfig } from '@site/core/config';
import type { Locale } from '@site/core/i18n';
import type { JsonLdData } from '@site/core/seo';

const REQUISITES_BREADCRUMB_TEXT: Record<Locale, { home: string; requisites: string }> = {
  uk: { home: 'Головна', requisites: 'Реквізити' },
  ru: { home: 'Главная', requisites: 'Реквизиты' },
};

/** Only visible breadcrumbs; Organization stays in the locale layout and WebSite on home. */
export function buildRequisitesBreadcrumbJsonLd(
  locale: Locale,
  config: SiteConfig = siteConfig,
): JsonLdData {
  const text = REQUISITES_BREADCRUMB_TEXT[locale];
  const items = [
    { name: text.home, path: '/' },
    { name: text.requisites, path: '/requisites' },
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
