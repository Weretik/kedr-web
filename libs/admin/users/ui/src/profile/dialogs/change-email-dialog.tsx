import { validateEmail } from '@admin/users/model';
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

export interface OwnEmailChange {
  email: string;
  currentPassword: string;
}

interface ChangeEmailDialogProps {
  open: boolean;
  currentEmail: string;
  onClose: () => void;
  /** Called with valid values; the caller asks for confirmation before saving. */
  onSubmit: (change: OwnEmailChange) => void;
}

/** New sign-in email for the signed-in administrator; the current password proves it is them. */
export function ChangeEmailDialog({
  currentEmail,
  onClose,
  onSubmit,
  open,
}: ChangeEmailDialogProps) {
  const [email, setEmail] = useState(currentEmail);
  const [currentPassword, setCurrentPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; currentPassword?: string }>({});

  useEffect(() => {
    if (open) {
      setEmail(currentEmail);
      setCurrentPassword('');
      setErrors({});
    }
  }, [currentEmail, open]);

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
    <Dialog fullWidth maxWidth="xs" onClose={onClose} open={open}>
      <form noValidate onSubmit={handleSubmit}>
        <DialogTitle>Змінити email</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <DialogContentText>
              Новий email стане логіном. На інших пристроях потрібно буде увійти знову.
            </DialogContentText>
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
