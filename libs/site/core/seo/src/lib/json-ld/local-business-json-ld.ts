import { COMPANY, siteConfig } from '@site/core/config';
import { localizedPath } from '@site/core/i18n';

import type { JsonLdData } from './json-ld';
import type { CompanyContacts, SiteConfig } from '@site/core/config';
import type { Locale } from '@site/core/i18n';

/**
 * The shop as a `HardwareStore` (a schema.org `LocalBusiness`) with its address and opening hours, for the
 * contacts page. `null` while the admin has not filled in the street, so no half address is published.
 */
export function buildLocalBusinessJsonLd(
  locale: Locale,
  contacts: CompanyContacts,
  config: SiteConfig = siteConfig,
): JsonLdData | null {
  const store = contacts.store;
  if (!store) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'HardwareStore',
    '@id': `${config.siteUrl}/#store`,
    name: store.name ?? COMPANY.name,
    url: `${config.siteUrl}${localizedPath(locale, '/contacts')}`,
    image: `${config.siteUrl}/assets/logo/main-logo.svg`,
    telephone: contacts.phone.e164,
    email: contacts.email,
    hasMap: contacts.links.map,
    parentOrganization: { '@id': `${config.siteUrl}/#organization` },
    address: {
      '@type': 'PostalAddress',
      streetAddress: store.streetAddress[locale],
      addressLocality: contacts.city[locale],
      ...(store.region ? { addressRegion: store.region[locale] } : {}),
      ...(store.postalCode ? { postalCode: store.postalCode } : {}),
      addressCountry: COMPANY.address.countryCode,
    },
    ...(store.hours.length
      ? {
          openingHoursSpecification: store.hours.map((hours) => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [...hours.days],
            opens: hours.opens,
            closes: hours.closes,
          })),
        }
      : {}),
  };
}
