import { LOCALE_LANGUAGE_TAGS } from '@site/core/i18n';

import { getCatalogDictionary } from '../i18n/catalog-dictionary';

import type { Locale } from '@site/core/i18n';

/** Price in hryvnias with the locale's separators and kopecks only when present: `1 245,50 грн`. */
export function formatPrice(price: number, locale: Locale): string {
  const amount = new Intl.NumberFormat(LOCALE_LANGUAGE_TAGS[locale], {
    minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(price);
  return `${amount} ${getCatalogDictionary(locale).currency}`;
}
