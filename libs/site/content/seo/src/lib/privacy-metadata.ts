import { buildPageMetadata } from '@site/core/seo';

import type { SiteConfig } from '@site/core/config';
import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

const PRIVACY_SEO_TEXT: Record<Locale, { title: string; description: string }> = {
  uk: {
    title: 'Політика конфіденційності',
    description:
      'Політика конфіденційності Class Kedr: обробка персональних даних, їх захист, права користувачів та контакти для звернень.',
  },
  ru: {
    title: 'Политика конфиденциальности',
    description:
      'Политика конфиденциальности Class Kedr: обработка персональных данных, их защита, права пользователей и контакты для обращений.',
  },
};

/** Localized privacy metadata; the shared layout supplies the brand title template. */
export function buildPrivacyMetadata(locale: Locale, config?: SiteConfig): Metadata {
  return buildPageMetadata(
    { locale, path: '/privacy-policy', ...PRIVACY_SEO_TEXT[locale] },
    config,
  );
}
