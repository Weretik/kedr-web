import type { CheckoutFormValues } from './checkout-form';
import type { ApiError } from '@mobile/shared/api-client';
import type { UseFormSetError } from 'react-hook-form';

export function applyOrderError(
  error: unknown,
  setError: UseFormSetError<CheckoutFormValues>,
): string {
  const apiError = error as Partial<ApiError>;

  for (const [field, messages] of Object.entries(apiError.fieldErrors ?? {})) {
    const message = messages[0];
    if (!message) continue;
    const normalized = field.toLocaleLowerCase('en-US');
    if (normalized.includes('counterparty')) setError('counterpartyId', { message });
    else if (normalized.includes('comment')) setError('comment', { message });
  }

  if (apiError.status === 404) {
    setError('counterpartyId', { message: 'Обраного клієнта більше не знайдено.' });
  }

  if (apiError.status === 409) {
    return 'Замовлення конфліктує з актуальними даними. Перевірте кошик і повторіть.';
  }

  return apiError.message ?? 'Не вдалося оформити замовлення. Спробуйте ще раз.';
}

export function canReuseOrderAttempt(error: unknown): boolean {
  const code = (error as Partial<ApiError>).code ?? '';
  return ['Network', 'Timeout', 'Server', 'Unknown'].includes(code);
}
