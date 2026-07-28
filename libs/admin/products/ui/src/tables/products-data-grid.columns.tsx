import { ProductsDataGridFlagsCell } from './cells/products-data-grid-flags-cell';
import { ProductsDataGridNameCell } from './cells/products-data-grid-name-cell';
import { ProductsDataGridPhotoCell } from './cells/products-data-grid-photo-cell';
import { ProductsDataGridStockCell } from './cells/products-data-grid-stock-cell';

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
    width: 80,
  },
  { field: 'id', headerName: 'ID', width: 84 },
  {
    field: 'name',
    flex: 1,
    headerName: 'Товар',
    minWidth: 220,
    renderCell: ProductsDataGridNameCell,
    valueGetter: (_value, row) => row.nameUk,
  },
  {
    align: 'right',
    field: 'price',
    headerAlign: 'right',
    headerName: 'Ціна',
    valueFormatter: (value) => (value == null ? '—' : priceFormatter.format(value)),
    width: 140,
  },
  {
    field: 'inStock',
    headerName: 'Наявність',
    renderCell: ProductsDataGridStockCell,
    sortable: false,
    width: 128,
  },
  {
    field: 'flags',
    headerName: 'Ознаки',
    renderCell: ProductsDataGridFlagsCell,
    sortable: false,
    width: 176,
  },
];
