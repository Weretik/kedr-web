import { useSelectedCustomer } from '@mobile/customers/data-access';

export interface SelectedCustomerSummary {
  name: string;
  priceTypeName: string | null;
}

/** What the customer bar on the working screens shows; null until a known customer is chosen (R-002). */
export function useSelectedCustomerSummary(): SelectedCustomerSummary | null {
  const customer = useSelectedCustomer();
  return customer ? { name: customer.name, priceTypeName: customer.defaultPriceTypeName } : null;
}
