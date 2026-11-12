import { Box, Typography } from '@mui/material';

import type { SharePicture } from '@admin/seo-settings/model';

/** The chosen picture in the link-preview proportion (1.91 : 1), or a note that there is none. */
export function SharePicturePreview({ picture }: { picture: SharePicture | null }) {
  const url = picture && !picture.missing ? picture.url : null;
  return (
    <Box
      sx={{
        alignItems: 'center',
        aspectRatio: '1.91 / 1',
        bgcolor: 'action.hover',
        border: 1,
        borderColor: picture?.missing ? 'error.main' : 'divider',
        borderRadius: 1,
        display: 'flex',
        flexShrink: 0,
        justifyContent: 'center',
        overflow: 'hidden',
        width: { xs: '100%', sm: 240 },
      }}
    >
      {url ? (
        <Box
          alt=""
          component="img"
          src={url}
          sx={{ height: '100%', objectFit: 'cover', width: '100%' }}
        />
      ) : (
        <Typography color="text.disabled" sx={{ px: 2, textAlign: 'center' }} variant="body2">
          {picture?.missing ? 'Файл видалено' : 'Стандартне фото сайту'}
        </Typography>
      )}
    </Box>
  );
}
