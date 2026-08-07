import type { CatalogProduct } from '@mobile/catalog/model';

export function mergeCatalogProducts(
  existing: readonly CatalogProduct[],
  incoming: readonly CatalogProduct[],
): CatalogProduct[] {
  const productsById = new Map(existing.map((product) => [product.id, product]));

  for (const product of incoming) {
    productsById.set(product.id, product);
  }

  return [...productsById.values()];
}
