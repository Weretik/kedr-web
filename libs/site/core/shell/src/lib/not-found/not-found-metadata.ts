import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

const TITLE: Record<Locale, string> = {
  uk: 'Сторінку не знайдено',
  ru: 'Страница не найдена',
};

/**
 * Title of the 404 page inside the site frame (a missing product or category); the layout adds the brand once.
 * Next.js adds `noindex` to every 404 itself.
 */
export function buildNotFoundMetadata(locale: Locale): Metadata {
  return { title: TITLE[locale] };
}
