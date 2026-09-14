import { toConnectivityState } from './connectivity-adapter';

import type { NetInfoState } from '@react-native-community/netinfo';

jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: {
    addEventListener: jest.fn(),
    fetch: jest.fn(),
  },
}));

const createNetInfoState = (
  overrides: Partial<Pick<NetInfoState, 'isConnected' | 'isInternetReachable'>>,
): NetInfoState =>
  ({
    details: null,
    isConnected: true,
    isInternetReachable: true,
    type: 'wifi',
    ...overrides,
  }) as unknown as NetInfoState;

describe('toConnectivityState', () => {
  it('treats a connected network with reachable internet as online', () => {
    expect(toConnectivityState(createNetInfoState({}))).toEqual({
      isInternetReachable: true,
      isOnline: true,
    });
  });

  it('treats an unreachable network as offline', () => {
    expect(toConnectivityState(createNetInfoState({ isInternetReachable: false }))).toEqual({
      isInternetReachable: false,
      isOnline: false,
    });
  });
});
