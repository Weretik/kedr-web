import { siteConfig } from '@site/core/config';
import { LOCALE_LANGUAGE_TAGS, localizedPath } from '@site/core/i18n';

import { CONTACTS_PATH } from './contacts-metadata';

import type { SiteConfig } from '@site/core/config';
import type { Locale } from '@site/core/i18n';
import type { JsonLdData } from '@site/core/seo';

export function buildContactsJsonLd(locale: Locale, config: SiteConfig = siteConfig): JsonLdData[] {
  const url = `${config.siteUrl}${localizedPath(locale, CONTACTS_PATH)}`;
  const name = locale === 'uk' ? 'Контакти' : 'Контакты';
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      '@id': `${url}#webpage`,
      url,
      name,
      inLanguage: LOCALE_LANGUAGE_TAGS[locale],
      mainEntity: { '@id': `${config.siteUrl}/#organization` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: locale === 'uk' ? 'Головна' : 'Главная',
          item: `${config.siteUrl}${localizedPath(locale)}`,
        },
        { '@type': 'ListItem', position: 2, name, item: url },
      ],
    },
  ];
}
