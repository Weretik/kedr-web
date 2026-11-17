import './global.css';
import { DEFAULT_LOCALE, LOCALE_LANGUAGE_TAGS, isLocale } from '@site/core/i18n';
import { NotFoundView } from '@site/core/shell';
import { headers } from 'next/headers';

import { jetBrainsMono, onest } from './fonts';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Сторінку не знайдено | Class Kedr',
};

/** Ukrainian unless the browser asks for Russian first: the URL of an unmatched path carries no locale. */
async function preferredLocale() {
  const header = (await headers()).get('accept-language') ?? '';
  const first = header.split(',')[0]?.trim().slice(0, 2).toLowerCase() ?? '';
  return isLocale(first) ? first : DEFAULT_LOCALE;
}

/**
 * 404 for URLs that no route matches. It bypasses the layouts, so it is a full document in one language.
 * Next.js adds `noindex` itself and keeps the 404 status.
 */
export default async function GlobalNotFound() {
  const locale = await preferredLocale();
  return (
    <html
      lang={LOCALE_LANGUAGE_TAGS[locale]}
      className={`${onest.variable} ${jetBrainsMono.variable}`}
    >
      <body>
        <NotFoundView locale={locale} />
      </body>
    </html>
  );
}
