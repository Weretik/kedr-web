import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Box, Card, IconButton, Skeleton, Stack, Tooltip, Typography } from '@mui/material';

import type { PageSeoEntry } from '@admin/page-seo/model';

interface PageSeoListProps {
  entries: readonly PageSeoEntry[];
  loading: boolean;
  onEdit: (entry: PageSeoEntry) => void;
}

const clamp = {
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
} as const;

/** The site pages in menu order with the Ukrainian title and description editors set, if any. */
export function PageSeoList({ entries, loading, onEdit }: PageSeoListProps) {
  if (loading && entries.length === 0)
    return (
      <Stack aria-busy="true" aria-label="Завантаження сторінок" spacing={1}>
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton height={64} key={index} sx={{ borderRadius: 2 }} variant="rectangular" />
        ))}
      </Stack>
    );

  return (
    <Card component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }} variant="outlined">
      {entries.map((entry, index) => (
        <Stack
          component="li"
          direction="row"
          key={entry.page}
          spacing={2}
          sx={{
            alignItems: 'flex-start',
            borderTop: index === 0 ? 0 : 1,
            borderColor: 'divider',
            px: 2,
            py: 1.5,
          }}
        >
          <Box sx={{ minWidth: { xs: 120, sm: 200 } }}>
            <Typography sx={{ fontWeight: 600 }} variant="body2">
              {entry.label}
            </Typography>
            <Typography color="text.secondary" variant="caption">
              {entry.path}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {entry.texts.titleUk || entry.texts.descriptionUk ? (
              <>
                <Typography sx={clamp} variant="body2">
                  {entry.texts.titleUk || 'Заголовок сайту'}
                </Typography>
                <Typography color="text.secondary" sx={clamp} variant="body2">
                  {entry.texts.descriptionUk || 'Опис сайту'}
                </Typography>
              </>
            ) : (
              <Typography color="text.secondary" variant="body2">
                Тексти сайту
              </Typography>
            )}
          </Box>
          <Tooltip title="Редагувати">
            <IconButton
              aria-label={`Редагувати «${entry.label}»`}
              onClick={() => onEdit(entry)}
              size="small"
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ))}
    </Card>
  );
}
