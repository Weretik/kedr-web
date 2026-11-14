import { DataGridMessageOverlay } from '@admin/shared/ui';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { OrderGridToolbar, OrderGridToolbarContext } from './order-grid-toolbar';
import { orderListColumns } from './order-list-grid.columns';
import { toOrderApiSort, toOrderGridSortModel } from './order-list-grid.sort';

import type { DraftSummary, OrderSummary } from '@admin/orders/model';
import type { GridPaginationModel } from '@mui/x-data-grid';

interface OrderListGridProps {
  mode: 'orders' | 'drafts';
  rows: OrderSummary[] | DraftSummary[];
  rowCount: number;
  loading: boolean;
  error: boolean;
  search: string;
  createdFrom: string;
  createdTo: string;
  hideSearch: boolean;
  hideCustomerColumn: boolean;
  page: number;
  pageSize: number;
  sort: string;
  onSearch: (value: string) => void;
  onPage: (page: number) => void;
  onDateChange: (from: string, to: string) => void;
  onPageSize: (size: number) => void;
  onSort: (sort: string) => void;
  onView: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (row: DraftSummary) => void;
  onRetry: () => void;
}
export function OrderListGrid(props: OrderListGridProps) {
  const orders = props.mode === 'orders';
  const columns = orderListColumns(props.mode, props.hideCustomerColumn, props);
  const sortModel = toOrderGridSortModel(props.sort);
  const model: GridPaginationModel = { page: props.page - 1, pageSize: props.pageSize };
  const errorOverlay = () => (
    <DataGridMessageOverlay message="Не вдалося завантажити записи." onRetry={props.onRetry} />
  );
  const emptyOverlay = () => (
    <DataGridMessageOverlay message={orders ? 'Замовлень немає.' : 'Чернеток немає.'} />
  );
  return (
    <Box sx={{ minWidth: 0 }}>
      <OrderGridToolbarContext.Provider
        value={{
          mode: props.mode,
          search: props.search,
          onSearch: props.onSearch,
          createdFrom: props.createdFrom,
          createdTo: props.createdTo,
          hideSearch: props.hideSearch,
          onDateChange: props.onDateChange,
        }}
      >
        <Box sx={{ overflowX: 'auto' }}>
          <Box sx={{ minWidth: 700 }}>
            <DataGrid
              autoHeight
              columns={columns}
              disableRowSelectionOnClick
              getRowId={(row) => (orders ? row.orderId : row.draftId)}
              loading={props.loading}
              onPaginationModelChange={(next) =>
                next.pageSize !== props.pageSize
                  ? props.onPageSize(next.pageSize)
                  : props.onPage(next.page + 1)
              }
              filterMode="server"
              filterModel={{ items: [], quickFilterValues: props.search ? [props.search] : [] }}
              onSortModelChange={(next) => {
                const sort = toOrderApiSort(next);
                if (sort) props.onSort(sort);
              }}
              pageSizeOptions={[10, 20, 30, 50]}
              pagination
              paginationMode="server"
              paginationModel={model}
              rowCount={props.rowCount}
              rows={props.error ? [] : props.rows}
              sortingMode="server"
              sortModel={sortModel}
              showToolbar
              slots={{
                noRowsOverlay: props.error ? errorOverlay : emptyOverlay,
                toolbar: OrderGridToolbar,
              }}
            />
          </Box>
        </Box>
      </OrderGridToolbarContext.Provider>
    </Box>
  );
}
