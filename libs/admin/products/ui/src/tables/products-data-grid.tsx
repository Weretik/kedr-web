import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { productsDataGridColumns } from './products-data-grid.columns';
import { toGridSortModel, toProductsListSort } from './products-data-grid.sort';
import { ProductsDataGridEmptyOverlay } from '../states/products-data-grid-empty-overlay';
import { ProductsDataGridErrorOverlay } from '../states/products-data-grid-error-overlay';

import type { AdminProductListItem, ProductsListSort } from '@admin/products/model';
import type { GridPaginationModel } from '@mui/x-data-grid';

interface ProductsDataGridProps {
  errorMessage?: string;
  loading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRetry: () => void;
  onSortChange: (sort: ProductsListSort) => void;
  page: number;
  pageSize: number;
  rowCount: number;
  rows: readonly AdminProductListItem[];
  sort: ProductsListSort;
}

export function ProductsDataGrid({
  errorMessage,
  loading,
  onPageChange,
  onPageSizeChange,
  onRetry,
  onSortChange,
  page,
  pageSize,
  rowCount,
  rows,
  sort,
}: ProductsDataGridProps) {
  const paginationModel: GridPaginationModel = { page, pageSize };
  const noRowsOverlay = errorMessage
    ? () => <ProductsDataGridErrorOverlay message={errorMessage} onRetry={onRetry} />
    : ProductsDataGridEmptyOverlay;

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Box sx={{ minWidth: 760 }}>
        <DataGrid
          autoHeight
          columns={productsDataGridColumns}
          disableRowSelectionOnClick
          loading={loading}
          onPaginationModelChange={(model) => {
            if (model.pageSize !== pageSize) {
              onPageSizeChange(model.pageSize);
              return;
            }

            onPageChange(model.page + 1);
          }}
          onSortModelChange={(model) => onSortChange(toProductsListSort(model))}
          pageSizeOptions={[10, 20, 30, 50]}
          pagination
          paginationMode="server"
          paginationModel={paginationModel}
          rowCount={rowCount}
          rows={errorMessage ? [] : rows}
          slots={{ noRowsOverlay }}
          sortingMode="server"
          sortModel={toGridSortModel(sort)}
          sx={{ bgcolor: 'background.paper' }}
        />
      </Box>
    </Box>
  );
}
