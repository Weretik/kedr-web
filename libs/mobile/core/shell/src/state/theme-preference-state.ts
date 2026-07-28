import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type AppState } from './app-store';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemePreferenceState {
  preference: ThemePreference;
}

const initialState: ThemePreferenceState = {
  preference: 'system',
};

const themePreferenceSlice = createSlice({
  initialState,
  name: 'themePreference',
  reducers: {
    setThemePreference: (state, action: PayloadAction<ThemePreference>) => {
      state.preference = action.payload;
    },
  },
});

export const themePreferenceReducer = themePreferenceSlice.reducer;
export const { setThemePreference } = themePreferenceSlice.actions;

export const selectThemePreference = (state: AppState): ThemePreference =>
  state.themePreference.preference;

export const selectResolvedTheme = (
  state: AppState,
  systemColorScheme: string | null | undefined,
): ResolvedTheme => {
  const preference = selectThemePreference(state);

  return preference === 'dark' || (preference === 'system' && systemColorScheme === 'dark')
    ? 'dark'
    : 'light';
};
