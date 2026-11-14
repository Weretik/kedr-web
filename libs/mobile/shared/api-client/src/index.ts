export type { ApiError, ApiErrorCode, ApiRequest } from './contracts/api-client-contract';
export { isUnexpectedApiError, toApiError } from './errors/api-error';
export { axiosClient as apiClient } from './client/axios-client';
export { configureMobileAuth } from './auth/mobile-auth-adapter';
export type { MobileAuthAdapter } from './auth/mobile-auth-adapter';
