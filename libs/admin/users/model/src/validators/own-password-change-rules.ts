import { validateStaffPassword } from './staff-account-rules';

export interface OwnPasswordValues {
  currentPassword: string;
  newPassword: string;
  repeat: string;
}

export type OwnPasswordErrors = Partial<Record<keyof OwnPasswordValues, string>>;

export const emptyOwnPasswordValues: OwnPasswordValues = {
  currentPassword: '',
  newPassword: '',
  repeat: '',
};

/** Errors of «Змінити пароль»: the current password, a valid new one, and a matching repeat. */
export function ownPasswordChangeErrors(values: OwnPasswordValues): OwnPasswordErrors {
  return {
    currentPassword: values.currentPassword ? undefined : 'Вкажіть поточний пароль.',
    newPassword: validateStaffPassword(values.newPassword),
    repeat: values.repeat === values.newPassword ? undefined : 'Паролі не збігаються.',
  };
}

export const hasOwnPasswordErrors = (errors: OwnPasswordErrors) =>
  Object.values(errors).some(Boolean);
