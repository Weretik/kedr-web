import {
  useChangeStaffEmailMutation,
  useChangeStaffNameMutation,
  useRemoveStaffAvatarMutation,
  useSetStaffPasswordMutation,
  useUploadStaffAvatarMutation,
} from '@admin/users/data-access';
import { useState } from 'react';

import { useAvatarChange } from './use-avatar-change';
import { useConfirmedChange } from './use-confirmed-change';

import type { StaffAccount } from '@admin/users/model';
import type { StaffAccountAction } from '@admin/users/ui';

export type StaffProfileAction = Extract<
  StaffAccountAction,
  { type: 'changeName' | 'changeEmail' | 'setPassword' | 'uploadAvatar' | 'removeAvatar' }
>;

const profileActionTypes: ReadonlySet<StaffAccountAction['type']> = new Set([
  'changeName',
  'changeEmail',
  'setPassword',
  'uploadAvatar',
  'removeAvatar',
]);

export const isStaffProfileAction = (action: StaffAccountAction): action is StaffProfileAction =>
  profileActionTypes.has(action.type);

type EditDialog = { account: StaffAccount; field: 'name' | 'email' | 'password' } | null;

/** A manager's name, email, password and photo, edited by an admin; every change is confirmed. */
export function useStaffProfileActions(onSuccess: (message: string) => void) {
  const [changeName] = useChangeStaffNameMutation();
  const [changeEmail] = useChangeStaffEmailMutation();
  const [setPassword] = useSetStaffPasswordMutation();
  const [uploadAvatar] = useUploadStaffAvatarMutation();
  const [removeAvatar] = useRemoveStaffAvatarMutation();
  const confirmation = useConfirmedChange(onSuccess);
  const avatar = useAvatarChange();
  const [editDialog, setEditDialog] = useState<EditDialog>(null);

  const start = (account: StaffAccount, action: StaffProfileAction) => {
    avatar.clearFileError();
    switch (action.type) {
      case 'changeName':
        return setEditDialog({ account, field: 'name' });
      case 'changeEmail':
        return setEditDialog({ account, field: 'email' });
      case 'setPassword':
        return setEditDialog({ account, field: 'password' });
      case 'uploadAvatar':
        return void avatar.choose(action.file, {
          subject: account.fullName || account.email,
          request: confirmation.request,
          upload: (file) => uploadAvatar({ userId: account.id, file }).unwrap(),
        });
      case 'removeAvatar':
        return confirmation.request({
          title: 'Видалити фото?',
          description: `Фото ${account.email} буде видалено, замість нього зʼявиться перша літера імені.`,
          confirmLabel: 'Видалити фото',
          destructive: true,
          successMessage: 'Фото видалено.',
          run: () => removeAvatar({ userId: account.id }).unwrap(),
        });
    }
  };

  /** The edit form collected a valid value; ask to confirm it before saving. */
  const submitEdit = (value: string) => {
    if (!editDialog) return;
    const { account, field } = editDialog;
    setEditDialog(null);

    if (field === 'name') {
      if (value === account.fullName) return;
      confirmation.request({
        title: 'Змінити імʼя?',
        description: `${account.email}: імʼя зміниться на «${value}».`,
        confirmLabel: 'Змінити імʼя',
        successMessage: 'Імʼя змінено.',
        run: () => changeName({ userId: account.id, fullName: value }).unwrap(),
      });
    } else if (field === 'email') {
      if (value.toLowerCase() === account.email.toLowerCase()) return;
      confirmation.request({
        title: 'Змінити email?',
        description: `Новий логін для ${account.fullName || account.email}: ${value}. Менеджер вийде з системи на всіх пристроях.`,
        confirmLabel: 'Змінити email',
        successMessage: 'Email змінено.',
        run: () => changeEmail({ userId: account.id, email: value }).unwrap(),
      });
    } else {
      confirmation.request({
        title: 'Змінити пароль?',
        description: `${account.email}: після зміни пароля всі сесії цього користувача завершаться.`,
        confirmLabel: 'Змінити пароль',
        successMessage: `Пароль для ${account.email} змінено.`,
        run: () => setPassword({ userId: account.id, password: value }).unwrap(),
      });
    }
  };

  return {
    closeEdit: () => setEditDialog(null),
    confirmation,
    editDialog,
    fileError: avatar.fileError,
    clearFileError: avatar.clearFileError,
    start,
    submitEdit,
  };
}
