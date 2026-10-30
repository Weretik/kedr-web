import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { slugMaxLength, validateSlug } from './slug-rules';

import type { FormEvent } from 'react';

export type ChangeSlugInput = { slug: string } | { regenerate: true };

interface ChangeSlugDialogProps {
  open: boolean;
  currentSlug: string;
  /** Public path before the slug, for example `/uk/catalog/`. */
  pathPrefix: string;
  saving: boolean;
  /** Server error in the words of the page. */
  error?: string;
  onClose: () => void;
  onSubmit: (input: ChangeSlugInput) => void;
}

/** Changes the public address of a catalog item; the old address keeps redirecting. */
export function ChangeSlugDialog({
  currentSlug,
  error,
  onClose,
  onSubmit,
  open,
  pathPrefix,
  saving,
}: ChangeSlugDialogProps) {
  const [value, setValue] = useState(currentSlug);
  const [fieldError, setFieldError] = useState<string | undefined>();

  useEffect(() => {
    if (open) {
      setValue(currentSlug);
      setFieldError(undefined);
    }
  }, [currentSlug, open]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateSlug(value);
    setFieldError(validationError);
    if (!validationError) onSubmit({ slug: value.trim() });
  };

  return (
    <Dialog fullWidth maxWidth="sm" onClose={saving ? undefined : onClose} open={open}>
      <form noValidate onSubmit={handleSubmit}>
        <DialogTitle>Змінити адресу</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <DialogContentText>
              Стара адреса не зникне: відвідувачів і пошукові системи з неї буде перенаправлено на
              нову.
            </DialogContentText>
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
          </Stack>
        </DialogContent>
        <DialogActions sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Button
            disabled={saving}
            onClick={() => onSubmit({ regenerate: true })}
            sx={{ mr: 'auto' }}
          >
            Згенерувати з назви
          </Button>
          <Button disabled={saving} onClick={onClose}>
            Скасувати
          </Button>
          <Button disabled={saving} type="submit" variant="contained">
            Зберегти
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
