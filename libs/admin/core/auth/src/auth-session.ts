import { configureApiClient } from '@admin/shared/api-client';
import { appConfig } from '@admin/shared/config';
import axios from 'axios';

export interface LoginRequest {
  email: string;
  password: string;
}

interface SessionResponse {
  accessToken: string;
}

let accessToken: string | null = null;

const getAuthUrl = (path: string) => new URL(path, appConfig.apiBaseUrl).toString();

const getCsrfToken = () => {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookie = document.cookie
    .split('; ')
    .find((value) => value.startsWith('kedr.csrf='));

  return cookie ? decodeURIComponent(cookie.substring('kedr.csrf='.length)) : null;
};

const setAccessToken = (nextAccessToken: string | null) => {
  accessToken = nextAccessToken;
};

const refreshAccessToken = async () => {
  const csrfToken = getCsrfToken();
  const response = await axios.post<SessionResponse>(
    getAuthUrl('/api/auth/session/refresh'),
    {},
    {
      headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : undefined,
      withCredentials: true,
    },
  );

  setAccessToken(response.data.accessToken);

  return response.data.accessToken;
};

export const login = async (request: LoginRequest) => {
  const response = await axios.post<SessionResponse>(
    getAuthUrl('/api/auth/session/login'),
    request,
    { withCredentials: true },
  );

  setAccessToken(response.data.accessToken);
};

export const logout = async () => {
  try {
    await axios.post(getAuthUrl('/api/auth/session/logout'), {}, { withCredentials: true });
  } finally {
    setAccessToken(null);
  }
};

export const initializeAdminAuth = async () => {
  configureApiClient({
    authSession: {
      getAccessToken: () => accessToken,
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
