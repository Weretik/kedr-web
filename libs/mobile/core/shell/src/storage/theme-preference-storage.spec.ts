import AsyncStorage from '@react-native-async-storage/async-storage';

import { themePreferenceStorage } from './theme-preference-storage';

describe('themePreferenceStorage', () => {
  it.each([null, 'unexpected'])('falls back to system for invalid value %p', async (value) => {
    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValueOnce(value);

    await expect(themePreferenceStorage.read()).resolves.toBe('system');
  });

  it('falls back to system when storage is unavailable', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('Storage unavailable'));

    await expect(themePreferenceStorage.read()).resolves.toBe('system');
  });
});
