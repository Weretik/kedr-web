import { DataGridMessageOverlay } from '@admin/shared/ui';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Box } from '@mui/material';
import { DataGrid, GridToolbarContainer, QuickFilter, QuickFilterControl } from '@mui/x-data-grid';

import type { AdminProductListItem } from '@admin/products/model';
import type { GridColDef, GridFilterModel } from '@mui/x-data-grid';

const dateFormatter = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'medium', timeStyle: 'short' });

const columns: GridColDef<AdminProductListItem>[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'nameUk', headerName: 'Назва', flex: 2, minWidth: 220 },
  { field: 'categoryName', headerName: 'Категорія', flex: 1, minWidth: 160 },
  {
    field: 'deletedAt',
    headerName: 'Видалено',
    minWidth: 170,
    valueFormatter: (value: string | null) => (value ? dateFormatter.format(new Date(value)) : '—'),
  },
].map((column) => ({ ...column, filterable: false, sortable: false }));

function DeletedProductsToolbar() {
  return (
    <GridToolbarContainer sx={{ px: 2, py: 1 }}>
      <Box sx={{ maxWidth: '100%', width: { xs: '100%', sm: 320 } }}>
        <QuickFilter expanded debounceMs={300}>
          <QuickFilterControl
            fullWidth
            placeholder="Назва або ID"
            size="small"
            slotProps={{
              htmlInput: { 'aria-label': 'Пошук видалених товарів' },
              input: { startAdornment: <SearchOutlinedIcon aria-hidden="true" fontSize="small" /> },
            }}
          />
        </QuickFilter>
      </Box>
    </GridToolbarContainer>
  );
}

interface DeletedProductsDataGridProps {
  rows: readonly AdminProductListItem[];
  rowCount: number;
  page: number;
  pageSize: number;
  searchTerm?: string;
  loading: boolean;
  errorMessage?: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSearchChange: (searchTerm: string | undefined) => void;
  onRetry: () => void;
}

/** Products the 1C import soft-deleted, newest first; the server supports search and paging only. */
export function DeletedProductsDataGrid({
  errorMessage,
  loading,
  onPageChange,
  onPageSizeChange,
  onRetry,
  onSearchChange,
  page,
  pageSize,
  rowCount,
  rows,
  searchTerm,
}: DeletedProductsDataGridProps) {
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
        disableColumnMenu
        disableRowSelectionOnClick
        filterMode="server"
        filterModel={filterModel}
        loading={loading}
        onFilterModelChange={(model) => {
          const next =
            model.quickFilterValues?.map(String).join(' ').trim().slice(0, 100) || undefined;
          if (next !== searchTerm) onSearchChange(next);
        }}
        onPaginationModelChange={(model) => {
          if (model.pageSize !== pageSize) {
            onPageSizeChange(model.pageSize);
            return;
          }
          onPageChange(model.page + 1);
        }}
        pageSizeOptions={[10, 20, 30, 50]}
        pagination
        paginationMode="server"
        paginationModel={{ page, pageSize }}
        rowCount={rowCount}
        rows={errorMessage ? [] : [...rows]}
        showToolbar
        slots={{
          noRowsOverlay: () =>
            errorMessage ? (
              <DataGridMessageOverlay message={errorMessage} onRetry={onRetry} />
            ) : (
              <DataGridMessageOverlay message="Видалених товарів немає." />
            ),
          toolbar: DeletedProductsToolbar,
        }}
      />
    </Box>
  );
}
