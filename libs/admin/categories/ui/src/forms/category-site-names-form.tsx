import { Alert, Button, Stack, TextField, Typography } from '@mui/material';

import type { FormEvent } from 'react';

/** The longest site name the server accepts. */
export const siteNameMaxLength = 100;

interface CategorySiteNamesFormProps {
  value: { uk: string; ru: string };
  /** Names the site shows when a field is empty: from 1C and the server settings. */
  sourceName: string;
  dirty: boolean;
  saving: boolean;
  error?: string;
  onChange: (value: { uk: string; ru: string }) => void;
  onReset: () => void;
  onSave: () => void;
}

/** Ukrainian and Russian names for the site, breadcrumbs, and titles; they win over the 1C name. */
export function CategorySiteNamesForm({
  dirty,
  error,
  onChange,
  onReset,
  onSave,
  saving,
  sourceName,
  value,
}: CategorySiteNamesFormProps) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave();
  };

  return (
    <Stack component="form" noValidate onSubmit={submit} spacing={2}>
      <Typography color="text.secondary" variant="body2">
        Назва в каталозі, хлібних крихтах і заголовках. Порожньо — назва з 1С ({sourceName}).
      </Typography>
      <TextField
        autoComplete="off"
        label="Українською"
        onChange={(event) => onChange({ ...value, uk: event.target.value })}
        slotProps={{ htmlInput: { maxLength: siteNameMaxLength } }}
        value={value.uk}
      />
      <TextField
        autoComplete="off"
        label="Російською"
        onChange={(event) => onChange({ ...value, ru: event.target.value })}
        slotProps={{ htmlInput: { maxLength: siteNameMaxLength } }}
        value={value.ru}
      />
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
        <Button disabled={!dirty || saving} onClick={onReset}>
          Скасувати
        </Button>
        <Button disabled={!dirty || saving} type="submit" variant="contained">
          {saving ? 'Збереження…' : 'Зберегти'}
        </Button>
      </Stack>
    </Stack>
  );
}
