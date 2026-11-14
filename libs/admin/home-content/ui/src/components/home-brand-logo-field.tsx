import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import { Box, Button, Stack, Typography } from '@mui/material';

import type { HomeBrandLogo } from '@admin/home-content/model';
import type { ChangeEvent } from 'react';

interface HomeBrandLogoFieldProps {
  logo: HomeBrandLogo | null;
  /** Accepted picture types for the upload button. */
  accept: string;
  busy: boolean;
  uploading: boolean;
  error?: string;
  onPickFromLibrary: () => void;
  onUpload: (file: File) => void;
}

/** The brand logo preview with «Вибрати з медіатеки» and upload from the computer. */
export function HomeBrandLogoField({
  accept,
  busy,
  error,
  logo,
  onPickFromLibrary,
  onUpload,
  uploading,
}: HomeBrandLogoFieldProps) {
  const pick = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) onUpload(file);
  };

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'center' }}>
      <Box
        sx={{
          alignItems: 'center',
          bgcolor: 'common.white',
          border: 1,
          borderColor: error ? 'error.main' : 'divider',
          borderRadius: 1,
          display: 'flex',
          flexShrink: 0,
          height: 96,
          justifyContent: 'center',
          p: 1.5,
          width: 200,
        }}
      >
        {logo?.url ? (
          <Box
            alt=""
            component="img"
            src={logo.url}
            sx={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
          />
        ) : (
          <Typography color="text.disabled" variant="body2">
            Без логотипа
          </Typography>
        )}
      </Box>
      <Stack spacing={1} sx={{ minWidth: 0 }}>
        <Button
          disabled={busy}
          onClick={onPickFromLibrary}
          startIcon={<PhotoLibraryOutlinedIcon />}
          variant="outlined"
        >
          Вибрати з медіатеки
        </Button>
        <Button
          component="label"
          disabled={busy}
          startIcon={<UploadOutlinedIcon />}
          variant="outlined"
        >
          {uploading ? 'Завантаження…' : 'Завантажити з комп’ютера'}
          <input accept={accept} hidden onChange={pick} type="file" />
        </Button>
        {logo?.fileName ? (
          <Typography color="text.secondary" noWrap variant="caption">
            Файл: {logo.fileName}
          </Typography>
        ) : null}
        {error ? (
          <Typography color="error" variant="caption">
            {error}
          </Typography>
        ) : null}
      </Stack>
    </Stack>
  );
}
