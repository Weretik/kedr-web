import { AxiosError } from 'axios';

import { toApiError } from './api-error';

import type { InternalAxiosRequestConfig } from 'axios';

function createAxiosError(status?: number, data?: unknown, code?: string): AxiosError {
  const config = { headers: {} } as InternalAxiosRequestConfig;
  const error = new AxiosError('Request failed', code, config);

  if (status) {
    error.response = {
      config,
      data,
      headers: {},
      status,
      statusText: 'Error',
    };
  }

  return error;
}

describe('toApiError', () => {
  it('normalizes ASP.NET Problem Details validation errors', () => {
    expect(
      toApiError(
        createAxiosError(400, {
          detail: 'One or more validation errors occurred.',
          errors: { Email: ['Email is invalid.'] },
          traceId: '00-abc',
        }),
      ),
    ).toEqual({
      code: 'Validation',
      fieldErrors: { Email: ['Email is invalid.'] },
      message: 'One or more validation errors occurred.',
      status: 400,
      traceId: '00-abc',
    });
  });

  it('normalizes Ardalis validation errors', () => {
    expect(
      toApiError(
        createAxiosError(422, [{ ErrorMessage: 'Name is required.', Identifier: 'Name' }]),
      ),
    ).toEqual({
      code: 'Validation',
      fieldErrors: { Name: ['Name is required.'] },
      message: 'Request failed',
      status: 422,
      traceId: undefined,
    });
  });

  it('normalizes a network error', () => {
    expect(toApiError(new AxiosError('Network unavailable'))).toEqual({
      code: 'Network',
      message: 'Network unavailable',
      status: 0,
    });
  });

  it('normalizes a timeout error', () => {
    expect(toApiError(createAxiosError(undefined, undefined, 'ECONNABORTED'))).toEqual({
      code: 'Timeout',
      message: 'Час очікування відповіді вичерпано. Спробуйте ще раз.',
    });
  });
});
