import {
  selectResolvedTheme,
  selectThemePreference,
  setThemePreference,
  themePreferenceReducer,
} from './theme-preference-state';

describe('themePreference state', () => {
  it('stores the selected preference and resolves the system scheme', () => {
    const state = {
      themePreference: themePreferenceReducer(undefined, setThemePreference('system')),
    } as Parameters<typeof selectThemePreference>[0];

    expect(selectThemePreference(state)).toBe('system');
    expect(selectResolvedTheme(state, 'dark')).toBe('dark');
    expect(selectResolvedTheme(state, 'light')).toBe('light');
  });
});
