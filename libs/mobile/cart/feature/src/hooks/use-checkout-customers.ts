import { useGetCustomersQuery } from '@mobile/customers/data-access';
import { filterCustomersByName } from '@mobile/customers/model';
import { useMemo, useState } from 'react';

/** Customer list, search, and selector visibility for checkout; loads only while checkout is open. */
export function useCheckoutCustomers(checkoutVisible: boolean, selectedId: string) {
  const [selectorVisible, setSelectorVisible] = useState(false);
  const [query, setQuery] = useState('');
  const customersQuery = useGetCustomersQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: !checkoutVisible,
  });
  const customers = customersQuery.data ?? [];
  const filtered = useMemo(() => filterCustomersByName(customers, query), [customers, query]);

  return {
    close: () => setSelectorVisible(false),
    error: customersQuery.isError,
    filtered,
    loading: customersQuery.isLoading || customersQuery.isFetching,
    open: () => setSelectorVisible(true),
    query,
    retry: () => void customersQuery.refetch(),
    selectedName: customers.find((customer) => customer.counterpartyId === selectedId)?.name,
    setQuery,
    visible: selectorVisible,
  };
}
