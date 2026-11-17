import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useMemo } from 'react';

import { ProductsBooleanFilterHeader } from '../tables/cells/products-boolean-filter-header';
import { ProductsViewActionCell } from '../tables/cells/products-view-action-cell';
import { productCategoryPath } from '../tables/grid/product-category-path';
import { productsDataGridColumns } from '../tables/grid/products-data-grid.columns';

import type { ProductBooleanField } from '../tables/cells/products-boolean-filter-header';
import type { AdminProductListItem, ProductCategoryOption } from '@admin/products/model';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

/** Columns whose header holds a yes/no filter, and the query field it sets. */
const headerFilterFields: Readonly<Record<string, ProductBooleanField>> = {
  stock: 'hasStock',
  inStock: 'inStock',
  isSale: 'isSale',
  isNew: 'isNew',
};
/** The only header filter in basic mode («Без фото»), where the server list has no other flags. */
const basicHeaderFilterFields: readonly ProductBooleanField[] = ['hasStock'];

export interface ProductsGridColumnsOptions {
  categories: readonly ProductCategoryOption[];
  booleanFilters: Partial<Record<ProductBooleanField, boolean>>;
  onBooleanFilterChange: (field: ProductBooleanField, value: boolean | undefined) => void;
  onViewProduct: (product: AdminProductListItem) => void;
  onEditProduct?: (product: AdminProductListItem) => void;
  onAddProduct?: (product: AdminProductListItem) => void;
  /** «Без фото»: no price filter and only the stock header filter. */
  basicFilters: boolean;
}

/** Static product columns plus the category path, boolean filter headers, and the actions column. */
export function useProductsGridColumns({
  categories,
  booleanFilters,
  onBooleanFilterChange,
  onViewProduct,
  onEditProduct,
  onAddProduct,
  basicFilters,
}: ProductsGridColumnsOptions) {
  const theme = useTheme();
  const phone = useMediaQuery(theme.breakpoints.down('sm'));
  const categoriesById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  );
  return useMemo<GridColDef<AdminProductListItem>[]>(
    () => [
      ...productsDataGridColumns.map((column) => {
        if (column.field === 'name') return { ...column, minWidth: phone ? 140 : 180 };
        if (column.field === 'category')
          return {
            ...column,
            type: 'string' as const,
            valueGetter: (_value: unknown, row: AdminProductListItem) =>
              productCategoryPath(row, categoriesById),
            renderCell: ({ value }: GridRenderCellParams<AdminProductListItem>) => (
              <Box sx={{ overflowWrap: 'anywhere', py: 1, whiteSpace: 'normal', width: '100%' }}>
                {value}
              </Box>
            ),
          };
        if (column.field === 'price' && basicFilters) return { ...column, filterable: false };
        const field = headerFilterFields[column.field];
        if (field && (!basicFilters || basicHeaderFilterFields.includes(field))) {
          return {
            ...column,
            renderHeader: () => (
              <ProductsBooleanFilterHeader
                field={field}
                label={column.headerName ?? ''}
                value={booleanFilters[field]}
                onChange={onBooleanFilterChange}
              />
            ),
          };
        }
        return column;
      }),
      {
        align: 'center',
        field: 'view',
        headerAlign: 'center',
        headerName: 'Дії',
        sortable: false,
        filterable: false,
        width: 80 + 44 * ((onEditProduct ? 1 : 0) + (onAddProduct ? 1 : 0)),
        renderCell: ({ row }) => (
          <ProductsViewActionCell
            product={row}
            onView={onViewProduct}
            onEdit={onEditProduct}
            onAdd={onAddProduct}
          />
        ),
      },
    ],
    [
      booleanFilters,
      categoriesById,
      onAddProduct,
      onBooleanFilterChange,
      onEditProduct,
      onViewProduct,
      phone,
      basicFilters,
    ],
  );
}
