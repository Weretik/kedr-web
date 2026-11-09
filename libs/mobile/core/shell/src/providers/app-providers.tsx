import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { AppThemeProvider, darkTheme, lightTheme } from '@mobile/shared/ui';
import { ThemeProvider } from 'expo-router/react-navigation';
import { StatusBar } from 'expo-status-bar';
import { type ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ConnectivityProvider } from './connectivity-context';
import { useOrientationPolicy } from './orientation-policy';
import { toNavigationTheme } from '../theme/navigation-theme';
import { useThemeName } from '../theme/use-theme-name';

const themes = { dark: darkTheme, light: lightTheme };

/** Everything a screen needs: gestures, safe areas, sheets, navigation colors, network state. */
export function AppProviders({ children }: Readonly<{ children: ReactNode }>) {
  const themeName = useThemeName();
  const dark = themeName === 'dark';

  useOrientationPolicy();

  return (
    <GestureHandlerRootView
      style={{ backgroundColor: themes[themeName].colors.background, flex: 1 }}
    >
      {/* Above the sheet host, so bottom sheets get the theme too. */}
      <AppThemeProvider themeName={themeName}>
        <SafeAreaProvider>
          <ThemeProvider value={toNavigationTheme(themes[themeName], dark)}>
            <BottomSheetModalProvider>
              <ConnectivityProvider>
                <StatusBar style={dark ? 'light' : 'dark'} />
                {children}
              </ConnectivityProvider>
            </BottomSheetModalProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </AppThemeProvider>
    </GestureHandlerRootView>
  );
}
