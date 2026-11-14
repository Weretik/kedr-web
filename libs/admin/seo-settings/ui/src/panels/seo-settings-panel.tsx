import { seoCodeFields, seoSettingsIssues } from '@admin/seo-settings/model';
import { AdminEditPanel } from '@admin/shared/ui';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import { Alert, Button, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';

import { SharePicturePreview } from '../details/share-picture-preview';
import { seoCodeLabels } from '../forms/seo-settings-fields';

import type { SeoSettingsDraft, SharePicture } from '@admin/seo-settings/model';
import type { ChangeEvent } from 'react';

interface SeoSettingsPanelProps {
  initial: SeoSettingsDraft;
  /** The picture of the form; the page keeps it, so a pick or an upload reaches the panel. */
  picture: SharePicture | null;
  /** Accepted picture types for the upload button. */
  accept: string;
  uploading: boolean;
  saving: boolean;
  error?: string;
  onPickFromLibrary: () => void;
  onRemovePicture: () => void;
  onUpload: (file: File) => void;
  onCancel: () => void;
  onSave: (draft: SeoSettingsDraft) => void;
}

/** All settings in one form; an empty field removes that code from the site. Mount it per opening. */
export function SeoSettingsPanel({
  accept,
  error,
  initial,
  onCancel,
  onPickFromLibrary,
  onRemovePicture,
  onSave,
  onUpload,
  picture,
  saving,
  uploading,
}: SeoSettingsPanelProps) {
  const [draft, setDraft] = useState(initial);
  const [touched, setTouched] = useState(false);
  const issues = touched ? seoSettingsIssues(draft) : {};
  const busy = saving || uploading;

  const pick = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) onUpload(file);
  };

  const submit = () => {
    setTouched(true);
    if (Object.keys(seoSettingsIssues(draft)).length === 0)
      onSave({ ...draft, sharePicture: picture });
  };

  return (
    <AdminEditPanel
      actions={
        <>
          <Button disabled={busy} onClick={onCancel}>
            Скасувати
          </Button>
          <Button disabled={busy} type="submit" variant="contained">
            {saving ? 'Збереження…' : 'Зберегти'}
          </Button>
        </>
      }
      busy={busy}
      onClose={onCancel}
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      open
      subtitle="Коди, які сайт додає на кожну сторінку. Порожнє поле нічого не додає."
      title="Налаштування SEO сайту"
    >
      <Stack spacing={2.5}>
        {error ? <Alert severity="error">{error}</Alert> : null}
        {seoCodeFields.map((field) => (
          <TextField
            autoComplete="off"
            error={Boolean(issues[field])}
            helperText={issues[field] ?? seoCodeLabels[field].hint}
            key={field}
            label={seoCodeLabels[field].label}
            onChange={(event) => setDraft({ ...draft, [field]: event.target.value })}
            slotProps={{ htmlInput: { spellCheck: false } }}
            value={draft[field]}
          />
        ))}
        <Stack spacing={1}>
          <Typography variant="subtitle2">Фото для поширення</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <SharePicturePreview picture={picture} />
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
              {picture ? (
                <Button
                  color="inherit"
                  disabled={busy}
                  onClick={onRemovePicture}
                  startIcon={<DeleteOutlinedIcon />}
                >
                  Прибрати фото
                </Button>
              ) : null}
              {picture?.fileName ? (
                <Typography color="text.secondary" noWrap variant="caption">
                  Файл: {picture.fileName}
                </Typography>
              ) : null}
            </Stack>
          </Stack>
          <Typography color="text.secondary" variant="caption">
            Показується, коли посиланням на сторінку без власного фото діляться в месенджерах і
            соцмережах. Найкраще горизонтальне фото 1200 × 630 пікселів. Без фото сайт показує своє
            стандартне.
          </Typography>
        </Stack>
      </Stack>
    </AdminEditPanel>
  );
}
