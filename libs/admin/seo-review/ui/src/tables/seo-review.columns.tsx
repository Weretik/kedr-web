import { seoIssueLabels, seoReviewKindLabels } from '@admin/seo-review/model';
import { RowEditAction } from '@admin/shared/ui';
import { Chip, Stack } from '@mui/material';

import type { SeoReviewItem } from '@admin/seo-review/model';
import type { GridColDef } from '@mui/x-data-grid';

const fixed = { sortable: false, filterable: false, disableColumnMenu: true } as const;

/** Rows come ordered by kind and name (filterSeoReview), so no column sorts. */
export function seoReviewColumns(
  onOpen: (item: SeoReviewItem) => void,
): GridColDef<SeoReviewItem>[] {
  return [
    {
      ...fixed,
      field: 'kind',
      headerName: 'Сторінка',
      width: 120,
      valueGetter: (_value, row) => seoReviewKindLabels[row.kind],
    },
    { ...fixed, field: 'name', headerName: 'Назва', flex: 1, minWidth: 220 },
    {
      ...fixed,
      field: 'language',
      headerName: 'Мова',
      width: 80,
      valueGetter: (_value, row) => row.language.toUpperCase(),
    },
    {
      ...fixed,
      field: 'issues',
      headerName: 'Що виправити',
      flex: 1,
      minWidth: 260,
      renderCell: ({ row }) => (
        <Stack
          direction="row"
          sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 0.5, height: '100%' }}
        >
          {row.issues.map((issue) => (
            <Chip
              color="warning"
              key={issue}
              label={seoIssueLabels[issue]}
              size="small"
              variant="outlined"
            />
          ))}
        </Stack>
      ),
    },
    {
      ...fixed,
      align: 'center',
      field: 'actions',
      headerAlign: 'center',
      headerName: 'Дії',
      width: 80,
      renderCell: ({ row }) => (
        <RowEditAction
          label={`Відкрити «${row.name}» для редагування`}
          onEdit={() => onOpen(row)}
          title="Редагувати"
        />
      ),
    },
  ];
}
