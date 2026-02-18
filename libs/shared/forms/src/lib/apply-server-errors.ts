import { AbstractControl, FormGroup } from '@angular/forms';
import { ApiError } from '@shared/util';

export function applyServerErrors(form: FormGroup, error: ApiError): void {
  if (error.code !== 'Validation' || !error.fieldErrors) return;

  for (const [rawKey, messages] of Object.entries(error.fieldErrors)) {
    const key = normalizeKey(rawKey);
    const control = findControl(form, key);

    if (!control) continue;

    const current = control.errors ?? {};
    control.setErrors({
      ...current,
      server: messages,
    });

    control.markAsTouched();
    control.updateValueAndValidity({ emitEvent: false });
  }
}

function normalizeKey(key: string): string {
  if (!key) return key;
  const parts = key.split('.');
  const lastPart = parts[parts.length - 1];

  return lastPart.length === 1
    ? lastPart.toLowerCase()
    : lastPart[0].toLowerCase() + lastPart.slice(1);
}

function findControl(form: FormGroup, path: string): AbstractControl | null {
  return form.get(path) ?? form.get(fallbackVariants(path)) ?? null;
}

function fallbackVariants(path: string): string {
  return path[0].toUpperCase() + path.slice(1);
}
