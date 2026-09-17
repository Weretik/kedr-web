import { useCallback } from 'react';

import { useOrderCustomerFilter } from './use-order-customer-filter';
import { useOrderHistoryPages } from './use-order-history-pages';

export function useOrderHistoryController() {
  const filter = useOrderCustomerFilter();
  const history = useOrderHistoryPages(filter.customer?.counterpartyId);

  const chooseCustomer = useCallback(
    (customer: Parameters<typeof filter.chooseCustomer>[0]) => {
      history.firstPage();
      filter.chooseCustomer(customer);
    },
    [filter.chooseCustomer, history.firstPage],
  );
  const clearFilter = useCallback(() => {
    history.firstPage();
    filter.clearCustomer();
  }, [filter.clearCustomer, history.firstPage]);

  return {
    filter: { ...filter, chooseCustomer, clearFilter },
    history,
  };
}
