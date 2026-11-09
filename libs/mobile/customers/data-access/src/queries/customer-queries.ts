import {
  categories,
  customerCategoryPriceTypes,
  customers,
  priceTypes,
  type LocalDatabase,
} from '@mobile/core/local-db';
import {
  compareNames,
  sortCustomersByName,
  type Customer,
  type CustomerDetails,
} from '@mobile/customers/model';
import { eq } from 'drizzle-orm';

/** Every synced customer in A–Я order; the list is small enough to filter in memory while typing. */
export function readCustomers(db: LocalDatabase): Customer[] {
  return sortCustomersByName(db.select().from(customers).all());
}

/** The customer with the names of the default price type and of each rule's category and price type. */
export function readCustomerDetails(
  db: LocalDatabase,
  counterpartyId: string,
): CustomerDetails | null {
  const customer = db
    .select()
    .from(customers)
    .where(eq(customers.counterpartyId, counterpartyId))
    .get();
  if (!customer) return null;

  const typeNames = new Map(
    db
      .select()
      .from(priceTypes)
      .all()
      .map((type) => [type.id, type.name]),
  );
  const categoryNames = new Map(
    db
      .select({ id: categories.id, name: categories.name })
      .from(categories)
      .all()
      .map((category) => [category.id, category.name]),
  );
  const rules = db
    .select()
    .from(customerCategoryPriceTypes)
    .where(eq(customerCategoryPriceTypes.counterpartyId, counterpartyId))
    .all();

  return {
    ...customer,
    defaultPriceTypeName: typeNames.get(customer.defaultPriceTypeId) ?? null,
    priceRules: rules
      .map((rule) => ({
        categoryId: rule.categoryId,
        categoryName: categoryNames.get(rule.categoryId) ?? null,
        priceTypeId: rule.priceTypeId,
        priceTypeName: typeNames.get(rule.priceTypeId) ?? null,
      }))
      .sort((a, b) => compareNames(a.categoryName ?? '', b.categoryName ?? '')),
  };
}
