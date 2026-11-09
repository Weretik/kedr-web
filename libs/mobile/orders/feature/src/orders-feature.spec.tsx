import {
  enqueueOrder,
  readCalculation,
  saveEntry,
  writeCalculation,
  type OrderWorkspaceApi,
} from '@mobile/calculation/data-access';
import { customers, LocalDatabaseProvider, type LocalDatabase } from '@mobile/core/local-db';
import { createTestLocalDatabase } from '@mobile/core/local-db/testing';
import { useSelectedCustomerStore } from '@mobile/customers/data-access';
import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { OrderDetailScreen } from './components/order-detail-screen';
import { OrdersScreen } from './components/orders-screen';
import { OrdersWorkspace } from './components/orders-workspace';

import type { ReactNode } from 'react';

let mockBreakpoint = 'phone';
jest.mock('@mobile/shared/ui', () => ({
  ...jest.requireActual('@mobile/shared/ui'),
  useBreakpoint: () => mockBreakpoint,
}));

function seed(): LocalDatabase {
  const db = createTestLocalDatabase();
  db.insert(customers)
    .values({ counterpartyId: 'c-1', defaultPriceTypeId: 2, email: '', name: 'Будмаркет' })
    .run();
  return db;
}

function wrapperFor(db: LocalDatabase) {
  return function DatabaseWrapper({ children }: { children: ReactNode }) {
    return <LocalDatabaseProvider database={db}>{children}</LocalDatabaseProvider>;
  };
}

const fetcher = jest.fn().mockResolvedValue({
  drafts: [{ draftId: 5, lineCount: 1, title: 'Подол', updatedAtUtc: '2026-11-04T10:00:00Z' }],
  orders: [
    {
      createdAtUtc: '2026-11-05T10:00:00Z',
      lineCount: 2,
      orderId: 42,
      orderNumber: 'КД-0042',
      syncStatus: 'Synced',
      totalAmount: 1608,
    },
  ],
});

const api = {
  getDraft: jest.fn().mockResolvedValue({
    counterpartyId: 'c-1',
    draftId: 5,
    lines: [{ adjustmentKopecks: -1000, productId: 7, quantity: 4 }],
    note: null,
    title: 'Подол',
    version: 'v3',
  }),
} as unknown as OrderWorkspaceApi;

const queueOrder = (db: LocalDatabase) =>
  enqueueOrder(db, {
    comment: null,
    counterpartyId: 'c-1',
    customerName: 'Будмаркет',
    expectedBaseKopecks: {},
    lines: [{ adjustmentKopecks: 0, productId: 7, quantity: 1 }],
    totalKopecks: 41_200,
  });

const order = {
  comment: 'Самовивіз',
  createdAtUtc: '2026-11-05T10:00:00Z',
  customerName: 'Будмаркет',
  lines: [
    {
      adjustmentKopecks: -1000,
      amountKopecks: 160_800,
      productId: '7',
      productName: 'Петля дверна',
      quantity: 4,
    },
  ],
  oneCDocumentNumber: null,
  orderId: 42,
  orderNumber: 'КД-0042',
  syncStatus: 'Synced',
  totalKopecks: 160_800,
};

describe('OrdersScreen', () => {
  beforeEach(async () => {
    await act(async () => useSelectedCustomerStore.getState().select('c-1'));
  });

  it('lists queued orders, customer orders, and opens an order (SC-016, R-013)', async () => {
    const db = seed();
    queueOrder(db);
    const onOpenOrder = jest.fn();
    await render(
      <OrdersScreen
        api={api}
        fetcher={fetcher}
        isOnline
        onOpenCalculation={jest.fn()}
        onOpenOrder={onOpenOrder}
      />,
      { wrapper: wrapperFor(db) },
    );
    await act(async () => undefined);

    expect(screen.getByText('У черзі')).toBeTruthy();
    await fireEvent.press(screen.getByText('№ КД-0042'));
    expect(onOpenOrder).toHaveBeenCalledWith(42);
  });

  it('opens a draft in the calculation (SC-014)', async () => {
    const db = seed();
    const onOpenCalculation = jest.fn();
    await render(
      <OrdersScreen
        api={api}
        fetcher={fetcher}
        isOnline
        onOpenCalculation={onOpenCalculation}
        onOpenOrder={jest.fn()}
      />,
      { wrapper: wrapperFor(db) },
    );
    await act(async () => undefined);

    await fireEvent.press(screen.getByText('Чернетки'));
    await fireEvent.press(screen.getByText('Подол'));
    await act(async () => undefined);

    expect(onOpenCalculation).toHaveBeenCalled();
    expect(readCalculation(db, 'c-1')).toMatchObject({ sourceDraft: { id: 5, version: 'v3' } });
  });

  it('opens a returned order only when the calculation is free (SC-017)', async () => {
    const db = seed();
    const entry = queueOrder(db);
    saveEntry(db, {
      ...entry,
      lastError: 'Ціни змінилися',
      review: { changedProductIds: [7], reason: 'Ціни змінилися' },
      state: 'needs-review',
    });
    writeCalculation(db, {
      comment: null,
      counterpartyId: 'c-1',
      lines: [{ adjustmentKopecks: 0, productId: 9, quantity: 1 }],
      review: null,
      sourceDraft: null,
    });
    const onOpenCalculation = jest.fn();
    await render(
      <OrdersScreen
        api={api}
        fetcher={fetcher}
        isOnline={false}
        onOpenCalculation={onOpenCalculation}
        onOpenOrder={jest.fn()}
      />,
      { wrapper: wrapperFor(db) },
    );

    await fireEvent.press(screen.getByText('Ціни змінилися'));
    expect(screen.getByText('Спочатку відправте або збережіть поточний розрахунок.')).toBeTruthy();
    expect(onOpenCalculation).not.toHaveBeenCalled();
  });
});

describe('OrderDetailScreen', () => {
  it('shows lines with adjustments and the total', async () => {
    await render(
      <OrderDetailScreen fetcher={jest.fn().mockResolvedValue(order)} isOnline orderId={42} />,
      { wrapper: wrapperFor(seed()) },
    );
    await act(async () => undefined);

    expect(screen.getByText('№ КД-0042')).toBeTruthy();
    expect(screen.getByText(/−10,00.*\/шт/)).toBeTruthy();
    expect(screen.getByText(/Разом 1\s?608,00/)).toBeTruthy();
  });

  it('says it opens with the network', async () => {
    await render(<OrderDetailScreen isOnline={false} orderId={42} />, {
      wrapper: wrapperFor(seed()),
    });
    expect(screen.getByText('Замовлення відкриється, коли з’явиться мережа.')).toBeTruthy();
  });
});

describe('OrdersWorkspace', () => {
  beforeEach(async () => {
    await act(async () => useSelectedCustomerStore.getState().select('c-1'));
  });
  afterEach(() => {
    mockBreakpoint = 'phone';
  });

  it('opens the order next to the lists on a tablet (R-017)', async () => {
    mockBreakpoint = 'tablet';
    const onOpenOrder = jest.fn();
    await render(
      <OrdersWorkspace
        api={api}
        detailFetcher={jest.fn().mockResolvedValue(order)}
        fetcher={fetcher}
        isOnline
        onOpenCalculation={jest.fn()}
        onOpenOrder={onOpenOrder}
      />,
      { wrapper: wrapperFor(seed()) },
    );
    await act(async () => undefined);
    expect(screen.getByText('Оберіть замовлення')).toBeTruthy();

    await fireEvent.press(screen.getByText('№ КД-0042'));
    await act(async () => undefined);

    expect(onOpenOrder).not.toHaveBeenCalled();
    expect(screen.getByText('Петля дверна')).toBeTruthy();
  });
});
