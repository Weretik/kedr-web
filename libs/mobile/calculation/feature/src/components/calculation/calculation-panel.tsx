import { useSelectedCustomer } from '@mobile/customers/data-access';

import { CustomerCalculation } from './customer-calculation';

export interface CalculationPanelProps {
  isOnline: boolean | null;
  /** Opens one line's quantity and price, usually as a sheet. */
  onOpenLine: (productId: number) => void;
}

/**
 * The chosen customer's calculation as a compact work sheet: one line per product (a tap opens quantity and price, a
 * swipe removes it with «Скасувати»), the comment, and under the list the total, «Чернетка» and «Відправити в 1С»,
 * plus what is on its way to the server (R-009–R-012). On a wide tablet it stands next to the products (R-017).
 */
export function CalculationPanel({ isOnline, onOpenLine }: Readonly<CalculationPanelProps>) {
  const customer = useSelectedCustomer();
  if (!customer) return null;
  return (
    <CustomerCalculation
      counterpartyId={customer.counterpartyId}
      customerName={customer.name}
      isOnline={isOnline}
      key={customer.counterpartyId}
      onOpenLine={onOpenLine}
    />
  );
}
