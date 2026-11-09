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

const normalizedNames = new Map<string, string>();
const maxNormalizedNames = 20_000;

/** Product names normalized once per app run, so typing does not redo it for every product. */
function normalizedName(name: string): string {
  let normalized = normalizedNames.get(name);
  if (normalized === undefined) {
    if (normalizedNames.size >= maxNormalizedNames) normalizedNames.clear();
    normalized = normalizeQuery(name);
    normalizedNames.set(name, normalized);
  }
  return normalized;
}

function matcherFor(query: string): (product: Pick<PricedProduct, 'id' | 'name'>) => boolean {
  const text = normalizeQuery(query);
  if (text.length === 0) return () => true;
  const isCode = /^\d+$/.test(text);
  const words = text.split(' ');
  return (product) =>
    (isCode && product.id.toString().startsWith(text)) ||
    words.every((word) => normalizedName(product.name).includes(word));
}

/**
 * Whether the product fits the typed text: the code from its start, or every word of the text somewhere in the name,
 * so «ручка хром» finds «Ручка на розетці ... хром» (R-007).
 */
export function matchesProduct(
  product: Pick<PricedProduct, 'id' | 'name'>,
  query: string,
): boolean {
  return matcherFor(query)(product);
}

/** Keeps the input order, so a catalog read in name order stays in name order. */
export function filterProducts<T extends PricedProduct>(
  products: readonly T[],
  filter: ProductFilter,
): T[] {
  const matches = matcherFor(filter.query);
  return products.filter(
    (product) =>
      (filter.categoryIds === null || filter.categoryIds.has(product.categoryId)) &&
      (!filter.inStockOnly || !isOutOfStock(product)) &&
      matches(product),
  );
}

/**
 * Orders by the customer's price with unpriced products last. The sort is stable, so products already in name order
 * keep A–Я among equal prices; `name` returns the input as is.
 */
export function sortNameOrdered<T extends PricedProduct>(
  products: readonly T[],
  sort: ProductSort,
): readonly T[] {
  if (sort === 'name') return products;
  const direction = sort === 'price-asc' ? 1 : -1;
  return [...products].sort((a, b) => {
    if (a.priceKopecks === null || b.priceKopecks === null) {
      return Number(a.priceKopecks === null) - Number(b.priceKopecks === null);
    }
    return (a.priceKopecks - b.priceKopecks) * direction;
  });
}

/** By name, or by the customer's price with unpriced products last, for products in any order. */
export function sortProducts<T extends PricedProduct>(
  products: readonly T[],
  sort: ProductSort,
): T[] {
  // Names are normalized once and compared with one collator.
  return [
    ...sortNameOrdered(
      sortByText(products, (product) => normalizedName(product.name)),
      sort,
    ),
  ];
}
