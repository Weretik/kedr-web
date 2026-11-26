import { DataGridMessageOverlay } from '@admin/shared/ui';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { seoReviewColumns } from './seo-review.columns';

import type { SeoReviewItem } from '@admin/seo-review/model';

export interface SeoReviewTableProps {
  error: boolean;
  loading: boolean;
  onOpen: (item: SeoReviewItem) => void;
  onRetry: () => void;
  rows: readonly SeoReviewItem[];
}

/** One row per page and language that needs work; the whole list comes at once and pages here. */
export function SeoReviewTable({ error, loading, onOpen, onRetry, rows }: SeoReviewTableProps) {
  return (
    <Box sx={{ minWidth: 0, width: '100%' }}>
      <DataGrid
        autoHeight
        columns={seoReviewColumns(onOpen)}
        disableColumnFilter
        disableRowSelectionOnClick
        getRowHeight={() => 'auto'}
        getRowId={(row) => `${row.kind}-${row.id}-${row.language}`}
        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 25 } } }}
        loading={loading}
        pageSizeOptions={[25, 50, 100]}
        rows={error ? [] : [...rows]}
        slots={{
          noRowsOverlay: error
            ? () => (
                <DataGridMessageOverlay message="Не вдалося завантажити огляд." onRetry={onRetry} />
              )
            : () => <DataGridMessageOverlay message="Усе гаразд: сторінок із проблемами немає." />,
        }}
        sx={{ '& .MuiDataGrid-cell': { py: 1 } }}
      />
    </Box>
  );
}
