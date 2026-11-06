import {
  findLanding,
  landingGroups,
  landingHeading,
  landingPath,
  singleAttributeChoice,
  withAttributeValue,
  withoutAttribute,
} from './listing-landing';
import { DEFAULT_LISTING_QUERY } from '../listing/listing-query';

import type { ListingFilter } from '../entities/listing-filter';

const value = (slug: string, name: string, count: number) => ({
  slug,
  name,
  hex: null,
  textureUrl: null,
  count,
  selected: false,
});

const filters: ListingFilter[] = [
  {
    code: 'side',
    slug: 'storona',
    name: 'Сторона',
    display: 'button',
    values: [value('liva', 'Ліва', 6)],
  },
  {
    code: 'size',
    slug: 'rozmir',
    name: 'Розмір',
    display: 'button',
    values: [value('100x75', '100×75 мм', 5), value('120x80', '120×80 мм', 1)],
  },
  {
    code: 'color',
    slug: 'kolir',
    name: 'Колір',
    display: 'swatch',
    values: [value('khrom', 'Хром', 12), value('bile-zoloto', 'Біле золото', 1)],
  },
];

describe('listing landing', () => {
  it('builds the value page path under the category', () => {
    expect(landingPath('zavisy', 'khrom')).toBe('/catalog/zavisy/khrom');
  });

  it('finds color and size values only, color first', () => {
    expect(findLanding(filters, 'khrom')).toEqual({
      code: 'color',
      attribute: 'kolir',
      value: 'khrom',
      name: 'Хром',
      count: 12,
    });
    expect(findLanding(filters, '100x75')?.attribute).toBe('rozmir');
    expect(findLanding(filters, 'liva')).toBeNull();
    expect(findLanding(filters, 'missing')).toBeNull();
  });

  it('links only values with at least two models', () => {
    const groups = landingGroups(filters);
    expect(groups.map((group) => group.filter.code)).toEqual(['size', 'color']);
    expect(groups.flatMap((group) => group.landings.map((landing) => landing.value))).toEqual([
      '100x75',
      'khrom',
    ]);
  });

  it('takes one attribute value without other filters as a value page choice', () => {
    const one = {
      ...DEFAULT_LISTING_QUERY,
      attributes: { kolir: ['khrom'] },
      sort: 'name' as const,
    };
    expect(singleAttributeChoice(one)).toEqual({ attribute: 'kolir', value: 'khrom' });
    expect(
      singleAttributeChoice({ ...one, attributes: { kolir: ['khrom', 'zoloto'] } }),
    ).toBeNull();
    expect(
      singleAttributeChoice({ ...one, attributes: { kolir: ['khrom'], rozmir: ['100x75'] } }),
    ).toBeNull();
    expect(singleAttributeChoice({ ...one, inStock: true })).toBeNull();
    expect(singleAttributeChoice({ ...one, priceFrom: 10 })).toBeNull();
    expect(singleAttributeChoice(DEFAULT_LISTING_QUERY)).toBeNull();
  });

  it('adds and removes the value of the path', () => {
    const query = withAttributeValue(DEFAULT_LISTING_QUERY, 'kolir', 'khrom');
    expect(query.attributes).toEqual({ kolir: ['khrom'] });
    expect(withAttributeValue(query, 'kolir', 'khrom')).toBe(query);
    expect(withoutAttribute(query, 'kolir').attributes).toEqual({});
    expect(withoutAttribute(DEFAULT_LISTING_QUERY, 'kolir')).toBe(DEFAULT_LISTING_QUERY);
  });

  it('reads a color in lower case after the subject and keeps a size as is', () => {
    expect(landingHeading('Завіси', { code: 'color', name: 'Хром' })).toBe('Завіси хром');
    expect(landingHeading('Завіси', { code: 'size', name: '100×75 мм' })).toBe('Завіси 100×75 мм');
  });
});
