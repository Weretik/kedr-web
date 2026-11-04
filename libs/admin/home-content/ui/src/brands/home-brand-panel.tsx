import {
  emptyHomeBrandDraft,
  homeBrandIssues,
  homeBrandNameMaxLength,
} from '@admin/home-content/model';
import { AdminEditPanel, CountedTextField } from '@admin/shared/ui';
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import type { HomeBrandDraft, HomeBrandLogo } from '@admin/home-content/model';
import type { ChangeEvent } from 'react';

interface HomeBrandPanelProps {
  /** The brand being edited; none for a new one. */
  initial?: HomeBrandDraft;
  /** The logo just picked or uploaded; replaces the one in the form. */
  pickedLogo: HomeBrandLogo | null;
  /** Accepted picture types for the upload button. */
  accept: string;
  uploading: boolean;
  saving: boolean;
  error?: string;
  onPickFromLibrary: () => void;
  onUpload: (file: File) => void;
  onCancel: () => void;
  onSave: (draft: HomeBrandDraft & { logo: HomeBrandLogo }) => void;
}

/** Brand name and its logo from the media library (picked or uploaded from the computer). */
export function HomeBrandPanel({
  accept,
  error,
  initial,
  onCancel,
  onPickFromLibrary,
  onSave,
  onUpload,
  pickedLogo,
  saving,
  uploading,
}: HomeBrandPanelProps) {
  const [name, setName] = useState(initial?.name ?? emptyHomeBrandDraft.name);
  const [touched, setTouched] = useState(false);
  const logo = pickedLogo ?? initial?.logo ?? null;
  const draft = { name, logo };
  const issues = touched ? homeBrandIssues(draft) : {};
  const busy = saving || uploading;

  const pick = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) onUpload(file);
  };

  return (
    <AdminEditPanel
      actions={
        <>
          <Button disabled={busy} onClick={onCancel}>
            Скасувати
          </Button>
          <Button
            disabled={busy}
            onClick={() => {
              setTouched(true);
              if (logo && Object.keys(homeBrandIssues(draft)).length === 0) onSave({ name, logo });
            }}
            variant="contained"
          >
            {saving ? 'Збереження…' : 'Зберегти'}
          </Button>
        </>
      }
      busy={busy}
      onClose={onCancel}
      open
      subtitle={initial?.name}
      title={initial ? 'Редагування бренду' : 'Новий бренд'}
    >
      <Stack spacing={2}>
        {error ? <Alert severity="error">{error}</Alert> : null}
        <CountedTextField
          error={issues.name}
          label="Назва"
          maxLength={homeBrandNameMaxLength}
          onChange={setName}
          value={name}
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              alignItems: 'center',
              bgcolor: 'common.white',
              border: 1,
              borderColor: issues.logo ? 'error.main' : 'divider',
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
            {issues.logo ? (
              <Typography color="error" variant="caption">
                {issues.logo}
              </Typography>
            ) : null}
          </Stack>
        </Stack>
        <Typography color="text.secondary" variant="caption">
          Краще логотип на прозорому або білому тлі, приблизно 320 × 128 пікселів. На сайті він
          показується сірим.
        </Typography>
      </Stack>
    </AdminEditPanel>
  );
}
