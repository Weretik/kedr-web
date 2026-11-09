import Storage from 'expo-sqlite/kv-store';
import { create } from 'zustand';

export type ThemePreference = 'dark' | 'light' | 'system';

interface ThemePreferenceState {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

const storageKey = 'kedr.mobile.theme';

// Read synchronously, so the first frame already has the chosen theme.
function readStoredPreference(): ThemePreference {
  try {
    const stored = Storage.getItemSync(storageKey);
    return stored === 'dark' || stored === 'light' ? stored : 'system';
  } catch {
    return 'system';
  }
}

function storePreference(preference: ThemePreference): void {
  try {
    Storage.setItemSync(storageKey, preference);
  } catch {
    // Not saved: the choice still applies until the app is closed.
  }
}

/** «Як у системі» follows the phone; «Світла» and «Темна» pin the theme (`useThemeName`). */
export const useThemePreference = create<ThemePreferenceState>()((set) => ({
  preference: readStoredPreference(),
  setPreference: (preference) => {
    storePreference(preference);
    set({ preference });
  },
}));
