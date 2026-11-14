import { validateNewPassword } from '@mobile/profile/model';
import { AppText, Button, TextField } from '@mobile/shared/ui';
import { useState } from 'react';

import { FormFrame } from './form-frame';
import { useConfirmStep } from '../hooks/use-confirm-step';

export interface PasswordFormProps {
  error: string | null;
  busy: boolean;
  onCancel: () => void;
  onSave: (currentPassword: string, newPassword: string) => void;
}

/** Admin only: the current password, the new one twice, then a confirmation (SC-022). */
export function PasswordForm({ busy, error, onCancel, onSave }: Readonly<PasswordFormProps>) {
  const [values, setValues] = useState({ current: '', next: '', repeat: '' });
  const { current, next, repeat } = values;
  const change = (patch: Partial<typeof values>) => setValues((old) => ({ ...old, ...patch }));
  const { back, confirming, problem, review } = useConfirmStep(() =>
    current ? validateNewPassword(next, repeat) : 'Вкажіть поточний пароль.',
  );

  return (
    <FormFrame
      actions={
        confirming ? (
          <>
            <Button label="Назад" onPress={back} variant="text" />
            <Button label="Так, змінити" onPress={() => onSave(current, next)} />
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
      title="Пароль"
    >
      {confirming ? (
        <AppText variant="body">Змінити пароль? Інші пристрої вийдуть з акаунта.</AppText>
      ) : (
        <>
          <TextField
            label="Поточний пароль"
            onChangeText={(text) => change({ current: text })}
            secret
            value={current}
          />
          <TextField
            label="Новий пароль"
            onChangeText={(text) => change({ next: text })}
            secret
            value={next}
          />
          <TextField
            label="Повторіть новий пароль"
            onChangeText={(text) => change({ repeat: text })}
            secret
            value={repeat}
          />
        </>
      )}
    </FormFrame>
  );
}
