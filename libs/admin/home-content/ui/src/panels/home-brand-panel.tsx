import {
  emptyHomeBrandDraft,
  homeBrandIssues,
  homeBrandNameMaxLength,
} from '@admin/home-content/model';
import { AdminEditPanel, CountedTextField } from '@admin/shared/ui';
import { Alert, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { HomeBrandLogoField } from '../components/brands/home-brand-logo-field';

import type { HomeBrandDraft, HomeBrandLogo } from '@admin/home-content/model';

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
        <HomeBrandLogoField
          accept={accept}
          busy={busy}
          error={issues.logo}
          logo={logo}
          onPickFromLibrary={onPickFromLibrary}
          onUpload={onUpload}
          uploading={uploading}
        />
        <Typography color="text.secondary" variant="caption">
          Краще логотип на прозорому або білому тлі, приблизно 320 × 128 пікселів. На сайті він
          показується сірим.
        </Typography>
      </Stack>
    </AdminEditPanel>
  );
}
