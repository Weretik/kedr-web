import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  catalogSearchHistoryStorageKey,
  loadCatalogSearchHistory,
  saveCatalogSearchHistory,
} from './catalog-search-history-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: { getItem: jest.fn(), setItem: jest.fn() },
}));

const storage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('catalog search history storage', () => {
  beforeEach(() => jest.resetAllMocks());

  it('loads a normalized stored history', async () => {
    storage.getItem.mockResolvedValue(JSON.stringify(['  Кабель  ', 'кабель', 'Реле']));

    await expect(loadCatalogSearchHistory()).resolves.toEqual(['Кабель', 'Реле']);
    expect(storage.getItem).toHaveBeenCalledWith(catalogSearchHistoryStorageKey);
  });

  it.each([['not-json'], ['{}'], [JSON.stringify(['Кабель', 1])]])(
    'reads corrupt value %p as an empty history',
    async (value) => {
      storage.getItem.mockResolvedValue(value);

      await expect(loadCatalogSearchHistory()).resolves.toEqual([]);
    },
  );

  it('persists only normalized history values', async () => {
    storage.setItem.mockResolvedValue();

    await saveCatalogSearchHistory(['  Кабель ', 'кабель', 'Реле']);

    expect(storage.setItem).toHaveBeenCalledWith(
      catalogSearchHistoryStorageKey,
      JSON.stringify(['Кабель', 'Реле']),
    );
  });
});
