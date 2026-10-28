import type { SessionUser } from './session-user';

export type MobileSessionState =
  { status: 'loading' } | { status: 'anonymous' } | { status: 'authenticated'; user: SessionUser };

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
