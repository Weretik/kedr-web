import { configureMobileAuth } from '@mobile/shared/api-client';

import { requestCurrentUser, requestLogin, requestLogout, requestRefresh } from './auth-transport';
import { initializeMobileAuth, login, logout, refreshAccessToken } from './mobile-auth';
import { getMobileSessionState } from './session-store';
import { clearStoredTokens, readStoredTokens, saveTokens } from '../storage/token-storage';

import type { MobileAuthAdapter } from '@mobile/shared/api-client';

jest.mock('@mobile/shared/api-client', () => ({ configureMobileAuth: jest.fn() }));
jest.mock('./auth-transport', () => ({
  requestCurrentUser: jest.fn(),
  requestLogin: jest.fn(),
  requestLogout: jest.fn(),
  requestRefresh: jest.fn(),
}));
jest.mock('../storage/token-storage', () => ({
  clearStoredTokens: jest.fn().mockResolvedValue(undefined),
  readStoredTokens: jest.fn(),
  saveTokens: jest.fn().mockResolvedValue(undefined),
}));

const manager = { email: 'm@kedr.ua', fullName: 'Олена', id: 'u-1', roles: ['Manager'] as const };
const adapter = () => jest.mocked(configureMobileAuth).mock.lastCall?.[0] as MobileAuthAdapter;

describe('mobile auth session', () => {
  beforeEach(() => jest.clearAllMocks());

  it('restores a saved session', async () => {
    jest.mocked(readStoredTokens).mockResolvedValue({ accessToken: 'a1', refreshToken: 'r1' });
    jest.mocked(requestCurrentUser).mockResolvedValue({ ...manager, roles: ['Manager'] });

    await initializeMobileAuth();

    expect(getMobileSessionState()).toEqual({ status: 'authenticated', user: manager });
    expect(adapter().getAccessToken()).toBe('a1');
  });

  it('refreshes an expired access token on start', async () => {
    jest.mocked(readStoredTokens).mockResolvedValue({ accessToken: 'old', refreshToken: 'r1' });
    jest
      .mocked(requestCurrentUser)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ ...manager, roles: ['Manager'] });
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

  it('shares one refresh between parallel requests', async () => {
    jest.mocked(requestLogin).mockResolvedValue({ accessToken: 'a1', refreshToken: 'r1' });
    jest.mocked(requestCurrentUser).mockResolvedValue({ ...manager, roles: ['Manager'] });
    await login({ email: 'm@kedr.ua', password: 'secret-pass' });
    jest.mocked(requestRefresh).mockResolvedValue({ accessToken: 'a2', refreshToken: 'r2' });

    const results = await Promise.all([refreshAccessToken(), refreshAccessToken()]);

    expect(results).toEqual(['a2', 'a2']);
    expect(requestRefresh).toHaveBeenCalledTimes(1);
  });

  it('forgets the tokens on logout even when offline', async () => {
    jest.mocked(requestLogin).mockResolvedValue({ accessToken: 'a1', refreshToken: 'r1' });
    jest.mocked(requestCurrentUser).mockResolvedValue({ ...manager, roles: ['Manager'] });
    await login({ email: 'm@kedr.ua', password: 'secret-pass' });
    jest.mocked(requestLogout).mockRejectedValue(new Error('offline'));

    await logout();

    expect(clearStoredTokens).toHaveBeenCalled();
    expect(getMobileSessionState()).toEqual({ status: 'anonymous' });
  });
});
