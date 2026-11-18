import { DataGridMessageOverlay } from '@admin/shared/ui';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';

import { toGridSortModel, toProductsListSort } from './products-data-grid.sort';
import { usePanelWidth } from '../../hooks/use-panel-width';
import { useProductsGridColumns } from '../../hooks/use-products-grid-columns';
import { ProductsGridToolbar } from '../toolbar/products-grid-toolbar';
import { ProductsGridToolbarContext } from '../toolbar/products-grid-toolbar-context';

import type { ProductsDataGridProps } from './products-data-grid.props';
import type { GridPaginationModel } from '@mui/x-data-grid';

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
  onEditProduct,
  onAddProduct,
  page,
  pageSize,
  rowCount,
  rows,
  sort,
  basicFilters = false,
  sortable = true,
}: ProductsDataGridProps) {
  const [panelAnchor, setPanelAnchor] = useState<HTMLDivElement | null>(null);
  const panelWidth = usePanelWidth(panelAnchor);
  const columns = useProductsGridColumns({
    categories,
    booleanFilters,
    onBooleanFilterChange,
    onViewProduct,
    onEditProduct,
    onAddProduct,
    basicFilters,
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
          showFilterPanel: !basicFilters,
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
