import { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';

import { toApiError } from './api-error';

describe('toApiError', () => {
  it('normalizes ASP.NET Core validation problem details', () => {
    const error = new AxiosError('Bad request');
    error.response = {
      data: {
        detail: 'One or more validation errors occurred.',
        errors: { Email: ['Email is invalid.'] },
        traceId: '00-abc',
      },
      status: 400,
    } as typeof error.response;

    expect(toApiError(error)).toEqual({
      code: 'Validation',
      status: 400,
      message: 'One or more validation errors occurred.',
      fieldErrors: { Email: ['Email is invalid.'] },
      traceId: '00-abc',
    });
  });

  it('normalizes Ardalis validation errors', () => {
    const error = new AxiosError('Unprocessable entity');
    error.response = {
      data: [{ Identifier: 'Name', ErrorMessage: 'Name is required.' }],
      status: 422,
    } as typeof error.response;

    expect(toApiError(error)).toEqual({
      code: 'Validation',
      status: 422,
      message: 'Unprocessable entity',
      fieldErrors: { Name: ['Name is required.'] },
      traceId: undefined,
    });
  });

  it('normalizes a network error', () => {
    expect(toApiError(new AxiosError('Network unavailable'))).toEqual({
      code: 'Network',
      status: 0,
      message: 'Network unavailable',
    });
  });
});
