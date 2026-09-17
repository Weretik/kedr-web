import { parseCustomerPage } from './customer-page.contract';

describe('customer contract', () => {
  it('validates and maps a customer page', () => {
    expect(
      parseCustomerPage({
        pagedInfo: { pageNumber: 1, pageSize: 100, totalPages: 1, totalRecords: 2 },
        value: [
          { counterpartyId: 'cp-1', name: 'Клієнт 1', phone: null },
          { counterpartyId: 'cp-2', name: 'Клієнт 2', phone: '+380501234567' },
        ],
      }),
    ).toEqual({
      customers: [
        { counterpartyId: 'cp-1', name: 'Клієнт 1', phone: null },
        { counterpartyId: 'cp-2', name: 'Клієнт 2', phone: '+380501234567' },
      ],
      pageNumber: 1,
      pageSize: 100,
      totalPages: 1,
      totalRecords: 2,
    });
  });

  it('rejects invalid external data', () => {
    expect(() =>
      parseCustomerPage({
        pagedInfo: { pageNumber: 0, pageSize: 100, totalPages: 1, totalRecords: 1 },
        value: [{ counterpartyId: '', name: 'Invalid', phone: null }],
      }),
    ).toThrow();
  });
});
