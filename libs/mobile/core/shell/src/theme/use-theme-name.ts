import { type ThemeName } from '@mobile/shared/ui';
import { useColorScheme } from 'react-native';

import { useThemePreference } from './theme-preference-store';

/** The theme the app shows: the pinned «Світла»/«Темна», or the phone's scheme for «Як у системі». */
export function useThemeName(): ThemeName {
  const preference = useThemePreference((state) => state.preference);
  const scheme = useColorScheme();
  if (preference !== 'system') return preference;
  return scheme === 'dark' ? 'dark' : 'light';
}
