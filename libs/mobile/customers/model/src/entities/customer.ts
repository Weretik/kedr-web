/** A customer as the device keeps it (from the customers snapshot). Debt and balance stay null until 1C sends them. */
export interface Customer {
  counterpartyId: string;
  name: string;
  phone: string | null;
  email: string;
  defaultPriceTypeId: number;
  debtKopecks: number | null;
  balanceKopecks: number | null;
}

/** A category price rule with the names the card shows. */
export interface CustomerPriceRule {
  categoryId: number;
  categoryName: string | null;
  priceTypeId: number;
  priceTypeName: string | null;
}

export interface CustomerDetails extends Customer {
  defaultPriceTypeName: string | null;
  priceRules: CustomerPriceRule[];
}
