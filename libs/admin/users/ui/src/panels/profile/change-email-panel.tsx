import { AdminEditPanel } from '@admin/shared/ui';
import { validateEmail } from '@admin/users/model';
import { Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';

import type { FormEvent } from 'react';

export interface OwnEmailChange {
  email: string;
  currentPassword: string;
}

interface ChangeEmailPanelProps {
  open: boolean;
  currentEmail: string;
  onClose: () => void;
  /** Called with valid values; the caller asks for confirmation before saving. */
  onSubmit: (change: OwnEmailChange) => void;
}

/** New sign-in email for the signed-in administrator; the current password proves it is them. */
export function ChangeEmailPanel({ currentEmail, onClose, onSubmit, open }: ChangeEmailPanelProps) {
  const [email, setEmail] = useState(currentEmail);
  const [currentPassword, setCurrentPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; currentPassword?: string }>({});

  // Each opening starts from the current email and an empty password.
  const [openedWith, setOpenedWith] = useState({ currentEmail, open });
  if (openedWith.open !== open || openedWith.currentEmail !== currentEmail) {
    setOpenedWith({ currentEmail, open });
    if (open) {
      setEmail(currentEmail);
      setCurrentPassword('');
      setErrors({});
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = {
      email: validateEmail(email),
      currentPassword: currentPassword ? undefined : 'Вкажіть поточний пароль.',
    };
    setErrors(nextErrors);
    if (!nextErrors.email && !nextErrors.currentPassword) {
      onSubmit({ email: email.trim(), currentPassword });
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
      title="Змінити email"
    >
      <Typography color="text.secondary" variant="body2">
        Новий email стане логіном. На інших пристроях потрібно буде увійти знову.
      </Typography>
      <TextField
        autoComplete="email"
        error={Boolean(errors.email)}
        helperText={errors.email}
        label="Новий email"
        onChange={(event) => setEmail(event.target.value)}
        required
        type="email"
        value={email}
      />
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
    </AdminEditPanel>
  );
}
