import { UnistylesRuntime } from 'react-native-unistyles';

import { applyThemePreference, useThemePreference } from './theme-preference-store';

describe('theme preference', () => {
  it('pins a chosen theme and follows the system otherwise', () => {
    const setAdaptive = jest.spyOn(UnistylesRuntime, 'setAdaptiveThemes');
    const setTheme = jest.spyOn(UnistylesRuntime, 'setTheme');

    applyThemePreference('dark');
    expect(setAdaptive).toHaveBeenLastCalledWith(false);
    expect(setTheme).toHaveBeenLastCalledWith('dark');

    applyThemePreference('system');
    expect(setAdaptive).toHaveBeenLastCalledWith(true);
  });

  it('remembers the choice', () => {
    useThemePreference.getState().setPreference('light');

    expect(useThemePreference.getState().preference).toBe('light');
  });
});
