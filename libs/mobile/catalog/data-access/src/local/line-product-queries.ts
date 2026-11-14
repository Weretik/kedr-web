import { parentsOf, type PricedProduct } from '@mobile/catalog/model';
import {
  categories,
  customerCategoryPriceTypes,
  customers,
  productPrices,
  products,
  type LocalDatabase,
} from '@mobile/core/local-db';
import { eq, inArray } from 'drizzle-orm';

import { pricingOf } from './customer-pricing-queries';
import { priceWith, pricesByProduct, productColumns } from './priced-product-rows';

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
