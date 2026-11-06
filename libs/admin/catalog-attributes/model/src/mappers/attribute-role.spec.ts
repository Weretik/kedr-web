import { describe, expect, it } from 'vitest';

import { attributeRole, groupAttributesByRole } from './attribute-role';

import type { CatalogAttribute } from '../entities/catalog-attribute';

const attribute = (patch: Partial<CatalogAttribute>): CatalogAttribute => ({
  id: 1,
  code: 'color',
  nameUk: 'Колір',
  nameRu: null,
  kind: 'enum',
  unit: null,
  slug: 'kolir',
  isFilterable: true,
  isVariantAxis: true,
  sortOrder: 10,
  isEditedManually: false,
  valueCount: 87,
  productCount: 1695,
  ...patch,
});

describe('attribute role', () => {
  it('sorts attributes into switches, filters, service, and unused', () => {
    expect(attributeRole(attribute({}))).toBe('switch');
    expect(attributeRole(attribute({ isVariantAxis: false }))).toBe('filter');
    expect(attributeRole(attribute({ isVariantAxis: false, isFilterable: false }))).toBe('service');
    expect(attributeRole(attribute({ productCount: 0 }))).toBe('unused');
  });

  it('groups in role order, finds by name or code, and leaves out empty groups', () => {
    const list = [
      attribute({
        id: 2,
        code: 'packaging',
        nameUk: 'Пакування',
        isVariantAxis: false,
        isFilterable: false,
      }),
      attribute({ id: 1 }),
    ];
    expect(groupAttributesByRole(list).map((group) => group.role)).toEqual(['switch', 'service']);
    expect(groupAttributesByRole(list, 'pack').map((group) => group.attributes[0].id)).toEqual([2]);
  });
});
