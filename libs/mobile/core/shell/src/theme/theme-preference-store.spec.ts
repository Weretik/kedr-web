import { UnistylesRuntime } from 'react-native-unistyles';

import { useThemePreference } from './theme-preference-store';
import { applyUnistylesTheme } from './use-theme-name';

describe('theme preference', () => {
  it('switches Unistyles to the theme the app chose', () => {
    const setAdaptive = jest.spyOn(UnistylesRuntime, 'setAdaptiveThemes');
    const setTheme = jest.spyOn(UnistylesRuntime, 'setTheme');
    Object.defineProperty(UnistylesRuntime, 'hasAdaptiveThemes', {
      configurable: true,
      value: true,
    });

    applyUnistylesTheme('dark');

    expect(setAdaptive).toHaveBeenLastCalledWith(false);
    expect(setTheme).toHaveBeenLastCalledWith('dark');
  });

  it('remembers the choice', () => {
    useThemePreference.getState().setPreference('light');

    expect(useThemePreference.getState().preference).toBe('light');
  });
});
