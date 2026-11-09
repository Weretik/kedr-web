import { sortByText } from '@mobile/shared/model';

import { isOutOfStock, type PricedProduct } from '../entities/product';

export type ProductSort = 'name' | 'price-asc' | 'price-desc';

export interface ProductFilter {
  query: string;
  /** The picked category with its subcategories; null is the whole catalog. */
  categoryIds: ReadonlySet<number> | null;
  inStockOnly: boolean;
}

const quotes = /[«»"'“”„’`]/g;

export function normalizeQuery(text: string): string {
  return text.toLocaleLowerCase('uk').replace(quotes, '').replace(/\s+/g, ' ').trim();
}

/**
 * Whether the product fits the typed text: the code from its start, or every word of the text somewhere in the name,
 * so «ручка хром» finds «Ручка на розетці ... хром» (R-007).
 */
export function matchesProduct(
  product: Pick<PricedProduct, 'id' | 'name'>,
  query: string,
): boolean {
  const text = normalizeQuery(query);
  if (text.length === 0) return true;
  if (/^\d+$/.test(text) && product.id.toString().startsWith(text)) return true;
  const name = normalizeQuery(product.name);
  return text.split(' ').every((word) => name.includes(word));
}

export function filterProducts<T extends PricedProduct>(
  products: readonly T[],
  filter: ProductFilter,
): T[] {
  return products.filter(
    (product) =>
      (filter.categoryIds === null || filter.categoryIds.has(product.categoryId)) &&
      (!filter.inStockOnly || !isOutOfStock(product)) &&
      matchesProduct(product, filter.query),
  );
}

/** By name, or by the customer's price with unpriced products last. */
export function sortProducts<T extends PricedProduct>(
  products: readonly T[],
  sort: ProductSort,
): T[] {
  // Names are normalized once and compared with one collator; the price order is stable, so ties keep A–Я.
  const byName = sortByText(products, (product) => normalizeQuery(product.name));
  if (sort === 'name') return byName;
  const direction = sort === 'price-asc' ? 1 : -1;
  return byName.sort((a, b) => {
    if (a.priceKopecks === null || b.priceKopecks === null) {
      return Number(a.priceKopecks === null) - Number(b.priceKopecks === null);
    }
    return (a.priceKopecks - b.priceKopecks) * direction;
  });
}
