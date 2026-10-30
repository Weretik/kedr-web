import { DataGridMessageOverlay } from '@admin/shared/ui';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useMemo } from 'react';

import { categoriesColumns } from './categories-data-grid.columns';
import { CategoriesGridToolbar } from './categories-grid-toolbar';

import type { AdminCategory } from '@admin/categories/model';

interface CategoriesDataGridProps {
  mode: 'active' | 'deleted';
  rows: readonly AdminCategory[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  onView: (category: AdminCategory) => void;
}

/** Category tree in display order with client-side search over name and address. */
export function CategoriesDataGrid({
  error,
  loading,
  mode,
  onRetry,
  onView,
  rows,
}: CategoriesDataGridProps) {
  const columns = useMemo(() => categoriesColumns(mode, onView), [mode, onView]);
  const emptyMessage = mode === 'deleted' ? 'Видалених категорій немає.' : 'Категорій немає.';

  return (
    <Box sx={{ minWidth: 0, width: '100%' }}>
      <DataGrid
        autoHeight
        columns={columns}
        disableColumnFilter
        disableColumnMenu
        disableRowSelectionOnClick
        getRowHeight={() => 'auto'}
        initialState={{ pagination: { paginationModel: { pageSize: 50 } } }}
        loading={loading}
        onRowClick={mode === 'active' ? ({ row }) => onView(row) : undefined}
        pageSizeOptions={[25, 50, 100]}
        rows={error ? [] : [...rows]}
        showToolbar
        slots={{
          noRowsOverlay: () =>
            error ? (
              <DataGridMessageOverlay
                message="Не вдалося завантажити категорії."
                onRetry={onRetry}
              />
            ) : (
              <DataGridMessageOverlay message={emptyMessage} />
            ),
          toolbar: CategoriesGridToolbar,
        }}
        sx={{ '& .MuiDataGrid-row': { cursor: mode === 'active' ? 'pointer' : 'default' } }}
      />
    </Box>
  );
}
