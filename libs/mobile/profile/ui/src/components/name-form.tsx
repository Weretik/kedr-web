import { validateName } from '@mobile/profile/model';
import { Button, TextField } from '@mobile/shared/ui';
import { useState } from 'react';

import { FormFrame } from './form-frame';

export interface NameFormProps {
  initialName: string;
  error: string | null;
  busy: boolean;
  onCancel: () => void;
  onSave: (name: string) => void;
}

/** Every staff member may change their own name (R-016). */
export function NameForm({ busy, error, initialName, onCancel, onSave }: Readonly<NameFormProps>) {
  const [name, setName] = useState(initialName);
  const [shownError, setShownError] = useState<string | null>(null);
  const save = () => {
    const problem = validateName(name);
    setShownError(problem);
    if (!problem) onSave(name.trim());
  };
  return (
    <FormFrame
      actions={
        <>
          <Button label="Скасувати" onPress={onCancel} variant="text" />
          <Button label="Зберегти імʼя" onPress={save} />
        </>
      }
      busy={busy}
      error={error}
      title="Імʼя"
    >
      <TextField
        // The form opens on the manager's tap to type a name, so the keyboard comes up at once.
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        error={shownError}
        label="Імʼя та прізвище"
        onChangeText={setName}
        value={name}
      />
    </FormFrame>
  );
}
