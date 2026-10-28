import { appConfig } from '@mobile/shared/config';
import axios from 'axios';

import type { SessionUser } from './session-user';
import type { StoredTokens } from '../storage/token-storage';
import type { operations } from '@shared/api-contracts';

export type MobileLoginRequest =
  operations['loginMobile']['requestBody']['content']['application/json'];
type TokenResponse = operations['loginMobile']['responses'][200]['content']['application/json'];
type SessionUserResponse =
  operations['getCurrentSession']['responses'][200]['content']['application/json'];

// Sign-in calls bypass the shared client, so its 401 handling cannot loop into a refresh.
const authClient = axios.create({ baseURL: appConfig.apiBaseUrl ?? undefined, timeout: 15_000 });

const toTokens = (response: TokenResponse): StoredTokens => ({
  accessToken: response.accessToken,
  refreshToken: response.refreshToken,
});

export async function requestLogin(request: MobileLoginRequest): Promise<StoredTokens> {
  const response = await authClient.post<TokenResponse>('/api/auth/mobile/login', request);
  return toTokens(response.data);
}

/** Returns a new token pair, or null when the refresh token is no longer valid. */
export async function requestRefresh(refreshToken: string): Promise<StoredTokens | null> {
  try {
    const response = await authClient.post<TokenResponse>('/api/auth/mobile/refresh', {
      refreshToken,
    });
    return toTokens(response.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }

    throw error;
  }
}

export async function requestLogout(tokens: StoredTokens): Promise<void> {
  await authClient.post(
    '/api/auth/mobile/logout',
    { refreshToken: tokens.refreshToken },
    { headers: { Authorization: `Bearer ${tokens.accessToken}` } },
  );
}

/** Returns the user, or null when the access token was rejected. */
export async function requestCurrentUser(accessToken: string): Promise<SessionUser | null> {
  try {
    const response = await authClient.get<SessionUserResponse>('/api/auth/session/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const { email, fullName, roles, userId } = response.data;
    return { email, fullName, id: userId, roles };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }

    throw error;
  }
}
