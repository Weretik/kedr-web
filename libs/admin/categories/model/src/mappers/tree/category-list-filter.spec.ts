import { describe, expect, it } from 'vitest';

import {
  categoryFilterCounts,
  categorySearchMatches,
  matchesCategoryFilter,
} from './category-list-filter';

import type { AdminCategory } from '../../entities/admin-category';

const category = (overrides: Partial<AdminCategory> = {}): AdminCategory => ({
  deletedAt: null,
  id: 1304,
  isDeleted: false,
  isShownOnSite: true,
  level: 2,
  nameRu: 'Навесные',
  nameUk: 'Навісні',
  parentId: null,
  slug: 'kedr-zamky-navisni',
  sortOrder: 0,
  sourceKey: '000005513',
  sourceName: 'KEDR Замки навісні та велозамки',
  productCount: 37,
  filledLanguages: ['ru', 'uk'],
  siteNameUk: 'Навісні та велозамки',
  siteNameRu: null,
  isClosedFromSearch: false,
  sharePicture: null,
  isManual: false,
  modelCount: 9,
  proposedModelCount: 0,
  ...overrides,
});

describe('categorySearchMatches', () => {
  it('finds a category by its 1C name, site name, address or exact ID', () => {
    expect(categorySearchMatches(category(), 'kedr замки')).toBe(true);
    expect(categorySearchMatches(category(), 'велозамки')).toBe(true);
    expect(categorySearchMatches(category(), 'zamky-navisni')).toBe(true);
    expect(categorySearchMatches(category(), '1304')).toBe(true);
    expect(categorySearchMatches(category(), '130')).toBe(false);
    expect(categorySearchMatches(category(), ' ')).toBe(true);
  });
});

describe('category chips', () => {
  it('keeps categories by missing text, hidden, closed and manual, and counts them', () => {
    const rows = [
      category(),
      category({ id: 2, filledLanguages: ['uk'], isShownOnSite: false }),
      category({ id: 3, isClosedFromSearch: true, isManual: true, filledLanguages: [] }),
    ];

    expect(matchesCategoryFilter(rows[1], 'missingText')).toBe(true);
    expect(matchesCategoryFilter(rows[0], 'missingText')).toBe(false);
    expect(categoryFilterCounts(rows)).toEqual({ missingText: 2, hidden: 1, closed: 1, manual: 1 });
  });
});
