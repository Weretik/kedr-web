import { AdminEditPanel } from '@admin/shared/ui';
import { Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';

import type { FormEvent } from 'react';

interface EditTextPanelProps {
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

/** One-field form for a name or an email, in the right edit panel. */
export function EditTextPanel({
  description,
  initialValue,
  label,
  onClose,
  onSubmit,
  open,
  title,
  type = 'text',
  validate,
}: EditTextPanelProps) {
  const [value, setValue] = useState(initialValue);
  const [fieldError, setFieldError] = useState<string | undefined>();
  // Each opening starts from the current value.
  const [openedWith, setOpenedWith] = useState<{ open: boolean; initialValue: string }>({
    open,
    initialValue,
  });
  if (openedWith.open !== open || openedWith.initialValue !== initialValue) {
    setOpenedWith({ open, initialValue });
    if (open) {
      setValue(initialValue);
      setFieldError(undefined);
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validate(value);
    setFieldError(validationError);
    if (!validationError) onSubmit(value.trim());
  };

  return (
    <AdminEditPanel
      actions={
        <>
          <Button onClick={onClose}>Скасувати</Button>
          <Button type="submit" variant="contained">
            Далі
          </Button>
        </>
      }
      onClose={onClose}
      onSubmit={handleSubmit}
      open={open}
      title={title}
    >
      {description ? (
        <Typography color="text.secondary" variant="body2">
          {description}
        </Typography>
      ) : null}
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
    </AdminEditPanel>
  );
}
