import {
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

import type { FormEvent } from 'react';

interface EditTextDialogProps {
  open: boolean;
  title: string;
  label: string;
  initialValue: string;
  description?: string;
  type?: 'text' | 'email';
  validate: (value: string) => string | undefined;
  onClose: () => void;
  /** Called with a valid value; the caller asks for confirmation before saving. */
  onSubmit: (value: string) => void;
}

/** One-field form for a name or an email. */
export function EditTextDialog({
  description,
  initialValue,
  label,
  onClose,
  onSubmit,
  open,
  title,
  type = 'text',
  validate,
}: EditTextDialogProps) {
  const [value, setValue] = useState(initialValue);
  const [fieldError, setFieldError] = useState<string | undefined>();

  useEffect(() => {
    if (open) {
      setValue(initialValue);
      setFieldError(undefined);
    }
  }, [initialValue, open]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validate(value);
    setFieldError(validationError);
    if (!validationError) onSubmit(value.trim());
  };

  return (
    <Dialog fullWidth maxWidth="xs" onClose={onClose} open={open}>
      <form noValidate onSubmit={handleSubmit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {description ? <DialogContentText>{description}</DialogContentText> : null}
            <TextField
              autoComplete={type === 'email' ? 'email' : 'name'}
              error={Boolean(fieldError)}
              helperText={fieldError}
              label={label}
              onChange={(event) => setValue(event.target.value)}
              required
              type={type}
              value={value}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Скасувати</Button>
          <Button type="submit" variant="contained">
            Далі
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
