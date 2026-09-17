import { applyOrderError, canReuseOrderAttempt } from './order-error';

import type { CheckoutFormValues } from './checkout-form';
import type { UseFormSetError } from 'react-hook-form';

describe('order error handling', () => {
  it('maps backend validation errors to the matching checkout fields', () => {
    const setError = jest.fn() as UseFormSetError<CheckoutFormValues>;

    expect(
      applyOrderError(
        {
          code: 'Validation',
          fieldErrors: {
            Comment: ['Коментар задовгий.'],
            CounterpartyId: ['Клієнта не знайдено.'],
          },
          message: 'Перевірте форму.',
          status: 400,
        },
        setError,
      ),
    ).toBe('Перевірте форму.');
    expect(setError).toHaveBeenCalledWith('comment', { message: 'Коментар задовгий.' });
    expect(setError).toHaveBeenCalledWith('counterpartyId', {
      message: 'Клієнта не знайдено.',
    });
  });

  it('reuses an idempotency attempt only for transient failures', () => {
    expect(canReuseOrderAttempt({ code: 'Network' })).toBe(true);
    expect(canReuseOrderAttempt({ code: 'Server' })).toBe(true);
    expect(canReuseOrderAttempt({ code: 'Validation' })).toBe(false);
  });
});
