import type { SessionUser } from './session-user';

/**
 * `locked`: a saved session waits for quick unlock (fingerprint, face or device code).
 * `authenticated` may start offline from the saved session within the offline window.
 */
export type MobileSessionState =
  | { status: 'anonymous' }
  | { status: 'authenticated'; user: SessionUser }
  | { status: 'loading' }
  | { status: 'locked'; user: SessionUser };

let state: MobileSessionState = { status: 'loading' };
const listeners = new Set<() => void>();

export const getMobileSessionState = (): MobileSessionState => state;

export const setMobileSessionState = (nextState: MobileSessionState): void => {
  state = nextState;
  listeners.forEach((listener) => listener());
};

export const subscribeToMobileSession = (listener: () => void): (() => void) => {
  listeners.add(listener);

  return () => listeners.delete(listener);
};
