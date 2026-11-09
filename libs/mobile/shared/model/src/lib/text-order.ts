/**
 * One Ukrainian collator for every A–Я list. `localeCompare(…, 'uk')` builds a collator on each call, which on
 * Hermes makes sorting a few thousand names take seconds.
 */
const collator = new Intl.Collator('uk');

export const compareText = (a: string, b: string): number => collator.compare(a, b);

/** Sorts by a text key computed once per item, not once per comparison. */
export function sortByText<T>(items: readonly T[], keyOf: (item: T) => string): T[] {
  return items
    .map((item) => ({ item, key: keyOf(item) }))
    .sort((a, b) => collator.compare(a.key, b.key))
    .map(({ item }) => item);
}
