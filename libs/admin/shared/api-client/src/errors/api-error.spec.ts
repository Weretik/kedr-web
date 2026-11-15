import { describe, expect, it } from 'vitest';

import { HttpError, toApiError } from './api-error';

const httpError = (statusText: string, response: { data: unknown; status: number }) =>
  new HttpError(response.status, response.data, statusText);

describe('toApiError', () => {
  it('keeps a known order-workspace error code and message', () => {
    const error = httpError('Bad request', {
      data: { code: 'unavailable_product', message: 'Недостатньо товару на складі.' },
      status: 400,
    });

    expect(toApiError(error)).toEqual({
      code: 'Validation',
      reason: 'unavailable_product',
      status: 400,
      message: 'Недостатньо товару на складі.',
    });
  });

  it('preserves a 409 quote conflict for the existing confirmation flow', () => {
    const conflict = { code: 'quote_changed', currentQuote: { totalAmount: 42 } };
    const error = httpError('Conflict', { data: conflict, status: 409 });

    expect(toApiError(error)).toMatchObject({ status: 409, conflict });
  });

  it('normalizes ASP.NET Core validation problem details', () => {
    const error = httpError('Bad request', {
      data: {
        detail: 'One or more validation errors occurred.',
        errors: { Email: ['Email is invalid.'] },
        traceId: '00-abc',
      },
      status: 400,
    });

    expect(toApiError(error)).toEqual({
      code: 'Validation',
      status: 400,
      message: 'One or more validation errors occurred.',
      fieldErrors: { Email: ['Email is invalid.'] },
      traceId: '00-abc',
    });
  });

  it('keeps the business code as the reason next to field errors', () => {
    const error = httpError('Bad request', {
      data: {
        code: 'invalid_quantity',
        detail: 'Кількість має бути більшою за нуль.',
        errors: { quantity: ['Має бути більшою за нуль.'] },
        traceId: '00-def',
      },
      status: 400,
    });

    expect(toApiError(error)).toEqual({
      code: 'Validation',
      reason: 'invalid_quantity',
      status: 400,
      message: 'Кількість має бути більшою за нуль.',
      fieldErrors: { quantity: ['Має бути більшою за нуль.'] },
      traceId: '00-def',
    });
  });

  it('normalizes Ardalis validation errors', () => {
    const error = httpError('Unprocessable entity', {
      data: [{ Identifier: 'Name', ErrorMessage: 'Name is required.' }],
      status: 422,
    });

    expect(toApiError(error)).toEqual({
      code: 'Validation',
      status: 422,
      message: 'Unprocessable entity',
      fieldErrors: { Name: ['Name is required.'] },
      traceId: undefined,
    });
  });

  it('normalizes a network error', () => {
    expect(toApiError(new TypeError('Failed to fetch'))).toEqual({
      code: 'Network',
      status: 0,
      message: 'Сервер недоступний. Перевірте зʼєднання.',
    });
  });

  it('normalizes a timeout', () => {
    expect(toApiError(new DOMException('Timed out', 'TimeoutError'))).toMatchObject({
      code: 'Timeout',
    });
  });

  it('keeps an error that is already normalized', () => {
    const error = { code: 'NotFound', status: 404, message: 'Not found' } as const;

    expect(toApiError(error)).toBe(error);
  });
});
