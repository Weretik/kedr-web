import { formatPrice } from '../../format/price';

import type { CatalogDictionary } from '../../i18n/catalog-dictionary';
import type { Locale } from '@site/core/i18n';

/** Retail price, «від» the lowest price of a model of several products, or «price on request» when there is none. */
export function ProductPrice({
  price,
  locale,
  dictionary,
  from = false,
}: {
  price: number | null;
  locale: Locale;
  dictionary: CatalogDictionary;
  from?: boolean;
}) {
  if (price === null) {
    return (
      <span className="text-sm font-normal text-muted-foreground">{dictionary.priceOnRequest}</span>
    );
  }
  return (
    <>
      <span className="sr-only">{dictionary.retailPrice}: </span>
      {from && <span className="font-normal">{dictionary.fromPrice} </span>}
      {formatPrice(price, locale)}
    </>
  );
}
