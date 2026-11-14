import { type CustomerPricing } from '@mobile/catalog/model';
import { customerCategoryPriceTypes, customers, type LocalReader } from '@mobile/core/local-db';
import { eq } from 'drizzle-orm';

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

export function pricingOf({ customer, rules }: PricingRows): CustomerPricing | null {
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
