export { baseApi } from './lib/base-api';
export { configureApiClient, configureApiErrorNotifier } from './lib/axios-client';
export { toApiError } from './lib/api-error';

export type {
  ApiClientOptions,
  ApiError,
  ApiErrorNotifier,
  ApiErrorCode,
  ApiRequest,
  AuthSessionAdapter,
} from './lib/api-client.types';
