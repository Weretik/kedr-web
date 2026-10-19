import { Box, useMediaQuery, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useMemo } from 'react';

import { productsDataGridColumns } from './products-data-grid.columns';
import { ProductsBooleanFilterHeader } from './cells/products-boolean-filter-header';
import { ProductsViewActionCell } from './cells/products-view-action-cell';
import { ProductsGridToolbar, ProductsGridToolbarContext } from './products-grid-toolbar';
import { toGridSortModel, toProductsListSort } from './products-data-grid.sort';
import { ProductsDataGridEmptyOverlay } from '../states/products-data-grid-empty-overlay';
import { ProductsDataGridErrorOverlay } from '../states/products-data-grid-error-overlay';

import type { AdminProductListItem, ProductCategoryOption, ProductsListSort } from '@admin/products/model';
import type { ProductBooleanField } from './cells/products-boolean-filter-header';
import type { GridColDef, GridFilterModel, GridPaginationModel } from '@mui/x-data-grid';

type BooleanFilterField = ProductBooleanField;
const booleanFields: readonly string[] = ['inStock', 'isSale', 'isNew'];

interface ProductsDataGridProps {
  categories?: readonly ProductCategoryOption[];
  categoryId?: number;
  categoriesLoading?: boolean;
  categoriesError?: boolean;
  emptyMessage?: string;
  errorMessage?: string;
  booleanFilters: Partial<Record<BooleanFilterField, boolean>>;
  filterModel: GridFilterModel;
  loading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onFilterChange: (model: GridFilterModel) => void;
  onBooleanFilterChange: (field: BooleanFilterField, value: boolean | undefined) => void;
  onCategoryChange?: (categoryId: number | undefined) => void;
  onRetry: () => void;
  onSortChange: (sort: ProductsListSort) => void;
  onViewProduct: (product: AdminProductListItem) => void;
  page: number;
  pageSize: number;
  rowCount: number;
  rows: readonly AdminProductListItem[];
  sort: ProductsListSort;
  priceFilterable: boolean;
  sortable?: boolean;
}

export function ProductsDataGrid({
  categories = [],
  categoryId,
  categoriesLoading = false,
  categoriesError = false,
  emptyMessage,
  errorMessage,
  booleanFilters,
  filterModel,
  loading,
  onPageChange,
  onPageSizeChange,
  onFilterChange,
  onBooleanFilterChange,
  onCategoryChange = () => undefined,
  onRetry,
  onSortChange,
  onViewProduct,
  page,
  pageSize,
  rowCount,
  rows,
  sort,
  priceFilterable,
  sortable = true,
}: ProductsDataGridProps) {
  const theme = useTheme();
  const phone = useMediaQuery(theme.breakpoints.down('sm'));
  const columns = useMemo<GridColDef<AdminProductListItem>[]>(() => [
    ...productsDataGridColumns.map((column) => {
      if (column.field === 'name') return { ...column, minWidth: phone ? 140 : 180 };
      if (column.field === 'price' && !priceFilterable) return { ...column, filterable: false };
      if (booleanFields.includes(column.field)) {
        const field = column.field as BooleanFilterField;
        return {
          ...column,
          renderHeader: () => <ProductsBooleanFilterHeader field={field} label={column.headerName ?? ''} value={booleanFilters[field]} onChange={onBooleanFilterChange} />,
        };
      }
      return column;
    }),
    {
      align: 'center', field: 'view', headerAlign: 'center', headerName: 'Дії',
      sortable: false, filterable: false, width: 80,
      renderCell: ({ row }) => <ProductsViewActionCell product={row} onView={onViewProduct} />,
    },
  ], [booleanFilters, onBooleanFilterChange, onViewProduct, phone, priceFilterable]);
  const paginationModel: GridPaginationModel = { page, pageSize };
  const noRowsOverlay = errorMessage
    ? () => <ProductsDataGridErrorOverlay message={errorMessage} onRetry={onRetry} />
    : () => <ProductsDataGridEmptyOverlay message={emptyMessage} />;

  return (
    <Box sx={{ minWidth: 0, width: '100%' }}>
        <ProductsGridToolbarContext.Provider value={{ categories, categoryId, categoriesLoading, categoriesError, onCategoryChange }}>
        <DataGrid
          autoHeight
          columns={columns}
          columnHeaderHeight={76}
          disableColumnSorting={!sortable}
          disableRowSelectionOnClick
          filterMode="server"
          filterModel={filterModel}
          loading={loading}
          onFilterModelChange={onFilterChange}
          onPaginationModelChange={(model) => {
            if (model.pageSize !== pageSize) {
              onPageSizeChange(model.pageSize);
              return;
            }

            onPageChange(model.page + 1);
          }}
          onSortModelChange={(model) => { if (sortable) onSortChange(toProductsListSort(model)); }}
          pageSizeOptions={[10, 20, 30, 50]}
          pagination
          paginationMode="server"
          paginationModel={paginationModel}
          rowCount={rowCount}
          rowHeight={72}
          rows={errorMessage ? [] : rows}
          showToolbar
          slots={{ noRowsOverlay, toolbar: ProductsGridToolbar }}
          sortingMode="server"
          sortModel={sortable ? toGridSortModel(sort) : []}
          sx={{
            bgcolor: 'background.paper',
            border: 0,
            borderRadius: 0,
            '& .MuiDataGrid-footerContainer': { flexWrap: 'wrap' },
            '& .MuiTablePagination-selectLabel': { display: { xs: 'none', sm: 'block' } },
            '& .MuiTablePagination-toolbar': { px: { xs: 1, sm: 2 } },
          }}
        />
        </ProductsGridToolbarContext.Provider>
    </Box>
  );
}
