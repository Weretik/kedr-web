import { DataGridMessageOverlay, StatusPill } from '@admin/shared/ui';
import { formatSitePrice } from '@admin/site-models/model';
import { Box, Button, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { ProductThumb } from '../common/product-thumb';
import { SiteProblemPills } from '../common/site-problem-pills';

import type { SiteModelListItem } from '@admin/site-models/model';
import type { GridColDef } from '@mui/x-data-grid';

interface SiteModelsDataGridProps {
  rows: readonly SiteModelListItem[];
  rowCount: number;
  page: number;
  pageSize: number;
  loading: boolean;
  error: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRetry: () => void;
  onOpen: (model: SiteModelListItem) => void;
}

function columns(onOpen: (model: SiteModelListItem) => void): GridColDef<SiteModelListItem>[] {
  return [
    {
      field: 'name',
      headerName: 'Модель',
      flex: 1.6,
      minWidth: 260,
      sortable: false,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', py: 1 }}>
          <ProductThumb size={40} src={row.photo} />
          <Stack spacing={0.25} sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 600, overflowWrap: 'anywhere' }} variant="body2">
              {row.name}
            </Typography>
            <Typography color="text.secondary" sx={{ overflowWrap: 'anywhere' }} variant="caption">
              /{row.slug} · {row.categoryName}
            </Typography>
            {row.status === 'proposed' ? (
              <Box>
                <StatusPill label="Запропонована" tone="info" />
              </Box>
            ) : null}
          </Stack>
        </Stack>
      ),
    },
    {
      field: 'axes',
      headerName: 'Ознаки',
      flex: 0.8,
      minWidth: 150,
      sortable: false,
      valueGetter: (_value, row) => (row.axes.length ? row.axes.join(', ') : '—'),
    },
    {
      field: 'productCount',
      headerName: 'Товарів',
      minWidth: 100,
      sortable: false,
      type: 'number',
      valueFormatter: (_value, row) =>
        row.onSiteCount === row.productCount
          ? String(row.productCount)
          : `${row.productCount} (на сайті ${row.onSiteCount})`,
    },
    {
      field: 'minPrice',
      headerName: 'Ціна від',
      minWidth: 110,
      sortable: false,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (value: number | null) => formatSitePrice(value),
    },
    {
      field: 'problems',
      headerName: 'Чого бракує',
      flex: 1.2,
      minWidth: 220,
      sortable: false,
      renderCell: ({ row }) => (
        <Box sx={{ py: 1.25 }}>
          <SiteProblemPills problems={row.problems} />
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Дії',
      minWidth: 110,
      sortable: false,
      align: 'right',
      headerAlign: 'right',
      renderCell: ({ row }) => (
        <Button
          aria-label={`Відкрити модель ${row.name}`}
          onClick={(event) => {
            event.stopPropagation();
            onOpen(row);
          }}
          size="small"
        >
          Відкрити
        </Button>
      ),
    },
  ];
}

/** «Моделі»: models with problems first; a click on a row opens the model card. */
export function SiteModelsDataGrid(props: SiteModelsDataGridProps) {
  return (
    <Box sx={{ minWidth: 0, overflowX: 'auto', width: '100%' }}>
      <Box sx={{ minWidth: 860 }}>
        <DataGrid
          autoHeight
          columns={columns(props.onOpen)}
          disableColumnMenu
          disableRowSelectionOnClick
          getRowHeight={() => 'auto'}
          getRowId={(row) => row.id}
          loading={props.loading}
          onPaginationModelChange={(next) =>
            next.pageSize !== props.pageSize
              ? props.onPageSizeChange(next.pageSize)
              : props.onPageChange(next.page + 1)
          }
          onRowClick={({ row }) => props.onOpen(row)}
          pageSizeOptions={[25, 50, 100]}
          pagination
          paginationMode="server"
          paginationModel={{ page: props.page - 1, pageSize: props.pageSize }}
          rowCount={props.error ? 0 : props.rowCount}
          rows={props.error ? [] : [...props.rows]}
          sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
          slots={{
            noRowsOverlay: () =>
              props.error ? (
                <DataGridMessageOverlay
                  message="Не вдалося завантажити моделі."
                  onRetry={props.onRetry}
                />
              ) : (
                <DataGridMessageOverlay message="Моделей за цими умовами немає." />
              ),
          }}
        />
      </Box>
    </Box>
  );
}
