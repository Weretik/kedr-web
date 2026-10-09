import { type ReactNode } from 'react';
import { type ColorSchemeName } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider, type ProviderProps } from 'react-redux';

import { ConnectivityProvider } from './connectivity-context';
import { AppNotificationProvider } from './notification-context';
import { ThemePreferenceProvider } from './theme-preference-context';
import { OfflineIndicator } from '../components/status/offline-indicator';
import { appStore } from '../state/app-store';

export interface AppProvidersProps {
  children: ReactNode;
  colorScheme?: ColorSchemeName;
  store?: ProviderProps['store'];
}

export function AppProviders({ children, colorScheme, store = appStore }: Readonly<AppProvidersProps>) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ReduxProvider store={store}>
          <ThemePreferenceProvider colorScheme={colorScheme}>
            <AppNotificationProvider>
              <ConnectivityProvider>
                <OfflineIndicator />
                {children}
              </ConnectivityProvider>
            </AppNotificationProvider>
          </ThemePreferenceProvider>
        </ReduxProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
