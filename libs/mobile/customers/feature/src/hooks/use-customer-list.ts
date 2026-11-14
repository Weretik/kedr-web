import { useCustomers, useSelectedCustomerStore } from '@mobile/customers/data-access';
import {
  customerListSections,
  flattenSections,
  letterSections,
  recentCustomers,
  searchCustomers,
  type Customer,
} from '@mobile/customers/model';
import { useCallback, useMemo, useState } from 'react';

const noCustomers: Customer[] = [];

/** The local customers as «Недавні», A–Я, or search results, and picking one as the selected customer (R-003). */
export function useCustomerList(onPicked: (counterpartyId: string) => void) {
  const loaded = useCustomers();
  const customers = loaded ?? noCustomers;
  const recentIds = useSelectedCustomerStore((state) => state.recentIds);
  const selectedId = useSelectedCustomerStore((state) => state.selectedId);
  const select = useSelectedCustomerStore((state) => state.select);
  const [query, setQuery] = useState('');

  // The A–Я sections change only after a sync; picking a customer changes only «Недавні».
  const letters = useMemo(() => letterSections(customers), [customers]);
  const recent = useMemo(() => recentCustomers(customers, recentIds), [customers, recentIds]);
  const found = useMemo(
    () => (query.trim().length > 0 ? searchCustomers(customers, query) : null),
    [customers, query],
  );
  const sections = useMemo(
    () => customerListSections(found, recent, letters),
    [found, letters, recent],
  );
  const items = useMemo(() => flattenSections(sections), [sections]);

  const pick = useCallback(
    (counterpartyId: string) => {
      select(counterpartyId);
      onPicked(counterpartyId);
    },
    [onPicked, select],
  );

  return {
    loading: loaded === undefined,
    empty: customers.length === 0,
    nothingFound: sections.length === 0,
    items,
    selectedId,
    query,
    setQuery,
    pick,
  };
}
