import { describe, expect, it } from 'vitest';

import { problemLabel, problemReasonLabel } from './attribute-problem';
import { attributeValueText, isManualAttribute } from './product-attributes';

import type { ProductAttribute } from './product-attributes';

describe('problem labels', () => {
  it('adds the quoted code from the explanation', () => {
    expect(
      problemLabel({
        code: 'unresolved_material_code',
        text: '«AL»: Материальный код не раскрыт.',
      }),
    ).toBe('Не розшифровано матеріал: AL');
    expect(problemLabel({ code: 'no_name', text: null })).toBe('No name');
  });

  it('keeps an unknown code readable', () => {
    expect(problemReasonLabel('new_reason')).toBe('Потребує перевірки (new_reason)');
  });
});

describe('product attributes', () => {
  const attribute: ProductAttribute = {
    attributeId: 1,
    code: 'color',
    name: 'Колір',
    kind: 'enum',
    unit: null,
    isVariantAxis: true,
    values: [
      {
        position: 0,
        valueId: 2,
        valueName: 'Хром',
        number: null,
        source: 'import',
        isLocked: false,
        isConfirmed: true,
        hasAutomatic: false,
      },
      {
        position: 1,
        valueId: 3,
        valueName: 'Чорний',
        number: null,
        source: 'manual',
        isLocked: true,
        isConfirmed: true,
        hasAutomatic: false,
      },
    ],
  };

  it('joins values in order and tells a manual attribute', () => {
    expect(attributeValueText(attribute)).toBe('Хром / Чорний');
    expect(isManualAttribute(attribute)).toBe(true);
    expect(isManualAttribute({ ...attribute, values: [attribute.values[0]] })).toBe(false);
  });

  it('shows numbers with the unit', () => {
    expect(
      attributeValueText({
        ...attribute,
        kind: 'number',
        unit: 'мм',
        values: [{ ...attribute.values[0], valueId: null, valueName: null, number: 70 }],
      }),
    ).toBe('70 мм');
  });
});
