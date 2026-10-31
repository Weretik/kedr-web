import { validateStaffPassword } from '@admin/users/model';
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

export interface OwnPasswordChange {
  currentPassword: string;
  newPassword: string;
}

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
  /** Called with valid values; the caller asks for confirmation before saving. */
  onSubmit: (change: OwnPasswordChange) => void;
}

type FieldErrors = Partial<Record<'currentPassword' | 'newPassword' | 'repeat', string>>;

/** New password for the signed-in administrator, with the current one and a repeat. */
export function ChangePasswordDialog({ onClose, onSubmit, open }: ChangePasswordDialogProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (open) {
      setCurrentPassword('');
      setNewPassword('');
      setRepeat('');
      setErrors({});
    }
  }, [open]);

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
    <Dialog fullWidth maxWidth="xs" onClose={onClose} open={open}>
      <form noValidate onSubmit={handleSubmit}>
        <DialogTitle>Змінити пароль</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <DialogContentText>
              На цьому пристрої ви залишитеся в системі, на інших потрібно буде увійти знову.
            </DialogContentText>
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
