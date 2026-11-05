import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useMemo } from 'react';

import { ProductsBooleanFilterHeader } from '../tables/cells/products-boolean-filter-header';
import { ProductsViewActionCell } from '../tables/cells/products-view-action-cell';
import { productCategoryPath } from '../tables/product-category-path';
import { productsDataGridColumns } from '../tables/products-data-grid.columns';

import type { ProductBooleanField } from '../tables/cells/products-boolean-filter-header';
import type { AdminProductListItem, ProductCategoryOption } from '@admin/products/model';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

const booleanFields: readonly string[] = ['inStock', 'isSale', 'isNew'];

/** «Група»: the variant group of the product; a dash when it has none. */
const groupColumn: GridColDef<AdminProductListItem> = {
  field: 'groupName',
  filterable: false,
  sortable: false,
  flex: 0.6,
  headerName: 'Група',
  minWidth: 140,
  renderCell: ({ row }) => (
    <Box sx={{ overflowWrap: 'anywhere', py: 1, whiteSpace: 'normal', width: '100%' }}>
      {row.groupName ?? '—'}
    </Box>
  ),
};

export interface ProductsGridColumnsOptions {
  categories: readonly ProductCategoryOption[];
  booleanFilters: Partial<Record<ProductBooleanField, boolean>>;
  onBooleanFilterChange: (field: ProductBooleanField, value: boolean | undefined) => void;
  onViewProduct: (product: AdminProductListItem) => void;
  onEditProduct?: (product: AdminProductListItem) => void;
  onAddProduct?: (product: AdminProductListItem) => void;
  priceFilterable: boolean;
  /** Adds the «Група» column after the category. */
  showGroup?: boolean;
}

/** Static product columns plus the category path, boolean filter headers, and the actions column. */
export function useProductsGridColumns({
  categories,
  booleanFilters,
  onBooleanFilterChange,
  onViewProduct,
  onEditProduct,
  onAddProduct,
  priceFilterable,
  showGroup = false,
}: ProductsGridColumnsOptions) {
  const theme = useTheme();
  const phone = useMediaQuery(theme.breakpoints.down('sm'));
  const categoriesById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  );
  return useMemo<GridColDef<AdminProductListItem>[]>(
    () => [
      ...productsDataGridColumns
        .map((column) => {
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
          if (column.field === 'price' && !priceFilterable) return { ...column, filterable: false };
          if (booleanFields.includes(column.field)) {
            const field = column.field as ProductBooleanField;
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
        })
        .flatMap((column) =>
          column.field === 'category' && showGroup ? [column, groupColumn] : [column],
        ),
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
      priceFilterable,
      showGroup,
    ],
  );
}
