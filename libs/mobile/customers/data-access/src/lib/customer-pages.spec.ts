import { loadAllCustomers } from './customer-pages';

describe('customer pagination', () => {
  it('loads all pages and deduplicates customers by counterparty ID', async () => {
    const fetchPage = jest.fn(async (page: number) => ({
      customers:
        page === 1
          ? [
              { counterpartyId: 'cp-1', name: 'Клієнт 1', phone: null },
              { counterpartyId: 'cp-2', name: 'Клієнт 2', phone: null },
            ]
          : [
              { counterpartyId: 'cp-2', name: 'Клієнт 2', phone: null },
              { counterpartyId: 'cp-3', name: 'Клієнт 3', phone: null },
            ],
      pageNumber: page,
      pageSize: 100,
      totalPages: 2,
      totalRecords: 3,
    }));

    await expect(loadAllCustomers(fetchPage)).resolves.toEqual([
      { counterpartyId: 'cp-1', name: 'Клієнт 1', phone: null },
      { counterpartyId: 'cp-2', name: 'Клієнт 2', phone: null },
      { counterpartyId: 'cp-3', name: 'Клієнт 3', phone: null },
    ]);
    expect(fetchPage).toHaveBeenNthCalledWith(1, 1, 100);
    expect(fetchPage).toHaveBeenNthCalledWith(2, 2, 100);
  });
});
