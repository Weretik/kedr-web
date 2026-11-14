import { ProductGrid } from './product-grid';
import { ProductTable } from './product-table';

import type { ListingView, ProductSummary } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';
import type { ReactNode } from 'react';

/** Products in the view the visitor chose. */
export function ProductList({
  locale,
  products,
  view,
  renderAction,
}: {
  locale: Locale;
  products: readonly ProductSummary[];
  view: ListingView;
  renderAction?: (product: ProductSummary) => ReactNode;
}) {
  return view === 'table' ? (
    <ProductTable locale={locale} products={products} renderAction={renderAction} />
  ) : (
    <ProductGrid locale={locale} products={products} renderAction={renderAction} />
  );
}
