import { pluralize } from '@site/core/i18n';

import { getCatalogDictionary } from '../i18n/catalog-dictionary';

import type { Locale } from '@site/core/i18n';

/** «Показано 1–48 з 312 товарів»: the range shown so far, including pages added by «Показати ще». */
export function ListingSummary({
  locale,
  from,
  to,
  total,
}: {
  locale: Locale;
  from: number;
  to: number;
  total: number;
}) {
  const dictionary = getCatalogDictionary(locale);

  return (
    <p className="text-center text-sm text-muted-foreground" aria-live="polite">
      {dictionary.summary(from, to, pluralize(locale, total, dictionary.products))}
    </p>
  );
}
