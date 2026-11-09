import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemePreference = 'dark' | 'light' | 'system';

interface ThemePreferenceState {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

/** «Як у системі» follows the phone; «Світла» and «Темна» pin the theme. The shell applies it (`useThemeName`). */
export const useThemePreference = create<ThemePreferenceState>()(
  persist(
    (set) => ({
      preference: 'system',
      setPreference: (preference) => set({ preference }),
    }),
    {
      name: 'kedr.mobile.theme-preference',
      partialize: ({ preference }) => ({ preference }),
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
