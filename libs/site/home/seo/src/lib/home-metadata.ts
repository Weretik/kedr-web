import { buildPageMetadata } from '@site/core/seo';

import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

/**
 * Home title and description per locale. The home page shares the segment of the layout, so the brand template
 * does not apply: the title carries the brand itself and is kept as written.
 */
export const HOME_SEO_TEXT: Record<Locale, { title: string; description: string }> = {
  uk: {
    title: 'Дверна фурнітура оптом і в роздріб — Class Kedr',
    description:
      'Завіси, замки, ручки, циліндри та міжкімнатні механізми оптом і в роздріб. Склад у Харкові, доставка по Україні.',
  },
  ru: {
    title: 'Дверная фурнитура оптом и в розницу — Class Kedr',
    description:
      'Петли, замки, ручки, цилиндры и межкомнатные механизмы оптом и в розницу. Склад в Харькове, доставка по Украине.',
  },
};

export function buildHomeMetadata(locale: Locale): Metadata {
  const text = HOME_SEO_TEXT[locale];
  const metadata = buildPageMetadata({ locale, path: '/', ...text });
  return {
    ...metadata,
    title: text.title,
    openGraph: { ...metadata.openGraph, title: text.title },
  };
}
