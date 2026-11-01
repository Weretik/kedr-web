import { formatPrice } from '../format/price';

import type { CatalogDictionary } from '../i18n/catalog-dictionary';
import type { Locale } from '@site/core/i18n';

/** Retail price, or «price on request» when the product has none. */
export function ProductPrice({
  price,
  locale,
  dictionary,
}: {
  price: number | null;
  locale: Locale;
  dictionary: CatalogDictionary;
}) {
  if (price === null) {
    return (
      <span className="text-sm font-normal text-muted-foreground">{dictionary.priceOnRequest}</span>
    );
  }
  return (
    <>
      <span className="sr-only">{dictionary.retailPrice}: </span>
      {formatPrice(price, locale)}
    </>
  );
}
