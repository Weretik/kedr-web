import { configureApiClient } from '@admin/shared/api-client';

import { getAccessToken, setAccessToken } from './session-state';
import { requestAccessTokenRefresh, requestLogin, requestLogout } from './session-transport';

import type { LoginRequest } from './session-transport';

const refreshAccessToken = async (): Promise<string> => {
  const nextAccessToken = await requestAccessTokenRefresh();
  setAccessToken(nextAccessToken);

  return nextAccessToken;
};

export const login = async (request: LoginRequest): Promise<void> => {
  const nextAccessToken = await requestLogin(request);
  setAccessToken(nextAccessToken);
};

export const logout = async (): Promise<void> => {
  try {
    await requestLogout();
  } finally {
    setAccessToken(null);
  }
};

export const initializeAdminAuth = async (): Promise<void> => {
  configureApiClient({
    authSession: {
      getAccessToken,
      refreshAccessToken,
      onUnauthenticated: () => setAccessToken(null),
    },
  });

  try {
    await refreshAccessToken();
  } catch {
    setAccessToken(null);
  }
};
