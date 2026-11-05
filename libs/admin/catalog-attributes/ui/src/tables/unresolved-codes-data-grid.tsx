import { DataGridMessageOverlay, StatusPill } from '@admin/shared/ui';
import { Box, Button, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import type { UnresolvedCode } from '@admin/catalog-attributes/model';
import type { GridColDef } from '@mui/x-data-grid';

interface UnresolvedCodesDataGridProps {
  rows: readonly UnresolvedCode[];
  loading: boolean;
  error: boolean;
  canEdit: boolean;
  onRetry: () => void;
  onDecide: (code: UnresolvedCode) => void;
}

function columns(canEdit: boolean, onDecide: (code: UnresolvedCode) => void) {
  const result: GridColDef<UnresolvedCode>[] = [
    {
      field: 'rawValue',
      headerName: 'Код',
      minWidth: 120,
      renderCell: ({ row }) => (
        <Typography sx={{ fontFamily: 'monospace', fontWeight: 700 }} variant="body2">
          {row.rawValue}
        </Typography>
      ),
    },
    { field: 'attributeName', headerName: 'Властивість', flex: 1, minWidth: 180 },
    {
      field: 'valueName',
      headerName: 'Стан',
      flex: 1.2,
      minWidth: 220,
      sortable: false,
      renderCell: ({ row }) => (
        <Stack spacing={0.5} sx={{ alignItems: 'flex-start', py: 1.5 }}>
          {row.valueId === null ? (
            <StatusPill label="Не розшифровано" tone="error" />
          ) : (
            <StatusPill label={`Припущення: ${row.valueName ?? ''}`} tone="warning" />
          )}
          {row.note ? (
            <Typography color="text.secondary" sx={{ overflowWrap: 'anywhere' }} variant="caption">
              {row.note}
            </Typography>
          ) : null}
        </Stack>
      ),
    },
    { field: 'scope', headerName: 'Де діє', minWidth: 120 },
    { field: 'productCount', headerName: 'Товарів', minWidth: 100, type: 'number' },
  ];
  if (canEdit)
    result.push({
      field: 'actions',
      headerName: 'Дії',
      align: 'right',
      headerAlign: 'right',
      minWidth: 150,
      sortable: false,
      renderCell: ({ row }) => (
        <Button
          aria-label={`Розшифрувати код ${row.rawValue}`}
          onClick={() => onDecide(row)}
          size="small"
        >
          Розшифрувати
        </Button>
      ),
    });
  return result;
}

/** Codes from 1C names that nobody has decoded or confirmed, the most used first. */
export function UnresolvedCodesDataGrid({
  canEdit,
  error,
  loading,
  onDecide,
  onRetry,
  rows,
}: UnresolvedCodesDataGridProps) {
  return (
    <Box sx={{ minWidth: 0, width: '100%' }}>
      <DataGrid
        autoHeight
        columns={columns(canEdit, onDecide)}
        disableColumnMenu
        disableRowSelectionOnClick
        getRowHeight={() => 'auto'}
        getRowId={(row) => row.aliasId}
        initialState={{
          pagination: { paginationModel: { pageSize: 50 } },
          sorting: { sortModel: [{ field: 'productCount', sort: 'desc' }] },
        }}
        loading={loading}
        pageSizeOptions={[25, 50, 100]}
        rows={error ? [] : [...rows]}
        slots={{
          noRowsOverlay: () =>
            error ? (
              <DataGridMessageOverlay message="Не вдалося завантажити коди." onRetry={onRetry} />
            ) : (
              <DataGridMessageOverlay message="Нерозшифрованих кодів немає." />
            ),
        }}
      />
    </Box>
  );
}
