import { AdminEditPanel } from '@admin/shared/ui';
import { validateStaffPassword } from '@admin/users/model';
import { Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';

import type { FormEvent } from 'react';

interface SetPasswordPanelProps {
  /** Email of the account; the panel is open while it is set. */
  email: string | null;
  onClose: () => void;
  /** Called with a valid password; the caller asks for confirmation before saving. */
  onSubmit: (password: string) => void;
}

export function SetPasswordPanel({ email, onClose, onSubmit }: SetPasswordPanelProps) {
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
    <AdminEditPanel
      actions={
        <>
          <Button onClick={handleClose}>Скасувати</Button>
          <Button type="submit" variant="contained">
            Далі
          </Button>
        </>
      }
      onClose={handleClose}
      onSubmit={handleSubmit}
      open={email !== null}
      subtitle={email}
      title="Новий пароль"
    >
      <Typography color="text.secondary" variant="body2">
        Після зміни пароля всі сесії цього користувача завершаться.
      </Typography>
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
    </AdminEditPanel>
  );
}
