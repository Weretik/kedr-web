import { DataGridMessageOverlay } from '@admin/shared/ui';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';

import { toGridSortModel, toProductsListSort } from './products-data-grid.sort';
import { usePanelWidth } from '../hooks/use-panel-width';
import { useProductsGridColumns } from '../hooks/use-products-grid-columns';
import { ProductsGridToolbar } from './toolbar/products-grid-toolbar';
import { ProductsGridToolbarContext } from './toolbar/products-grid-toolbar-context';

import type { ProductBooleanField } from './cells/products-boolean-filter-header';
import type {
  AdminProductListItem,
  ProductCategoryOption,
  ProductsListSort,
} from '@admin/products/model';
import type { GridFilterModel, GridPaginationModel } from '@mui/x-data-grid';

type BooleanFilterField = ProductBooleanField;

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
  onAddProduct?: (product: AdminProductListItem) => void;
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
  onAddProduct,
  page,
  pageSize,
  rowCount,
  rows,
  sort,
  priceFilterable,
  sortable = true,
}: ProductsDataGridProps) {
  const [panelAnchor, setPanelAnchor] = useState<HTMLDivElement | null>(null);
  const panelWidth = usePanelWidth(panelAnchor);
  const columns = useProductsGridColumns({
    categories,
    booleanFilters,
    onBooleanFilterChange,
    onViewProduct,
    onAddProduct,
    priceFilterable,
  });
  const paginationModel: GridPaginationModel = { page, pageSize };
  const noRowsOverlay = errorMessage
    ? () => <DataGridMessageOverlay message={errorMessage} onRetry={onRetry} />
    : () => <DataGridMessageOverlay message={emptyMessage ?? 'Товарів немає.'} />;

  return (
    <Box sx={{ minWidth: 0, width: '100%' }}>
      <ProductsGridToolbarContext.Provider
        value={{
          categories,
          categoryId,
          categoriesLoading,
          categoriesError,
          onCategoryChange,
          setPanelAnchor,
        }}
      >
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
          onSortModelChange={(model) => {
            if (sortable) onSortChange(toProductsListSort(model));
          }}
          pageSizeOptions={[10, 20, 30, 50]}
          pagination
          paginationMode="server"
          paginationModel={paginationModel}
          rowCount={rowCount}
          getRowHeight={() => 'auto'}
          getEstimatedRowHeight={() => 72}
          rows={errorMessage ? [] : rows}
          showToolbar
          slotProps={{
            panel: { target: panelAnchor },
            basePopper: { style: { maxWidth: panelWidth } },
            filterPanel: {
              sx: {
                maxWidth: panelWidth,
                '& .MuiDataGrid-filterForm': { flexWrap: 'wrap' },
              },
            },
          }}
          slots={{ noRowsOverlay, toolbar: ProductsGridToolbar }}
          sortingMode="server"
          sortModel={sortable ? toGridSortModel(sort) : []}
        />
      </ProductsGridToolbarContext.Provider>
    </Box>
  );
}
