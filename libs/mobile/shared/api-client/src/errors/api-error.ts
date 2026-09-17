import axios from 'axios';

import type { ApiError } from '../contracts/api-client.types';

interface ProblemDetails {
  detail?: string;
  errors?: Record<string, string[]>;
  title?: string;
  traceId?: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const toStringArray = (value: unknown): string[] | undefined =>
  Array.isArray(value) && value.every((item) => typeof item === 'string') ? value : undefined;

function toProblemDetails(value: unknown): ProblemDetails | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const errors = isRecord(value['errors'])
    ? Object.entries(value['errors']).reduce<Record<string, string[]>>(
        (mapped, [field, messages]) => {
          const stringMessages = toStringArray(messages);

          if (stringMessages) {
            mapped[field] = stringMessages;
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
}

function toArdalisFieldErrors(value: unknown): Record<string, string[]> | undefined {
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
}

export function toApiError(error: unknown): ApiError {
  if (!axios.isAxiosError(error)) {
    return { code: 'Unknown', message: 'Сталася неочікувана помилка застосунку.' };
  }

  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return { code: 'Timeout', message: 'Час очікування відповіді вичерпано. Спробуйте ще раз.' };
  }

  if (!error.response) {
    return {
      code: 'Network',
      message: error.message || 'Помилка мережі. Перевірте підключення.',
      status: 0,
    };
  }

  const { data, status } = error.response;
  const problemDetails = toProblemDetails(data);
  const fieldErrors = toArdalisFieldErrors(data) ?? problemDetails?.errors;
  const message =
    problemDetails?.detail?.trim() ||
    problemDetails?.title?.trim() ||
    error.message ||
    'Не вдалося виконати запит.';

  if (status === 401) return { code: 'Unauthorized', message: 'Не авторизовано.', status };
  if (status === 403) return { code: 'Forbidden', message: 'Доступ заборонено.', status };
  if (status === 404) return { code: 'NotFound', message: 'Ресурс не знайдено.', status };

  if (fieldErrors && status >= 400 && status < 500) {
    return { code: 'Validation', fieldErrors, message, status, traceId: problemDetails?.traceId };
  }

  if (status >= 500) {
    return { code: 'Server', message, status, traceId: problemDetails?.traceId };
  }

  return { code: 'Unknown', message, status, traceId: problemDetails?.traceId };
}

export function isUnexpectedApiError(error: unknown): error is ApiError {
  return (
    isRecord(error) &&
    typeof error['code'] === 'string' &&
    ['Network', 'Timeout', 'Server', 'Unknown'].includes(error['code'])
  );
}
