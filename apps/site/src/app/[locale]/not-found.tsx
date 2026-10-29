'use client';

import { DEFAULT_LOCALE, isLocale } from '@site/core/i18n';
import { NotFoundView } from '@site/core/shell';
import { usePathname } from 'next/navigation';

/**
 * 404 inside the site frame for `notFound()` calls from pages (missing product or category). Not-found files get
 * no params, so the locale comes from the URL. Unmatched URLs are answered by `global-not-found.tsx` instead.
 */
export default function LocaleNotFound() {
  const segment = usePathname()?.split('/')[1] ?? '';
  return <NotFoundView locale={isLocale(segment) ? segment : DEFAULT_LOCALE} />;
}
