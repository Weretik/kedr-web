import { apiClient, apiRequest, toApiError } from '@admin/shared/api-client';

import { toSessionRoles } from './session-user';

import type { SessionUser } from './session-user';
import type { components } from '@shared/api-contracts';

export type LoginRequest = components['schemas']['SessionLoginRequest'];
type SessionUserResponse = components['schemas']['SessionMeResponse'];

const toSessionUser = (response: SessionUserResponse): SessionUser => ({
  id: response.userId,
  email: response.email,
  fullName: response.fullName,
  roles: toSessionRoles(response.roles),
  avatarUrl: response.avatarUrl ?? null,
});

/** Signs in with the HttpOnly session cookie. Throws the `ApiError` on 401 or 429. */
export const requestLogin = (request: LoginRequest): Promise<SessionUser> =>
  apiRequest(apiClient.POST('/api/auth/cookie/login', { body: request }), toSessionUser);

export const requestLogout = async (): Promise<void> => {
  await apiRequest(apiClient.POST('/api/auth/cookie/logout'));
};

/** Returns the signed-in user, or null when there is no valid session cookie. */
export const requestCurrentUser = async (): Promise<SessionUser | null> => {
  try {
    return await apiRequest(apiClient.GET('/api/auth/session/me'), toSessionUser);
  } catch (error) {
    if (toApiError(error).code === 'Unauthorized') return null;

    throw error;
  }
};
