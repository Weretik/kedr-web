import { getGridNumericOperators } from '@mui/x-data-grid';

import { ProductsDataGridBooleanCell } from './cells/products-data-grid-boolean-cell';
import { ProductsDataGridNameCell } from './cells/products-data-grid-name-cell';
import { ProductsDataGridPhotoCell } from './cells/products-data-grid-photo-cell';

import type { AdminProductListItem } from '@admin/products/model';
import type { GridColDef } from '@mui/x-data-grid';

const priceFormatter = new Intl.NumberFormat('uk-UA', {
  currency: 'UAH',
  maximumFractionDigits: 2,
  style: 'currency',
});

export const productsDataGridColumns: readonly GridColDef<AdminProductListItem>[] = [
  {
    field: 'photo',
    filterable: false,
    headerName: 'Фото',
    renderCell: ProductsDataGridPhotoCell,
    sortable: false,
    width: 88,
  },
  { field: 'id', headerName: 'ID', width: 72, filterable: false },
  {
    field: 'name',
    flex: 1,
    headerName: 'Товар',
    minWidth: 180,
    renderCell: ProductsDataGridNameCell,
    valueGetter: (_value, row) => row.nameUk,
    filterable: false,
  },
  {
    field: 'category',
    filterable: false,
    flex: 0.7,
    headerName: 'Категорія',
    minWidth: 160,
  },
  {
    align: 'right',
    field: 'price',
    type: 'number',
    headerAlign: 'right',
    headerName: 'Ціна (роздріб)',
    valueFormatter: (value) => (value == null ? '—' : priceFormatter.format(value)),
    filterOperators: getGridNumericOperators().filter(
      (operator) => operator.value === '>=' || operator.value === '<=' || operator.value === '=',
    ),
    width: 116,
  },
  {
    align: 'center',
    field: 'inStock',
    type: 'boolean',
    filterable: false,
    headerAlign: 'center',
    headerName: 'Наявність',
    renderCell: ProductsDataGridBooleanCell,
    sortable: false,
    width: 110,
  },
  {
    align: 'center',
    field: 'isSale',
    type: 'boolean',
    filterable: false,
    headerAlign: 'center',
    headerName: 'Акція',
    renderCell: ProductsDataGridBooleanCell,
    sortable: false,
    width: 96,
  },
  {
    align: 'center',
    field: 'isNew',
    type: 'boolean',
    filterable: false,
    headerAlign: 'center',
    headerName: 'Новинка',
    renderCell: ProductsDataGridBooleanCell,
    sortable: false,
    width: 104,
  },
];
