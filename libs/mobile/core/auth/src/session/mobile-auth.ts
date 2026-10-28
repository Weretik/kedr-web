import { configureMobileAuth } from '@mobile/shared/api-client';

import { requestCurrentUser, requestLogin, requestLogout, requestRefresh } from './auth-transport';
import { setMobileSessionState } from './session-store';
import { clearStoredTokens, readStoredTokens, saveTokens } from '../storage/token-storage';

import type { MobileLoginRequest } from './auth-transport';
import type { SessionUser } from './session-user';
import type { StoredTokens } from '../storage/token-storage';

let tokens: StoredTokens | null = null;
let refreshInFlight: Promise<string | null> | null = null;

async function endSession(): Promise<void> {
  tokens = null;
  setMobileSessionState({ status: 'anonymous' });
  await clearStoredTokens().catch(() => undefined);
}

async function storeTokens(nextTokens: StoredTokens): Promise<void> {
  tokens = nextTokens;
  await saveTokens(nextTokens);
}

/** One refresh at a time: parallel 401s wait for the same rotation instead of reusing the old token. */
export function refreshAccessToken(): Promise<string | null> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const current = tokens;
      if (!current) return null;

      const nextTokens = await requestRefresh(current.refreshToken).catch(() => null);
      if (!nextTokens) return null;

      await storeTokens(nextTokens);
      return nextTokens.accessToken;
    })().finally(() => {
      refreshInFlight = null;
    });
  }

  return refreshInFlight;
}

async function loadUser(): Promise<SessionUser | null> {
  if (!tokens) return null;

  const user = await requestCurrentUser(tokens.accessToken);
  if (user) return user;

  const accessToken = await refreshAccessToken();
  return accessToken ? requestCurrentUser(accessToken) : null;
}

export async function login(request: MobileLoginRequest): Promise<SessionUser> {
  await storeTokens(await requestLogin(request));
  const user = await loadUser();
  if (!user) {
    await endSession();
    throw new Error('The new session was rejected.');
  }

  setMobileSessionState({ status: 'authenticated', user });
  return user;
}

export async function logout(): Promise<void> {
  const current = tokens;

  try {
    if (current) await requestLogout(current);
  } catch {
    // The device forgets the tokens even when the server cannot be reached.
  } finally {
    await endSession();
  }
}

/** Connects the API client and restores the session saved on the device. */
export async function initializeMobileAuth(): Promise<void> {
  configureMobileAuth({
    getAccessToken: () => tokens?.accessToken ?? null,
    onUnauthenticated: () => void endSession(),
    refreshAccessToken,
  });

  try {
    tokens = await readStoredTokens();
    const user = await loadUser();
    if (user) {
      setMobileSessionState({ status: 'authenticated', user });
    } else {
      await endSession();
    }
  } catch {
    // Offline start: keep the saved tokens, but ask to sign in until the API answers.
    setMobileSessionState({ status: 'anonymous' });
  }
}
