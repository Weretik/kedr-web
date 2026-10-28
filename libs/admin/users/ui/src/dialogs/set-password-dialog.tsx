import { validateStaffPassword } from '@admin/users/model';
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
import { useState } from 'react';

import type { FormEvent } from 'react';

interface SetPasswordDialogProps {
  /** Email of the account; the dialog is open while it is set. */
  email: string | null;
  submitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (password: string) => Promise<boolean>;
}

export function SetPasswordDialog({
  email,
  error,
  onClose,
  onSubmit,
  submitting,
}: SetPasswordDialogProps) {
  const [password, setPassword] = useState('');
  const [fieldError, setFieldError] = useState<string | undefined>();

  const handleClose = () => {
    setPassword('');
    setFieldError(undefined);
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateStaffPassword(password);
    setFieldError(validationError);
    if (validationError) return;

    if (await onSubmit(password)) {
      handleClose();
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      onClose={submitting ? undefined : handleClose}
      open={email !== null}
    >
      <form noValidate onSubmit={handleSubmit}>
        <DialogTitle>Новий пароль</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <DialogContentText>
              {email}: після зміни пароля всі сесії цього користувача завершаться.
            </DialogContentText>
            {error ? <Alert severity="error">{error}</Alert> : null}
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
          <Button disabled={submitting} onClick={handleClose}>
            Скасувати
          </Button>
          <Button disabled={submitting} type="submit" variant="contained">
            Зберегти
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
