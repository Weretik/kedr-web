import { attributeKindLabel } from '@admin/catalog-attributes/model';
import { DataGridMessageOverlay, RowEditAction, StatusPill } from '@admin/shared/ui';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import type { CatalogAttribute } from '@admin/catalog-attributes/model';
import type { GridColDef } from '@mui/x-data-grid';

interface CatalogAttributesDataGridProps {
  rows: readonly CatalogAttribute[];
  loading: boolean;
  error: boolean;
  canEdit: boolean;
  onRetry: () => void;
  onOpen: (attribute: CatalogAttribute) => void;
}

function columns(canEdit: boolean, onOpen: (attribute: CatalogAttribute) => void) {
  const result: GridColDef<CatalogAttribute>[] = [
    {
      field: 'nameUk',
      headerName: 'Властивість',
      flex: 1.4,
      minWidth: 220,
      renderCell: ({ row }) => (
        <Stack spacing={0.5} sx={{ py: 1.5 }}>
          <Typography sx={{ fontWeight: 600, overflowWrap: 'anywhere' }} variant="body2">
            {row.nameUk}
          </Typography>
          <Typography color="text.secondary" variant="caption">
            {row.code}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'kind',
      headerName: 'Тип',
      minWidth: 110,
      valueGetter: (_value, row) => attributeKindLabel(row.kind),
    },
    { field: 'valueCount', headerName: 'Значень', minWidth: 100, type: 'number' },
    { field: 'productCount', headerName: 'Товарів', minWidth: 100, type: 'number' },
    {
      field: 'isFilterable',
      headerName: 'Фільтр на сайті',
      minWidth: 150,
      valueGetter: (_value, row) => (row.isFilterable ? 'Так' : 'Ні'),
    },
    {
      field: 'isEditedManually',
      headerName: 'Зміни',
      minWidth: 150,
      sortable: false,
      renderCell: ({ row }) =>
        row.isEditedManually ? <StatusPill label="Змінено вручну" tone="neutral" /> : null,
    },
    {
      field: 'actions',
      headerName: 'Дії',
      align: 'right',
      headerAlign: 'right',
      minWidth: 80,
      sortable: false,
      renderCell: ({ row }) =>
        canEdit ? (
          <RowEditAction
            label={`Редагувати властивість ${row.nameUk}`}
            onEdit={() => onOpen(row)}
            title="Редагувати властивість"
          />
        ) : (
          <Tooltip title="Переглянути властивість">
            <IconButton
              aria-label={`Переглянути властивість ${row.nameUk}`}
              onClick={() => onOpen(row)}
              size="small"
            >
              <VisibilityOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ),
    },
  ];
  return result;
}

/** The product properties from the dictionary, in their site order. */
export function CatalogAttributesDataGrid({
  canEdit,
  error,
  loading,
  onOpen,
  onRetry,
  rows,
}: CatalogAttributesDataGridProps) {
  return (
    <Box sx={{ minWidth: 0, width: '100%' }}>
      <DataGrid
        autoHeight
        columns={columns(canEdit, onOpen)}
        disableColumnMenu
        disableRowSelectionOnClick
        getRowHeight={() => 'auto'}
        hideFooter
        loading={loading}
        rows={error ? [] : [...rows]}
        slots={{
          noRowsOverlay: () =>
            error ? (
              <DataGridMessageOverlay message="Не вдалося завантажити ознаки." onRetry={onRetry} />
            ) : (
              <DataGridMessageOverlay message="Ознак ще немає: запустіть імпорт словника." />
            ),
        }}
      />
    </Box>
  );
}
