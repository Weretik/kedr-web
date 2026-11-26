import { Box, Stack, Typography } from '@mui/material';

import type { GooglePreview } from '@admin/categories/model';

const siteBuilds = 'Сайт складе сам з назви категорії';

/** «Як у Google»: the result snippet of the category page in one language (spec 003 R-009). */
export function CategoryGooglePreview({ preview }: { preview: GooglePreview }) {
  return (
    <Stack spacing={0.5}>
      <Typography color="text.secondary" component="h3" variant="overline">
        Як у Google
      </Typography>
      <Box
        sx={{
          bgcolor: 'background.default',
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
          p: 1.5,
        }}
      >
        <Typography color="success.main" sx={{ overflowWrap: 'anywhere' }} variant="caption">
          {preview.address}
        </Typography>
        <Typography
          color={preview.title ? 'info.main' : 'text.secondary'}
          sx={{ fontSize: '1.05rem', fontWeight: 700, overflowWrap: 'anywhere' }}
        >
          {preview.title ?? `${siteBuilds}.`}
        </Typography>
        <Typography color="text.secondary" sx={{ overflowWrap: 'anywhere' }} variant="body2">
          {preview.description ?? `${siteBuilds}, кількості товарів і ціни.`}
        </Typography>
      </Box>
      {preview.titleCut || preview.descriptionCut ? (
        <Typography color="warning.main" variant="caption">
          {preview.titleCut && preview.descriptionCut
            ? 'Заголовок і опис задовгі: Google обріже їх.'
            : preview.titleCut
              ? 'Заголовок задовгий: Google обріже його.'
              : 'Опис задовгий: Google обріже його.'}
        </Typography>
      ) : null}
    </Stack>
  );
}
