import { configureApiClient } from '@admin/shared/api-client';

import { setAccessToken } from './session-state';
import { requestLogin, requestLogout } from './session-transport';

import type { LoginRequest } from './session-transport';

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

export const initializeAdminAuth = (): Promise<void> => {
  configureApiClient({});
  setAccessToken(null);
  return Promise.resolve();
};
