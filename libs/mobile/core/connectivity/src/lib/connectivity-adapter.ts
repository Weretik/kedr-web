import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';

export interface ConnectivityState {
  isInternetReachable: boolean | null;
  isOnline: boolean;
}

export type ConnectivityListener = (state: ConnectivityState) => void;

export function toConnectivityState(netInfoState: NetInfoState): ConnectivityState {
  return {
    isInternetReachable: netInfoState.isInternetReachable,
    isOnline: netInfoState.isConnected === true && netInfoState.isInternetReachable !== false,
  };
}

export const connectivityAdapter = {
  async getCurrent(): Promise<ConnectivityState> {
    return toConnectivityState(await NetInfo.fetch());
  },

  subscribe(listener: ConnectivityListener): () => void {
    return NetInfo.addEventListener((netInfoState) => listener(toConnectivityState(netInfoState)));
  },
};
