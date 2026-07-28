import AsyncStorage from '@react-native-async-storage/async-storage';

import { type ThemePreference } from '../state/theme-preference-state';

export { type ThemePreference } from '../state/theme-preference-state';

const themePreferenceKey = 'kedr.mobile.theme-preference';

function isThemePreference(value: string | null): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark';
}

export const themePreferenceStorage = {
  async read(): Promise<ThemePreference> {
    try {
      const value = await AsyncStorage.getItem(themePreferenceKey);
      return isThemePreference(value) ? value : 'system';
    } catch {
      return 'system';
    }
  },

  async write(preference: ThemePreference): Promise<void> {
    try {
      await AsyncStorage.setItem(themePreferenceKey, preference);
    } catch {
      // Storage failure must not block the shell or prevent applying the chosen theme.
    }
  },
};
