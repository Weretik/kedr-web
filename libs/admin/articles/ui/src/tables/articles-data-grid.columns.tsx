import { StatusPill } from '@admin/shared/ui';
import ImageNotSupportedOutlinedIcon from '@mui/icons-material/ImageNotSupportedOutlined';
import { Box, Typography } from '@mui/material';

import type { ArticleSummary } from '@admin/articles/model';
import type { GridColDef } from '@mui/x-data-grid';

const dateFormatter = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'medium' });

/** `2026-03-24` as a local calendar date, so the day does not shift with the time zone. */
export const formatArticleDate = (date: string) => {
  const [year, month, day] = date.split('-').map(Number);
  return dateFormatter.format(new Date(year, month - 1, day));
};

const coverColumn: GridColDef<ArticleSummary> = {
  field: 'coverUrl',
  headerName: 'Обкладинка',
  sortable: false,
  width: 112,
  renderCell: ({ row }) => (
    <Box
      sx={{
        alignItems: 'center',
        bgcolor: 'action.hover',
        borderRadius: 1,
        color: 'text.disabled',
        display: 'flex',
        height: 48,
        justifyContent: 'center',
        my: 1,
        overflow: 'hidden',
        width: 80,
      }}
    >
      {row.coverUrl ? (
        <Box
          alt=""
          component="img"
          loading="lazy"
          src={row.coverUrl}
          sx={{ height: '100%', objectFit: 'cover', width: '100%' }}
        />
      ) : (
        <ImageNotSupportedOutlinedIcon aria-label="Без обкладинки" fontSize="small" />
      )}
    </Box>
  ),
};

const titleColumn: GridColDef<ArticleSummary> = {
  field: 'title',
  headerName: 'Заголовок',
  flex: 2,
  minWidth: 240,
  renderCell: ({ row }) => (
    <Box sx={{ overflowWrap: 'anywhere', py: 1, whiteSpace: 'normal' }}>
      <Typography component="span" sx={{ display: 'block', fontWeight: 600 }} variant="body2">
        {row.title}
      </Typography>
      <Typography color="text.secondary" component="code" sx={{ fontSize: '0.75rem' }}>
        {row.slug}
      </Typography>
    </Box>
  ),
};

const publishedOnColumn: GridColDef<ArticleSummary> = {
  field: 'publishedOn',
  headerName: 'Дата',
  minWidth: 130,
  valueFormatter: (value: string) => formatArticleDate(value),
};

const statusColumn: GridColDef<ArticleSummary> = {
  field: 'isPublished',
  headerName: 'На сайті',
  minWidth: 140,
  // Only a draft gets a mark; a published article needs none.
  renderCell: ({ row }) =>
    row.isPublished ? null : <StatusPill label="Чернетка" tone="neutral" />,
};

export const articlesColumns: GridColDef<ArticleSummary>[] = [
  coverColumn,
  titleColumn,
  publishedOnColumn,
  statusColumn,
];
