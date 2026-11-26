import { DEFAULT_LOCALE, isLocale } from '@site/core/i18n';
import { NotFoundView, buildNotFoundMetadata } from '@site/core/shell';
import { locale as rootLocale } from 'next/root-params';

import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

/** Not-found files get no params, so the locale comes from the root params. */
async function notFoundLocale(): Promise<Locale> {
  const locale = await rootLocale();
  return isLocale(locale) ? locale : DEFAULT_LOCALE;
}

export async function generateMetadata(): Promise<Metadata> {
  return buildNotFoundMetadata(await notFoundLocale());
}

/**
 * 404 inside the site frame for `notFound()` calls from pages (missing product or category, a page past the last
 * one). Unmatched URLs are answered by `global-not-found.tsx`.
 */
export default async function LocaleNotFound() {
  return <NotFoundView locale={await notFoundLocale()} />;
}
