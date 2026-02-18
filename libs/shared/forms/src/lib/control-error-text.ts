import { AbstractControl } from '@angular/forms';

export function controlErrorText(
  control: AbstractControl | null,
): string | null {
  if (!control || !control.errors) return null;
  if (!control.touched) return null;

  // server errors
  const server = control.errors['server'] as string[] | undefined;
  if (server?.length) return server[0];

  // client validators
  if (control.errors['required']) return "Обов'язкове поле";
  if (control.errors['email']) return 'Невірний email';
  if (control.errors['minlength']) return 'Занадто коротко';
  if (control.errors['maxlength']) return 'Занадто довго';

  return 'Невірне значення';
}
