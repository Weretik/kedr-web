import { DataGridMessageOverlay } from '@admin/shared/ui';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { SiteOrdersGridToolbar, SiteOrdersToolbarContext } from './site-orders-grid-toolbar';
import { siteOrdersGridColumns } from './site-orders-grid.columns';

import type { SiteOrderListItem } from '@admin/site-orders/model';
import type { GridPaginationModel } from '@mui/x-data-grid';

export interface SiteOrdersDataGridProps {
  error: boolean;
  loading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onProblemOnlyChange: (problemOnly: boolean) => void;
  onRetry: () => void;
  onSearchChange: (search: string | undefined) => void;
  onView: (orderId: string) => void;
  /** Opens the order made for 1C in «Історія замовлень» (KedrStore spec sales/009, R-015). */
  onOpenOrder: (orderId: number) => void;
  page: number;
  pageSize: number;
  problemOnly: boolean;
  rowCount: number;
  rows: readonly SiteOrderListItem[];
  search?: string;
}

export function SiteOrdersDataGrid(props: SiteOrdersDataGridProps) {
  const { error, loading, page, pageSize, search } = props;
  const filtered = Boolean(search) || props.problemOnly;
  const empty = filtered ? 'Нічого не знайдено.' : 'Замовлень з сайту ще немає.';

  return (
    <SiteOrdersToolbarContext.Provider
      value={{ problemOnly: props.problemOnly, onProblemOnlyChange: props.onProblemOnlyChange }}
    >
      <Box sx={{ minWidth: 0, width: '100%' }}>
        <DataGrid
          columns={siteOrdersGridColumns(props.onView, props.onOpenOrder)}
          getRowHeight={() => 'auto'}
          disableColumnFilter
          disableRowSelectionOnClick
          filterMode="server"
          filterModel={{ items: [], quickFilterValues: search ? [search] : [] }}
          getRowId={(row) => row.orderId}
          loading={loading}
          onFilterModelChange={(model) => {
            const next =
              model.quickFilterValues?.map(String).join(' ').trim().slice(0, 100) || undefined;
            if (next !== search) props.onSearchChange(next);
          }}
          onPaginationModelChange={(model: GridPaginationModel) => {
            if (loading || (model.page + 1 === page && model.pageSize === pageSize)) return;
            if (model.pageSize !== pageSize) props.onPageSizeChange(model.pageSize);
            else props.onPageChange(model.page + 1);
          }}
          onRowClick={({ row }) => props.onView(row.orderId)}
          pageSizeOptions={[10, 20, 50, 100]}
          pagination
          paginationMode="server"
          paginationModel={{ page: page - 1, pageSize }}
          rowCount={props.rowCount}
          rows={error ? [] : [...props.rows]}
          showToolbar
          slots={{
            noRowsOverlay: error
              ? () => (
                  <DataGridMessageOverlay
                    message="Не вдалося завантажити замовлення з сайту."
                    onRetry={props.onRetry}
                  />
                )
              : () => <DataGridMessageOverlay message={empty} />,
            toolbar: SiteOrdersGridToolbar,
          }}
        />
      </Box>
    </SiteOrdersToolbarContext.Provider>
  );
}
