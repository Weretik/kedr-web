import { AdminEditPanel } from '@admin/shared/ui';
import { validateStaffPassword } from '@admin/users/model';
import { Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';

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

type FieldErrors = Partial<Record<'currentPassword' | 'newPassword' | 'repeat', string>>;

/** New password for the signed-in administrator, with the current one and a repeat. */
export function ChangePasswordPanel({ onClose, onSubmit, open }: ChangePasswordPanelProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});

  // Each opening starts with empty fields.
  const [wasOpen, setWasOpen] = useState(open);
  if (wasOpen !== open) {
    setWasOpen(open);
    if (open) {
      setCurrentPassword('');
      setNewPassword('');
      setRepeat('');
      setErrors({});
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: FieldErrors = {
      currentPassword: currentPassword ? undefined : 'Вкажіть поточний пароль.',
      newPassword: validateStaffPassword(newPassword),
      repeat: repeat === newPassword ? undefined : 'Паролі не збігаються.',
    };
    setErrors(nextErrors);
    if (!Object.values(nextErrors).some(Boolean)) {
      onSubmit({ currentPassword, newPassword });
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
        onChange={(event) => setCurrentPassword(event.target.value)}
        required
        type="password"
        value={currentPassword}
      />
      <TextField
        autoComplete="new-password"
        error={Boolean(errors.newPassword)}
        helperText={errors.newPassword ?? 'Щонайменше 8 символів.'}
        label="Новий пароль"
        onChange={(event) => setNewPassword(event.target.value)}
        required
        type="password"
        value={newPassword}
      />
      <TextField
        autoComplete="new-password"
        error={Boolean(errors.repeat)}
        helperText={errors.repeat}
        label="Повторіть новий пароль"
        onChange={(event) => setRepeat(event.target.value)}
        required
        type="password"
        value={repeat}
      />
    </AdminEditPanel>
  );
}
