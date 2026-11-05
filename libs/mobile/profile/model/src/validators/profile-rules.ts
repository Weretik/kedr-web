/** KedrStore limits for the own profile (`profile.openapi.yaml`). */
export const maxNameLength = 100;
export const minPasswordLength = 8;
export const maxPasswordLength = 128;
export const maxEmailLength = 256;

export function validateName(name: string): string | null {
  const trimmed = name.trim();
  if (trimmed.length === 0) return 'Вкажіть імʼя.';
  if (trimmed.length > maxNameLength) return `Не довше ${maxNameLength} символів.`;
  return null;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!emailPattern.test(trimmed)) return 'Вкажіть коректний e-mail.';
  if (trimmed.length > maxEmailLength) return 'Задовгий e-mail.';
  return null;
}

export function validateNewPassword(password: string, repeat: string): string | null {
  if (password.length < minPasswordLength) return `Щонайменше ${minPasswordLength} символів.`;
  if (password.length > maxPasswordLength) return `Не довше ${maxPasswordLength} символів.`;
  if (password !== repeat) return 'Паролі не збігаються.';
  return null;
}

/** «Адміністратор» or «Менеджер», as the Admin shows the role. */
export const roleLabel = (roles: readonly string[]): string =>
  roles.includes('Admin') ? 'Адміністратор' : 'Менеджер';
