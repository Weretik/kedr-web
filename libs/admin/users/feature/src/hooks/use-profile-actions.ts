import {
  useChangeMyEmailMutation,
  useChangeMyNameMutation,
  useChangeMyPasswordMutation,
  useRemoveMyAvatarMutation,
  useUploadMyAvatarMutation,
} from '@admin/users/data-access';
import { useState } from 'react';

import { useConfirmedChange } from './use-confirmed-change';
import { useAvatarChange } from '../avatar/use-avatar-change';

import type { StaffProfile } from '@admin/users/model';
import type { OwnEmailChange, OwnPasswordChange } from '@admin/users/ui';

type ProfileDialog = 'name' | 'email' | 'password' | null;

/**
 * Own-profile changes. Each form only collects values; the change is sent after the user confirms it,
 * and then the shell re-reads the session so the header shows the new name or photo.
 */
export function useProfileActions(
  profile: StaffProfile | undefined,
  onProfileChanged: () => Promise<void>,
  onSuccess: (message: string) => void,
) {
  const [changeName] = useChangeMyNameMutation();
  const [changeEmail] = useChangeMyEmailMutation();
  const [changePassword] = useChangeMyPasswordMutation();
  const [uploadAvatar] = useUploadMyAvatarMutation();
  const [removeAvatar] = useRemoveMyAvatarMutation();
  const confirmation = useConfirmedChange(onSuccess);
  const avatar = useAvatarChange();
  const [dialog, setDialog] = useState<ProfileDialog>(null);

  // The change is already saved; a failed session refresh only delays the header update.
  const afterChange = () => onProfileChanged().catch(() => undefined);

  const submitName = (fullName: string) => {
    setDialog(null);
    if (fullName === profile?.fullName) return;

    confirmation.request({
      title: 'Змінити імʼя?',
      description: `Ваше імʼя зміниться на «${fullName}».`,
      confirmLabel: 'Змінити імʼя',
      successMessage: 'Імʼя змінено.',
      run: async () => {
        await changeName(fullName).unwrap();
        await afterChange();
      },
    });
  };

  const submitEmail = (change: OwnEmailChange) => {
    setDialog(null);
    confirmation.request({
      title: 'Змінити email?',
      description: `Новий логін: ${change.email}. На інших пристроях потрібно буде увійти знову.`,
      confirmLabel: 'Змінити email',
      successMessage: 'Email змінено.',
      run: async () => {
        await changeEmail(change).unwrap();
        await afterChange();
      },
    });
  };

  const submitPassword = (change: OwnPasswordChange) => {
    setDialog(null);
    confirmation.request({
      title: 'Змінити пароль?',
      description:
        'На цьому пристрої ви залишитеся в системі, на інших — потрібно буде увійти знову.',
      confirmLabel: 'Змінити пароль',
      successMessage: 'Пароль змінено.',
      run: () => changePassword(change).unwrap(),
    });
  };

  const chooseAvatar = (file: File) =>
    void avatar.choose(file, {
      subject: 'вашого профілю',
      request: confirmation.request,
      upload: async (photo) => {
        await uploadAvatar(photo).unwrap();
        await afterChange();
      },
    });

  const requestRemoveAvatar = () => {
    avatar.clearFileError();
    confirmation.request({
      title: 'Видалити фото?',
      description: 'Замість фото буде показано першу літеру імені.',
      confirmLabel: 'Видалити фото',
      destructive: true,
      successMessage: 'Фото видалено.',
      run: async () => {
        await removeAvatar().unwrap();
        await afterChange();
      },
    });
  };

  return {
    chooseAvatar,
    closeDialog: () => setDialog(null),
    confirmation,
    dialog,
    fileError: avatar.fileError,
    openDialog: setDialog,
    requestRemoveAvatar,
    submitEmail,
    submitName,
    submitPassword,
  };
}
