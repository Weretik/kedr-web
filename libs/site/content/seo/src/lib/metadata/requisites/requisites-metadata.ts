import { buildPageMetadata } from '@site/core/seo';

import type { SiteConfig } from '@site/core/config';
import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

const REQUISITES_SEO_TEXT: Record<Locale, { title: string; description: string }> = {
  uk: {
    title: 'Реквізити',
    description:
      'Офіційні реквізити адміністрації Class Kedr: дані ФОП, IBAN і банк. Контакт менеджера для уточнення реквізитів оплати замовлення.',
  },
  ru: {
    title: 'Реквизиты',
    description:
      'Официальные реквизиты администрации Class Kedr: данные ФОП, IBAN и банк. Контакт менеджера для уточнения реквизитов оплаты заказа.',
  },
};

/** Localized requisites metadata; the root layout applies the brand title template. */
export function buildRequisitesMetadata(locale: Locale, config?: SiteConfig): Metadata {
  return buildPageMetadata({ locale, path: '/requisites', ...REQUISITES_SEO_TEXT[locale] }, config);
}
