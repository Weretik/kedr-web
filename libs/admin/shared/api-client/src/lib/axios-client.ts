import { appConfig } from '@admin/shared/config';
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import type {
  ApiClientOptions,
  ApiErrorNotifier,
  AuthSessionAdapter,
} from './api-client.types';

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retryAfterRefresh?: boolean;
  requestStartedAt?: number;
}

let authSession: AuthSessionAdapter | undefined;
let refreshPromise: Promise<string | null> | undefined;
let apiErrorNotifier: ApiErrorNotifier | undefined;

const logRequest = (config: RetriableRequestConfig) => {
  if (!appConfig.isDevelopment || !appConfig.enableHttpLogs) {
    return;
  }

  console.info('[Admin API]', config.method?.toUpperCase(), config.url);
};

const logResponse = (config: RetriableRequestConfig, status: number) => {
  if (!appConfig.isDevelopment || !appConfig.enableHttpLogs) {
    return;
  }

  const duration = config.requestStartedAt
    ? `${Date.now() - config.requestStartedAt}ms`
    : 'unknown duration';

  console.info('[Admin API]', status, config.method?.toUpperCase(), config.url, duration);
};

const isAuthSessionRequest = (url: string | undefined) =>
  url?.includes('/api/auth/session/') ?? false;

const refreshAccessToken = () => {
  if (!authSession?.refreshAccessToken) {
    return Promise.resolve(null);
  }

  if (!refreshPromise) {
    refreshPromise = authSession.refreshAccessToken().finally(() => {
      refreshPromise = undefined;
    });
  }

  return refreshPromise;
};

export const axiosClient = axios.create({
  baseURL: appConfig.apiBaseUrl,
  withCredentials: true,
});

axiosClient.interceptors.request.use(async (config) => {
  const requestConfig = config as RetriableRequestConfig;
  requestConfig.requestStartedAt = Date.now();

  const accessToken = await authSession?.getAccessToken();

  if (accessToken) {
    requestConfig.headers.Authorization = `Bearer ${accessToken}`;
  }

  logRequest(requestConfig);

  return requestConfig;
});

axiosClient.interceptors.response.use(
  (response) => {
    logResponse(response.config as RetriableRequestConfig, response.status);

    return response;
  },
  async (error: AxiosError) => {
    const requestConfig = error.config as RetriableRequestConfig | undefined;

    if (requestConfig) {
      logResponse(requestConfig, error.response?.status ?? 0);
    }

    if (
      error.response?.status !== 401 ||
      !requestConfig ||
      requestConfig._retryAfterRefresh ||
      isAuthSessionRequest(requestConfig.url)
    ) {
      apiErrorNotifier?.(error);
      return Promise.reject(error);
    }

    requestConfig._retryAfterRefresh = true;

    try {
      const accessToken = await refreshAccessToken();

      if (!accessToken) {
        await authSession?.onUnauthenticated?.();
        apiErrorNotifier?.(error);
        return Promise.reject(error);
      }

      requestConfig.headers.Authorization = `Bearer ${accessToken}`;

      return axiosClient.request(requestConfig);
    } catch {
      await authSession?.onUnauthenticated?.();
      apiErrorNotifier?.(error);

      return Promise.reject(error);
    }
  },
);

export const configureApiClient = ({ authSession: nextAuthSession }: ApiClientOptions) => {
  authSession = nextAuthSession;
};

export const configureApiErrorNotifier = (nextApiErrorNotifier: ApiErrorNotifier) => {
  apiErrorNotifier = nextApiErrorNotifier;
};
