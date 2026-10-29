import { DEFAULT_LOCALE, LOCALES, LOCALE_LANGUAGE_TAGS, localizedPath } from '@site/core/i18n';

import type { Locale } from '@site/core/i18n';

/** `hreflang` map for one page: every locale plus `x-default` pointing to Ukrainian. */
export function buildLanguageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    languages[LOCALE_LANGUAGE_TAGS[locale]] = localizedPath(locale, path);
  }
  languages['x-default'] = localizedPath(DEFAULT_LOCALE, path);
  return languages;
}

/** Self-referencing canonical: each language version is canonical for itself, never across languages. */
export function buildCanonicalPath(locale: Locale, path: string): string {
  return localizedPath(locale, path);
}
