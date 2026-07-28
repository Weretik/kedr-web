import { type ReactNode } from 'react';
import { type ColorSchemeName } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';

import { ConnectivityProvider } from './connectivity-context';
import { AppNotificationProvider } from './notification-context';
import { ThemePreferenceProvider } from './theme-preference-context';
import { OfflineIndicator } from '../components/status/offline-indicator';
import { appStore } from '../state/app-store';

export interface AppProvidersProps {
  children: ReactNode;
  colorScheme?: ColorSchemeName;
}

export function AppProviders({ children, colorScheme }: Readonly<AppProvidersProps>) {
  return (
    <SafeAreaProvider>
      <ReduxProvider store={appStore}>
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
  );
}
