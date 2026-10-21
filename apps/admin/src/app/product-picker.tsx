import { useGetProductsListQuery } from '@admin/products/data-access';
import { Autocomplete, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

import type { ProductPickerProps } from '@admin/orders/feature';
import type { AdminProductListItem } from '@admin/products/model';

export function ProductPicker({ excludedIds, onSelect }: ProductPickerProps) {
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  useEffect(() => { const timer = window.setTimeout(() => setSearch(input.trim()), 300); return () => window.clearTimeout(timer); }, [input]);
  const products = useGetProductsListQuery({ page: 1, pageSize: 20, searchTerm: search || undefined, sort: 'name-asc' });
  const options = (products.data?.items ?? []).filter((product) => !excludedIds.includes(String(product.id)));
  return <Autocomplete<AdminProductListItem>
    autoHighlight filterOptions={(values) => values} inputValue={input}
    getOptionLabel={(product) => `${product.nameUk || product.nameRu} · ID ${product.id}`}
    isOptionEqualToValue={(option, selected) => option.id === selected.id}
    loading={products.isFetching} onChange={(_event, product) => { if (product) { onSelect(String(product.id)); setInput(''); } }}
    onInputChange={(_event, value, reason) => { if (reason === 'input') setInput(value); }}
    options={options} renderInput={(parameters) => <TextField {...parameters} label="Знайти й додати товар" size="small" helperText={products.isError ? 'Не вдалося завантажити товари.' : undefined} />}
    sx={{ width: { xs: '100%', sm: 360 } }} value={null}
  />;
}
