import { describe, expect, it } from 'vitest';

import { mapCustomerDetail, mapCustomerPage } from './customer.mapper';

describe('customer API mapping', () => {
  it('maps one server page without changing the order or total', () => {
    expect(
      mapCustomerPage({
        pagedInfo: { pageNumber: 2, pageSize: 20, totalPages: 3, totalRecords: 41 },
        value: [
          { counterpartyId: '0002', name: 'Бета', phone: null },
          { counterpartyId: '0003', name: 'Гама', phone: '+380123' },
        ],
      }),
    ).toEqual({
      items: [
        { counterpartyId: '0002', name: 'Бета', phone: null },
        { counterpartyId: '0003', name: 'Гама', phone: '+380123' },
      ],
      pageNumber: 2,
      pageSize: 20,
      totalPages: 3,
      totalRecords: 41,
    });
  });

  it('rejects malformed customer pages', () => {
    expect(() => mapCustomerPage({ pagedInfo: {}, value: [] })).toThrow();
  });

  it('maps price type and category names together with their identities', () => {
    expect(
      mapCustomerDetail({
        counterpartyId: '0002',
        name: 'Бета',
        phone: null,
        email: 'a@example.com',
        defaultPriceTypeId: 5,
        defaultPriceTypeName: 'Роздрібна',
        categoryPriceTypes: [{ categoryId: 3, categoryName: 'Замки', priceTypeId: 7, priceTypeName: 'Оптова' }],
      }),
    ).toEqual({
      counterpartyId: '0002',
      name: 'Бета',
      phone: null,
      email: 'a@example.com',
      defaultPriceTypeId: 5,
      defaultPriceTypeName: 'Роздрібна',
      categoryPriceTypes: [{ categoryId: 3, categoryName: 'Замки', priceTypeId: 7, priceTypeName: 'Оптова' }],
    });
  });

  it('preserves nullable names for a missing Catalog reference', () => {
    const detail = mapCustomerDetail({
      counterpartyId: '0002', name: 'Бета', phone: null, email: '',
      defaultPriceTypeId: 5, defaultPriceTypeName: null,
      categoryPriceTypes: [{ categoryId: 3, categoryName: null, priceTypeId: 7, priceTypeName: null }],
    });
    expect(detail.defaultPriceTypeName).toBeNull();
    expect(detail.categoryPriceTypes[0].categoryName).toBeNull();
    expect(detail.categoryPriceTypes[0].priceTypeName).toBeNull();
  });

  it('rejects malformed customer detail', () => {
    expect(() => mapCustomerDetail({ counterpartyId: '0002' })).toThrow();
  });
});
