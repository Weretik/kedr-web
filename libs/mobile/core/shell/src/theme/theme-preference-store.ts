import AsyncStorage from '@react-native-async-storage/async-storage';
import { UnistylesRuntime } from 'react-native-unistyles';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemePreference = 'dark' | 'light' | 'system';

interface ThemePreferenceState {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

/** «Як у системі» follows the phone; «Світла» and «Темна» pin the theme. */
export function applyThemePreference(preference: ThemePreference): void {
  UnistylesRuntime.setAdaptiveThemes(preference === 'system');
  if (preference !== 'system') UnistylesRuntime.setTheme(preference);
}

export const useThemePreference = create<ThemePreferenceState>()(
  persist(
    (set) => ({
      preference: 'system',
      setPreference: (preference) => {
        applyThemePreference(preference);
        set({ preference });
      },
    }),
    {
      name: 'kedr.mobile.theme-preference',
      onRehydrateStorage: () => (state) => {
        if (state) applyThemePreference(state.preference);
      },
      partialize: ({ preference }) => ({ preference }),
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
