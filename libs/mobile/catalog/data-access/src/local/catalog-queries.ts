import {
  normalizeQuery,
  parentsOf,
  type Category,
  type CustomerPricing,
  type PricedProduct,
  type Product,
} from '@mobile/catalog/model';
import { categories, productPrices, products, type LocalReader } from '@mobile/core/local-db';
import { sortByText } from '@mobile/shared/model';
import { eq, inArray } from 'drizzle-orm';

import { priceWith, pricesByProduct, productColumns } from './priced-product-rows';

export async function readCategories(reader: LocalReader): Promise<Category[]> {
  return reader.select().from(categories).all();
}

/** Products in name order with the category parents; the part of the catalog that does not depend on a customer. */
export interface CatalogBase {
  parents: ReturnType<typeof parentsOf>;
  products: Product[];
}

export async function readCatalogBase(reader: LocalReader): Promise<CatalogBase> {
  const [categoryRows, productRows] = await Promise.all([
    readCategories(reader),
    reader.select(productColumns).from(products).all(),
  ]);
  return {
    parents: parentsOf(categoryRows),
    products: sortByText(productRows, (product) => normalizeQuery(product.name)),
  };
}

/** Only the price types the customer can get: the default and those of the category rules. */
async function readCustomerPrices(reader: LocalReader, pricing: CustomerPricing) {
  const priceTypeIds = [...new Set([pricing.defaultPriceTypeId, ...pricing.rules.values()])];
  return pricesByProduct(
    await reader
      .select()
      .from(productPrices)
      .where(inArray(productPrices.priceTypeId, priceTypeIds))
      .all(),
  );
}

/** The base products with the customer's price (R-005), in name order; no prices are read without a customer. */
export async function priceCatalog(
  reader: LocalReader,
  base: CatalogBase,
  pricing: CustomerPricing | null,
): Promise<PricedProduct[]> {
  if (!pricing) return base.products.map((product) => ({ ...product, priceKopecks: null }));
  const prices = await readCustomerPrices(reader, pricing);
  return base.products.map((product) =>
    priceWith(product, prices.get(product.id), pricing, base.parents),
  );
}

/** Every synced product with the customer's price (R-005); about 2.5 thousand rows, filtered in memory. */
export async function readPricedProducts(
  reader: LocalReader,
  pricing: CustomerPricing | null,
): Promise<PricedProduct[]> {
  return priceCatalog(reader, await readCatalogBase(reader), pricing);
}

export async function readPricedProduct(
  reader: LocalReader,
  productId: number,
  pricing: CustomerPricing | null,
): Promise<PricedProduct | null> {
  const [product, priceRows, categoryRows] = await Promise.all([
    reader.select(productColumns).from(products).where(eq(products.id, productId)).get(),
    reader.select().from(productPrices).where(eq(productPrices.productId, productId)).all(),
    readCategories(reader),
  ]);
  if (!product) return null;
  const prices = pricesByProduct(priceRows);
  return priceWith(product, prices.get(productId), pricing, parentsOf(categoryRows));
}
