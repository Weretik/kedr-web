import type { SiteModelCategory, SiteShowcaseRow } from './site-showcase';

/** The work counts of «Перевірка»: proposals to review and on-site products in no model, over the whole site. */
export function siteReviewCounts(categories: readonly SiteModelCategory[]): {
  review: number;
  lone: number;
} {
  const ids = new Set(categories.map((category) => category.id));
  const tops = categories.filter(
    (category) => category.parentId === null || !ids.has(category.parentId),
  );
  const sum = (count: (category: SiteModelCategory) => number) =>
    tops.reduce((total, category) => total + count(category), 0);
  return {
    review: sum((category) => category.proposedModels),
    lone: sum((category) => category.loneProducts),
  };
}

/** The key after `current` in the queue, or the one before it when it was the last; none in an empty queue. */
export function nextSiteQueueKey(
  keys: readonly string[],
  current: string | undefined,
): string | undefined {
  const index = current === undefined ? -1 : keys.indexOf(current);
  if (index < 0) return keys[0];
  return keys[index + 1] ?? keys[index - 1];
}

/** The first word of a model name, lower-cased: «Завіса 100×75 BK» → «завіса». */
function firstWord(name: string): string {
  return name.trim().split(/\s+/u)[0]?.toLocaleLowerCase('uk') ?? '';
}

/**
 * Other proposed models of the same category whose name starts with the same word: candidates to merge into the
 * model a person reviews.
 */
export function similarSiteModels(
  rows: readonly SiteShowcaseRow[],
  model: { id: number; name: string; categoryId: number },
  limit = 5,
): SiteShowcaseRow[] {
  const word = firstWord(model.name);
  if (!word) return [];
  return rows
    .filter(
      (row) =>
        row.model !== null &&
        row.model.id !== model.id &&
        row.model.status === 'proposed' &&
        row.categoryId === model.categoryId &&
        firstWord(row.name) === word,
    )
    .slice(0, limit);
}

/** The open proposal of «Нові моделі» (the first one by default) and the row «Далі» goes to. */
export function siteQueueSelection(rows: readonly SiteShowcaseRow[], item: string | undefined) {
  const keys = rows.map((row) => row.key);
  const selectedKey = item ?? keys[0];
  const next = nextSiteQueueKey(keys, selectedKey);
  return {
    selectedKey,
    nextKey: next !== selectedKey ? next : undefined,
    modelId: selectedKey?.startsWith('m') ? Number(selectedKey.slice(1)) : undefined,
  };
}
