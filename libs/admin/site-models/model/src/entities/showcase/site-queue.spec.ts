import { describe, expect, it } from 'vitest';

import {
  nextSiteQueueKey,
  siteQueueSelection,
  siteReviewCounts,
  similarSiteModels,
} from './site-queue';

import type { SiteModelCategory, SiteShowcaseRow } from './site-showcase';

const category = (
  id: number,
  parentId: number | null,
  counts: Partial<SiteModelCategory> = {},
): SiteModelCategory => ({
  id,
  name: `Категорія ${id}`,
  parentId,
  onSiteProducts: 0,
  acceptedModels: 0,
  proposedModels: 0,
  problemCount: 0,
  loneProducts: 0,
  filterCount: 0,
  ...counts,
});

const row = (id: number, name: string, status: 'proposed' | 'accepted', categoryId = 7) =>
  ({
    key: `m${id}`,
    model: { id, name, status },
    name,
    photo: '',
    categoryId,
    categoryName: '',
    minPrice: null,
    inStock: true,
    products: [],
    problems: [],
  }) satisfies SiteShowcaseRow;

describe('site queue', () => {
  it('counts proposals and products in no model over the top categories', () => {
    const categories = [
      category(1, null, { acceptedModels: 3, proposedModels: 5, problemCount: 2, loneProducts: 1 }),
      category(2, 1, { acceptedModels: 1, proposedModels: 2, problemCount: 1 }),
      category(3, null, { proposedModels: 1 }),
    ];
    expect(siteReviewCounts(categories)).toEqual({ review: 6, lone: 1 });
  });

  it('moves to the next key, or to the previous one after the last', () => {
    expect(nextSiteQueueKey(['a', 'b', 'c'], 'a')).toBe('b');
    expect(nextSiteQueueKey(['a', 'b', 'c'], 'c')).toBe('b');
    expect(nextSiteQueueKey(['a', 'b'], 'x')).toBe('a');
    expect(nextSiteQueueKey([], undefined)).toBeUndefined();
  });

  it('finds other proposed models of the category that start with the same word', () => {
    const rows = [
      row(1, 'Завіса 100×75', 'proposed'),
      row(2, 'завіса 100×75 BK', 'proposed'),
      row(3, 'Завіса 120×80', 'accepted'),
      row(4, 'Завіса 100', 'proposed', 8),
      row(5, 'Ручка RIO', 'proposed'),
    ];
    expect(
      similarSiteModels(rows, { id: 1, name: 'Завіса 100×75', categoryId: 7 }).map(
        (item) => item.model?.id,
      ),
    ).toEqual([2]);
  });
});

describe('siteQueueSelection', () => {
  const rows = [row(1, 'Завіса', 'proposed'), row(2, 'Ручка А', 'proposed')];

  it('opens the first row when nothing is chosen and offers the next one', () => {
    expect(siteQueueSelection(rows, undefined)).toEqual({
      selectedKey: 'm1',
      nextKey: 'm2',
      modelId: 1,
    });
  });

  it('goes back one row after the last and has none after the only one', () => {
    expect(siteQueueSelection(rows, 'm2').nextKey).toBe('m1');
    expect(siteQueueSelection([rows[0]], 'm1').nextKey).toBeUndefined();
  });
});
