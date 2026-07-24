export { baseApi } from './rtk-query/base-api';
export { toApiError } from './errors/api-error';
export { configureApiClient, configureApiErrorNotifier } from './runtime/api-client-runtime';

export type {
  ApiClientOptions,
  ApiError,
  ApiErrorNotifier,
  ApiErrorCode,
  ApiRequest,
  AuthSessionAdapter,
} from './contracts/api-client.types';
