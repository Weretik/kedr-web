import type { ApiError, ApiErrorCode } from '../contracts/api-client-contract';

/** A response outside 2xx: its status, its parsed body, and the status text. */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly body: unknown,
    statusText = '',
  ) {
    super(statusText || `Request failed with status ${status}`);
    this.name = 'HttpError';
  }
}

const apiErrorCodes: readonly ApiErrorCode[] = [
  'Unknown',
  'Network',
  'Timeout',
  'Unauthorized',
  'Forbidden',
  'NotFound',
  'Validation',
  'Server',
];

type ProblemDetails = {
  detail?: string;
  errors?: Record<string, string[]>;
  title?: string;
  traceId?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isApiError = (value: unknown): value is ApiError =>
  isRecord(value) &&
  apiErrorCodes.includes(value['code'] as ApiErrorCode) &&
  typeof value['message'] === 'string';

const toStringArray = (value: unknown) =>
  Array.isArray(value) && value.every((item) => typeof item === 'string') ? value : undefined;

const toProblemDetails = (value: unknown): ProblemDetails | undefined => {
  if (!isRecord(value)) return undefined;

  const errors = isRecord(value['errors'])
    ? Object.entries(value['errors']).reduce<Record<string, string[]>>(
        (mapped, [key, messages]) => {
          const stringMessages = toStringArray(messages);
          if (stringMessages) mapped[key] = stringMessages;

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
  if (!Array.isArray(value)) return undefined;

  const fieldErrors = value.reduce<Record<string, string[]>>((mapped, item) => {
    if (!isRecord(item)) return mapped;

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
  if (isApiError(error)) return error;

  if (
    error instanceof DOMException &&
    (error.name === 'TimeoutError' || error.name === 'AbortError')
  ) {
    return { code: 'Timeout', message: 'Request timeout. Try again.' };
  }

  if (error instanceof TypeError) {
    return { code: 'Network', status: 0, message: 'Сервер недоступний. Перевірте зʼєднання.' };
  }

  if (!(error instanceof HttpError)) {
    return { code: 'Unknown', message: 'An unexpected client error occurred.' };
  }

  const { body: data, status } = error;
  const businessCode =
    isRecord(data) && typeof data['code'] === 'string' ? data['code'] : undefined;
  const businessMessage =
    isRecord(data) && typeof data['message'] === 'string' ? data['message'] : undefined;
  const problemDetails = toProblemDetails(data);
  const fieldErrors = toArdalisFieldErrors(data) ?? problemDetails?.errors;
  const message =
    problemDetails?.detail?.trim() ||
    problemDetails?.title?.trim() ||
    businessMessage?.trim() ||
    error.message ||
    'Request failed';

  if (status === 401) return { code: 'Unauthorized', status, message: 'Unauthorized' };
  if (status === 403) return { code: 'Forbidden', status, message: 'Forbidden' };
  if (status === 404) return { code: 'NotFound', status, message: 'Not found' };

  if (fieldErrors && status >= 400 && status < 500) {
    return {
      code: 'Validation',
      reason: businessCode,
      status,
      message,
      fieldErrors,
      traceId: problemDetails?.traceId,
    };
  }

  if (businessCode && status === 400) {
    return { code: 'Validation', reason: businessCode, status, message };
  }

  if (status >= 500) {
    return { code: 'Server', status, message, traceId: problemDetails?.traceId };
  }

  if (status === 409) return { code: 'Unknown', status, message, conflict: data };

  return { code: 'Unknown', status, message, traceId: problemDetails?.traceId };
};

/**
 * A 409 answer: the record changed since the form read it (KedrStore database rules 4) or another conflict. The form
 * shows the message and reloads the record so its version is current again.
 */
export const isConflict = (error: unknown): boolean =>
  typeof error === 'object' && error !== null && (error as { status?: unknown }).status === 409;
