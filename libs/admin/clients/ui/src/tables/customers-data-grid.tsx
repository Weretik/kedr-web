import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import type { CustomerListItem } from '@admin/clients/model';
import type { GridColDef, GridFilterModel, GridPaginationModel } from '@mui/x-data-grid';

import { CustomerGridViewCell } from './customer-grid-view-cell';
import { CustomersGridMessage } from './customers-grid-message';
import { CustomersGridToolbar } from './customers-grid-toolbar';

interface CustomersDataGridProps {
  error: boolean;
  loading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRetry: () => void;
  onSearchChange: (searchTerm: string | undefined) => void;
  onView: (counterpartyId: string) => void;
  page: number;
  pageSize: number;
  rowCount: number;
  rows: readonly CustomerListItem[];
  searchTerm?: string;
}

export function CustomersDataGrid({
  error,
  loading,
  onPageChange,
  onPageSizeChange,
  onRetry,
  onSearchChange,
  onView,
  page,
  pageSize,
  rowCount,
  rows,
  searchTerm,
}: CustomersDataGridProps) {
  const columns: GridColDef<CustomerListItem>[] = [
    { field: 'name', headerName: 'Клієнт', flex: 1, minWidth: 200, sortable: false, filterable: false },
    {
      field: 'phone', headerName: 'Телефон', flex: 1, minWidth: 160, sortable: false, filterable: false,
      valueFormatter: (value: string | null) => value ?? 'Не вказано',
    },
    { field: 'counterpartyId', headerName: 'ID', minWidth: 130, flex: 1, sortable: false, filterable: false },
    {
      align: 'center',
      field: 'view',
      headerAlign: 'center',
      headerName: 'Дії',
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => <CustomerGridViewCell counterpartyId={row.counterpartyId} name={row.name} onView={onView} />,
    },
  ];
  const filterModel: GridFilterModel = {
    items: [],
    quickFilterValues: searchTerm ? [searchTerm] : [],
  };

  return (
    <Box sx={{ minWidth: 0, width: '100%' }}>
      <DataGrid
        autoHeight
        columns={columns}
        disableColumnFilter
        disableColumnSorting
        disableRowSelectionOnClick
        filterMode="server"
        filterModel={filterModel}
        getRowId={(row) => row.counterpartyId}
        loading={loading}
        onFilterModelChange={(model) => {
          const nextSearchTerm = model.quickFilterValues?.map(String).join(' ').trim().slice(0, 100) || undefined;
          if (nextSearchTerm !== searchTerm) onSearchChange(nextSearchTerm);
        }}
        onPaginationModelChange={(model: GridPaginationModel) => {
          if (loading || (model.page + 1 === page && model.pageSize === pageSize)) return;
          if (model.pageSize !== pageSize) {
            onPageSizeChange(model.pageSize);
            return;
          }
          onPageChange(model.page + 1);
        }}
        onRowClick={({ row }) => onView(row.counterpartyId)}
        pageSizeOptions={[10, 20, 50, 100]}
        pagination
        paginationMode="server"
        paginationModel={{ page: page - 1, pageSize }}
        rowCount={rowCount}
        rows={error ? [] : [...rows]}
        showToolbar
        slots={{
          noRowsOverlay: error ? () => <CustomersGridMessage onRetry={onRetry} /> : () => <CustomersGridMessage />,
          toolbar: CustomersGridToolbar,
        }}
        sx={{
          bgcolor: 'background.paper',
          border: 0,
          borderRadius: 0,
          '& .MuiDataGrid-footerContainer': { flexWrap: 'wrap' },
          '& .MuiTablePagination-selectLabel': { display: { xs: 'none', sm: 'block' } },
          '& .MuiTablePagination-toolbar': { px: { xs: 1, sm: 2 } },
        }}
      />
    </Box>
  );
}
