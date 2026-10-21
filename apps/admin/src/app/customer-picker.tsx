import { useGetCustomerByIdQuery, useGetCustomersPageQuery } from '@admin/clients/data-access';
import { Autocomplete, TextField } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import type { CustomerListItem } from '@admin/clients/model';
import type { CustomerPickerProps } from '@admin/orders/feature';

export function CustomerPicker({ value, onChange, label }: CustomerPickerProps) {
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  useEffect(() => { const timer = window.setTimeout(() => setSearch(input.trim()), 300); return () => window.clearTimeout(timer); }, [input]);
  const page = useGetCustomersPageQuery({ page: 1, pageSize: 20, searchTerm: search || undefined, sort: 'name' });
  const selected = useGetCustomerByIdQuery(value, { skip: !value });
  const options = useMemo(() => {
    const list = [...(page.data?.items ?? [])];
    if (selected.data && !list.some((entry) => entry.counterpartyId === selected.data?.counterpartyId)) list.unshift({ counterpartyId: selected.data.counterpartyId, name: selected.data.name, phone: selected.data.phone });
    if (value && !list.some((entry) => entry.counterpartyId === value)) list.unshift({ counterpartyId: value, name: value, phone: null });
    return list;
  }, [page.data?.items, selected.data, value]);
  return <Autocomplete<CustomerListItem>
    autoHighlight filterOptions={(values) => values} getOptionLabel={(option) => `${option.name} · ${option.counterpartyId}`}
    isOptionEqualToValue={(option, chosen) => option.counterpartyId === chosen.counterpartyId}
    loading={page.isFetching} onChange={(_event, option) => onChange(option?.counterpartyId ?? '', option?.name ?? '')}
    onInputChange={(_event, next, reason) => { if (reason === 'input') setInput(next); }}
    options={options} renderInput={(parameters) => <TextField {...parameters} label={label} size="small" helperText={page.isError ? 'Не вдалося завантажити клієнтів.' : undefined} />}
    sx={{ minWidth: { sm: 240 }, width: { xs: '100%', md: 340 } }} value={options.find((entry) => entry.counterpartyId === value) ?? null}
  />;
}
