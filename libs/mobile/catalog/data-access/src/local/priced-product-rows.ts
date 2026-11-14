import {
  resolvePriceKopecks,
  type CustomerPricing,
  type parentsOf,
  type PricedProduct,
  type Product,
} from '@mobile/catalog/model';
import { products } from '@mobile/core/local-db';

/** Price rows grouped by product, then by price type. */
export function pricesByProduct(
  rows: readonly { productId: number; priceTypeId: number; amountKopecks: number }[],
) {
  const byProduct = new Map<number, Map<number, number>>();
  for (const row of rows) {
    const prices = byProduct.get(row.productId) ?? new Map<number, number>();
    prices.set(row.priceTypeId, row.amountKopecks);
    byProduct.set(row.productId, prices);
  }
  return byProduct;
}

export function priceWith(
  product: Product,
  prices: ReadonlyMap<number, number> | undefined,
  pricing: CustomerPricing | null,
  parents: ReturnType<typeof parentsOf>,
): PricedProduct {
  const priceKopecks =
    pricing && prices ? resolvePriceKopecks(product.categoryId, prices, pricing, parents) : null;
  return { ...product, priceKopecks };
}

export const productColumns = {
  categoryId: products.categoryId,
  id: products.id,
  isNew: products.isNew,
  isSale: products.isSale,
  name: products.name,
  photos: products.photos,
  quantityInPack: products.quantityInPack,
  scheme: products.scheme,
  slug: products.slug,
  stock: products.stock,
};
