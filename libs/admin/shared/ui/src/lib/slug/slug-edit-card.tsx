import { Alert, Button, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';

import { slugMaxLength, validateSlug } from './slug-rules';
import { SectionCard } from '../layout/section-card';

import type { FormEvent } from 'react';

export type ChangeSlugInput = { slug: string } | { regenerate: true };

interface SlugEditCardProps {
  currentSlug: string;
  /** Public path before the slug, for example `/uk/catalog/`. */
  pathPrefix: string;
  saving: boolean;
  /** Server error in the words of the page. */
  error?: string;
  onSubmit: (input: ChangeSlugInput) => void;
}

/** «Адреса на сайті» in an edit panel; the old address keeps redirecting to the new one. */
export function SlugEditCard({
  currentSlug,
  error,
  onSubmit,
  pathPrefix,
  saving,
}: SlugEditCardProps) {
  const [value, setValue] = useState(currentSlug);
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [baseSlug, setBaseSlug] = useState(currentSlug);

  // A saved or regenerated address becomes the new starting value.
  if (baseSlug !== currentSlug) {
    setBaseSlug(currentSlug);
    setValue(currentSlug);
    setFieldError(undefined);
  }

  const changed = value.trim() !== currentSlug;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateSlug(value);
    setFieldError(validationError);
    if (!validationError) onSubmit({ slug: value.trim() });
  };

  return (
    <SectionCard title="Адреса на сайті">
      <Stack component="form" noValidate onSubmit={handleSubmit} spacing={2}>
        <Typography color="text.secondary" variant="body2">
          Стара адреса не зникне: відвідувачів і пошукові системи з неї буде перенаправлено на нову.
        </Typography>
        <TextField
          autoComplete="off"
          error={Boolean(fieldError)}
          helperText={fieldError ?? `${pathPrefix}${value.trim() || '…'}`}
          label="Адреса"
          onChange={(event) => setValue(event.target.value.toLowerCase())}
          required
          slotProps={{ htmlInput: { maxLength: slugMaxLength, spellCheck: false } }}
          value={value}
        />
        {error ? <Alert severity="error">{error}</Alert> : null}
        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Button
            disabled={saving}
            onClick={() => onSubmit({ regenerate: true })}
            sx={{ mr: 'auto' }}
          >
            Згенерувати з назви
          </Button>
          <Button
            disabled={saving || !changed}
            onClick={() => {
              setValue(currentSlug);
              setFieldError(undefined);
            }}
          >
            Скасувати
          </Button>
          <Button disabled={saving || !changed} type="submit" variant="contained">
            {saving ? 'Збереження…' : 'Зберегти адресу'}
          </Button>
        </Stack>
      </Stack>
    </SectionCard>
  );
}
