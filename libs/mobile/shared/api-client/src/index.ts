export type { ApiError, ApiErrorCode, ApiRequest } from './contracts/api-client.types';
export { isUnexpectedApiError, toApiError } from './errors/api-error';
export { baseApi } from './rtk-query/base-api';
export { apiErrorNotifierMiddleware, registerApiErrorNotifier } from './runtime/error-notifier';
export { configureMobileAuth } from './auth/mobile-auth-adapter';
export type { MobileAuthAdapter } from './auth/mobile-auth-adapter';
