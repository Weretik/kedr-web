import { DataGridMessageOverlay } from '@admin/shared/ui';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import { Box, IconButton, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { ProductPickerToolbar } from './product-picker-toolbar';

import type { GridColDef } from '@mui/x-data-grid';

export interface ProductPickerRow {
  id: number;
  name: string;
  price: number | null;
}

interface ProductPickerGridProps {
  rows: readonly ProductPickerRow[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  onAdd: (row: ProductPickerRow) => void;
}

const money = new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' });

export function ProductPickerGrid({
  rows,
  loading,
  error,
  onRetry,
  onAdd,
}: ProductPickerGridProps) {
  const columns: GridColDef<ProductPickerRow>[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 110,
      type: 'string',
      valueGetter: (value) => String(value),
    },
    { field: 'name', headerName: 'Назва', flex: 1, minWidth: 220 },
    {
      field: 'price',
      headerName: 'Ціна',
      width: 140,
      type: 'number',
      valueFormatter: (value: number | null) => (value == null ? '—' : money.format(value)),
    },
    {
      align: 'center',
      field: 'add',
      headerAlign: 'center',
      headerName: 'Дії',
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Tooltip title="Додати">
          <IconButton aria-label={`Додати ${row.name}`} color="primary" onClick={() => onAdd(row)}>
            <AddShoppingCartOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];
  return (
    <Box sx={{ minWidth: 0, width: '100%' }}>
      <DataGrid
        autoHeight
        columns={columns}
        disableColumnFilter
        disableRowSelectionOnClick
        initialState={{ pagination: { paginationModel: { pageSize: 50 } } }}
        loading={loading}
        pageSizeOptions={[20, 50, 100]}
        pagination
        rows={error ? [] : [...rows]}
        showToolbar
        slots={{
          noRowsOverlay: error
            ? () => (
                <DataGridMessageOverlay
                  message="Не вдалося завантажити товари."
                  onRetry={onRetry}
                />
              )
            : () => <DataGridMessageOverlay message="Товарів немає." />,
          toolbar: ProductPickerToolbar,
        }}
      />
    </Box>
  );
}
