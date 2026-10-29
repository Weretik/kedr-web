import type { CreateStaffAccountInput } from '../entities/staff-account';

/** Matches the server rule for staff passwords. */
export const minStaffPasswordLength = 8;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type StaffAccountFieldErrors = Partial<Record<keyof CreateStaffAccountInput, string>>;

export const validateStaffPassword = (password: string): string | undefined =>
  password.length < minStaffPasswordLength
    ? `Пароль має містити щонайменше ${minStaffPasswordLength} символів.`
    : undefined;

/** Matches the server: a name is required and at most 100 characters after trimming. */
export const maxFullNameLength = 100;

export const validateFullName = (fullName: string): string | undefined => {
  const trimmed = fullName.trim();
  if (!trimmed) return 'Вкажіть імʼя.';

  return trimmed.length > maxFullNameLength
    ? `Імʼя має бути не довшим за ${maxFullNameLength} символів.`
    : undefined;
};

export const validateEmail = (email: string): string | undefined =>
  emailPattern.test(email.trim()) ? undefined : 'Вкажіть коректний email.';

export const validateStaffAccountInput = (
  input: CreateStaffAccountInput,
): StaffAccountFieldErrors => {
  const errors: StaffAccountFieldErrors = {};

  const emailError = validateEmail(input.email);
  if (emailError) {
    errors.email = emailError;
  }

  const fullNameError = validateFullName(input.fullName);
  if (fullNameError) {
    errors.fullName = fullNameError;
  }

  const passwordError = validateStaffPassword(input.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
};
