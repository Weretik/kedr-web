import { HttpError, toApiError } from '../errors/api-error';
import { notifyApiError } from '../runtime/api-client-runtime';

import type { ApiError } from '../contracts/api-client-contract';

/** What an `apiClient` call resolves to: the typed body on success, the parsed error body otherwise. */
type ApiResponse = { data?: unknown; error?: unknown; response: Response };

/** The body type of the success branch of an `apiClient` response. */
type SuccessData<R> = R extends { error?: never; data: infer Data } ? Data : never;

export type ApiCallResult<Result> = { data: Result } | { error: ApiError };

/**
 * Runs one `apiClient` call for an RTK Query `queryFn`: maps the typed body with `map`, or returns the normalized
 * `ApiError`. The mapper receives the response type of the contract, so it is checked against it.
 */
export function apiCall<R extends ApiResponse>(
  request: Promise<R>,
): Promise<ApiCallResult<SuccessData<R>>>;
export function apiCall<R extends ApiResponse, Result>(
  request: Promise<R>,
  map: (data: SuccessData<R>) => Result,
): Promise<ApiCallResult<Result>>;
export async function apiCall<R extends ApiResponse, Result>(
  request: Promise<R>,
  map?: (data: SuccessData<R>) => Result,
): Promise<ApiCallResult<Result | SuccessData<R>>> {
  try {
    const { data, error, response } = await request;
    if (!response.ok) throw new HttpError(response.status, error, response.statusText);

    return { data: map ? map(data as SuccessData<R>) : (data as SuccessData<R>) };
  } catch (error) {
    notifyApiError(error);

    return { error: toApiError(error) };
  }
}

/** The same call for code outside RTK Query: returns the mapped body or throws the `ApiError`. */
export function apiRequest<R extends ApiResponse>(request: Promise<R>): Promise<SuccessData<R>>;
export function apiRequest<R extends ApiResponse, Result>(
  request: Promise<R>,
  map: (data: SuccessData<R>) => Result,
): Promise<Result>;
export async function apiRequest<R extends ApiResponse, Result>(
  request: Promise<R>,
  map?: (data: SuccessData<R>) => Result,
): Promise<Result | SuccessData<R>> {
  const result = map ? await apiCall(request, map) : await apiCall(request);
  if ('error' in result) throw result.error;

  return result.data;
}
