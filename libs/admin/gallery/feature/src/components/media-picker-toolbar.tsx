import { mediaAcceptedTypes, mediaScopeFromValue, mediaScopeValue } from '@admin/media/model';
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import { Button, MenuItem, Stack, TextField } from '@mui/material';

import type { MediaScope } from '@admin/media/model';
import type { ChangeEvent } from 'react';

interface MediaPickerToolbarProps {
  scope: MediaScope;
  folderOptions: readonly { id: number; label: string }[];
  search: string;
  /** Upload progress, or null when nothing is uploading. */
  progress: { done: number; total: number } | null;
  onScopeChange: (scope: MediaScope) => void;
  onSearchChange: (search: string) => void;
  onFiles: (files: File[]) => void;
}

/** Folder, file name search, and upload from the computer for the media picker. */
export function MediaPickerToolbar({
  folderOptions,
  onFiles,
  onScopeChange,
  onSearchChange,
  progress,
  scope,
  search,
}: MediaPickerToolbarProps) {
  const pick = (event: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (picked.length > 0) onFiles(picked);
  };

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
      <TextField
        label="Папка"
        onChange={(event) => onScopeChange(mediaScopeFromValue(event.target.value))}
        select
        sx={{ minWidth: 260 }}
        value={mediaScopeValue(scope)}
      >
        <MenuItem value="all">Уся медіатека</MenuItem>
        <MenuItem value="root">Без папки</MenuItem>
        {folderOptions.map((option) => (
          <MenuItem key={option.id} value={String(option.id)}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        fullWidth
        label="Пошук за назвою файлу"
        onChange={(event) => onSearchChange(event.target.value)}
        value={search}
      />
      <Button
        component="label"
        disabled={progress !== null}
        startIcon={<UploadOutlinedIcon />}
        sx={{ flexShrink: 0 }}
        variant="outlined"
      >
        {progress
          ? `Завантаження ${progress.done} / ${progress.total}`
          : 'Завантажити з комп’ютера'}
        <input accept={mediaAcceptedTypes.join(',')} hidden multiple onChange={pick} type="file" />
      </Button>
    </Stack>
  );
}
