import type { CheckoutDraft, CheckoutFieldErrors } from './checkout-types';

export function validateCheckoutDraft(draft: CheckoutDraft): {
  valid: boolean;
  fieldErrors: CheckoutFieldErrors;
} {
  const fieldErrors: CheckoutFieldErrors = {};
  const nameLength = draft.firstName.trim().length;
  if (!nameLength) fieldErrors.firstName = ['required'];
  else if (nameLength < 3) fieldErrors.firstName = ['too-short'];
  else if (nameLength > 30) fieldErrors.firstName = ['too-long'];

  if (!draft.phone) fieldErrors.phone = ['required'];
  else if (draft.phone.length > 20) fieldErrors.phone = ['too-long'];
  else if (!/^\+38 \(0\d{2}\) \d{3}-\d{2}-\d{2}$/.test(draft.phone)) {
    fieldErrors.phone = ['invalid-phone'];
  }
  return { valid: Object.keys(fieldErrors).length === 0, fieldErrors };
}

export function formatPhoneInput(value: string): string {
  let digits = value.replace(/\D/g, '');
  if (value.trimStart().startsWith('+') && ['', '3', '38'].includes(digits)) return '+' + digits;
  if (digits.startsWith('38')) digits = digits.slice(2);
  digits = digits.slice(0, 10);
  if (!digits) return '';
  return (
    '+38 (' +
    digits.slice(0, 3) +
    (digits.length > 3 ? ') ' : '') +
    digits.slice(3, 6) +
    (digits.length > 6 ? '-' : '') +
    digits.slice(6, 8) +
    (digits.length > 8 ? '-' : '') +
    digits.slice(8, 10)
  );
}
