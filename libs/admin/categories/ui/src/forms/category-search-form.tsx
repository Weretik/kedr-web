import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import { Alert, Box, Button, FormControlLabel, Stack, Switch, Typography } from '@mui/material';

import type { CategorySharePicture } from '@admin/categories/model';
import type { FormEvent } from 'react';

interface CategorySearchFormProps {
  isClosedFromSearch: boolean;
  picture: CategorySharePicture | null;
  dirty: boolean;
  saving: boolean;
  error?: string;
  onClosedChange: (closed: boolean) => void;
  onPickPicture: () => void;
  onRemovePicture: () => void;
  onReset: () => void;
  onSave: () => void;
}

/** «Закрити від пошуку» and the picture shown when someone shares a link to the category. */
export function CategorySearchForm({
  dirty,
  error,
  isClosedFromSearch,
  onClosedChange,
  onPickPicture,
  onRemovePicture,
  onReset,
  onSave,
  picture,
  saving,
}: CategorySearchFormProps) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave();
  };

  return (
    <Stack component="form" noValidate onSubmit={submit} spacing={2}>
      <Stack spacing={0.5}>
        <FormControlLabel
          control={
            <Switch
              checked={isClosedFromSearch}
              onChange={(event) => onClosedChange(event.target.checked)}
            />
          }
          label="Закрити від пошуку"
        />
        <Typography color="text.secondary" variant="body2">
          Категорія лишається на сайті, але Google її не індексує. Діє й на підкатегорії та їхні
          товари.
        </Typography>
      </Stack>
      <Stack spacing={1}>
        <Typography variant="subtitle2">Фото для поширення</Typography>
        {picture?.url ? (
          <Box
            alt="Фото для поширення"
            component="img"
            src={picture.url}
            sx={{ borderRadius: 1, maxHeight: 160, maxWidth: '100%', objectFit: 'contain' }}
          />
        ) : (
          <Typography color="text.secondary" variant="body2">
            {picture ? 'Файл видалено з медіатеки.' : 'Не вибрано — сайт покаже загальне фото.'}
          </Typography>
        )}
        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Button
            disabled={saving}
            onClick={onPickPicture}
            startIcon={<PhotoLibraryOutlinedIcon />}
            variant="outlined"
          >
            Вибрати з медіатеки
          </Button>
          {picture ? (
            <Button disabled={saving} onClick={onRemovePicture} startIcon={<DeleteOutlinedIcon />}>
              Прибрати
            </Button>
          ) : null}
        </Stack>
      </Stack>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
        <Button disabled={saving} onClick={onReset}>
          Скасувати
        </Button>
        <Button disabled={!dirty || saving} type="submit" variant="contained">
          {saving ? 'Збереження…' : 'Зберегти'}
        </Button>
      </Stack>
    </Stack>
  );
}
