import { buildPageMetadata } from '@site/core/seo';

import type { SiteConfig } from '@site/core/config';
import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

const RETURNS_SEO_TEXT: Record<Locale, { title: string; description: string }> = {
  uk: {
    title: 'Повернення та обмін',
    description:
      'Умови повернення та обміну дверної фурнітури Class Kedr: гарантія, доставка та порядок звернення до менеджера.',
  },
  ru: {
    title: 'Возврат и обмен',
    description:
      'Условия возврата и обмена дверной фурнитуры Class Kedr: гарантия, доставка и порядок обращения к менеджеру.',
  },
};

/** Localized returns metadata; the shared layout supplies the brand title template. */
export function buildReturnsMetadata(locale: Locale, config?: SiteConfig): Metadata {
  return buildPageMetadata(
    { locale, path: '/returns-exchanges', ...RETURNS_SEO_TEXT[locale] },
    config,
  );
}
