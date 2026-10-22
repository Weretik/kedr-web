import { useGetCustomerByIdQuery, useGetCustomersPageQuery } from '@admin/clients/data-access';
import { Autocomplete, TextField } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';


import type { CustomerListItem } from '@admin/clients/model';
import type { CustomerPickerProps } from '@admin/orders/feature';
import type { UIEvent } from 'react';

const PAGE_SIZE = 20;

export function CustomerPicker({ value, onChange, label }: CustomerPickerProps) {
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [loadedPages, setLoadedPages] = useState<readonly CustomerListItem[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(input.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [input]);

  useEffect(() => {
    setPageNumber(1);
    setLoadedPages([]);
  }, [search]);

  const page = useGetCustomersPageQuery({
    page: pageNumber,
    pageSize: PAGE_SIZE,
    searchTerm: search || undefined,
    sort: 'name',
  });
  const selected = useGetCustomerByIdQuery(value, { skip: !value });

  useEffect(() => {
    const data = page.data;
    if (!data || data.pageNumber !== pageNumber) return;
    setLoadedPages((current) => {
      const next = new Map(current.map((customer) => [customer.counterpartyId, customer]));
      for (const customer of data.items) next.set(customer.counterpartyId, customer);
      const merged = [...next.values()];
      const unchanged = merged.length === current.length && merged.every((customer, index) => {
        const existing = current[index];
        return existing.counterpartyId === customer.counterpartyId
          && existing.name === customer.name
          && existing.phone === customer.phone;
      });
      return unchanged ? current : merged;
    });
  }, [page.data, pageNumber]);

  const options = useMemo(() => {
    const list = [...loadedPages];
    const chosen = selected.data;
    if (chosen && !list.some((customer) => customer.counterpartyId === chosen.counterpartyId)) {
      list.unshift(chosen);
    }
    return list;
  }, [loadedPages, selected.data]);

  const loadNextPage = () => {
    if (!page.isFetching && !page.isError && page.data && pageNumber < page.data.totalPages) {
      setPageNumber((current) => current + 1);
    }
  };

  const handleListboxScroll = (event: UIEvent<HTMLUListElement>) => {
    const listbox = event.currentTarget;
    if (listbox.scrollTop + listbox.clientHeight >= listbox.scrollHeight - 32) loadNextPage();
  };

  return (
    <Autocomplete<CustomerListItem>
      autoHighlight
      filterOptions={(values) => values}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, chosen) => option.counterpartyId === chosen.counterpartyId}
      loading={page.isFetching || selected.isFetching}
      slotProps={{ listbox: { onScroll: handleListboxScroll } }}
      onChange={(_event, option) => onChange(option?.counterpartyId ?? '', option?.name ?? '')}
      onInputChange={(_event, next, reason) => {
        if (reason === 'input') setInput(next);
      }}
      options={options}
      renderInput={(parameters) => (
        <TextField
          {...parameters}
          label={label}
          size="small"
          helperText={page.isError || selected.isError ? 'Не вдалося завантажити клієнтів.' : undefined}
        />
      )}
      sx={{ minWidth: { sm: 240 }, width: { xs: '100%', md: 340 } }}
      value={options.find((customer) => customer.counterpartyId === value) ?? null}
    />
  );
}
