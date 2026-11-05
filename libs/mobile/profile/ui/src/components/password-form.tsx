import { validateNewPassword } from '@mobile/profile/model';
import { AppText, Button, TextField } from '@mobile/shared/ui';
import { useState } from 'react';

import { FormFrame } from './form-frame';

export interface PasswordFormProps {
  error: string | null;
  busy: boolean;
  onCancel: () => void;
  onSave: (currentPassword: string, newPassword: string) => void;
}

/** Admin only: the current password, the new one twice, then a confirmation (SC-022). */
export function PasswordForm({ busy, error, onCancel, onSave }: Readonly<PasswordFormProps>) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [repeat, setRepeat] = useState('');
  const [problem, setProblem] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  const review = () => {
    const found = current ? validateNewPassword(next, repeat) : 'Вкажіть поточний пароль.';
    setProblem(found);
    if (!found) setConfirming(true);
  };

  return (
    <FormFrame
      actions={
        confirming ? (
          <>
            <Button label="Назад" onPress={() => setConfirming(false)} variant="text" />
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
          <TextField label="Поточний пароль" onChangeText={setCurrent} secret value={current} />
          <TextField label="Новий пароль" onChangeText={setNext} secret value={next} />
          <TextField
            label="Повторіть новий пароль"
            onChangeText={setRepeat}
            secret
            value={repeat}
          />
        </>
      )}
    </FormFrame>
  );
}
