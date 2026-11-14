import { describe, expect, it } from 'vitest';

import { searchAttributeValues } from './attribute-value-search';

import type { CatalogAttributeValue } from '../entities/catalog-attribute';

const values = [
  { nameUk: 'Золото', code: 'ZL' },
  { nameUk: 'Хром', code: 'CR' },
] as CatalogAttributeValue[];

describe('searchAttributeValues', () => {
  it('matches the name or the code, ignoring case and spaces', () => {
    expect(searchAttributeValues(values, ' зол ').map((value) => value.code)).toEqual(['ZL']);
    expect(searchAttributeValues(values, 'cr').map((value) => value.code)).toEqual(['CR']);
  });

  it('keeps every value for an empty search', () => {
    expect(searchAttributeValues(values, '  ')).toBe(values);
  });
});
