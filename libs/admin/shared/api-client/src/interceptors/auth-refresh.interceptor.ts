import { notifyApiError, getAuthSession } from '../runtime/api-client-runtime';

import type { TimedRequestConfig } from './api-logging.interceptor';
import type { AxiosError, AxiosInstance } from 'axios';

interface RetriableRequestConfig extends TimedRequestConfig {
  _retryAfterRefresh?: boolean;
}

let refreshPromise: Promise<string | null> | undefined;

export async function retryAfterAuthRefresh(
  client: AxiosInstance,
  error: AxiosError,
): Promise<never> {
  const requestConfig = error.config as RetriableRequestConfig | undefined;

  if (
    error.response?.status !== 401 ||
    !requestConfig ||
    requestConfig._retryAfterRefresh ||
    isAuthSessionRequest(requestConfig.url)
  ) {
    notifyApiError(error);
    return Promise.reject(error);
  }

  requestConfig._retryAfterRefresh = true;

  try {
    const accessToken = await refreshAccessToken();

    if (!accessToken) {
      await getAuthSession()?.onUnauthenticated?.();
      notifyApiError(error);
      return Promise.reject(error);
    }

    requestConfig.headers.Authorization = `Bearer ${accessToken}`;

    return client.request(requestConfig);
  } catch {
    await getAuthSession()?.onUnauthenticated?.();
    notifyApiError(error);
    return Promise.reject(error);
  }
}

function isAuthSessionRequest(url: string | undefined): boolean {
  return url?.includes('/api/auth/session/') ?? false;
}

function refreshAccessToken(): Promise<string | null> {
  const authSession = getAuthSession();

  if (!authSession?.refreshAccessToken) {
    return Promise.resolve(null);
  }

  if (!refreshPromise) {
    refreshPromise = authSession.refreshAccessToken().finally(() => {
      refreshPromise = undefined;
    });
  }

  return refreshPromise;
}
