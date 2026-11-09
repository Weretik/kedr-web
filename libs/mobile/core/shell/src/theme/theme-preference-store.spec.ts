import { renderHook } from '@testing-library/react-native';

import { useThemePreference } from './theme-preference-store';
import { useThemeName } from './use-theme-name';

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  __esModule: true,
  default: () => 'dark',
}));

jest.mock('expo-sqlite/kv-store', () => {
  const values = new Map<string, string>();
  return {
    __esModule: true,
    default: {
      getItemSync: (key: string) => values.get(key) ?? null,
      setItemSync: (key: string, value: string) => values.set(key, value),
    },
  };
});

describe('theme preference', () => {
  it('follows the phone until a theme is pinned', async () => {
    const { result, rerender } = await renderHook(() => useThemeName());
    expect(result.current).toBe('dark');

    useThemePreference.getState().setPreference('light');
    await rerender({});

    expect(useThemePreference.getState().preference).toBe('light');
    expect(result.current).toBe('light');
  });
});
