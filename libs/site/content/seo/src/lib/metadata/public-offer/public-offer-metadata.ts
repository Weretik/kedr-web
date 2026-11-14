import { buildPageMetadata } from '@site/core/seo';

import type { SiteConfig } from '@site/core/config';
import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

const PUBLIC_OFFER_SEO_TEXT: Record<Locale, { title: string; description: string }> = {
  uk: {
    title: 'Публічна оферта',
    description:
      'Публічна оферта та правила користування сайтом Class Kedr: умови замовлення, оплати, доставки, повернення товарів і обробки персональних даних.',
  },
  ru: {
    title: 'Публичная оферта',
    description:
      'Публичная оферта и правила пользования сайтом Class Kedr: условия заказа, оплаты, доставки, возврата товаров и обработки персональных данных.',
  },
};

/** Localized offer metadata; the shared layout supplies the brand title template. */
export function buildPublicOfferMetadata(locale: Locale, config?: SiteConfig): Metadata {
  return buildPageMetadata(
    { locale, path: '/public-offer', ...PUBLIC_OFFER_SEO_TEXT[locale] },
    config,
  );
}
