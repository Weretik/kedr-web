import { describe, expect, it } from 'vitest';

import { isSwatchHex } from './catalog-attribute';
import { moveFilter } from './category-filter';
import { codeDecisionNotice } from './unresolved-code';

import type { CategoryFilter } from './category-filter';
import type { UnresolvedCode } from './unresolved-code';

const filter = (attributeId: number, sortOrder: number): CategoryFilter => ({
  attributeId,
  code: `a${attributeId}`,
  name: `Фільтр ${attributeId}`,
  isFilterable: true,
  sortOrder,
  isEditedManually: false,
  productCount: 1,
});

const code: UnresolvedCode = {
  aliasId: 1,
  attributeId: 2,
  attributeName: 'Матеріал',
  scope: 'general',
  rawValue: 'AL',
  valueId: null,
  valueName: null,
  isConfirmed: false,
  note: null,
  productCount: 181,
};

describe('catalog attributes model', () => {
  it('accepts only #RRGGBB colors or empty', () => {
    expect(isSwatchHex('#B08D57')).toBe(true);
    expect(isSwatchHex('')).toBe(true);
    expect(isSwatchHex('B08D57')).toBe(false);
    expect(isSwatchHex('#B08')).toBe(false);
  });

  it('moves a filter and renumbers the order by tens', () => {
    const moved = moveFilter([filter(1, 5), filter(2, 7), filter(3, 9)], 2, -1);
    expect(moved.map((item) => [item.attributeId, item.sortOrder])).toEqual([
      [1, 10],
      [3, 20],
      [2, 30],
    ]);
  });

  it('keeps the list when a filter cannot move further', () => {
    const filters = [filter(1, 10), filter(2, 20)];
    expect(moveFilter(filters, 0, -1)).toEqual(filters);
  });

  it('says that new decodings reach products with the next recognition', () => {
    expect(codeDecisionNotice({ code, valuesConfirmed: 0 })).toBe(
      'Код «AL» збережено. Нові розшифровки потраплять у товари під час наступного розпізнавання.',
    );
    expect(codeDecisionNotice({ code, valuesConfirmed: 3 })).toContain(
      'Підтверджено значень у товарах: 3.',
    );
  });
});
