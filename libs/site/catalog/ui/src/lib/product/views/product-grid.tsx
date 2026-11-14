import { ProductCard } from '../card/product-card';

import type { ProductSummary } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';
import type { ReactNode } from 'react';

export function ProductGrid({
  locale,
  products,
  renderAction,
}: {
  locale: Locale;
  products: readonly ProductSummary[];
  renderAction?: (product: ProductSummary) => ReactNode;
}) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard locale={locale} product={product} action={renderAction?.(product)} />
        </li>
      ))}
    </ul>
  );
}
