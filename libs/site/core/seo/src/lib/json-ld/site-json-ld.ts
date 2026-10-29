import { COMPANY, siteConfig } from '@site/core/config';
import { LOCALE_LANGUAGE_TAGS, localizedPath } from '@site/core/i18n';

import type { JsonLdData } from './json-ld';
import type { SiteConfig } from '@site/core/config';
import type { Locale } from '@site/core/i18n';

const organizationId = (config: SiteConfig) => `${config.siteUrl}/#organization`;

/** Organization with public contacts; rendered once in the root layout. */
export function buildOrganizationJsonLd(
  locale: Locale,
  config: SiteConfig = siteConfig,
): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organizationId(config),
    name: COMPANY.name,
    url: `${config.siteUrl}${localizedPath(locale)}`,
    logo: `${config.siteUrl}/assets/logo/main-logo.svg`,
    email: COMPANY.email,
    telephone: COMPANY.phone.e164,
    address: {
      '@type': 'PostalAddress',
      addressLocality: COMPANY.address.city[locale],
      addressCountry: COMPANY.address.countryCode,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: COMPANY.phone.e164,
      contactType: 'sales',
      areaServed: COMPANY.address.countryCode,
      availableLanguage: ['uk', 'ru'],
    },
  };
}

/** WebSite for the home page of each language. A SearchAction is added when site search exists. */
export function buildWebSiteJsonLd(locale: Locale, config: SiteConfig = siteConfig): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: COMPANY.name,
    url: `${config.siteUrl}${localizedPath(locale)}`,
    inLanguage: LOCALE_LANGUAGE_TAGS[locale],
    publisher: { '@id': organizationId(config) },
  };
}
