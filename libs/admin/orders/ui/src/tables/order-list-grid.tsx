import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Alert, Box, Button, IconButton, Stack, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { OrderGridToolbar, OrderGridToolbarContext } from './order-grid-toolbar';

import type { DraftSummary, OrderSummary } from '@admin/orders/model';
import type { GridColDef, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';

interface OrderListGridProps {
  mode: 'orders' | 'drafts'; rows: OrderSummary[] | DraftSummary[]; rowCount: number;
  loading: boolean; error: boolean; search: string;
  createdFrom: string; createdTo: string; hideSearch: boolean; hideCustomerColumn: boolean;
  page: number; pageSize: number; sort: string;
  onSearch: (value: string) => void; onPage: (page: number) => void;
  onDateChange: (from: string, to: string) => void;
  onPageSize: (size: number) => void; onSort: (sort: string) => void;
  onView: (id: number) => void; onEdit?: (id: number) => void;
  onDelete?: (row: DraftSummary) => void; onRetry: () => void;
}
const dateFormat = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'medium', timeStyle: 'short' });
const moneyFormat = new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' });
const apiSortToGridField: Record<string, string> = {
  customerName: 'counterpartyName', createdAt: 'createdAtUtc', updatedAt: 'updatedAtUtc',
};
const gridFieldToApiSort: Record<string, string> = {
  counterpartyName: 'customerName', createdAtUtc: 'createdAt', updatedAtUtc: 'updatedAt',
};
export function OrderListGrid(props: OrderListGridProps) {
  const orders = props.mode === 'orders';
  const columns: GridColDef[] = orders ? [
    { field: 'orderNumber', headerName: 'Номер', minWidth: 150, flex: 1 },
    ...(!props.hideCustomerColumn ? [{ field: 'counterpartyName', headerName: 'Клієнт', minWidth: 180, flex: 1 } satisfies GridColDef] : []),
    { field: 'createdAtUtc', headerName: 'Створено', minWidth: 180, flex: 1, valueFormatter: (value: string) => dateFormat.format(new Date(value)) },
    { field: 'totalAmount', headerName: 'Сума', minWidth: 130, flex: 0.7, valueFormatter: (value: number) => moneyFormat.format(value) },
    { field: 'syncStatus', headerName: '1C', minWidth: 130, flex: 0.7, sortable: false },
  ] : [
    { field: 'title', headerName: 'Назва', minWidth: 180, flex: 1 },
    { field: 'counterpartyName', headerName: 'Клієнт', minWidth: 180, flex: 1 },
    { field: 'updatedAtUtc', headerName: 'Оновлено', minWidth: 180, flex: 1, valueFormatter: (value: string) => dateFormat.format(new Date(value)) },
    { field: 'lineCount', headerName: 'Позицій', minWidth: 110, flex: 0.5, sortable: false },
  ];
  columns.push({
    field: 'actions', headerName: 'Дії', minWidth: orders ? 76 : 144,
    sortable: false, filterable: false, align: 'center', headerAlign: 'center',
    renderCell: ({ row }) => {
      const id = orders ? (row as OrderSummary).orderId : (row as DraftSummary).draftId;
      const label = orders ? (row as OrderSummary).orderNumber : (row as DraftSummary).title;
      return <Stack direction="row">
        <Tooltip title="Переглянути"><IconButton aria-label={`Переглянути ${label}`} onClick={() => props.onView(id)} size="small"><VisibilityOutlinedIcon fontSize="small" /></IconButton></Tooltip>
        {!orders && props.onEdit && <Tooltip title="Редагувати"><IconButton aria-label={`Редагувати ${label}`} onClick={() => props.onEdit?.(id)} size="small"><EditOutlinedIcon fontSize="small" /></IconButton></Tooltip>}
        {!orders && props.onDelete && <Tooltip title="Видалити"><IconButton aria-label={`Видалити ${label}`} onClick={() => props.onDelete?.(row as DraftSummary)} size="small"><DeleteOutlineIcon fontSize="small" /></IconButton></Tooltip>}
      </Stack>;
    },
  });
  const field = apiSortToGridField[props.sort.replace(/^-/, '')] ?? props.sort.replace(/^-/, '');
  const sortModel: GridSortModel = [{ field, sort: props.sort.startsWith('-') ? 'desc' : 'asc' }];
  const model: GridPaginationModel = { page: props.page - 1, pageSize: props.pageSize };
  return <Box sx={{ minWidth: 0 }}>
    {props.error && <Alert action={<Button onClick={props.onRetry}>Повторити</Button>} severity="error" sx={{ mx: 2 }}>Не вдалося завантажити записи.</Alert>}
    <OrderGridToolbarContext.Provider value={{ mode: props.mode, search: props.search, onSearch: props.onSearch, createdFrom: props.createdFrom, createdTo: props.createdTo, hideSearch: props.hideSearch, onDateChange: props.onDateChange }}>
    <Box sx={{ overflowX: 'auto' }}><Box sx={{ minWidth: 700 }}>
    <DataGrid
      autoHeight columns={columns} disableRowSelectionOnClick getRowId={(row) => orders ? row.orderId : row.draftId}
      loading={props.loading} onPaginationModelChange={(next) => next.pageSize !== props.pageSize ? props.onPageSize(next.pageSize) : props.onPage(next.page + 1)}
      filterMode="server" filterModel={{ items: [], quickFilterValues: props.search ? [props.search] : [] }}
      onSortModelChange={(next) => { const entry = next[0]; if (entry?.sort) props.onSort(`${entry.sort === 'desc' ? '-' : ''}${gridFieldToApiSort[entry.field] ?? entry.field}`); }}
      pageSizeOptions={[10, 20, 30, 50]} pagination paginationMode="server" paginationModel={model}
      rowCount={props.rowCount} rows={props.error ? [] : props.rows} sortingMode="server" sortModel={sortModel}
      showToolbar slots={{ toolbar: OrderGridToolbar }}
      sx={{ border: 0, '& .MuiDataGrid-footerContainer': { flexWrap: 'wrap' } }}
    />
    </Box></Box></OrderGridToolbarContext.Provider>
  </Box>;
}
