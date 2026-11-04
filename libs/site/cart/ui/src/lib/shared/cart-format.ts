import { LOCALE_LANGUAGE_TAGS } from '@site/core/i18n';

import type { Locale } from '@site/core/i18n';

export function formatCartMoney(locale: Locale, value: number): string {
  return new Intl.NumberFormat(LOCALE_LANGUAGE_TAGS[locale], {
    style: 'currency',
    currency: 'UAH',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCartCount(locale: Locale, value: number): string {
  return new Intl.NumberFormat(LOCALE_LANGUAGE_TAGS[locale]).format(value);
}
