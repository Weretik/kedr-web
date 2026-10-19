import { describe, expect, it } from 'vitest';

import { readProductsUrlState, writeProductsUrlState } from './products-url-state';

describe('products URL state', () => {
  it('normalizes invalid mode and pagination', () => {
    expect(readProductsUrlState(new URLSearchParams('mode=wrong&page=-2&pageSize=999'))).toMatchObject({
      mode: 'all', missingQuery: { page: 1 }, allQuery: { page: 1, pageSize: 100 },
    });
  });

  it('keeps each mode search and false filters in the URL', () => {
    const state = readProductsUrlState(new URLSearchParams('searchTerm=cable&isSale=false&page=3&sort=name-desc&missingSearchTerm=wire&missingInStock=false'));
    const next = writeProductsUrlState({ ...state, mode: 'missing', missingQuery: { ...state.missingQuery, page: 1 } });
    expect(next.get('mode')).toBe('missing');
    expect(next.get('searchTerm')).toBe('cable');
    expect(next.get('isSale')).toBe('false');
    expect(next.get('page')).toBe('3');
    expect(next.get('sort')).toBe('name-desc');
    expect(next.get('missingSearchTerm')).toBe('wire');
    expect(next.get('missingInStock')).toBe('false');
    expect(next.get('missingPage')).toBeNull();
  });

  it('keeps the site tab query separate and fixes its server predicate', () => {
    const state = readProductsUrlState(new URLSearchParams('mode=site&page=3&sitePage=4&siteSearchTerm=hinge&siteIsNew=false&siteExportToSite=false'));
    expect(state.mode).toBe('site');
    expect(state.allQuery.page).toBe(3);
    expect(state.siteQuery).toMatchObject({ page: 4, searchTerm: 'hinge', isNew: false, exportToSite: true });
    const next = writeProductsUrlState(state);
    expect(next.get('mode')).toBe('site');
    expect(next.get('sitePage')).toBe('4');
    expect(next.get('siteExportToSite')).toBeNull();
  });

  it('retains each tab category and category sorting independently', () => {
    const state = readProductsUrlState(new URLSearchParams('categoryId=42&sort=category-asc&missingCategoryId=73&siteCategoryId=88&siteSort=category-desc'));
    expect(state.allQuery).toMatchObject({ categoryId: 42, sort: 'category-asc' });
    expect(state.missingQuery.categoryId).toBe(73);
    expect(state.siteQuery).toMatchObject({ categoryId: 88, sort: 'category-desc' });
    expect(writeProductsUrlState(state).get('siteCategoryId')).toBe('88');
  });
});
