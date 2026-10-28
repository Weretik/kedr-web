import { AxiosHeaders } from 'axios';

import { getMobileAuth } from '../auth/mobile-auth-adapter';

import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

type RetriableConfig = InternalAxiosRequestConfig & { authRetried?: boolean };

const isAuthRequest = (url: string | undefined) => url?.includes('/api/auth/mobile/') ?? false;

const withBearer = (config: InternalAxiosRequestConfig, token: string) => {
  const headers = AxiosHeaders.from(config.headers);
  headers.set('Authorization', `Bearer ${token}`);
  config.headers = headers;
  return config;
};

/** Adds the bearer token and, on a 401, refreshes the token pair once and repeats the request. */
export function installBearerAuth(client: AxiosInstance): void {
  client.interceptors.request.use((config) => {
    const token = isAuthRequest(config.url) ? null : getMobileAuth()?.getAccessToken();
    return token ? withBearer(config, token) : config;
  });

  client.interceptors.response.use(undefined, async (error: AxiosError) => {
    const auth = getMobileAuth();
    const config = error.config as RetriableConfig | undefined;

    if (!auth || !config || error.response?.status !== 401 || isAuthRequest(config.url)) {
      throw error;
    }

    if (config.authRetried) {
      auth.onUnauthenticated();
      throw error;
    }

    const token = await auth.refreshAccessToken();
    if (!token) {
      auth.onUnauthenticated();
      throw error;
    }

    config.authRetried = true;
    return client.request(withBearer(config, token));
  });
}
