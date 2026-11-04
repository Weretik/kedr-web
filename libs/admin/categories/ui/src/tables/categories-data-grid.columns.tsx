import { Box, Typography } from '@mui/material';

import type { AdminCategory } from '@admin/categories/model';
import type { GridColDef } from '@mui/x-data-grid';

const dateFormatter = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'medium', timeStyle: 'short' });

const nameColumn: GridColDef<AdminCategory> = {
  field: 'nameUk',
  headerName: 'Назва',
  flex: 2,
  minWidth: 220,
  renderCell: ({ row }) => (
    <Box sx={{ overflowWrap: 'anywhere', py: 1, whiteSpace: 'normal' }}>
      <Typography component="span" sx={{ fontWeight: 600 }} variant="body2">
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

const deletedAtColumn: GridColDef<AdminCategory> = {
  field: 'deletedAt',
  headerName: 'Видалено',
  minWidth: 170,
  valueFormatter: (value: string | null) => (value ? dateFormatter.format(new Date(value)) : '—'),
};

/** Deleted rows keep the server order (newest first), so the columns are not sortable. */
export const deletedCategoriesColumns: GridColDef<AdminCategory>[] = [
  nameColumn,
  slugColumn,
  deletedAtColumn,
].map((column) => ({ ...column, sortable: false }));
