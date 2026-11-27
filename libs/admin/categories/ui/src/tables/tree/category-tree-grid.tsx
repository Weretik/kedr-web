import { DataGridMessageOverlay } from '@admin/shared/ui';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useMemo } from 'react';

import { categoryTreeColumns } from './category-tree-columns';

import type { CategoryTreeActions } from './category-tree-columns';
import type { CategoryTableRow } from '@admin/categories/model';

/** The largest page the free Data Grid allows; a longer table pages by it. */
const pageSize = 100;

interface CategoryTreeGridProps extends CategoryTreeActions {
  rows: readonly CategoryTableRow[];
  loading: boolean;
  error: boolean;
  emptyMessage: string;
  onRetry: () => void;
  onOpen: (categoryId: number) => void;
}

/** «Категорії» as one tree table like «Моделі» (spec 003 R-001); a row click opens the category page. */
export function CategoryTreeGrid(props: CategoryTreeGridProps) {
  const { onToggleOpen, onToggleSite } = props;
  const columns = useMemo(
    () => categoryTreeColumns({ onToggleOpen, onToggleSite }),
    [onToggleOpen, onToggleSite],
  );
  const noRowsOverlay = props.error
    ? () => (
        <DataGridMessageOverlay
          message="Не вдалося завантажити категорії."
          onRetry={props.onRetry}
        />
      )
    : () => <DataGridMessageOverlay message={props.emptyMessage} />;

  return (
    <Box sx={{ minWidth: 0, width: '100%' }}>
      <DataGrid
        columns={columns}
        disableColumnFilter
        disableColumnSorting
        disableRowSelectionOnClick
        getEstimatedRowHeight={() => 64}
        getRowHeight={() => 'auto'}
        hideFooter={props.rows.length <= pageSize}
        initialState={{ pagination: { paginationModel: { page: 0, pageSize } } }}
        loading={props.loading}
        onRowClick={(params, event) => {
          // Controls in the row (arrow, switch, open) act on their own.
          if ((event.target as HTMLElement).closest('button, input, a, label')) return;
          props.onOpen(params.row.id);
        }}
        pageSizeOptions={[pageSize]}
        rows={props.error ? [] : [...props.rows]}
        slots={{ noRowsOverlay }}
        sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
      />
    </Box>
  );
}
