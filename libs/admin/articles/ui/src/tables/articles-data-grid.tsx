import { DataGridMessageOverlay } from '@admin/shared/ui';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { articlesColumns } from './articles-data-grid.columns';
import { ArticlesGridToolbar } from './articles-grid-toolbar';

import type { ArticleSummary } from '@admin/articles/model';

interface ArticlesDataGridProps {
  rows: readonly ArticleSummary[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  onOpen: (article: ArticleSummary) => void;
}

/** Articles newest first, as the server sends them; a row opens the editor. */
export function ArticlesDataGrid({ error, loading, onOpen, onRetry, rows }: ArticlesDataGridProps) {
  return (
    <Box sx={{ minWidth: 0, width: '100%' }}>
      <DataGrid
        autoHeight
        columns={articlesColumns}
        disableColumnFilter
        disableColumnMenu
        disableRowSelectionOnClick
        getRowHeight={() => 'auto'}
        initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
        loading={loading}
        onRowClick={({ row }) => onOpen(row)}
        pageSizeOptions={[25, 50, 100]}
        rows={error ? [] : [...rows]}
        showToolbar
        slots={{
          noRowsOverlay: () =>
            error ? (
              <DataGridMessageOverlay message="Не вдалося завантажити статті." onRetry={onRetry} />
            ) : (
              <DataGridMessageOverlay message="Статей ще немає." />
            ),
          toolbar: ArticlesGridToolbar,
        }}
        sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
      />
    </Box>
  );
}
