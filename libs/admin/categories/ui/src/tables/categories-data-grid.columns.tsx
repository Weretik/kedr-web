import { Box, Typography } from '@mui/material';

import { CategoryViewCell } from './category-view-cell';

import type { AdminCategory } from '@admin/categories/model';
import type { GridColDef } from '@mui/x-data-grid';

const dateFormatter = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'medium', timeStyle: 'short' });

const nameColumn: GridColDef<AdminCategory> = {
  field: 'nameUk',
  headerName: 'Назва',
  flex: 2,
  minWidth: 220,
  renderCell: ({ row }) => (
    // The tree indent follows the level; search can still hide parents.
    <Box sx={{ overflowWrap: 'anywhere', pl: row.level * 2.5, py: 1, whiteSpace: 'normal' }}>
      <Typography component="span" sx={{ fontWeight: row.level === 0 ? 700 : 500 }} variant="body2">
        {row.nameUk}
      </Typography>
    </Box>
  ),
};

const slugColumn: GridColDef<AdminCategory> = {
  field: 'slug',
  headerName: 'Адреса',
  flex: 1.5,
  minWidth: 180,
  renderCell: ({ value }) => (
    <Box
      component="code"
      sx={{ fontSize: '0.8125rem', overflowWrap: 'anywhere', whiteSpace: 'normal' }}
    >
      {value}
    </Box>
  ),
};

const levelColumn: GridColDef<AdminCategory> = {
  field: 'level',
  headerName: 'Рівень',
  type: 'number',
  width: 90,
  valueFormatter: (value: number) => value + 1,
};

const deletedAtColumn: GridColDef<AdminCategory> = {
  field: 'deletedAt',
  headerName: 'Видалено',
  minWidth: 170,
  valueFormatter: (value: string | null) => (value ? dateFormatter.format(new Date(value)) : '—'),
};

export function categoriesColumns(
  mode: 'active' | 'deleted',
  onView: (category: AdminCategory) => void,
): GridColDef<AdminCategory>[] {
  const columns =
    mode === 'deleted'
      ? [nameColumn, slugColumn, deletedAtColumn]
      : [
          nameColumn,
          slugColumn,
          levelColumn,
          {
            align: 'center',
            field: 'actions',
            filterable: false,
            headerAlign: 'center',
            headerName: 'Дії',
            renderCell: ({ row }) => <CategoryViewCell category={row} onView={onView} />,
            width: 80,
          } satisfies GridColDef<AdminCategory>,
        ];

  // Rows keep the tree order from the server; column sorting would break it.
  return columns.map((column) => ({ ...column, sortable: false }));
}
