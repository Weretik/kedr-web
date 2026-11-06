import { describe, expect, it } from 'vitest';

import {
  completeMeanings,
  initialCategoryMeanings,
  initialMeanings,
  shortCategoryPath,
  toCodeDecision,
} from './code-decision';

const code = {
  aliasId: 1,
  attributeId: 7,
  attributeName: 'Код конфігурації циліндра',
  scope: 'mechanical_cylinder',
  rawValue: 'ZCG',
  valueId: null,
  valueName: null,
  isConfirmed: false,
  note: null,
  productCount: 14,
  meanings: [],
};

const category = {
  categoryId: 1,
  categoryPath: 'Фурнітура > Циліндри > серія BRASS',
  hasOwnValue: true,
  valueId: null,
  valueName: null,
  products: [],
  meanings: [{ attributeId: 3, attributeName: 'Колір', valueId: 5, valueName: 'Золото' }],
};

describe('code decision', () => {
  it('starts with one empty row in the code attribute, or the current meanings', () => {
    expect(initialMeanings(code)).toEqual({
      nothing: false,
      rows: [{ attributeId: 7, valueId: null }],
    });
    expect(initialMeanings({ ...code, meanings: category.meanings }).rows).toEqual([
      { attributeId: 3, valueId: 5 },
    ]);
  });

  it('reads the decoding of a category and shortens its path', () => {
    expect(initialCategoryMeanings(category, 7)).toEqual({
      mode: 'own',
      rows: [{ attributeId: 3, valueId: 5 }],
    });
    expect(initialCategoryMeanings({ ...category, meanings: [] }, 7).mode).toBe('none');
    expect(initialCategoryMeanings({ ...category, hasOwnValue: false }, 7).mode).toBe('inherit');
    expect(shortCategoryPath(category.categoryPath)).toBe('Циліндри > серія BRASS');
  });

  it('keeps complete rows, one per attribute', () => {
    expect(
      completeMeanings([
        { attributeId: 7, valueId: 1 },
        { attributeId: 3, valueId: null },
        { attributeId: 7, valueId: 2 },
        { attributeId: 3, valueId: 5 },
      ]),
    ).toEqual([
      { attributeId: 7, valueId: 1 },
      { attributeId: 3, valueId: 5 },
    ]);
  });

  it('sends several meanings for all and the categories with their own decoding', () => {
    expect(
      toCodeDecision(
        {
          nothing: false,
          rows: [
            { attributeId: 7, valueId: 1 },
            { attributeId: 3, valueId: 5 },
          ],
        },
        {
          1: { mode: 'inherit', rows: [] },
          2: { mode: 'none', rows: [{ attributeId: 3, valueId: 5 }] },
          3: { mode: 'own', rows: [{ attributeId: 3, valueId: 6 }] },
        },
      ),
    ).toEqual({
      valueId: null,
      applyToAll: true,
      meanings: [
        { attributeId: 7, valueId: 1 },
        { attributeId: 3, valueId: 5 },
      ],
      categories: [
        { categoryId: 2, valueId: null, meanings: [] },
        { categoryId: 3, valueId: null, meanings: [{ attributeId: 3, valueId: 6 }] },
      ],
    });
  });

  it('keeps the code undecided for all without a complete row, and sends nothing for «нічого не означає»', () => {
    expect(
      toCodeDecision({ nothing: false, rows: [{ attributeId: 7, valueId: null }] }, {}),
    ).toEqual({
      valueId: null,
      applyToAll: false,
      meanings: [],
      categories: [],
    });
    expect(
      toCodeDecision({ nothing: true, rows: [{ attributeId: 7, valueId: 1 }] }, {}),
    ).toMatchObject({ applyToAll: true, meanings: [] });
  });
});
