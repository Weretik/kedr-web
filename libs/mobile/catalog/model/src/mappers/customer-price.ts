/** What the resolver needs to know about the chosen customer. */
export interface CustomerPricing {
  defaultPriceTypeId: number;
  /** Category id → price type id of the customer's category rules. */
  rules: ReadonlyMap<number, number>;
}

/** Category id → parent id (null at the root). */
export type CategoryParents = ReadonlyMap<number, number | null>;

const maxDepth = 32;

/**
 * The price type for a product of the category: the customer's rule on the category, else on the nearest parent,
 * else the default (R-005). Mirrors KedrStore `CustomerPriceResolver`, including its depth guard against a parent
 * cycle.
 */
export function resolvePriceTypeId(
  categoryId: number,
  customer: CustomerPricing,
  parents: CategoryParents,
): number {
  let current: number | null | undefined = categoryId;
  for (let depth = 0; current !== null && current !== undefined && depth < maxDepth; depth++) {
    const rule = customer.rules.get(current);
    if (rule !== undefined) return rule;
    current = parents.get(current);
  }
  return customer.defaultPriceTypeId;
}

/**
 * The customer's unit price in kopecks, or null when the product has no price of that type. Like KedrStore, a rule
 * type without a price does not fall back to the default type.
 */
export function resolvePriceKopecks(
  categoryId: number,
  prices: ReadonlyMap<number, number>,
  customer: CustomerPricing,
  parents: CategoryParents,
): number | null {
  return prices.get(resolvePriceTypeId(categoryId, customer, parents)) ?? null;
}
