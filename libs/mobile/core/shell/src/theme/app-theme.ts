import {
  createKedrTokens,
  kedrDarkColors,
  kedrLightColors,
  kedrPaperFontConfig,
  type KedrColors,
  type KedrTheme,
} from '@mobile/shared/ui';
import {
  DarkTheme as navigationDarkTheme,
  DefaultTheme as navigationLightTheme,
} from 'expo-router/react-navigation';
import { configureFonts, MD3DarkTheme, MD3LightTheme, type MD3Theme } from 'react-native-paper';

/** Maps Kedr roles onto every Paper MD3 color so no default (purple) role can leak into the UI. */
function paperColors(base: MD3Theme['colors'], c: KedrColors): MD3Theme['colors'] {
  return {
    ...base,
    background: c.background,
    backdrop: c.backdrop,
    error: c.status.error.foreground,
    errorContainer: c.status.error.background,
    inverseOnSurface: c.inverseOnSurface,
    inversePrimary: c.accentText,
    inverseSurface: c.inverseSurface,
    onBackground: c.onBackground,
    onError: c.surface,
    onErrorContainer: c.status.error.foreground,
    onPrimary: c.onPrimary,
    onPrimaryContainer: c.accentText,
    onSecondary: c.inverseOnSurface,
    onSecondaryContainer: c.onSurface,
    onSurface: c.onSurface,
    onSurfaceDisabled: `${c.onSurface}61`,
    onSurfaceVariant: c.onSurfaceVariant,
    onTertiary: c.surface,
    onTertiaryContainer: c.status.warning.foreground,
    outline: c.outline,
    outlineVariant: c.outlineVariant,
    primary: c.primary,
    primaryContainer: c.primaryContainer,
    secondary: c.inverseSurface,
    secondaryContainer: c.surfaceVariant,
    surface: c.surface,
    surfaceDisabled: `${c.onSurface}1F`,
    surfaceVariant: c.surfaceVariant,
    tertiary: c.status.warning.foreground,
    tertiaryContainer: c.status.warning.background,
    elevation: {
      level0: 'transparent',
      level1: c.surface,
      level2: c.surface,
      level3: c.surface,
      level4: c.surface,
      level5: c.surface,
    },
  };
}

const fonts = configureFonts({ config: kedrPaperFontConfig });

export const mobileLightTheme: KedrTheme = {
  ...MD3LightTheme,
  colors: paperColors(MD3LightTheme.colors, kedrLightColors),
  fonts,
  kedr: createKedrTokens(false),
  roundness: 4,
};

export const mobileDarkTheme: KedrTheme = {
  ...MD3DarkTheme,
  colors: paperColors(MD3DarkTheme.colors, kedrDarkColors),
  fonts,
  kedr: createKedrTokens(true),
  roundness: 4,
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
