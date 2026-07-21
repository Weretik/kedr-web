import axios from 'axios';

import type { ApiError } from './api-client.types';

type ProblemDetails = {
  detail?: string;
  errors?: Record<string, string[]>;
  title?: string;
  traceId?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const toStringArray = (value: unknown) =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')
    ? value
    : undefined;

const toProblemDetails = (value: unknown): ProblemDetails | undefined => {
  if (!isRecord(value)) {
    return undefined;
  }

  const errors = isRecord(value['errors'])
    ? Object.entries(value['errors']).reduce<Record<string, string[]>>(
        (mapped, [key, messages]) => {
          const stringMessages = toStringArray(messages);

          if (stringMessages) {
            mapped[key] = stringMessages;
          }

          return mapped;
        },
        {},
      )
    : undefined;

  return {
    detail: typeof value['detail'] === 'string' ? value['detail'] : undefined,
    errors: errors && Object.keys(errors).length > 0 ? errors : undefined,
    title: typeof value['title'] === 'string' ? value['title'] : undefined,
    traceId: typeof value['traceId'] === 'string' ? value['traceId'] : undefined,
  };
};

const toArdalisFieldErrors = (value: unknown) => {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const fieldErrors = value.reduce<Record<string, string[]>>((mapped, item) => {
    if (!isRecord(item)) {
      return mapped;
    }

    const identifier = item['identifier'] ?? item['Identifier'];
    const errorMessage = item['errorMessage'] ?? item['ErrorMessage'];

    if (typeof identifier === 'string' && typeof errorMessage === 'string') {
      (mapped[identifier] ??= []).push(errorMessage);
    }

    return mapped;
  }, {});

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
};

export const toApiError = (error: unknown): ApiError => {
  if (!axios.isAxiosError(error)) {
    return {
      code: 'Unknown',
      message: 'An unexpected client error occurred.',
    };
  }

  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return {
      code: 'Timeout',
      message: 'Request timeout. Try again.',
    };
  }

  if (!error.response) {
    return {
      code: 'Network',
      status: 0,
      message: error.message || 'Network error. Check connection.',
    };
  }

  const { data, status } = error.response;
  const problemDetails = toProblemDetails(data);
  const fieldErrors = toArdalisFieldErrors(data) ?? problemDetails?.errors;
  const message =
    problemDetails?.detail?.trim() ||
    problemDetails?.title?.trim() ||
    error.message ||
    'Request failed';

  if (status === 401) {
    return { code: 'Unauthorized', status, message: 'Unauthorized' };
  }

  if (status === 403) {
    return { code: 'Forbidden', status, message: 'Forbidden' };
  }

  if (status === 404) {
    return { code: 'NotFound', status, message: 'Not found' };
  }

  if (fieldErrors && status >= 400 && status < 500) {
    return {
      code: 'Validation',
      status,
      message,
      fieldErrors,
      traceId: problemDetails?.traceId,
    };
  }

  if (status >= 500) {
    return {
      code: 'Server',
      status,
      message,
      traceId: problemDetails?.traceId,
    };
  }

  return {
    code: 'Unknown',
    status,
    message,
    traceId: problemDetails?.traceId,
  };
};
