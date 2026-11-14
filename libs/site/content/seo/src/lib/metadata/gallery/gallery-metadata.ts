import { buildPageMetadata } from '@site/core/seo';

import type { SiteConfig } from '@site/core/config';
import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

const GALLERY_SEO_TEXT: Record<Locale, { title: string; description: string }> = {
  uk: {
    title: 'Галерея та відео',
    description:
      'Медіаматеріали Class Kedr про дверну фурнітуру: деталі, фактури та конструкцію механізмів. Переглядайте доступні матеріали галереї.',
  },
  ru: {
    title: 'Галерея и видео',
    description:
      'Медиаматериалы Class Kedr о дверной фурнитуре: детали, фактуры и конструкция механизмов. Смотрите доступные материалы галереи.',
  },
};

/** Localized gallery metadata; the root layout adds the brand to the plain page title. */
export function buildGalleryMetadata(locale: Locale, config?: SiteConfig): Metadata {
  return buildPageMetadata({ locale, path: '/galleria', ...GALLERY_SEO_TEXT[locale] }, config);
}
