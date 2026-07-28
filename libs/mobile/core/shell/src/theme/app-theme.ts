import {
  DarkTheme as navigationDarkTheme,
  DefaultTheme as navigationLightTheme,
} from 'expo-router/react-navigation';
import { MD3DarkTheme, MD3LightTheme, type MD3Theme } from 'react-native-paper';

export const mobileLightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    background: '#f8faf8',
    error: '#ef4444',
    errorContainer: '#fce8e8',
    onError: '#ffffff',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onSurface: '#272927',
    onSurfaceVariant: '#4b5563',
    primary: '#18b125',
    primaryContainer: '#dff5e2',
    secondary: '#272927',
    secondaryContainer: '#e8eae8',
    surface: '#ffffff',
    surfaceVariant: '#eef1ee',
  },
};

export const mobileDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    background: '#101010',
    error: '#f79e9e',
    errorContainer: '#5d1f1f',
    onError: '#101010',
    onPrimary: '#101010',
    onSecondary: '#eeeeee',
    onSurface: '#eeeeee',
    onSurfaceVariant: '#c5c9c5',
    primary: '#18b125',
    primaryContainer: '#1d4f23',
    secondary: '#1e1f1e',
    secondaryContainer: '#303230',
    surface: '#1e1f1e',
    surfaceVariant: '#272927',
  },
};

export function createMobileNavigationTheme(theme: MD3Theme) {
  const navigationTheme = theme.dark ? navigationDarkTheme : navigationLightTheme;

  return {
    ...navigationTheme,
    colors: {
      ...navigationTheme.colors,
      background: theme.colors.background,
      border: theme.colors.outlineVariant,
      card: theme.colors.surface,
      notification: theme.colors.error,
      primary: theme.colors.primary,
      text: theme.colors.onSurface,
    },
    dark: theme.dark,
  };
}
