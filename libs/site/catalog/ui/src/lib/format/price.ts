import { formatPrice as formatSitePrice } from '@site/core/i18n';

import type { Locale } from '@site/core/i18n';

/** Price in hryvnias in the site-wide format: `1 245,50 грн`. */
export function formatPrice(price: number, locale: Locale): string {
  return formatSitePrice(locale, price);
}
