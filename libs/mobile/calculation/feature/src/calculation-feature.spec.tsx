import { enqueueOrder, openDraftInCalculation, readOutbox } from '@mobile/calculation/data-access';
import {
  customers,
  LocalDatabaseProvider,
  productPrices,
  products,
  type LocalDatabase,
} from '@mobile/core/local-db';
import { createTestLocalDatabase } from '@mobile/core/local-db/testing';
import { useSelectedCustomerStore } from '@mobile/customers/data-access';
import { act, fireEvent, render, renderHook, screen } from '@testing-library/react-native';

import { CalculationPanel } from './components/calculation-panel';
import { QueueSummaryCard } from './components/queue-summary-card';
import { useAddToCalculation, useCalculationBadges } from './hooks/use-add-to-calculation';

import type { ReactNode } from 'react';

const base = {
  categoryId: 1,
  inStock: true,
  isNew: false,
  isSale: false,
  photos: [],
  quantityInPack: 1,
  scheme: null,
  slug: 'p',
};

function seed(): LocalDatabase {
  const db = createTestLocalDatabase();
  db.insert(products)
    .values([
      { ...base, id: 7, name: 'Петля дверна', stock: 10 },
      { ...base, id: 8, name: 'Ручка мала', stock: 5 },
    ])
    .run();
  db.insert(productPrices)
    .values([
      { amountKopecks: 41_200, priceTypeId: 2, productId: 7 },
      { amountKopecks: 500, priceTypeId: 2, productId: 8 },
    ])
    .run();
  db.insert(customers)
    .values([
      { counterpartyId: 'c-1', defaultPriceTypeId: 2, email: '', name: 'Будмаркет' },
      { counterpartyId: 'c-2', defaultPriceTypeId: 2, email: '', name: 'Лісбуд' },
    ])
    .run();
  return db;
}

const wrapperFor =
  (db: LocalDatabase) =>
  ({ children }: { children: ReactNode }) => (
    <LocalDatabaseProvider database={db}>{children}</LocalDatabaseProvider>
  );

async function addProducts(db: LocalDatabase, ids: number[]) {
  const { result } = await renderHook(() => useAddToCalculation(), { wrapper: wrapperFor(db) });
  for (const id of ids) {
    await act(async () => result.current?.({ id, name: '', priceKopecks: 1, stock: 10 }));
  }
}

const select = (id: string) => act(async () => useSelectedCustomerStore.getState().select(id));

describe('CalculationPanel', () => {
  beforeEach(async () => {
    await select('c-1');
  });

  it('prices lines, applies a discount and totals them (SC-011)', async () => {
    const db = seed();
    await addProducts(db, [7, 7, 7, 7]);
    await render(<CalculationPanel isOnline />, { wrapper: wrapperFor(db) });

    await fireEvent.changeText(
      screen.getByLabelText('Знижка або націнка, гривень за штуку: Петля дверна'),
      '-10',
    );

    expect(screen.getByText('−10 ₴/шт')).toBeTruthy();
    expect(screen.getByText(/Знижка −40,00/)).toBeTruthy();
    expect(screen.getByText(/Разом 1\s?608,00/)).toBeTruthy();
  });

  it('stops a discount below 1 ₴ (SC-012)', async () => {
    const db = seed();
    await addProducts(db, [8]);
    await render(<CalculationPanel isOnline />, { wrapper: wrapperFor(db) });

    await fireEvent.changeText(
      screen.getByLabelText('Знижка або націнка, гривень за штуку: Ручка мала'),
      '-5',
    );

    expect(screen.getByText('Ціна не може бути нижче 1 ₴: найбільша знижка −4')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Відправити в 1С' })).toBeDisabled();
  });

  it('keeps a calculation per customer (SC-013)', async () => {
    const db = seed();
    await addProducts(db, [7, 8]);
    await select('c-2');
    const view = await render(<CalculationPanel isOnline />, { wrapper: wrapperFor(db) });
    expect(screen.getByText('Розрахунок порожній')).toBeTruthy();

    await select('c-1');
    await view.rerender(<CalculationPanel isOnline />);
    expect(screen.getByText('Петля дверна')).toBeTruthy();
    expect(screen.getByText('Ручка мала')).toBeTruthy();
  });

  it('confirms the total and queues the order offline (SC-015, SC-016)', async () => {
    const db = seed();
    await addProducts(db, [7]);
    await render(<CalculationPanel isOnline={false} />, { wrapper: wrapperFor(db) });

    await fireEvent.press(screen.getByRole('button', { name: 'Відправити в 1С' }));
    expect(screen.getByText('Відправити замовлення для Будмаркет?')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Так, відправити' }));

    expect(readOutbox(db)).toEqual([
      expect.objectContaining({
        kind: 'order-create',
        payload: expect.objectContaining({ totalKopecks: 41_200 }),
      }),
    ]);
    expect(screen.getByText('Розрахунок порожній')).toBeTruthy();
    expect(screen.getByText('У черзі')).toBeTruthy();
  });

  it('saves a named draft through the queue (SC-014)', async () => {
    const db = seed();
    await addProducts(db, [7]);
    await render(<CalculationPanel isOnline />, { wrapper: wrapperFor(db) });

    await fireEvent.press(screen.getByRole('button', { name: 'Чернетка' }));
    await fireEvent.changeText(screen.getByLabelText('Назва чернетки'), 'Об’єкт на Подолі');
    await fireEvent.press(screen.getByRole('button', { name: 'Зберегти чернетку' }));

    expect(readOutbox(db)).toEqual([
      expect.objectContaining({
        kind: 'draft-save',
        payload: expect.objectContaining({ title: 'Об’єкт на Подолі' }),
      }),
    ]);
  });

  it('deletes an opened draft through the queue (R-010)', async () => {
    const db = seed();
    openDraftInCalculation(db, {
      counterpartyId: 'c-1',
      draftId: 5,
      lines: [{ adjustmentKopecks: 0, productId: 7, quantity: 1 }],
      note: null,
      title: 'Подол',
      version: 'v3',
    });
    await render(<CalculationPanel isOnline />, { wrapper: wrapperFor(db) });

    expect(screen.getByText('Чернетка «Подол»')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Видалити чернетку' }));

    expect(readOutbox(db)).toEqual([
      expect.objectContaining({
        kind: 'draft-delete',
        payload: { counterpartyId: 'c-1', draft: { id: 5, version: 'v3' } },
      }),
    ]);
    expect(screen.getByText('Розрахунок порожній')).toBeTruthy();
  });

  it('counts lines and waiting orders for the tabs', async () => {
    const db = seed();
    await addProducts(db, [7, 8]);
    const { result } = await renderHook(() => useCalculationBadges(), { wrapper: wrapperFor(db) });
    expect(result.current).toEqual({ calculation: 2, orders: undefined });

    await act(async () => {
      enqueueOrder(db, {
        comment: null,
        counterpartyId: 'c-1',
        customerName: 'Будмаркет',
        expectedBaseKopecks: {},
        lines: [],
        totalKopecks: 0,
      });
    });
    expect(result.current).toEqual({ calculation: undefined, orders: 1 });
  });

  it('shows the waiting queue in the cabinet (R-016)', async () => {
    const db = seed();
    await render(<QueueSummaryCard isOnline={false} />, { wrapper: wrapperFor(db) });
    expect(screen.queryByText('Черга відправлення')).toBeNull();

    await act(async () => {
      enqueueOrder(db, {
        comment: null,
        counterpartyId: 'c-1',
        customerName: 'Будмаркет',
        expectedBaseKopecks: {},
        lines: [],
        totalKopecks: 0,
      });
    });
    expect(
      screen.getByText('Чекають відправлення: 1. Відправляться, коли зʼявиться мережа.'),
    ).toBeTruthy();
  });
});
