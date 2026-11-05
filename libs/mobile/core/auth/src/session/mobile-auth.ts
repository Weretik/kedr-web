import { configureMobileAuth } from '@mobile/shared/api-client';

import { requestCurrentUser, requestLogin, requestLogout, requestRefresh } from './auth-transport';
import { isWithinOfflineWindow } from './offline-window';
import { confirmOwner, isQuickUnlockAvailable } from './quick-unlock';
import { getMobileSessionState, setMobileSessionState } from './session-store';
import {
  clearStoredTokens,
  readQuickUnlockEnabled,
  readSavedSession,
  readStoredTokens,
  saveSession,
  saveTokens,
} from '../storage/token-storage';

import type { MobileLoginRequest } from './auth-transport';
import type { SessionUser } from './session-user';
import type { StoredTokens } from '../storage/token-storage';

let tokens: StoredTokens | null = null;
let currentUser: SessionUser | null = null;
let refreshInFlight: Promise<string | null> | null = null;

async function endSession(): Promise<void> {
  tokens = null;
  currentUser = null;
  setMobileSessionState({ status: 'anonymous' });
  await clearStoredTokens().catch(() => undefined);
}

async function storeTokens(nextTokens: StoredTokens): Promise<void> {
  tokens = nextTokens;
  await saveTokens(nextTokens);
}

/** The offline window counts from the last time the server confirmed the session. */
async function rememberSession(user: SessionUser): Promise<void> {
  currentUser = user;
  await saveSession({ lastRefreshedAt: Date.now(), user }).catch(() => undefined);
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
      if (currentUser) await rememberSession(currentUser);
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

/** A restored session opens behind quick unlock when the manager turned it on. */
async function openSavedSession(user: SessionUser): Promise<void> {
  const lock =
    (await readQuickUnlockEnabled().catch(() => false)) && (await isQuickUnlockAvailable());
  setMobileSessionState(lock ? { status: 'locked', user } : { status: 'authenticated', user });
}

export async function login(request: MobileLoginRequest): Promise<SessionUser> {
  await storeTokens(await requestLogin(request));
  const user = await loadUser();
  if (!user) {
    await endSession();
    throw new Error('The new session was rejected.');
  }

  await rememberSession(user);
  setMobileSessionState({ status: 'authenticated', user });
  return user;
}

/**
 * Keeps the session in step after the manager changed their own name, photo or e-mail in the cabinet, so the rail,
 * the cabinet and an offline start show the new values.
 */
export async function updateSessionUser(
  change: Partial<Pick<SessionUser, 'avatarUrl' | 'email' | 'fullName'>>,
): Promise<void> {
  const state = getMobileSessionState();
  if (state.status !== 'authenticated') return;
  const user = { ...state.user, ...change };
  setMobileSessionState({ status: 'authenticated', user });
  await rememberSession(user);
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

/** Quick unlock: asks for the fingerprint, face or device code; true when the app opened. */
export async function unlockSession(): Promise<boolean> {
  const state = getMobileSessionState();
  if (state.status !== 'locked') return state.status === 'authenticated';
  if (!(await confirmOwner())) return false;

  setMobileSessionState({ status: 'authenticated', user: state.user });
  return true;
}

/** Connects the API client and restores the session saved on the device. */
export async function initializeMobileAuth(now: () => number = Date.now): Promise<void> {
  configureMobileAuth({
    getAccessToken: () => tokens?.accessToken ?? null,
    onUnauthenticated: () => void endSession(),
    refreshAccessToken,
  });

  try {
    tokens = await readStoredTokens();
    const user = await loadUser();
    if (!user) {
      await endSession();
      return;
    }

    await rememberSession(user);
    await openSavedSession(user);
  } catch {
    // Offline start: the saved session works for seven days after the last confirmation.
    const saved = tokens ? await readSavedSession().catch(() => null) : null;
    if (saved && isWithinOfflineWindow(saved.lastRefreshedAt, now())) {
      currentUser = saved.user;
      await openSavedSession(saved.user);
    } else {
      setMobileSessionState({ status: 'anonymous' });
    }
  }
}
