import { ProductGrid } from './product-grid';
import { ProductTable } from './product-table';

import type { ListingView, ProductSummary } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/** Products in the view the visitor chose. */
export function ProductList({
  locale,
  products,
  view,
}: {
  locale: Locale;
  products: readonly ProductSummary[];
  view: ListingView;
}) {
  return view === 'table' ? (
    <ProductTable locale={locale} products={products} />
  ) : (
    <ProductGrid locale={locale} products={products} />
  );
}
