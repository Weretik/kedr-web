import { Autocomplete, Box, TextField, createFilterOptions } from '@mui/material';
import { GridToolbarContainer, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { createContext, useContext } from 'react';

import type { ProductCategoryOption } from '@admin/products/model';

export interface ProductsGridToolbarProps {
  categories: readonly ProductCategoryOption[];
  categoryId?: number;
  categoriesLoading: boolean;
  categoriesError: boolean;
  onCategoryChange: (categoryId: number | undefined) => void;
}

export const ProductsGridToolbarContext = createContext<ProductsGridToolbarProps>({
  categories: [], categoriesLoading: false, categoriesError: false, onCategoryChange: () => undefined,
});

const filterCategories = createFilterOptions<ProductCategoryOption>({
  stringify: (option) => option.pathUk,
});

function filterCategoryTree(options: ProductCategoryOption[], state: Parameters<typeof filterCategories>[1]) {
  const matches = filterCategories(options, state);
  const byId = new Map(options.map((option) => [option.id, option]));
  const visibleIds = new Set<number>();

  for (const match of matches) {
    let current: ProductCategoryOption | undefined = match;
    while (current && !visibleIds.has(current.id)) {
      visibleIds.add(current.id);
      current = current.parentId === null ? undefined : byId.get(current.parentId);
    }
  }

  return options.filter((option) => visibleIds.has(option.id));
}

export function ProductsGridToolbar() {
  const { categories, categoryId, categoriesLoading, categoriesError, onCategoryChange } = useContext(ProductsGridToolbarContext);
  const selected = categories.find((category) => category.id === categoryId) ?? null;

  return (
    <GridToolbarContainer sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, px: 2, py: 1 }}>
      <GridToolbarFilterButton />
      <GridToolbarQuickFilter
        debounceMs={300}
        quickFilterParser={(value) => value.trim() ? [value.trim()] : []}
        slotProps={{ root: { placeholder: 'Пошук товарів' } }}
      />
      <Box sx={{ ml: { sm: 'auto' }, minWidth: { xs: '100%', sm: 240 }, width: { sm: 320 } }}>
        <Autocomplete
          getOptionKey={(option) => option.id}
          filterOptions={filterCategoryTree}
          getOptionLabel={(option) => option.nameUk}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          loading={categoriesLoading}
          loadingText="Завантаження категорій…"
          noOptionsText={categoriesError ? 'Не вдалося завантажити категорії' : 'Категорій не знайдено'}
          onChange={(_event, category) => onCategoryChange(category?.id)}
          options={categories}
          renderOption={(props, option) => {
            const { key, ...optionProps } = props;
            return (
              <li key={key} {...optionProps} aria-label={`Рівень ${option.depth + 1}: ${option.nameUk}`}>
                <Box component="span" sx={{
                  borderColor: 'divider',
                  borderLeft: option.depth > 0 ? 1 : 0,
                  fontWeight: option.hasChildren ? 600 : 400,
                  ml: option.depth * 2,
                  overflowWrap: 'anywhere',
                  pl: option.depth > 0 ? 1 : 0,
                  whiteSpace: 'normal',
                }}>
                  {option.nameUk}
                </Box>
              </li>
            );
          }}
          renderInput={(params) => <TextField {...params} label="Категорія" placeholder="Усі категорії" size="small" />}
          size="small"
          value={selected}
        />
      </Box>
    </GridToolbarContainer>
  );
}
