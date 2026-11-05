import * as SecureStore from 'expo-secure-store';

import type { SessionUser } from '../session/session-user';

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
}

/** The user and the time of the last successful sign-in or refresh, for an offline start. */
export interface SavedSession {
  lastRefreshedAt: number;
  user: SessionUser;
}

const accessTokenKey = 'kedr.accessToken';
const refreshTokenKey = 'kedr.refreshToken';
const sessionKey = 'kedr.session';
const quickUnlockKey = 'kedr.quickUnlock';

/** Tokens live only in the device keychain/keystore, never in AsyncStorage or logs. */
export async function readStoredTokens(): Promise<StoredTokens | null> {
  const [accessToken, refreshToken] = await Promise.all([
    SecureStore.getItemAsync(accessTokenKey),
    SecureStore.getItemAsync(refreshTokenKey),
  ]);

  return accessToken && refreshToken ? { accessToken, refreshToken } : null;
}

export async function saveTokens(tokens: StoredTokens): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(accessTokenKey, tokens.accessToken),
    SecureStore.setItemAsync(refreshTokenKey, tokens.refreshToken),
  ]);
}

export async function readSavedSession(): Promise<SavedSession | null> {
  const value = await SecureStore.getItemAsync(sessionKey);
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as SavedSession;
    return typeof parsed.lastRefreshedAt === 'number' && parsed.user ? parsed : null;
  } catch {
    return null;
  }
}

export async function saveSession(session: SavedSession): Promise<void> {
  await SecureStore.setItemAsync(sessionKey, JSON.stringify(session));
}

export async function readQuickUnlockEnabled(): Promise<boolean> {
  return (await SecureStore.getItemAsync(quickUnlockKey)) === '1';
}

export async function saveQuickUnlockEnabled(enabled: boolean): Promise<void> {
  if (enabled) await SecureStore.setItemAsync(quickUnlockKey, '1');
  else await SecureStore.deleteItemAsync(quickUnlockKey);
}

/** Sign-out forgets the tokens and the saved session; the quick unlock choice stays. */
export async function clearStoredTokens(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(accessTokenKey),
    SecureStore.deleteItemAsync(refreshTokenKey),
    SecureStore.deleteItemAsync(sessionKey),
  ]);
}
