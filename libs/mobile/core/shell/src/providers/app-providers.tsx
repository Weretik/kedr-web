import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from 'expo-router/react-navigation';
import { StatusBar } from 'expo-status-bar';
import { type ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { ConnectivityProvider } from './connectivity-context';
import { useOrientationPolicy } from './orientation-policy';
import { toNavigationTheme } from '../theme/navigation-theme';

/** Everything a screen needs: gestures, safe areas, sheets, navigation colors, network state. */
export function AppProviders({ children }: Readonly<{ children: ReactNode }>) {
  const { rt, theme } = useUnistyles();
  const dark = rt.themeName === 'dark';

  useOrientationPolicy();

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ThemeProvider value={toNavigationTheme(theme, dark)}>
          <BottomSheetModalProvider>
            <ConnectivityProvider>
              <StatusBar style={dark ? 'light' : 'dark'} />
              {children}
            </ConnectivityProvider>
          </BottomSheetModalProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create((theme) => ({
  root: { backgroundColor: theme.colors.background, flex: 1 },
}));
