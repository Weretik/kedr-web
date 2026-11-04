import { DataGridMessageOverlay } from '@admin/shared/ui';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { deletedCategoriesColumns } from './categories-data-grid.columns';
import { CategoriesGridToolbar } from './categories-grid-toolbar';

import type { AdminCategory } from '@admin/categories/model';

interface CategoriesDataGridProps {
  rows: readonly AdminCategory[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
}

/** Categories the 1C import soft-deleted, newest first, with client-side search. */
export function CategoriesDataGrid({ error, loading, onRetry, rows }: CategoriesDataGridProps) {
  return (
    <Box sx={{ minWidth: 0, width: '100%' }}>
      <DataGrid
        autoHeight
        columns={deletedCategoriesColumns}
        disableColumnFilter
        disableColumnMenu
        disableRowSelectionOnClick
        getRowHeight={() => 'auto'}
        initialState={{ pagination: { paginationModel: { pageSize: 50 } } }}
        loading={loading}
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
              <DataGridMessageOverlay message="Видалених категорій немає." />
            ),
          toolbar: CategoriesGridToolbar,
        }}
      />
    </Box>
  );
}
