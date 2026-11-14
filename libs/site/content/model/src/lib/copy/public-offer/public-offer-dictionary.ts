import { PUBLIC_OFFER_UI_COPY } from './public-offer-ui-copy';

import type { PublicOfferDictionary } from './public-offer-types';
import type { Locale } from '@site/core/i18n';

export function getPublicOfferDictionary(locale: Locale): PublicOfferDictionary {
  return { locale, ...PUBLIC_OFFER_UI_COPY[locale] };
}
