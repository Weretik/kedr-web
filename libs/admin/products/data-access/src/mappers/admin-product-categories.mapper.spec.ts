import { describe, expect, it } from 'vitest';

import { mapAdminProductCategories } from './admin-product-categories.mapper';

describe('admin product category choices', () => {
  it('uses public Ukrainian labels and keeps hierarchy selectable at every level', () => {
    const categories = mapAdminProductCategories([
      { id: 5513, parentId: null, shortNameUk: 'Фурнітура' },
      { id: 900001, parentId: 5513, shortNameUk: 'Завіси' },
      { id: 1707, parentId: 900001, shortNameUk: 'Накладні(метелик)' },
    ]);
    expect(categories).toMatchObject([
      { id: 5513, parentId: null, nameUk: 'Фурнітура', depth: 0, hasChildren: true },
      { id: 900001, parentId: 5513, nameUk: 'Завіси', depth: 1, hasChildren: true },
      { id: 1707, parentId: 900001, nameUk: 'Накладні (метелик)', depth: 2, hasChildren: false },
    ]);
    expect(categories[2].pathUk).toBe('Фурнітура Завіси Накладні (метелик)');
  });
});
