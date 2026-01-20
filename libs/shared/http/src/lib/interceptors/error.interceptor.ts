import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { ApiError } from '@shared/util';
import { catchError, throwError } from 'rxjs';

type ProblemDetails = {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  traceId?: string;
  errors?: Record<string, string[]>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((x) => typeof x === 'string');
}

function toProblemDetails(value: unknown): ProblemDetails | undefined {
  if (!isRecord(value)) return undefined;

  const errorsRaw = value['errors'];
  let errors: Record<string, string[]> | undefined;

  if (isRecord(errorsRaw)) {
    const mapped: Record<string, string[]> = {};
    for (const [k, v] of Object.entries(errorsRaw)) {
      if (isStringArray(v)) mapped[k] = v;
    }
    if (Object.keys(mapped).length > 0) errors = mapped;
  }

  return {
    type: typeof value['type'] === 'string' ? value['type'] : undefined,
    title: typeof value['title'] === 'string' ? value['title'] : undefined,
    status: typeof value['status'] === 'number' ? value['status'] : undefined,
    detail: typeof value['detail'] === 'string' ? value['detail'] : undefined,
    instance:
      typeof value['instance'] === 'string' ? value['instance'] : undefined,
    traceId:
      typeof value['traceId'] === 'string' ? value['traceId'] : undefined,
    errors,
  };
}

function mapHttpError(err: HttpErrorResponse): ApiError {
  if (err.status === 0) {
    const message =
      err.error instanceof ProgressEvent
        ? 'Network error (blocked/aborted/offline).'
        : 'Network error. Check connection.';
    return { code: 'Network', status: 0, message };
  }

  if (err.status === 401)
    return { code: 'Unauthorized', status: 401, message: 'Unauthorized' };
  if (err.status === 403)
    return { code: 'Forbidden', status: 403, message: 'Forbidden' };
  if (err.status === 404)
    return { code: 'NotFound', status: 404, message: 'Not found' };

  const pd = toProblemDetails(err.error);
  const fieldErrors = pd?.errors;

  const message =
    pd?.detail?.trim() || pd?.title?.trim() || err.message || 'Request failed';

  if (fieldErrors && err.status >= 400 && err.status < 500) {
    return {
      code: 'Validation',
      status: err.status,
      message: message || 'Validation failed',
      fieldErrors,
      traceId: pd?.traceId,
    };
  }

  if (err.status >= 500) {
    return {
      code: 'Server',
      status: err.status,
      message: message || 'Server error',
      traceId: pd?.traceId,
    };
  }

  return {
    code: 'Unknown',
    status: err.status,
    message,
    traceId: pd?.traceId,
  };
}

export const errorInterceptor: HttpInterceptorFn = (_req, next) =>
  next(_req).pipe(
    catchError((e: unknown) => {
      const httpErr =
        e instanceof HttpErrorResponse
          ? e
          : new HttpErrorResponse({ error: e });

      return throwError(() => mapHttpError(httpErr));
    }),
  );
