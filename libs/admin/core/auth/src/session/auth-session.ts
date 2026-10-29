import { configureApiClient } from '@admin/shared/api-client';

import { setSessionState } from './session-store';
import { requestCurrentUser, requestLogin, requestLogout } from './session-transport';

import type { LoginRequest } from './session-transport';
import type { SessionUser } from './session-user';

export const login = async (request: LoginRequest): Promise<SessionUser> => {
  const user = await requestLogin(request);
  setSessionState({ status: 'authenticated', user });

  return user;
};

export const logout = async (): Promise<void> => {
  try {
    await requestLogout();
  } finally {
    setSessionState({ status: 'anonymous' });
  }
};

/** Re-reads the signed-in user after they change their own profile, so the shell shows it at once. */
export const refreshSession = async (): Promise<void> => {
  const user = await requestCurrentUser();
  setSessionState(user ? { status: 'authenticated', user } : { status: 'anonymous' });
};

/** Restores the session from the cookie; any API 401 later sends the user back to the login page. */
export const initializeAdminAuth = async (): Promise<void> => {
  configureApiClient({
    authSession: { onUnauthenticated: () => setSessionState({ status: 'anonymous' }) },
  });

  try {
    const user = await requestCurrentUser();
    setSessionState(user ? { status: 'authenticated', user } : { status: 'anonymous' });
  } catch {
    // The API is unreachable; the login page shows the error on the next attempt.
    setSessionState({ status: 'anonymous' });
  }
};
