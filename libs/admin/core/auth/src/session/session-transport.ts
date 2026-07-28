import { appConfig } from '@admin/shared/config';
import axios from 'axios';

export interface LoginRequest {
  email: string;
  password: string;
}

interface SessionResponse {
  accessToken: string;
}

const getAuthUrl = (path: string): string => new URL(path, appConfig.apiBaseUrl).toString();

const getCsrfToken = (): string | null => {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookie = document.cookie
    .split('; ')
    .find((value) => value.startsWith('kedr.csrf='));

  return cookie ? decodeURIComponent(cookie.substring('kedr.csrf='.length)) : null;
};

export const requestLogin = async (request: LoginRequest): Promise<string> => {
  const response = await axios.post<SessionResponse>(getAuthUrl('/api/auth/session/login'), request, {
    withCredentials: true,
  });

  return response.data.accessToken;
};

export const requestLogout = async (): Promise<void> => {
  await axios.post(getAuthUrl('/api/auth/session/logout'), {}, { withCredentials: true });
};

export const requestAccessTokenRefresh = async (): Promise<string> => {
  const csrfToken = getCsrfToken();
  const response = await axios.post<SessionResponse>(
    getAuthUrl('/api/auth/session/refresh'),
    {},
    {
      headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : undefined,
      withCredentials: true,
    },
  );

  return response.data.accessToken;
};
