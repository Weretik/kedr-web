import { COMPANY, siteConfig } from '@site/core/config';
import { localizedPath } from '@site/core/i18n';

import type { SiteConfig } from '@site/core/config';
import type { Locale } from '@site/core/i18n';

/** Days to return a product, as on the «Повернення та обмін» page. */
export const RETURN_DAYS = 14;
/** The «Повернення та обмін» page; the product domain cannot import the content domain, so the path is repeated. */
const RETURNS_PATH = '/returns-exchanges';

/**
 * Terms shared by every product offer: a new item sold by the company, returnable by mail within
 * {@link RETURN_DAYS} days. Google merchant listings warn when these are missing.
 */
export function buildOfferTerms(
  locale: Locale,
  config: SiteConfig = siteConfig,
): Record<string, unknown> {
  return {
    itemCondition: 'https://schema.org/NewCondition',
    seller: {
      '@type': 'Organization',
      '@id': `${config.siteUrl}/#organization`,
      name: COMPANY.name,
    },
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: COMPANY.address.countryCode,
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: RETURN_DAYS,
      returnMethod: 'https://schema.org/ReturnByMail',
      merchantReturnLink: `${config.siteUrl}${localizedPath(locale, RETURNS_PATH)}`,
    },
  };
}

/** One Offer for a visible positive price; nothing when the price is unknown, so no offer is invented. */
export function buildOffer(
  locale: Locale,
  url: string,
  price: number | null,
  inStock: boolean,
  config: SiteConfig = siteConfig,
): Record<string, unknown> | undefined {
  if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) return undefined;
  return {
    '@type': 'Offer',
    url,
    price,
    priceCurrency: 'UAH',
    availability: `https://schema.org/${inStock ? 'InStock' : 'OutOfStock'}`,
    ...buildOfferTerms(locale, config),
  };
}
