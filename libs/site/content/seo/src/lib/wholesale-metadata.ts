import { buildPageMetadata } from '@site/core/seo';

import type { SiteConfig } from '@site/core/config';
import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

const WHOLESALE_SEO_TEXT: Record<Locale, { title: string; description: string }> = {
  uk: {
    title: 'Дверна фурнітура оптом — замовити',
    description:
      'Дверна фурнітура оптом у Class Kedr: завіси, замки, ручки, циліндри та міжкімнатні механізми. Перегляньте каталог і дізнайтеся оптові умови у менеджера.',
  },
  ru: {
    title: 'Дверная фурнитура оптом — заказать',
    description:
      'Дверная фурнитура оптом в Class Kedr: петли, замки, ручки, цилиндры и межкомнатные механизмы. Посмотрите каталог и узнайте оптовые условия у менеджера.',
  },
};

/** Localized wholesale metadata; the root layout adds the brand to the plain page title. */
export function buildWholesaleMetadata(locale: Locale, config?: SiteConfig): Metadata {
  return buildPageMetadata({ locale, path: '/wholesale', ...WHOLESALE_SEO_TEXT[locale] }, config);
}
