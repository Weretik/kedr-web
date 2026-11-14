import {
  normalizeQuery,
  parentsOf,
  resolvePriceKopecks,
  type Category,
  type CustomerPricing,
  type PricedProduct,
  type Product,
} from '@mobile/catalog/model';
import {
  categories,
  customerCategoryPriceTypes,
  customers,
  productPrices,
  products,
  type LocalDatabase,
  type LocalReader,
} from '@mobile/core/local-db';
import { sortByText } from '@mobile/shared/model';
import { eq, inArray } from 'drizzle-orm';

export async function readCategories(reader: LocalReader): Promise<Category[]> {
  return reader.select().from(categories).all();
}

interface PricingRows {
  customer: { defaultPriceTypeId: number } | undefined;
  rules: readonly { categoryId: number; priceTypeId: number }[];
}

function pricingQueries(db: LocalReader, counterpartyId: string) {
  return {
    customer: db
      .select({ defaultPriceTypeId: customers.defaultPriceTypeId })
      .from(customers)
      .where(eq(customers.counterpartyId, counterpartyId)),
    rules: db
      .select({
        categoryId: customerCategoryPriceTypes.categoryId,
        priceTypeId: customerCategoryPriceTypes.priceTypeId,
      })
      .from(customerCategoryPriceTypes)
      .where(eq(customerCategoryPriceTypes.counterpartyId, counterpartyId)),
  };
}

function pricingOf({ customer, rules }: PricingRows): CustomerPricing | null {
  if (!customer) return null;
  return {
    defaultPriceTypeId: customer.defaultPriceTypeId,
    rules: new Map(rules.map((rule) => [rule.categoryId, rule.priceTypeId])),
  };
}

/** The customer's default price type and category rules, or null for a customer the device does not know. */
export async function readCustomerPricing(
  reader: LocalReader,
  counterpartyId: string,
): Promise<CustomerPricing | null> {
  const queries = pricingQueries(reader, counterpartyId);
  return pricingOf({ customer: await queries.customer.get(), rules: await queries.rules.all() });
}

function pricesByProduct(
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

function priceWith(
  product: Product,
  prices: ReadonlyMap<number, number> | undefined,
  pricing: CustomerPricing | null,
  parents: ReturnType<typeof parentsOf>,
): PricedProduct {
  const priceKopecks =
    pricing && prices ? resolvePriceKopecks(product.categoryId, prices, pricing, parents) : null;
  return { ...product, priceKopecks };
}

const productColumns = {
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

/**
 * The products of a calculation with the customer's price, read at once for the open calculation: a few rows by
 * key, so it stays synchronous and the lines never show without prices.
 */
export function readLineProducts(
  db: LocalDatabase,
  productIds: readonly number[],
  counterpartyId: string,
): Map<number, PricedProduct> {
  if (productIds.length === 0) return new Map();
  // The same two reads as `pricingQueries`, on the synchronous connection.
  const pricing = pricingOf({
    customer: db
      .select({ defaultPriceTypeId: customers.defaultPriceTypeId })
      .from(customers)
      .where(eq(customers.counterpartyId, counterpartyId))
      .get(),
    rules: db
      .select({
        categoryId: customerCategoryPriceTypes.categoryId,
        priceTypeId: customerCategoryPriceTypes.priceTypeId,
      })
      .from(customerCategoryPriceTypes)
      .where(eq(customerCategoryPriceTypes.counterpartyId, counterpartyId))
      .all(),
  });
  const ids = [...productIds];
  const rows = db.select(productColumns).from(products).where(inArray(products.id, ids)).all();
  const prices = pricesByProduct(
    db.select().from(productPrices).where(inArray(productPrices.productId, ids)).all(),
  );
  const parents = parentsOf(db.select().from(categories).all());
  return new Map(
    rows.map((product) => [
      product.id,
      priceWith(product, prices.get(product.id), pricing, parents),
    ]),
  );
}
