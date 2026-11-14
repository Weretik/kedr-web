import { useGetCustomerByIdQuery, useGetCustomersPageQuery } from '@admin/clients/data-access';
import { useEffect, useMemo, useState } from 'react';

import { mergeCustomerPage, withSelectedCustomer } from './customer-options';

import type { CustomerListItem } from '@admin/clients/model';
import type { UIEvent } from 'react';

const PAGE_SIZE = 20;
const SEARCH_DELAY_MS = 300;

/** Customers for the picker: delayed search, page-by-page loading on scroll, and the chosen one. */
export function useCustomerOptions(value: string) {
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [loaded, setLoaded] = useState<readonly CustomerListItem[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const next = input.trim();
      setSearch((current) => {
        if (current !== next) {
          setPageNumber(1);
          setLoaded([]);
        }
        return next;
      });
    }, SEARCH_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [input]);

  const page = useGetCustomersPageQuery({
    page: pageNumber,
    pageSize: PAGE_SIZE,
    searchTerm: search || undefined,
    sort: 'name',
  });
  const selected = useGetCustomerByIdQuery(value, { skip: !value });

  const pageData = page.data;
  const pageItems = pageData && pageData.pageNumber === pageNumber ? pageData.items : null;
  const [mergedFrom, setMergedFrom] = useState<typeof pageItems>(null);
  if (pageItems && pageItems !== mergedFrom) {
    setMergedFrom(pageItems);
    setLoaded((current) => mergeCustomerPage(current, pageItems));
  }

  const options = useMemo(() => withSelectedCustomer(loaded, selected.data), [loaded, selected.data]);

  const onListboxScroll = (event: UIEvent<HTMLUListElement>) => {
    const listbox = event.currentTarget;
    const nearEnd = listbox.scrollTop + listbox.clientHeight >= listbox.scrollHeight - 32;
    if (nearEnd && !page.isFetching && !page.isError && pageData && pageNumber < pageData.totalPages)
      setPageNumber((current) => current + 1);
  };

  return {
    options,
    chosen: options.find((customer) => customer.counterpartyId === value) ?? null,
    loading: page.isFetching || selected.isFetching,
    failed: page.isError || selected.isError,
    setInput,
    onListboxScroll,
  };
}
