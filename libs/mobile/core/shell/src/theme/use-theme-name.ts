import { type ThemeName } from '@mobile/shared/ui';
import { useColorScheme } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';

import { useThemePreference } from './theme-preference-store';

/**
 * The theme the app shows: the pinned «Світла»/«Темна», or the phone's scheme for «Як у системі». It comes from the
 * app's own state, not from Unistyles events, so the shell always knows when to repaint.
 */
export function useThemeName(): ThemeName {
  const preference = useThemePreference((state) => state.preference);
  const scheme = useColorScheme();
  if (preference !== 'system') return preference;
  return scheme === 'dark' ? 'dark' : 'light';
}

/**
 * Points Unistyles at the theme before the screens render with it. The app picks the theme itself, so Unistyles'
 * own following of the phone is switched off.
 */
export function applyUnistylesTheme(themeName: ThemeName): void {
  if (UnistylesRuntime.hasAdaptiveThemes) UnistylesRuntime.setAdaptiveThemes(false);
  if (UnistylesRuntime.themeName !== themeName) UnistylesRuntime.setTheme(themeName);
}
