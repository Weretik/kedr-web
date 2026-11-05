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

const byName = (a: PricedProduct, b: PricedProduct) =>
  normalizeQuery(a.name).localeCompare(normalizeQuery(b.name), 'uk');

/** By name, or by the customer's price with unpriced products last. */
export function sortProducts<T extends PricedProduct>(
  products: readonly T[],
  sort: ProductSort,
): T[] {
  const sorted = [...products];
  if (sort === 'name') return sorted.sort(byName);
  const direction = sort === 'price-asc' ? 1 : -1;
  return sorted.sort((a, b) => {
    if (a.priceKopecks === null || b.priceKopecks === null) {
      return Number(a.priceKopecks === null) - Number(b.priceKopecks === null) || byName(a, b);
    }
    return (a.priceKopecks - b.priceKopecks) * direction || byName(a, b);
  });
}
