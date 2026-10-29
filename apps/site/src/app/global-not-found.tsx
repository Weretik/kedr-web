import './global.css';
import { NotFoundView } from '@site/core/shell';

import { jetBrainsMono, onest } from './fonts';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Сторінку не знайдено | Class Kedr',
};

/**
 * 404 for URLs that no route matches. It bypasses the layouts, so it is a full document and shows both languages:
 * the URL may have no locale at all. Next.js adds `noindex` itself.
 */
export default function GlobalNotFound() {
  return (
    <html lang="uk-UA" className={`${onest.variable} ${jetBrainsMono.variable}`}>
      <body className="mx-auto grid max-w-3xl gap-2 px-4 py-8">
        <NotFoundView locale="uk" />
        <NotFoundView locale="ru" headingLevel="h2" />
      </body>
    </html>
  );
}
