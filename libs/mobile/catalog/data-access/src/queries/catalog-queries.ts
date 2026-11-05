import {
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
} from '@mobile/core/local-db';
import { eq } from 'drizzle-orm';

export function readCategories(db: LocalDatabase): Category[] {
  return db.select().from(categories).all();
}

/** The customer's default price type and category rules, or null for a customer the device does not know. */
export function readCustomerPricing(
  db: LocalDatabase,
  counterpartyId: string,
): CustomerPricing | null {
  const customer = db
    .select({ defaultPriceTypeId: customers.defaultPriceTypeId })
    .from(customers)
    .where(eq(customers.counterpartyId, counterpartyId))
    .get();
  if (!customer) return null;

  const rules = db
    .select({
      categoryId: customerCategoryPriceTypes.categoryId,
      priceTypeId: customerCategoryPriceTypes.priceTypeId,
    })
    .from(customerCategoryPriceTypes)
    .where(eq(customerCategoryPriceTypes.counterpartyId, counterpartyId))
    .all();
  return {
    defaultPriceTypeId: customer.defaultPriceTypeId,
    rules: new Map(rules.map((rule) => [rule.categoryId, rule.priceTypeId])),
  };
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

/** Every synced product with the customer's price (R-005); about 2.5 thousand rows, filtered in memory. */
export function readPricedProducts(
  db: LocalDatabase,
  pricing: CustomerPricing | null,
): PricedProduct[] {
  const parents = parentsOf(readCategories(db));
  const prices = pricesByProduct(db.select().from(productPrices).all());
  return db
    .select(productColumns)
    .from(products)
    .all()
    .map((product) => priceWith(product, prices.get(product.id), pricing, parents));
}

export function readPricedProduct(
  db: LocalDatabase,
  productId: number,
  pricing: CustomerPricing | null,
): PricedProduct | null {
  const product = db.select(productColumns).from(products).where(eq(products.id, productId)).get();
  if (!product) return null;
  const prices = pricesByProduct(
    db.select().from(productPrices).where(eq(productPrices.productId, productId)).all(),
  );
  return priceWith(product, prices.get(productId), pricing, parentsOf(readCategories(db)));
}
