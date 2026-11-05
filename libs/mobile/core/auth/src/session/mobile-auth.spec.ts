import { configureMobileAuth } from '@mobile/shared/api-client';

import { requestCurrentUser, requestLogin, requestLogout, requestRefresh } from './auth-transport';
import {
  initializeMobileAuth,
  login,
  logout,
  refreshAccessToken,
  unlockSession,
} from './mobile-auth';
import { confirmOwner, isQuickUnlockAvailable } from './quick-unlock';
import { getMobileSessionState } from './session-store';
import {
  clearStoredTokens,
  readQuickUnlockEnabled,
  readSavedSession,
  readStoredTokens,
  saveSession,
  saveTokens,
} from '../storage/token-storage';

import type { MobileAuthAdapter } from '@mobile/shared/api-client';

jest.mock('@mobile/shared/api-client', () => ({ configureMobileAuth: jest.fn() }));
jest.mock('./auth-transport', () => ({
  requestCurrentUser: jest.fn(),
  requestLogin: jest.fn(),
  requestLogout: jest.fn(),
  requestRefresh: jest.fn(),
}));
jest.mock('./quick-unlock', () => ({
  confirmOwner: jest.fn(),
  isQuickUnlockAvailable: jest.fn().mockResolvedValue(true),
}));
jest.mock('../storage/token-storage', () => ({
  clearStoredTokens: jest.fn().mockResolvedValue(undefined),
  readQuickUnlockEnabled: jest.fn().mockResolvedValue(false),
  readSavedSession: jest.fn().mockResolvedValue(null),
  readStoredTokens: jest.fn(),
  saveSession: jest.fn().mockResolvedValue(undefined),
  saveTokens: jest.fn().mockResolvedValue(undefined),
}));

const day = 24 * 60 * 60 * 1000;
const manager = {
  avatarUrl: null,
  email: 'm@kedr.ua',
  fullName: 'Олена',
  id: 'u-1',
  roles: ['Manager'] as const,
};
const adapter = () => jest.mocked(configureMobileAuth).mock.lastCall?.[0] as MobileAuthAdapter;
const offline = () => Object.assign(new Error('Network Error'), { isAxiosError: true });

describe('mobile auth session', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(readQuickUnlockEnabled).mockResolvedValue(false);
    jest.mocked(readSavedSession).mockResolvedValue(null);
  });

  it('restores a saved session and remembers when the server confirmed it', async () => {
    jest.mocked(readStoredTokens).mockResolvedValue({ accessToken: 'a1', refreshToken: 'r1' });
    jest.mocked(requestCurrentUser).mockResolvedValue(manager);

    await initializeMobileAuth();

    expect(getMobileSessionState()).toEqual({ status: 'authenticated', user: manager });
    expect(adapter().getAccessToken()).toBe('a1');
    expect(saveSession).toHaveBeenCalledWith({
      lastRefreshedAt: expect.any(Number),
      user: manager,
    });
  });

  it('refreshes an expired access token on start', async () => {
    jest.mocked(readStoredTokens).mockResolvedValue({ accessToken: 'old', refreshToken: 'r1' });
    jest.mocked(requestCurrentUser).mockResolvedValueOnce(null).mockResolvedValueOnce(manager);
    jest.mocked(requestRefresh).mockResolvedValue({ accessToken: 'a2', refreshToken: 'r2' });

    await initializeMobileAuth();

    expect(saveTokens).toHaveBeenCalledWith({ accessToken: 'a2', refreshToken: 'r2' });
    expect(getMobileSessionState().status).toBe('authenticated');
  });

  it('asks to sign in when nothing is saved', async () => {
    jest.mocked(readStoredTokens).mockResolvedValue(null);

    await initializeMobileAuth();

    expect(getMobileSessionState()).toEqual({ status: 'anonymous' });
  });

  it('opens offline within seven days of the last confirmation (SC-018)', async () => {
    const now = Date.UTC(2026, 10, 8, 9, 0);
    jest.mocked(readStoredTokens).mockResolvedValue({ accessToken: 'a1', refreshToken: 'r1' });
    jest.mocked(requestCurrentUser).mockRejectedValue(offline());
    jest
      .mocked(readSavedSession)
      .mockResolvedValue({ lastRefreshedAt: now - 6 * day, user: manager });

    await initializeMobileAuth(() => now);

    expect(getMobileSessionState()).toEqual({ status: 'authenticated', user: manager });
    expect(saveSession).not.toHaveBeenCalled();
  });

  it('asks to sign in offline after seven days (SC-019)', async () => {
    const now = Date.UTC(2026, 10, 8, 9, 0);
    jest.mocked(readStoredTokens).mockResolvedValue({ accessToken: 'a1', refreshToken: 'r1' });
    jest.mocked(requestCurrentUser).mockRejectedValue(offline());
    jest
      .mocked(readSavedSession)
      .mockResolvedValue({ lastRefreshedAt: now - 8 * day, user: manager });

    await initializeMobileAuth(() => now);

    expect(getMobileSessionState()).toEqual({ status: 'anonymous' });
  });

  it('keeps a restored session locked until quick unlock succeeds', async () => {
    jest.mocked(readStoredTokens).mockResolvedValue({ accessToken: 'a1', refreshToken: 'r1' });
    jest.mocked(requestCurrentUser).mockResolvedValue(manager);
    jest.mocked(readQuickUnlockEnabled).mockResolvedValue(true);
    jest.mocked(isQuickUnlockAvailable).mockResolvedValue(true);

    await initializeMobileAuth();
    expect(getMobileSessionState()).toEqual({ status: 'locked', user: manager });

    jest.mocked(confirmOwner).mockResolvedValueOnce(false);
    expect(await unlockSession()).toBe(false);
    expect(getMobileSessionState().status).toBe('locked');

    jest.mocked(confirmOwner).mockResolvedValueOnce(true);
    expect(await unlockSession()).toBe(true);
    expect(getMobileSessionState()).toEqual({ status: 'authenticated', user: manager });
  });

  it('shares one refresh between parallel requests and restarts the offline window', async () => {
    jest.mocked(requestLogin).mockResolvedValue({ accessToken: 'a1', refreshToken: 'r1' });
    jest.mocked(requestCurrentUser).mockResolvedValue(manager);
    await login({ email: 'm@kedr.ua', password: 'secret-pass' });
    jest.mocked(saveSession).mockClear();
    jest.mocked(requestRefresh).mockResolvedValue({ accessToken: 'a2', refreshToken: 'r2' });

    const results = await Promise.all([refreshAccessToken(), refreshAccessToken()]);

    expect(results).toEqual(['a2', 'a2']);
    expect(requestRefresh).toHaveBeenCalledTimes(1);
    expect(saveSession).toHaveBeenCalledTimes(1);
  });

  it('opens right after a password sign-in even with quick unlock on', async () => {
    jest.mocked(readQuickUnlockEnabled).mockResolvedValue(true);
    jest.mocked(requestLogin).mockResolvedValue({ accessToken: 'a1', refreshToken: 'r1' });
    jest.mocked(requestCurrentUser).mockResolvedValue(manager);

    await login({ email: 'm@kedr.ua', password: 'secret-pass' });

    expect(getMobileSessionState().status).toBe('authenticated');
  });

  it('forgets the tokens on logout even when offline', async () => {
    jest.mocked(requestLogin).mockResolvedValue({ accessToken: 'a1', refreshToken: 'r1' });
    jest.mocked(requestCurrentUser).mockResolvedValue(manager);
    await login({ email: 'm@kedr.ua', password: 'secret-pass' });
    jest.mocked(requestLogout).mockRejectedValue(new Error('offline'));

    await logout();

    expect(clearStoredTokens).toHaveBeenCalled();
    expect(getMobileSessionState()).toEqual({ status: 'anonymous' });
  });
});
