import type { SiteModelCategory, SiteShowcaseRow } from './site-showcase';
import type { SiteShowcaseQuery } from '../../queries/site-models-queries';

/**
 * A view of the «Моделі» queue: models to review, accepted models with problems, products in no model, or all.
 * A person reviews every model one by one; there is no bulk accept.
 */
export type SiteQueueView = 'review' | 'problems' | 'lone' | 'all';

/** «Усі» comes first and opens by default (owner, 2026-11-10). */
export const siteQueueViews: readonly SiteQueueView[] = ['all', 'review', 'problems', 'lone'];

export const siteQueueViewLabels: Record<SiteQueueView, string> = {
  review: 'На перевірку',
  problems: 'З проблемами',
  lone: 'Без моделі',
  all: 'Усі',
};

export function isSiteQueueView(value: string | null): value is SiteQueueView {
  return value !== null && (siteQueueViews as readonly string[]).includes(value);
}

/** The showcase filters of a view. */
export function siteQueueFilter(
  view: SiteQueueView,
): Pick<SiteShowcaseQuery, 'status' | 'problem'> {
  switch (view) {
    case 'review':
      return { status: 'proposed' };
    case 'problems':
      return { status: 'accepted', problem: 'any' };
    case 'lone':
      return { status: 'none' };
    case 'all':
      return {};
  }
}

/** How many rows each view has in a category (with subcategories), or in the whole site. */
export function siteQueueCounts(
  categories: readonly SiteModelCategory[],
  categoryId: number | undefined,
): Record<SiteQueueView, number> {
  const ids = new Set(categories.map((category) => category.id));
  const scope =
    categoryId === undefined
      ? categories.filter((category) => category.parentId === null || !ids.has(category.parentId))
      : categories.filter((category) => category.id === categoryId);
  const sum = (count: (category: SiteModelCategory) => number) =>
    scope.reduce((total, category) => total + count(category), 0);

  const review = sum((category) => category.proposedModels);
  const lone = sum((category) => category.loneProducts);
  return {
    review,
    problems: sum((category) => category.problemCount),
    lone,
    all: sum((category) => category.acceptedModels) + review + lone,
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

/** Products a person may add to a model: lone ones and those of proposed models, minus the model's own. */
export function modelAddCandidates(
  rows: readonly SiteShowcaseRow[],
  modelProductIds: readonly number[],
): SiteShowcaseRow['products'][number][] {
  const inModel = new Set(modelProductIds);
  return rows
    .filter((row) => row.model === null || row.model.status === 'proposed')
    .flatMap((row) => row.products)
    .filter((item) => !inModel.has(item.productId));
}

/** The open row of the queue (the first one by default), what it opens, and the row «Далі» goes to. */
export function siteQueueSelection(rows: readonly SiteShowcaseRow[], item: string | undefined) {
  const keys = rows.map((row) => row.key);
  const selectedKey = item ?? keys[0];
  const next = nextSiteQueueKey(keys, selectedKey);
  return {
    selectedKey,
    nextKey: next !== selectedKey ? next : undefined,
    modelId: selectedKey?.startsWith('m') ? Number(selectedKey.slice(1)) : undefined,
    lone: selectedKey?.startsWith('p') ? rows.find((row) => row.key === selectedKey) : undefined,
  };
}
