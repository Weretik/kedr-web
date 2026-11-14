import { pluralize } from '@site/core/i18n';

import { getCatalogDictionary } from '../../i18n/catalog-dictionary';

import type { Locale } from '@site/core/i18n';

/** «Показано 51–100 з 312 товарів»: the range of the current page. */
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
    <p className="text-sm text-muted-foreground">
      {dictionary.summary(from, to, pluralize(locale, total, dictionary.products))}
    </p>
  );
}
