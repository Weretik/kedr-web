import { describe, expect, it } from 'vitest';

import { productCategoryPath } from './product-category-path';

describe('product category path', () => {
  it('uses the API name while the category tree is loading', () => {
    expect(productCategoryPath({ categoryId: 7, categoryName: 'Замки' }, new Map())).toBe('Замки');
  });

  it('shows an honest identifier when a category is missing from both sources', () => {
    expect(productCategoryPath({ categoryId: 7, categoryName: '' }, new Map())).toBe('Категорія (ID 7)');
    expect(productCategoryPath({ categoryId: null, categoryName: '' }, new Map())).toBe('Категорію не вказано');
  });
});
