import FilterListIcon from '@mui/icons-material/FilterList';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Badge, Box, Button, InputAdornment } from '@mui/material';
import {
  FilterPanelTrigger,
  QuickFilter,
  QuickFilterControl,
  Toolbar,
  useGridApiContext,
} from '@mui/x-data-grid';
import { useContext } from 'react';

import { CategoryFilterAutocomplete } from './category-filter-autocomplete';
import { ProductsGridToolbarContext } from './products-grid-toolbar-context';

import type { KeyboardEvent } from 'react';

/** Time after the last keystroke before the search runs; enough to finish typing a word. */
const SEARCH_DEBOUNCE_MS = 450;

function parseSearch(value: string) {
  return value.trim() ? [value.trim()] : [];
}

export function ProductsGridToolbar() {
  const { setPanelAnchor, showFilterPanel, ...categoryFilter } = useContext(
    ProductsGridToolbarContext,
  );
  const apiRef = useGridApiContext();

  // Enter runs the search at once instead of waiting for the pause.
  const runSearchOnEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      apiRef.current.setQuickFilterValues(parseSearch(event.currentTarget.value));
    }
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
        <QuickFilter expanded debounceMs={SEARCH_DEBOUNCE_MS} parser={parseSearch}>
          <QuickFilterControl
            fullWidth
            placeholder="Пошук товарів"
            size="small"
            slotProps={{
              htmlInput: { 'aria-label': 'Пошук товарів', onKeyDown: runSearchOnEnter },
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
      {showFilterPanel && (
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
      )}
      <Box sx={{ ml: { sm: 'auto' }, minWidth: { xs: '100%', sm: 240 }, width: { sm: 320 } }}>
        <CategoryFilterAutocomplete {...categoryFilter} />
      </Box>
    </Toolbar>
  );
}
