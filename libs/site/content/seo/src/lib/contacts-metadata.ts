import { buildPageMetadata } from '@site/core/seo';

import type { SiteConfig } from '@site/core/config';
import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

const CONTACTS_SEO_TEXT: Record<Locale, { title: string; description: string }> = {
  uk: {
    title: 'Контакти',
    description:
      'Контакти Class Kedr: телефон відділу продажу, Telegram, Viber, електронна пошта та розташування в Харкові. Дверна фурнітура оптом і в роздріб.',
  },
  ru: {
    title: 'Контакты',
    description:
      'Контакты Class Kedr: телефон отдела продаж, Telegram, Viber, электронная почта и расположение в Харькове. Дверная фурнитура оптом и в розницу.',
  },
};

/** Localized contacts metadata; the root layout adds the brand to the plain page title. */
export function buildContactsMetadata(locale: Locale, config?: SiteConfig): Metadata {
  return buildPageMetadata({ locale, path: '/contacts', ...CONTACTS_SEO_TEXT[locale] }, config);
}
