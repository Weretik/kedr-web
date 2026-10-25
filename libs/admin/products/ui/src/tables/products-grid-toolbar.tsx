import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import {
  Autocomplete,
  Badge,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  createFilterOptions,
} from '@mui/material';
import { FilterPanelTrigger, QuickFilter, QuickFilterControl, Toolbar } from '@mui/x-data-grid';
import { createContext, useContext, useEffect, useState } from 'react';

import type { ProductCategoryOption } from '@admin/products/model';

export interface ProductsGridToolbarProps {
  categories: readonly ProductCategoryOption[];
  categoryId?: number;
  categoriesLoading: boolean;
  categoriesError: boolean;
  onCategoryChange: (categoryId: number | undefined) => void;
  setPanelAnchor: (element: HTMLDivElement | null) => void;
}

export const ProductsGridToolbarContext = createContext<ProductsGridToolbarProps>({
  categories: [],
  categoriesLoading: false,
  categoriesError: false,
  onCategoryChange: () => undefined,
  setPanelAnchor: () => undefined,
});

const filterCategories = createFilterOptions<ProductCategoryOption>({
  stringify: (option) => option.pathUk,
});

function filterCategoryTree(
  options: ProductCategoryOption[],
  state: Parameters<typeof filterCategories>[1],
  expandedIds: ReadonlySet<number>,
  searchTerm: string,
) {
  const byId = new Map(options.map((option) => [option.id, option]));
  if (!searchTerm.trim()) {
    return options.filter((option) => {
      let parentId = option.parentId;
      const visited = new Set([option.id]);
      while (parentId !== null) {
        if (visited.has(parentId) || !expandedIds.has(parentId)) return false;
        visited.add(parentId);
        parentId = byId.get(parentId)?.parentId ?? null;
      }
      return true;
    });
  }

  const matches = filterCategories(options, { ...state, inputValue: searchTerm });
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
  const {
    categories,
    categoryId,
    categoriesLoading,
    categoriesError,
    onCategoryChange,
    setPanelAnchor,
  } = useContext(ProductsGridToolbarContext);
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<number>>(() => new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const selected = categories.find((category) => category.id === categoryId) ?? null;

  useEffect(() => {
    setSearchTerm(selected?.nameUk ?? '');
  }, [selected?.nameUk]);

  useEffect(() => {
    if (categoryId === undefined) return;
    const byId = new Map(categories.map((category) => [category.id, category]));
    const ancestors = new Set<number>();
    let parentId = byId.get(categoryId)?.parentId;
    while (parentId != null && !ancestors.has(parentId)) {
      ancestors.add(parentId);
      parentId = byId.get(parentId)?.parentId;
    }
    if (ancestors.size > 0) {
      setExpandedIds((previous) => new Set([...previous, ...ancestors]));
    }
  }, [categories, categoryId]);

  const toggleCategory = (id: number) => {
    setExpandedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Toolbar
      style={{
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: 8,
        padding: '8px 16px',
        position: 'relative',
      }}
    >
      {/* MUI вирівнює широку панель за правим краєм цієї точки в межах таблиці. */}
      <Box
        ref={setPanelAnchor}
        aria-hidden="true"
        sx={{
          bottom: 0,
          height: 0,
          left: 'min(100%, 800px)',
          pointerEvents: 'none',
          position: 'absolute',
          width: 0,
        }}
      />
      <Box sx={{ flex: '1 1 220px', maxWidth: 320, minWidth: 0 }}>
        <QuickFilter
          expanded
          debounceMs={300}
          parser={(value) => (value.trim() ? [value.trim()] : [])}
        >
          <QuickFilterControl
            fullWidth
            placeholder="Пошук товарів"
            size="small"
            slotProps={{
              htmlInput: { 'aria-label': 'Пошук товарів' },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon aria-hidden="true" fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </QuickFilter>
      </Box>
      <FilterPanelTrigger
        render={(props, { filterCount }) => (
          <Button
            {...props}
            size="small"
            startIcon={
              <Badge badgeContent={filterCount} color="primary">
                <FilterListIcon />
              </Badge>
            }
          >
            Фільтри
          </Button>
        )}
      />
      <Box sx={{ ml: { sm: 'auto' }, minWidth: { xs: '100%', sm: 240 }, width: { sm: 320 } }}>
        <Autocomplete
          getOptionKey={(option) => option.id}
          filterOptions={(options, state) =>
            filterCategoryTree(
              options,
              state,
              expandedIds,
              searchTerm === selected?.nameUk ? '' : searchTerm,
            )
          }
          getOptionLabel={(option) => option.nameUk}
          inputValue={searchTerm}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          loading={categoriesLoading}
          loadingText="Завантаження категорій…"
          noOptionsText={
            categoriesError ? 'Не вдалося завантажити категорії' : 'Категорій не знайдено'
          }
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
            return (
              <li
                key={key}
                {...optionProps}
                aria-label={`Рівень ${option.depth + 1}: ${option.nameUk}`}
              >
                <Box sx={{ ml: option.depth * 2, width: 32, flexShrink: 0 }}>
                  {option.hasChildren && (!searchTerm || searchTerm === selected?.nameUk) && (
                    <IconButton
                      aria-expanded={expandedIds.has(option.id)}
                      aria-label={`${expandedIds.has(option.id) ? 'Згорнути' : 'Розгорнути'} категорію ${option.nameUk}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleCategory(option.id);
                      }}
                      onKeyDown={(event) => event.stopPropagation()}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      size="small"
                    >
                      {expandedIds.has(option.id) ? (
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
      </Box>
    </Toolbar>
  );
}
