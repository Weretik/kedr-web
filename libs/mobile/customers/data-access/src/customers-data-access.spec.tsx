import {
  categories,
  customerCategoryPriceTypes,
  customers,
  LocalDatabaseProvider,
  markLocalDataChanged,
  priceTypes,
  type LocalDatabase,
} from '@mobile/core/local-db';
import { createTestLocalDatabase } from '@mobile/core/local-db/testing';
import { act, renderHook, waitFor } from '@testing-library/react-native';

import { readCachedActivity } from './activity/customer-activity-store';
import { useCustomerActivity } from './hooks/use-customer-activity';
import { useCustomers, useSelectedCustomer } from './hooks/use-customers';
import { readCustomerDetails } from './queries/customer-queries';
import { useSelectedCustomerStore } from './selection/selected-customer-store';

import type { ReactNode } from 'react';

function seed(): LocalDatabase {
  const db = createTestLocalDatabase();
  db.insert(priceTypes)
    .values([
      { id: 12, name: 'Роздрібна' },
      { id: 14, name: 'Оптова' },
    ])
    .run();
  db.insert(categories).values({ id: 10, name: 'Ручки', parentId: null, sortOrder: 0 }).run();
  db.insert(customers)
    .values([
      { counterpartyId: 'c-2', defaultPriceTypeId: 12, email: 'b@x', name: 'Будсервіс-Захід' },
      {
        counterpartyId: 'c-1',
        defaultPriceTypeId: 14,
        email: 'a@x',
        name: 'Альфа',
        phone: '+380501112233',
      },
    ])
    .run();
  db.insert(customerCategoryPriceTypes)
    .values({ categoryId: 10, counterpartyId: 'c-1', priceTypeId: 12 })
    .run();
  return db;
}

function wrapperFor(db: LocalDatabase) {
  return function DatabaseWrapper({ children }: { children: ReactNode }) {
    return <LocalDatabaseProvider database={db}>{children}</LocalDatabaseProvider>;
  };
}

describe('customer queries', () => {
  it('reads the card with price type and rule names', () => {
    const details = readCustomerDetails(seed(), 'c-1');

    expect(details).toMatchObject({
      debtKopecks: null,
      defaultPriceTypeName: 'Оптова',
      name: 'Альфа',
      priceRules: [
        { categoryId: 10, categoryName: 'Ручки', priceTypeId: 12, priceTypeName: 'Роздрібна' },
      ],
    });
    expect(readCustomerDetails(seed(), 'missing')).toBeNull();
  });

  it('re-reads the list after a sync', async () => {
    const db = seed();
    const { result } = await renderHook(() => useCustomers(), { wrapper: wrapperFor(db) });
    expect(result.current.map((customer) => customer.name)).toEqual(['Альфа', 'Будсервіс-Захід']);

    db.delete(customers).run();
    await act(async () => markLocalDataChanged());

    expect(result.current).toEqual([]);
  });
});

describe('selected customer (R-002)', () => {
  beforeEach(() => useSelectedCustomerStore.getState().clear());

  it('is null until chosen and remembers recent customers', async () => {
    const db = seed();
    const { result } = await renderHook(() => useSelectedCustomer(), { wrapper: wrapperFor(db) });
    expect(result.current).toBeNull();

    await act(async () => useSelectedCustomerStore.getState().select('c-2'));
    await act(async () => useSelectedCustomerStore.getState().select('c-1'));

    expect(result.current?.name).toBe('Альфа');
    expect(useSelectedCustomerStore.getState().recentIds).toEqual(['c-1', 'c-2']);
  });

  it('is null when the chosen customer left the synced list', async () => {
    const db = seed();
    await act(async () => useSelectedCustomerStore.getState().select('gone'));

    const { result } = await renderHook(() => useSelectedCustomer(), { wrapper: wrapperFor(db) });

    expect(result.current).toBeNull();
  });
});

describe('customer activity', () => {
  const lists = {
    drafts: [{ draftId: 7, lineCount: 2, title: 'Ручки', updatedAtUtc: '2026-11-04T10:00:00Z' }],
    orders: [
      {
        createdAtUtc: '2026-11-03T10:00:00Z',
        lineCount: 3,
        orderId: 1,
        orderNumber: 'K-1',
        syncStatus: 'Accepted',
        totalAmount: 1250.5,
      },
    ],
  };

  it('reads online, saves for offline and shows the saved lists without a network', async () => {
    const db = seed();
    const fetcher = jest.fn().mockResolvedValue(lists);
    const online = await renderHook(() => useCustomerActivity('c-1', true, fetcher, () => 1000), {
      wrapper: wrapperFor(db),
    });
    await waitFor(() => expect(online.result.current.activity?.orders).toHaveLength(1));
    expect(readCachedActivity(db, 'c-1')?.fetchedAt).toBe(1000);

    const offline = await renderHook(() => useCustomerActivity('c-1', false, fetcher), {
      wrapper: wrapperFor(db),
    });

    expect(offline.result.current.activity?.drafts[0]?.title).toBe('Ручки');
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('keeps the saved lists and marks a failed refresh', async () => {
    const db = seed();
    const fetcher = jest.fn().mockRejectedValue(new Error('offline'));

    const { result } = await renderHook(() => useCustomerActivity('c-1', true, fetcher), {
      wrapper: wrapperFor(db),
    });

    await waitFor(() => expect(result.current.failed).toBe(true));
    expect(result.current.activity).toBeNull();
  });
});
