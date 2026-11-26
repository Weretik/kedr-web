import { categoryProblems } from '@admin/categories/model';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';

import { CategoryExpandCell } from './category-expand-cell';
import { CategoryNameCell } from './category-name-cell';
import { CategorySiteSwitch } from './category-site-switch';
import { CategoryProblemPills } from '../../components/category-problem-pills';

import type { AdminCategory, CategoryTableRow } from '@admin/categories/model';
import type { GridColDef } from '@mui/x-data-grid';

export interface CategoryTreeActions {
  onToggleOpen: (categoryId: number) => void;
  /** Administrators only. */
  onToggleSite?: (category: AdminCategory) => void;
}

const fixed = { sortable: false, filterable: false, disableColumnMenu: true } as const;
const count = (value: number | null) => (value === null ? '—' : value);

/** Columns of the category tree table (spec 003 R-001): no checkbox column, tree order. */
export function categoryTreeColumns({
  onToggleOpen,
  onToggleSite,
}: CategoryTreeActions): GridColDef<CategoryTableRow>[] {
  return [
    {
      ...fixed,
      field: 'open',
      headerName: '',
      width: 52,
      renderCell: ({ row }) =>
        row.hasChildren ? (
          <CategoryExpandCell
            name={row.category.nameUk}
            onToggle={() => onToggleOpen(row.id)}
            open={row.open}
          />
        ) : null,
    },
    {
      ...fixed,
      field: 'name',
      headerName: 'Назва на сайті',
      flex: 1.3,
      minWidth: 220,
      renderCell: ({ row }) => <CategoryNameCell row={row} />,
    },
    {
      ...fixed,
      field: 'path',
      headerName: 'Повний шлях',
      flex: 1,
      minWidth: 180,
      renderCell: ({ row }) => (
        <Typography color="text.secondary" sx={{ py: 1, whiteSpace: 'normal' }} variant="body2">
          {row.path.length > 0 ? row.path.join(' › ') : '—'}
        </Typography>
      ),
    },
    {
      ...fixed,
      field: 'sourceName',
      headerName: 'Назва в 1С',
      flex: 1,
      minWidth: 180,
      valueGetter: (_value, row) => row.category.sourceName,
      renderCell: ({ value }) => (
        <Box sx={{ overflowWrap: 'anywhere', py: 1, whiteSpace: 'normal' }}>{value as string}</Box>
      ),
    },
    {
      ...fixed,
      field: 'id',
      headerName: 'ID',
      width: 84,
      renderCell: ({ row }) => (
        <Box component="code" sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>
          {row.id}
        </Box>
      ),
    },
    {
      ...fixed,
      field: 'site',
      headerName: 'На сайті',
      width: 96,
      renderCell: ({ row }) => (
        <CategorySiteSwitch category={row.category} onToggle={onToggleSite} />
      ),
    },
    {
      ...fixed,
      field: 'productCount',
      headerName: 'Товарів',
      align: 'right',
      headerAlign: 'right',
      width: 90,
      valueGetter: (_value, row) => count(row.category.productCount),
    },
    {
      ...fixed,
      field: 'modelCount',
      headerName: 'Моделей',
      align: 'right',
      headerAlign: 'right',
      width: 96,
      valueGetter: (_value, row) => count(row.category.modelCount),
    },
    {
      ...fixed,
      field: 'problems',
      headerName: 'Чого бракує',
      flex: 1,
      minWidth: 190,
      renderCell: ({ row }) => (
        <CategoryProblemPills problems={categoryProblems(row.category, !row.hasChildren)} />
      ),
    },
    {
      ...fixed,
      field: 'actions',
      headerName: 'Дії',
      width: 64,
      renderCell: ({ row }) => (
        <Tooltip title="Відкрити категорію">
          <IconButton
            aria-label={`Відкрити категорію ${row.category.nameUk}`}
            href={`/categories/${row.id}`}
            size="small"
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];
}
