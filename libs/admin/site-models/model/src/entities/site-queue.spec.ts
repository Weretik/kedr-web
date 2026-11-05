import { describe, expect, it } from 'vitest';

import {
  nextSiteQueueKey,
  similarSiteModels,
  siteQueueCounts,
  siteQueueFilter,
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
  it('maps each view to the showcase filters', () => {
    expect(siteQueueFilter('review')).toEqual({ status: 'proposed' });
    expect(siteQueueFilter('problems')).toEqual({ status: 'accepted', problem: 'any' });
    expect(siteQueueFilter('lone')).toEqual({ status: 'none' });
    expect(siteQueueFilter('all')).toEqual({});
  });

  it('counts the top categories for the whole site and one category when selected', () => {
    const categories = [
      category(1, null, { acceptedModels: 3, proposedModels: 5, problemCount: 2, loneProducts: 1 }),
      category(2, 1, { acceptedModels: 1, proposedModels: 2, problemCount: 1 }),
      category(3, null, { proposedModels: 1 }),
    ];
    expect(siteQueueCounts(categories, undefined)).toEqual({
      review: 6,
      problems: 2,
      lone: 1,
      all: 10,
    });
    expect(siteQueueCounts(categories, 2)).toEqual({ review: 2, problems: 1, lone: 0, all: 3 });
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
