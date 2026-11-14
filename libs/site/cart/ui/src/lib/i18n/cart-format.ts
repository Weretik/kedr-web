import { LOCALE_LANGUAGE_TAGS, formatPrice } from '@site/core/i18n';

import type { Locale } from '@site/core/i18n';

/** Cart amounts use the same price format as the catalog and product pages. */
export function formatCartMoney(locale: Locale, value: number): string {
  return formatPrice(locale, value);
}

export function formatCartCount(locale: Locale, value: number): string {
  return new Intl.NumberFormat(LOCALE_LANGUAGE_TAGS[locale]).format(value);
}
