import { useGetWorkspaceCustomerPricesQuery } from '@admin/orders/data-access';
import { useMemo } from 'react';

import type { OrderInputLine } from '@admin/orders/model';

/** The chosen customer's unit prices for the lines, independent of stock and the full quote. */
export function useCustomerPrices(customerId: string, lines: OrderInputLine[]) {
  const productIds = useMemo(
    () => [...new Set(lines.map((line) => line.productId))].sort(),
    [lines],
  );
  const query = useGetWorkspaceCustomerPricesQuery(
    { counterpartyId: customerId, productIds },
    { skip: !customerId || productIds.length === 0 },
  );
  return customerId ? query.data : undefined;
}
