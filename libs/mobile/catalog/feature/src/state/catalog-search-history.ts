export const catalogSearchHistoryLimit = 10;

export function normalizeCatalogSearchPhrase(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function normalizeCatalogSearchHistory(history: readonly string[]): string[] {
  const normalizedHistory: string[] = [];
  const seen = new Set<string>();

  for (const phrase of history) {
    const normalizedPhrase = normalizeCatalogSearchPhrase(phrase);
    const comparisonKey = normalizedPhrase.toLocaleLowerCase();

    if (!normalizedPhrase || seen.has(comparisonKey)) continue;

    seen.add(comparisonKey);
    normalizedHistory.push(normalizedPhrase);

    if (normalizedHistory.length === catalogSearchHistoryLimit) break;
  }

  return normalizedHistory;
}

export function upsertCatalogSearchHistory(history: readonly string[], phrase: string): string[] {
  const normalizedPhrase = normalizeCatalogSearchPhrase(phrase);
  return normalizedPhrase
    ? normalizeCatalogSearchHistory([normalizedPhrase, ...history])
    : normalizeCatalogSearchHistory(history);
}

export function removeCatalogSearchHistoryEntry(
  history: readonly string[],
  phrase: string,
): string[] {
  const comparisonKey = normalizeCatalogSearchPhrase(phrase).toLocaleLowerCase();
  return normalizeCatalogSearchHistory(history).filter(
    (entry) => entry.toLocaleLowerCase() !== comparisonKey,
  );
}
