import { DataGridMessageOverlay, RowEditAction, StatusPill } from '@admin/shared/ui';
import { formatSitePrice } from '@admin/site-models/model';
import { Box, Link, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { selectedIds, selectionModel } from './row-selection';
import { ProductThumb } from '../common/product-thumb';
import { SiteProblemPills } from '../common/site-problem-pills';

import type { SiteShowcaseItem } from '@admin/site-models/model';
import type { GridColDef } from '@mui/x-data-grid';

interface SiteShowcaseDataGridProps {
  rows: readonly SiteShowcaseItem[];
  rowCount: number;
  page: number;
  pageSize: number;
  loading: boolean;
  error: boolean;
  selected: readonly number[];
  onSelectedChange: (ids: number[]) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRetry: () => void;
  onEdit: (item: SiteShowcaseItem) => void;
  /** In-app path of a model card. */
  modelHref: (modelId: number) => string;
}

function columns(
  onEdit: (item: SiteShowcaseItem) => void,
  modelHref: (id: number) => string,
): GridColDef<SiteShowcaseItem>[] {
  return [
    {
      field: 'photo',
      headerName: 'Фото',
      width: 76,
      sortable: false,
      renderCell: ({ row }) => <ProductThumb src={row.photo} />,
    },
    {
      field: 'name',
      headerName: 'Товар',
      flex: 1.6,
      minWidth: 240,
      sortable: false,
      renderCell: ({ row }) => (
        <Stack spacing={0.25} sx={{ py: 1.25 }}>
          <Typography sx={{ overflowWrap: 'anywhere' }} variant="body2">
            {row.name}
          </Typography>
          <Typography color="text.secondary" variant="caption">
            Код 1С {row.productId} · {row.categoryName}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'model',
      headerName: 'Модель',
      flex: 1,
      minWidth: 180,
      sortable: false,
      renderCell: ({ row }) =>
        row.model ? (
          <Stack spacing={0.5} sx={{ alignItems: 'flex-start', py: 1.25 }}>
            <Link href={modelHref(row.model.id)} sx={{ overflowWrap: 'anywhere' }} variant="body2">
              {row.model.name}
            </Link>
            {row.model.status === 'proposed' ? (
              <StatusPill label="Запропонована" tone="info" />
            ) : null}
          </Stack>
        ) : (
          <Typography color="text.secondary" variant="body2">
            —
          </Typography>
        ),
    },
    {
      field: 'values',
      headerName: 'Ознаки',
      flex: 1,
      minWidth: 180,
      sortable: false,
      renderCell: ({ row }) => (
        <Stack spacing={0.25} sx={{ py: 1.25 }}>
          {row.values.length === 0 ? (
            <Typography color="text.secondary" variant="body2">
              —
            </Typography>
          ) : (
            row.values.map((value) => (
              <Typography key={`${value.attributeId}-${value.value}`} variant="body2">
                <Box component="span" sx={{ color: 'text.secondary' }}>
                  {value.attributeName}:
                </Box>{' '}
                {value.value}
              </Typography>
            ))
          )}
        </Stack>
      ),
    },
    {
      field: 'retailPrice',
      headerName: 'Ціна',
      minWidth: 110,
      sortable: false,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (value: number | null) => formatSitePrice(value),
    },
    {
      field: 'inStock',
      headerName: 'Наявн.',
      minWidth: 100,
      sortable: false,
      renderCell: ({ row }) =>
        row.inStock ? (
          <Typography variant="body2">Є</Typography>
        ) : (
          <Typography color="text.secondary" variant="body2">
            Немає
          </Typography>
        ),
    },
    {
      field: 'problems',
      headerName: 'Чого бракує',
      flex: 1.2,
      minWidth: 200,
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
      width: 70,
      sortable: false,
      align: 'right',
      headerAlign: 'right',
      renderCell: ({ row }) => (
        <RowEditAction
          label={`Змінити ознаки товару ${row.name}`}
          onEdit={() => onEdit(row)}
          title="Змінити ознаки"
        />
      ),
    },
  ];
}

/** «Вітрина сайту»: on-site products, those without a model first. */
export function SiteShowcaseDataGrid(props: SiteShowcaseDataGridProps) {
  const pageIds = props.rows.map((row) => row.productId);
  return (
    <Box sx={{ minWidth: 0, overflowX: 'auto', width: '100%' }}>
      <Box sx={{ minWidth: 960 }}>
        <DataGrid
          autoHeight
          checkboxSelection
          columns={columns(props.onEdit, props.modelHref)}
          disableColumnMenu
          disableRowSelectionOnClick
          getRowHeight={() => 'auto'}
          getRowId={(row) => row.productId}
          keepNonExistentRowsSelected
          loading={props.loading}
          onPaginationModelChange={(next) =>
            next.pageSize !== props.pageSize
              ? props.onPageSizeChange(next.pageSize)
              : props.onPageChange(next.page + 1)
          }
          onRowSelectionModelChange={(model) => props.onSelectedChange(selectedIds(model, pageIds))}
          pageSizeOptions={[25, 50, 100]}
          pagination
          paginationMode="server"
          paginationModel={{ page: props.page - 1, pageSize: props.pageSize }}
          rowCount={props.error ? 0 : props.rowCount}
          rowSelectionModel={selectionModel(props.selected)}
          rows={props.error ? [] : [...props.rows]}
          slots={{
            noRowsOverlay: () =>
              props.error ? (
                <DataGridMessageOverlay
                  message="Не вдалося завантажити товари."
                  onRetry={props.onRetry}
                />
              ) : (
                <DataGridMessageOverlay message="Товарів за цими умовами немає." />
              ),
          }}
        />
      </Box>
    </Box>
  );
}
