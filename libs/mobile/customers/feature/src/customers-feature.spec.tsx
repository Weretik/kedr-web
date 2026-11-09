import {
  customers,
  LocalDatabaseProvider,
  priceTypes,
  type LocalDatabase,
} from '@mobile/core/local-db';
import { createTestLocalDatabase } from '@mobile/core/local-db/testing';
import {
  useSelectedCustomerStore,
  type CustomerActivityFetcher,
} from '@mobile/customers/data-access';
import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { CustomerCard } from './components/customer-card';
import { CustomerChoice } from './components/customer-choice';

import type { ReactElement } from 'react';

let mockBreakpoint = 'phone';
jest.mock('@mobile/shared/ui', () => ({
  ...jest.requireActual('@mobile/shared/ui'),
  useBreakpoint: () => mockBreakpoint,
}));

function seed(): LocalDatabase {
  const db = createTestLocalDatabase();
  db.insert(priceTypes).values({ id: 12, name: 'Роздрібна' }).run();
  db.insert(customers)
    .values([
      { counterpartyId: 'c-2', defaultPriceTypeId: 12, email: 'b@x', name: 'Будсервіс' },
      {
        counterpartyId: 'c-1',
        defaultPriceTypeId: 12,
        email: 'a@x',
        name: 'Альфа',
        phone: '+380 50 111 22 33',
      },
    ])
    .run();
  return db;
}

const inDb = (db: LocalDatabase, element: ReactElement) =>
  render(<LocalDatabaseProvider database={db}>{element}</LocalDatabaseProvider>);

describe('CustomerChoice', () => {
  beforeEach(async () => {
    mockBreakpoint = 'phone';
    await act(async () => useSelectedCustomerStore.getState().clear());
  });

  it('finds a customer by phone digits, selects it and opens the card', async () => {
    const onOpenCard = jest.fn();
    await inDb(seed(), <CustomerChoice isOnline onOpenCard={onOpenCard} />);

    // The list is read off the screen's thread, so it appears a moment after the first render.
    expect(await screen.findByRole('header', { name: 'А' })).toBeTruthy();
    await fireEvent.changeText(screen.getByLabelText('Пошук клієнта'), '111 22');
    expect(screen.queryByText('Будсервіс')).toBeNull();
    await fireEvent.press(screen.getByText('Альфа'));

    expect(onOpenCard).toHaveBeenCalledWith('c-1');
    expect(useSelectedCustomerStore.getState()).toMatchObject({
      recentIds: ['c-1'],
      selectedId: 'c-1',
    });
  });

  it('puts recent customers on top', async () => {
    await act(async () => useSelectedCustomerStore.getState().select('c-2'));
    await inDb(seed(), <CustomerChoice isOnline onOpenCard={jest.fn()} />);

    expect(await screen.findByRole('header', { name: 'Недавні' })).toBeTruthy();
  });

  it('keeps the list and the card side by side on a tablet', async () => {
    mockBreakpoint = 'tablet';
    const onOpenCard = jest.fn();
    await inDb(seed(), <CustomerChoice isOnline={false} onOpenCard={onOpenCard} />);

    expect(screen.getByText('Оберіть клієнта')).toBeTruthy();
    await fireEvent.press(await screen.findByText('Будсервіс'));

    expect(onOpenCard).not.toHaveBeenCalled();
    expect(screen.getByText('Код 1С')).toBeTruthy();
  });
});

describe('CustomerCard', () => {
  const fetcher: CustomerActivityFetcher = async () => ({
    drafts: [
      { draftId: 7, lineCount: 2, title: 'Офіс на Сихові', updatedAtUtc: '2026-11-04T09:00:00Z' },
    ],
    orders: [
      {
        createdAtUtc: '2026-11-05T09:00:00Z',
        lineCount: 3,
        orderId: 1,
        orderNumber: 'K-101',
        syncStatus: 'Accepted',
        totalAmount: 1250,
      },
    ],
  });

  it('shows contacts, prices, «—» for debt and the orders and drafts', async () => {
    await inDb(seed(), <CustomerCard counterpartyId="c-1" fetcher={fetcher} isOnline />);

    expect(screen.getByText('+380 50 111 22 33')).toBeTruthy();
    expect(screen.getByText('Роздрібна')).toBeTruthy();
    expect(screen.getAllByText('—')).toHaveLength(2);
    expect(await screen.findByText('№ K-101')).toBeTruthy();

    await fireEvent.press(screen.getByText('Чернетки'));
    expect(screen.getByText('Офіс на Сихові')).toBeTruthy();
  });

  it('says why the lists are missing offline', async () => {
    await inDb(seed(), <CustomerCard counterpartyId="c-1" fetcher={fetcher} isOnline={false} />);

    expect(screen.getByText('Без мережі замовлення ще не завантажені.')).toBeTruthy();
  });

  it('tells when the customer left the synced list', async () => {
    await inDb(seed(), <CustomerCard counterpartyId="gone" isOnline />);

    expect(screen.getByText('Клієнта не знайдено')).toBeTruthy();
  });
});
