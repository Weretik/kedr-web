import { useCallback, useEffect, useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  useColorScheme,
  type ColorSchemeName,
} from 'react-native';
import { ThemeProvider } from 'expo-router/react-navigation';
import { PaperProvider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { themePreferenceStorage, type ThemePreference } from '../storage/theme-preference-storage';
import {
  selectResolvedTheme,
  selectThemePreference,
  setThemePreference,
} from '../state/theme-preference-state';
import { type AppDispatch, type AppState } from '../state/app-store';
import { createMobileNavigationTheme, mobileDarkTheme, mobileLightTheme } from '../theme/app-theme';

export interface ThemePreferenceValue {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

export function useThemePreference(): ThemePreferenceValue {
  const dispatch = useDispatch<AppDispatch>();
  const preference = useSelector(selectThemePreference);

  const setPreference = useCallback(
    (nextPreference: ThemePreference) => {
      dispatch(setThemePreference(nextPreference));
      void themePreferenceStorage.write(nextPreference);
    },
    [dispatch],
  );

  return { preference, setPreference };
}

export function ThemePreferenceProvider({
  children,
  colorScheme,
}: Readonly<{ children: ReactNode; colorScheme?: ColorSchemeName }>) {
  const systemColorScheme = useColorScheme();
  const dispatch = useDispatch<AppDispatch>();
  const [isBootstrapped, setIsBootstrapped] = useState(false);
  const resolvedColorScheme = colorScheme ?? systemColorScheme;
  const resolvedTheme = useSelector((state: AppState) =>
    selectResolvedTheme(state, resolvedColorScheme),
  );

  useEffect(() => {
    let isMounted = true;

    void themePreferenceStorage.read().then((savedPreference) => {
      if (isMounted) {
        dispatch(setThemePreference(savedPreference));
        setIsBootstrapped(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  const theme = resolvedTheme === 'dark' ? mobileDarkTheme : mobileLightTheme;
  const navigationTheme = createMobileNavigationTheme(theme);

  return (
    <PaperProvider theme={theme}>
      <ThemeProvider value={navigationTheme}>
        {isBootstrapped ? (
          children
        ) : (
          <View
            accessibilityLabel="Завантаження налаштувань теми"
            style={[styles.loading, { backgroundColor: theme.colors.background }]}
          >
            <ActivityIndicator color={theme.colors.primary} />
          </View>
        )}
      </ThemeProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
