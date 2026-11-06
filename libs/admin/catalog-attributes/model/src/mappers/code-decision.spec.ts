import { describe, expect, it } from 'vitest';

import { categoryChoice, shortCategoryPath, toCodeDecision } from './code-decision';

describe('code decision', () => {
  it('keeps the code undecided for all when only categories are chosen', () => {
    expect(toCodeDecision('', { 1: 'inherit', 2: 'none', 3: '8' })).toEqual({
      valueId: null,
      applyToAll: false,
      categories: [
        { categoryId: 2, valueId: null },
        { categoryId: 3, valueId: 8 },
      ],
    });
  });

  it('decides «Без значення» for all', () => {
    expect(toCodeDecision('none', {})).toEqual({ valueId: null, applyToAll: true, categories: [] });
  });

  it('reads the choice of a category and shortens its path', () => {
    const category = {
      categoryId: 1,
      categoryPath: 'Фурнітура > Ручки > На планці',
      hasOwnValue: true,
      valueId: 5,
      valueName: 'Алюміній',
      products: [],
    };
    expect(categoryChoice(category)).toBe('5');
    expect(categoryChoice({ ...category, hasOwnValue: false })).toBe('inherit');
    expect(shortCategoryPath(category.categoryPath)).toBe('Ручки > На планці');
  });
});
