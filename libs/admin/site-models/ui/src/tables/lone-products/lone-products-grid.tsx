import { DataGridMessageOverlay } from '@admin/shared/ui';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { loneProductsGridColumns } from './lone-products-grid-columns';

import type { LoneProductsGridActions } from './lone-products-grid-columns';
import type { SiteShowcaseItem } from '@admin/site-models/model';
import type { GridPaginationModel } from '@mui/x-data-grid';

export interface LoneProductsGridProps extends LoneProductsGridActions {
  rows: readonly SiteShowcaseItem[];
  rowCount: number;
  page: number;
  pageSize: number;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  onPageChange: (page: number, pageSize: number) => void;
}

export const loneProductsPageSizes = [10, 20, 50];

/** «Товари без моделі» of «Перевірка»: on-site products in no model, paged by the server. */
export function LoneProductsGrid(props: LoneProductsGridProps) {
  const { error, loading, page, pageSize } = props;
  return (
    <Box sx={{ minWidth: 0, width: '100%' }}>
      <DataGrid
        autoHeight
        columns={loneProductsGridColumns(props)}
        disableColumnFilter
        disableRowSelectionOnClick
        getRowHeight={() => 'auto'}
        getRowId={(row) => row.productId}
        loading={loading}
        onPaginationModelChange={(model: GridPaginationModel) => {
          if (model.page + 1 === page && model.pageSize === pageSize) return;
          props.onPageChange(model.pageSize === pageSize ? model.page + 1 : 1, model.pageSize);
        }}
        pageSizeOptions={loneProductsPageSizes}
        pagination
        paginationMode="server"
        paginationModel={{ page: page - 1, pageSize }}
        rowCount={error ? 0 : props.rowCount}
        rows={error ? [] : [...props.rows]}
        slots={{
          noRowsOverlay: error
            ? () => (
                <DataGridMessageOverlay
                  message="Не вдалося завантажити товари без моделі."
                  onRetry={props.onRetry}
                />
              )
            : () => <DataGridMessageOverlay message="Усі товари в моделях" />,
        }}
      />
    </Box>
  );
}
