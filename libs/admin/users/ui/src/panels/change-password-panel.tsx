import { AdminEditPanel } from '@admin/shared/ui';
import {
  emptyOwnPasswordValues,
  hasOwnPasswordErrors,
  ownPasswordChangeErrors,
} from '@admin/users/model';
import { Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';

import type { OwnPasswordErrors, OwnPasswordValues } from '@admin/users/model';
import type { FormEvent } from 'react';

export interface OwnPasswordChange {
  currentPassword: string;
  newPassword: string;
}

interface ChangePasswordPanelProps {
  open: boolean;
  onClose: () => void;
  /** Called with valid values; the caller asks for confirmation before saving. */
  onSubmit: (change: OwnPasswordChange) => void;
}

/** New password for the signed-in administrator, with the current one and a repeat. */
export function ChangePasswordPanel({ onClose, onSubmit, open }: ChangePasswordPanelProps) {
  const [values, setValues] = useState<OwnPasswordValues>(emptyOwnPasswordValues);
  const [errors, setErrors] = useState<OwnPasswordErrors>({});
  const set = (field: keyof OwnPasswordValues) => (value: string) =>
    setValues((current) => ({ ...current, [field]: value }));

  // Each opening starts with empty fields.
  const [wasOpen, setWasOpen] = useState(open);
  if (wasOpen !== open) {
    setWasOpen(open);
    if (open) {
      setValues(emptyOwnPasswordValues);
      setErrors({});
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = ownPasswordChangeErrors(values);
    setErrors(nextErrors);
    if (!hasOwnPasswordErrors(nextErrors)) {
      onSubmit({ currentPassword: values.currentPassword, newPassword: values.newPassword });
    }
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
      title="Змінити пароль"
    >
      <Typography color="text.secondary" variant="body2">
        На цьому пристрої ви залишитеся в системі, на інших потрібно буде увійти знову.
      </Typography>
      <TextField
        autoComplete="current-password"
        error={Boolean(errors.currentPassword)}
        helperText={errors.currentPassword}
        label="Поточний пароль"
        onChange={(event) => set('currentPassword')(event.target.value)}
        required
        type="password"
        value={values.currentPassword}
      />
      <TextField
        autoComplete="new-password"
        error={Boolean(errors.newPassword)}
        helperText={errors.newPassword ?? 'Щонайменше 8 символів.'}
        label="Новий пароль"
        onChange={(event) => set('newPassword')(event.target.value)}
        required
        type="password"
        value={values.newPassword}
      />
      <TextField
        autoComplete="new-password"
        error={Boolean(errors.repeat)}
        helperText={errors.repeat}
        label="Повторіть новий пароль"
        onChange={(event) => set('repeat')(event.target.value)}
        required
        type="password"
        value={values.repeat}
      />
    </AdminEditPanel>
  );
}
