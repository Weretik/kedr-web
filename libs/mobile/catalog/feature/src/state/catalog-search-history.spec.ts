import {
  catalogSearchHistoryLimit,
  normalizeCatalogSearchHistory,
  normalizeCatalogSearchPhrase,
  removeCatalogSearchHistoryEntry,
  upsertCatalogSearchHistory,
} from './catalog-search-history';

describe('catalog search history', () => {
  it('normalizes whitespace and preserves the entered display case', () => {
    expect(normalizeCatalogSearchPhrase('  Кабель\n  мідний  ')).toBe('Кабель мідний');
    expect(upsertCatalogSearchHistory(['кабель мідний'], '  Кабель   мідний ')).toEqual([
      'Кабель мідний',
    ]);
  });

  it('drops blank and duplicate values while retaining the ten newest phrases', () => {
    const history = Array.from({ length: 12 }, (_, index) => `Запит ${index}`);

    expect(normalizeCatalogSearchHistory([' ', 'Кабель', 'кабель', ...history])).toEqual([
      'Кабель',
      ...history.slice(0, catalogSearchHistoryLimit - 1),
    ]);
  });

  it('does not add a blank applied phrase', () => {
    expect(upsertCatalogSearchHistory(['Кабель'], '   ')).toEqual(['Кабель']);
  });

  it('removes only the requested phrase without case sensitivity', () => {
    expect(removeCatalogSearchHistoryEntry(['Кабель', 'Реле'], 'кабель')).toEqual(['Реле']);
  });
});
