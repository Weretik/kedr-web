import { describe, expect, it } from 'vitest';

import { siteFinalCategories } from './site-final-categories';

import type { SiteModelCategory } from '../entities/showcase/site-showcase';

const category = (id: number, name: string, parentId: number | null): SiteModelCategory => ({
  id,
  name,
  parentId,
  onSiteProducts: 1,
  acceptedModels: 0,
  proposedModels: 0,
  problemCount: 0,
  loneProducts: 0,
  filterCount: 0,
});

describe('siteFinalCategories', () => {
  it('keeps only categories without subcategories, with the path, sorted by path', () => {
    const result = siteFinalCategories([
      category(1, 'Фурнітура', null),
      category(2, 'Ручки', 1),
      category(3, 'Завіси', 1),
      category(4, 'Замки', null),
    ]);
    expect(result).toEqual([
      { id: 4, name: 'Замки', path: 'Замки' },
      { id: 3, name: 'Завіси', path: 'Фурнітура / Завіси' },
      { id: 2, name: 'Ручки', path: 'Фурнітура / Ручки' },
    ]);
  });

  it('treats a category whose parent is missing as a top one', () => {
    expect(siteFinalCategories([category(5, 'Ручки', 99)])).toEqual([
      { id: 5, name: 'Ручки', path: 'Ручки' },
    ]);
  });
});
