import AsyncStorage from '@react-native-async-storage/async-storage';

import { normalizeCatalogSearchHistory } from '../state/catalog-search-history';

export const catalogSearchHistoryStorageKey = 'mobile.catalog.search-history.v1';

export async function loadCatalogSearchHistory(): Promise<string[]> {
  try {
    const value = await AsyncStorage.getItem(catalogSearchHistoryStorageKey);
    if (value === null) return [];

    const parsedValue: unknown = JSON.parse(value);
    return Array.isArray(parsedValue) && parsedValue.every((item) => typeof item === 'string')
      ? normalizeCatalogSearchHistory(parsedValue)
      : [];
  } catch {
    return [];
  }
}

export function saveCatalogSearchHistory(history: readonly string[]): Promise<void> {
  return AsyncStorage.setItem(
    catalogSearchHistoryStorageKey,
    JSON.stringify(normalizeCatalogSearchHistory(history)),
  );
}
