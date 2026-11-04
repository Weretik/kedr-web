import { LOCALE_LANGUAGE_TAGS } from './locales';

import type { Locale } from './locales';

/** The one price format of the site: locale separators, kopecks only when present, `1 245,50 грн`. */
export function formatPrice(locale: Locale, value: number): string {
  const amount = new Intl.NumberFormat(LOCALE_LANGUAGE_TAGS[locale], {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
  return `${amount} грн`;
}
