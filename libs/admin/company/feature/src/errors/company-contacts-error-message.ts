import { companyContactsFields } from '@admin/company/model';

import type { CompanyContactsErrors } from '@admin/company/model';

interface ContactsApiError {
  code?: string;
  fieldErrors?: Record<string, string[]>;
}

const asApiError = (error: unknown) =>
  (typeof error === 'object' && error !== null ? error : {}) as ContactsApiError;

/**
 * Server field errors under the fields they belong to. The backend reasons are in English, so each field
 * gets a short Ukrainian message; the local validator normally catches these first.
 */
export function companyContactsServerErrors(error: unknown): CompanyContactsErrors | undefined {
  const apiError = asApiError(error);
  if (apiError.code !== 'Validation') return undefined;
  const errors: CompanyContactsErrors = {};
  for (const [key, messages] of Object.entries(apiError.fieldErrors ?? {})) {
    const field = companyContactsFields.find((name) => name.toLowerCase() === key.toLowerCase());
    if (field && messages.length) errors[field] = 'Сервер не прийняв це значення. Перевірте його.';
  }
  return Object.keys(errors).length ? errors : undefined;
}

/** Turns an error of a contacts request into a message for the page. */
export function companyContactsErrorMessage(error: unknown): string {
  const apiError = asApiError(error);
  if (apiError.code === 'Forbidden') return 'Недостатньо прав для цієї дії.';
  if (apiError.code === 'Validation') return 'Сервер не прийняв дані. Перевірте поля.';
  return 'Не вдалося зберегти. Спробуйте ще раз.';
}
