import { buildPageMetadata } from '@site/core/seo';

import type { SiteConfig } from '@site/core/config';
import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

const DELIVERY_PAYMENT_SEO_TEXT: Record<Locale, { title: string; description: string }> = {
  uk: {
    title: 'Доставка та оплата',
    description:
      'Умови доставки й оплати Class Kedr: відвантаження по Україні, тарифи перевізника, оплата за реквізитами та погодження післяплати.',
  },
  ru: {
    title: 'Доставка и оплата',
    description:
      'Условия доставки и оплаты Class Kedr: отгрузка по Украине, тарифы перевозчика, оплата по реквизитам и согласование наложенного платежа.',
  },
};

/** Localized delivery metadata; the shared layout adds the brand to the plain page title. */
export function buildDeliveryPaymentMetadata(locale: Locale, config?: SiteConfig): Metadata {
  return buildPageMetadata(
    { locale, path: '/delivery-and-payment', ...DELIVERY_PAYMENT_SEO_TEXT[locale] },
    config,
  );
}
