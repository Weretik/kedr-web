import { Button, FormControlLabel, MenuItem, Stack, Switch, TextField } from '@mui/material';

import type { ProductsListQuery } from '@admin/products/model';
import type { FormEvent, KeyboardEvent } from 'react';

interface ProductsListFiltersProps {
  canReset: boolean;
  onApplyPriceRange: () => void;
  onApplySearch: () => void;
  onFilterChange: (filter: 'isNew' | 'isSale', value: boolean) => void;
  onInStockChange: (value: boolean) => void;
  onPriceFromDraftChange: (value: string) => void;
  onPriceToDraftChange: (value: string) => void;
  onReset: () => void;
  onSearchDraftChange: (value: string) => void;
  priceFromDraft: string;
  priceRangeError?: string;
  priceToDraft: string;
  query: ProductsListQuery;
  searchDraft: string;
}

export function ProductsListFilters({
  canReset,
  onApplyPriceRange,
  onApplySearch,
  onFilterChange,
  onInStockChange,
  onPriceFromDraftChange,
  onPriceToDraftChange,
  onReset,
  onSearchDraftChange,
  priceFromDraft,
  priceRangeError,
  priceToDraft,
  query,
  searchDraft,
}: ProductsListFiltersProps) {
  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onApplySearch();
  };

  const handlePriceKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    onApplyPriceRange();
  };

  return (
    <Stack component="form" noValidate onSubmit={handleSearchSubmit} spacing={2}>
      <Stack direction={{ md: 'row' }} spacing={2}>
        <TextField
          fullWidth
          label="Пошук товарів"
          onChange={(event) => onSearchDraftChange(event.target.value)}
          placeholder="Назва або slug"
          value={searchDraft}
        />
        <Button sx={{ alignSelf: { md: 'center' }, whiteSpace: 'nowrap' }} type="submit" variant="contained">
          Пошук
        </Button>
      </Stack>

      <Stack direction={{ lg: 'row' }} spacing={2}>
        <TextField
          fullWidth
          label="Наявність"
          onChange={(event) => onInStockChange(event.target.value === 'in-stock')}
          select
          value={query.inStock ? 'in-stock' : 'out-of-stock'}
        >
          <MenuItem value="in-stock">В наявності</MenuItem>
          <MenuItem value="out-of-stock">Немає в наявності</MenuItem>
        </TextField>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControlLabel
            control={
              <Switch
                checked={query.isSale === true}
                onChange={(event) => onFilterChange('isSale', event.target.checked)}
              />
            }
            label="Акційні"
          />
          <FormControlLabel
            control={
              <Switch
                checked={query.isNew === true}
                onChange={(event) => onFilterChange('isNew', event.target.checked)}
              />
            }
            label="Новинки"
          />
        </Stack>
      </Stack>

      <Stack direction={{ md: 'row' }} spacing={2}>
        <TextField
          error={Boolean(priceRangeError)}
          fullWidth
          label="Ціна від"
          onChange={(event) => onPriceFromDraftChange(event.target.value)}
          onKeyDown={handlePriceKeyDown}
          slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
          type="number"
          value={priceFromDraft}
        />
        <TextField
          error={Boolean(priceRangeError)}
          fullWidth
          helperText={priceRangeError ?? ' '}
          label="Ціна до"
          onChange={(event) => onPriceToDraftChange(event.target.value)}
          onKeyDown={handlePriceKeyDown}
          slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
          type="number"
          value={priceToDraft}
        />
        <Button
          disabled={Boolean(priceRangeError)}
          onClick={onApplyPriceRange}
          sx={{ alignSelf: { md: 'center' }, whiteSpace: 'nowrap' }}
          type="button"
          variant="outlined"
        >
          Застосувати ціну
        </Button>
        <Button
          disabled={!canReset}
          onClick={onReset}
          sx={{ alignSelf: { md: 'center' }, whiteSpace: 'nowrap' }}
          type="button"
        >
          Скинути фільтри
        </Button>
      </Stack>
    </Stack>
  );
}
