import { ProfileError, type PickedPhoto, type ProfileApi } from '@mobile/profile/data-access';
import { profileErrorMessage } from '@mobile/profile/model';
import { useState } from 'react';

import type { CabinetUser } from '../components/cabinet-profile';

export type CabinetEditing = 'email' | 'name' | 'password' | null;

interface CabinetProfileOptions {
  user: CabinetUser;
  api: ProfileApi;
  pickPhoto: () => Promise<PickedPhoto | null>;
  onUserChanged: (change: Partial<Pick<CabinetUser, 'avatarUrl' | 'email' | 'fullName'>>) => void;
  onCredentialsChanged: (email: string, password: string) => Promise<void>;
}

const messageOf = (error: unknown) =>
  error instanceof ProfileError
    ? profileErrorMessage(error.failure)
    : 'Не вдалося зберегти. Спробуйте ще раз.';

/** Which profile form is open, the save in progress, and its result (R-016, SC-021, SC-022). */
export function useCabinetProfile({
  api,
  onCredentialsChanged,
  onUserChanged,
  pickPhoto,
  user,
}: CabinetProfileOptions) {
  const [editing, setEditing] = useState<CabinetEditing>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const run = async (action: () => Promise<string>) => {
    setBusy(true);
    setError(null);
    setNotice(null);
    // No `finally`: React Compiler cannot compile it yet, and both branches end the same way.
    try {
      setNotice(await action());
      setEditing(null);
    } catch (failure) {
      setError(messageOf(failure));
    }
    setBusy(false);
  };

  return {
    editing,
    busy,
    error,
    notice,
    open: (next: CabinetEditing) => {
      setError(null);
      setNotice(null);
      setEditing(next);
    },
    changePhoto: async () => {
      const photo = await pickPhoto();
      if (!photo) return;
      await run(async () => {
        onUserChanged({ avatarUrl: await api.uploadAvatar(photo) });
        return 'Фото змінено.';
      });
    },
    removePhoto: () =>
      run(async () => {
        await api.removeAvatar();
        onUserChanged({ avatarUrl: null });
        return 'Фото прибрано.';
      }),
    saveName: (fullName: string) =>
      run(async () => {
        await api.changeName(fullName);
        onUserChanged({ fullName });
        return 'Імʼя змінено.';
      }),
    saveEmail: (email: string, password: string) =>
      run(async () => {
        await api.changeEmail(email, password);
        onUserChanged({ email });
        await onCredentialsChanged(email, password);
        return 'E-mail змінено.';
      }),
    savePassword: (current: string, next: string) =>
      run(async () => {
        await api.changePassword(current, next);
        await onCredentialsChanged(user.email, next);
        return 'Пароль змінено.';
      }),
  };
}
