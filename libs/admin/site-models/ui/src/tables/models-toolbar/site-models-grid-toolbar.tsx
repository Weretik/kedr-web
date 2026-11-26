import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Box, InputAdornment } from '@mui/material';
import { QuickFilter, QuickFilterControl, Toolbar, useGridApiContext } from '@mui/x-data-grid';
import { useContext } from 'react';

import { SiteModelListFilters } from './site-model-list-filters';
import { SiteModelsToolbarContext } from './site-models-toolbar-context';
import { SiteCategoryPicker } from '../../components/pickers/site-category-picker';

import type { KeyboardEvent } from 'react';

/** Time after the last keystroke before the search runs; enough to finish typing a word. */
const searchDebounceMs = 450;

const parseSearch = (value: string) => (value.trim() ? [value.trim()] : []);

/** «Моделі» toolbar: the name search, the category tree, the status and «Чого бракує» filters. */
export function SiteModelsGridToolbar() {
  const filters = useContext(SiteModelsToolbarContext);
  const apiRef = useGridApiContext();
  const runSearchOnEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter')
      apiRef.current.setQuickFilterValues(parseSearch(event.currentTarget.value));
  };

  return (
    <Toolbar
      style={{ flexWrap: 'wrap', gap: 8, justifyContent: 'flex-start', padding: '8px 16px' }}
    >
      <Box sx={{ flex: '1 1 220px', maxWidth: 320, minWidth: 0 }}>
        <QuickFilter debounceMs={searchDebounceMs} expanded parser={parseSearch}>
          <QuickFilterControl
            fullWidth
            placeholder="Пошук моделей"
            size="small"
            slotProps={{
              htmlInput: { 'aria-label': 'Пошук моделей', onKeyDown: runSearchOnEnter },
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
      <SiteCategoryPicker
        categories={filters.categories}
        loading={filters.categoriesLoading}
        onSelect={filters.onCategoryChange}
        selectedId={filters.categoryId}
      />
      <SiteModelListFilters
        onProblemChange={filters.onProblemChange}
        onStatusChange={filters.onStatusChange}
        problem={filters.problem}
        status={filters.status}
      />
    </Toolbar>
  );
}
