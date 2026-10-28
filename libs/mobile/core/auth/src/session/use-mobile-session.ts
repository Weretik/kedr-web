import { useSyncExternalStore } from 'react';

import { getMobileSessionState, subscribeToMobileSession } from './session-store';

import type { MobileSessionState } from './session-store';

export const useMobileSession = (): MobileSessionState =>
  useSyncExternalStore(subscribeToMobileSession, getMobileSessionState, getMobileSessionState);
