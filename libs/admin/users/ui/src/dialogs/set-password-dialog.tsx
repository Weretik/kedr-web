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
import { useState } from 'react';

import type { FormEvent } from 'react';

interface SetPasswordDialogProps {
  /** Email of the account; the dialog is open while it is set. */
  email: string | null;
  onClose: () => void;
  /** Called with a valid password; the caller asks for confirmation before saving. */
  onSubmit: (password: string) => void;
}

export function SetPasswordDialog({ email, onClose, onSubmit }: SetPasswordDialogProps) {
  const [password, setPassword] = useState('');
  const [fieldError, setFieldError] = useState<string | undefined>();

  const handleClose = () => {
    setPassword('');
    setFieldError(undefined);
    onClose();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateStaffPassword(password);
    setFieldError(validationError);
    if (validationError) return;

    setPassword('');
    onSubmit(password);
  };

  return (
    <Dialog fullWidth maxWidth="xs" onClose={handleClose} open={email !== null}>
      <form noValidate onSubmit={handleSubmit}>
        <DialogTitle>Новий пароль</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <DialogContentText>
              {email}: після зміни пароля всі сесії цього користувача завершаться.
            </DialogContentText>
            <TextField
              autoComplete="new-password"
              error={Boolean(fieldError)}
              helperText={fieldError ?? 'Щонайменше 8 символів.'}
              label="Новий пароль"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Скасувати</Button>
          <Button type="submit" variant="contained">
            Далі
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
