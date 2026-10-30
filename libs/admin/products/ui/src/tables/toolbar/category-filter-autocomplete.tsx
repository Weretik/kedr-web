import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Autocomplete, Box, IconButton, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

import { filterCategoryTree } from './category-tree-filter';
import { useCategoryTreeExpansion } from './use-category-tree-expansion';

import type { ProductCategoryOption } from '@admin/products/model';

export interface CategoryFilterAutocompleteProps {
  categories: readonly ProductCategoryOption[];
  categoryId?: number;
  categoriesLoading: boolean;
  categoriesError: boolean;
  onCategoryChange: (categoryId: number | undefined) => void;
}

export function CategoryFilterAutocomplete({
  categories,
  categoryId,
  categoriesLoading,
  categoriesError,
  onCategoryChange,
}: CategoryFilterAutocompleteProps) {
  const { expandedIds, toggle } = useCategoryTreeExpansion(categories, categoryId);
  const [searchTerm, setSearchTerm] = useState('');
  const selected = categories.find((category) => category.id === categoryId) ?? null;
  const browsing = !searchTerm || searchTerm === selected?.nameUk;

  useEffect(() => {
    setSearchTerm(selected?.nameUk ?? '');
  }, [selected?.nameUk]);

  return (
    <Autocomplete
      getOptionKey={(option) => option.id}
      filterOptions={(options, state) =>
        filterCategoryTree(options, state, expandedIds, browsing ? '' : searchTerm)
      }
      getOptionLabel={(option) => option.nameUk}
      inputValue={searchTerm}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      loading={categoriesLoading}
      loadingText="Завантаження категорій…"
      noOptionsText={categoriesError ? 'Не вдалося завантажити категорії' : 'Категорій не знайдено'}
      onChange={(_event, category) => {
        setSearchTerm(category?.nameUk ?? '');
        onCategoryChange(category?.id);
      }}
      onInputChange={(_event, value, reason) => {
        if (reason === 'input') setSearchTerm(value);
      }}
      options={categories}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        const expanded = expandedIds.has(option.id);
        return (
          <li
            key={key}
            {...optionProps}
            aria-label={`Рівень ${option.depth + 1}: ${option.nameUk}`}
          >
            <Box sx={{ ml: option.depth * 2, width: 32, flexShrink: 0 }}>
              {option.hasChildren && browsing && (
                <IconButton
                  aria-expanded={expanded}
                  aria-label={`${expanded ? 'Згорнути' : 'Розгорнути'} категорію ${option.nameUk}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggle(option.id);
                  }}
                  onKeyDown={(event) => event.stopPropagation()}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                  size="small"
                >
                  {expanded ? (
                    <ExpandMoreIcon fontSize="small" />
                  ) : (
                    <ChevronRightIcon fontSize="small" />
                  )}
                </IconButton>
              )}
            </Box>
            <Box
              component="span"
              sx={{
                fontWeight: option.hasChildren ? 600 : 400,
                overflowWrap: 'anywhere',
                whiteSpace: 'normal',
              }}
            >
              {option.nameUk}
            </Box>
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField {...params} label="Категорія" placeholder="Усі категорії" size="small" />
      )}
      size="small"
      value={selected}
    />
  );
}
