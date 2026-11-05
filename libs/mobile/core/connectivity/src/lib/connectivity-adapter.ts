import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';

export interface ConnectivityState {
  isInternetReachable: boolean | null;
  isOnline: boolean;
  /** Online over Wi‑Fi or cable that the system does not mark as metered: photos may be downloaded in the background. */
  isUnmetered: boolean;
}

export type ConnectivityListener = (state: ConnectivityState) => void;

export function toConnectivityState(netInfoState: NetInfoState): ConnectivityState {
  const isOnline = netInfoState.isConnected === true && netInfoState.isInternetReachable !== false;
  const isExpensive =
    netInfoState.details !== null &&
    'isConnectionExpensive' in netInfoState.details &&
    netInfoState.details.isConnectionExpensive;

  return {
    isInternetReachable: netInfoState.isInternetReachable,
    isOnline,
    isUnmetered:
      isOnline &&
      (netInfoState.type === 'wifi' || netInfoState.type === 'ethernet') &&
      !isExpensive,
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
