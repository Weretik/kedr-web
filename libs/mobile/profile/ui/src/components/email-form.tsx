import { validateEmail } from '@mobile/profile/model';
import { AppText, Button, TextField } from '@mobile/shared/ui';
import { useState } from 'react';

import { FormFrame } from './form-frame';
import { useConfirmStep } from '../hooks/use-confirm-step';

export interface EmailFormProps {
  currentEmail: string;
  error: string | null;
  busy: boolean;
  onCancel: () => void;
  onSave: (email: string, currentPassword: string) => void;
}

/** Admin only: a new e-mail with the current password, confirmed before it is sent (SC-022). */
export function EmailForm({
  busy,
  currentEmail,
  error,
  onCancel,
  onSave,
}: Readonly<EmailFormProps>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { back, confirming, problem, review } = useConfirmStep(
    () => validateEmail(email) ?? (password ? null : 'Вкажіть поточний пароль.'),
  );

  return (
    <FormFrame
      actions={
        confirming ? (
          <>
            <Button label="Назад" onPress={back} variant="text" />
            <Button label="Так, змінити" onPress={() => onSave(email.trim(), password)} />
          </>
        ) : (
          <>
            <Button label="Скасувати" onPress={onCancel} variant="text" />
            <Button label="Далі" onPress={review} />
          </>
        )
      }
      busy={busy}
      error={error ?? problem}
      title="E-mail для входу"
    >
      {confirming ? (
        <AppText variant="body">{`Змінити e-mail ${currentEmail} на ${email.trim()}? Інші пристрої вийдуть з акаунта.`}</AppText>
      ) : (
        <>
          <TextField
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            label="Новий e-mail"
            onChangeText={setEmail}
            value={email}
          />
          <TextField label="Поточний пароль" onChangeText={setPassword} secret value={password} />
        </>
      )}
    </FormFrame>
  );
}
