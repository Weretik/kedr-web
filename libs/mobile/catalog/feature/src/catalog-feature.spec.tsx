import {
  categories,
  customerCategoryPriceTypes,
  customers,
  LocalDatabaseProvider,
  productPrices,
  products,
  type LocalDatabase,
} from '@mobile/core/local-db';
import { createTestLocalDatabase } from '@mobile/core/local-db/testing';
import { useSelectedCustomerStore } from '@mobile/customers/data-access';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { ProductCatalog, ProductScreen } from './components/product-catalog';

import type { ReactElement } from 'react';

let mockBreakpoint = 'phone';
jest.mock('@mobile/shared/ui', () => ({
  ...jest.requireActual('@mobile/shared/ui'),
  useBreakpoint: () => mockBreakpoint,
}));

// Reanimated cannot start in Jest; the zoom gestures are checked on a device.
jest.mock('../../ui/src/components/zoomable-image', () => ({
  ZoomableImage: () => null,
}));

const base = { isNew: false, isSale: false, quantityInPack: 1, scheme: null, slug: 'p' };

function seed(): LocalDatabase {
  const db = createTestLocalDatabase();
  db.insert(categories)
    .values([
      { id: 10, name: 'Ручки', parentId: null, sortOrder: 0 },
      { id: 11, name: 'На розетці', parentId: 10, sortOrder: 0 },
      { id: 20, name: 'Замки', parentId: null, sortOrder: 1 },
    ])
    .run();
  db.insert(products)
    .values([
      {
        ...base,
        categoryId: 11,
        id: 101,
        inStock: true,
        name: 'Ручка Нова хром',
        photos: ['a.jpg'],
        scheme: 's.png',
        stock: 4,
      },
      {
        ...base,
        categoryId: 11,
        id: 102,
        inStock: false,
        name: 'Ручка Класик бронза',
        photos: [],
        stock: 0,
      },
      {
        ...base,
        categoryId: 20,
        id: 201,
        inStock: true,
        name: 'Замок врізний',
        photos: [],
        stock: 3,
      },
    ])
    .run();
  db.insert(productPrices)
    .values([
      { amountKopecks: 10_000, priceTypeId: 2, productId: 101 },
      { amountKopecks: 20_000, priceTypeId: 3, productId: 101 },
      { amountKopecks: 15_000, priceTypeId: 3, productId: 102 },
      { amountKopecks: 30_000, priceTypeId: 2, productId: 201 },
    ])
    .run();
  db.insert(customers)
    .values({ counterpartyId: 'c-1', defaultPriceTypeId: 2, email: 'a@x', name: 'Альфа' })
    .run();
  db.insert(customerCategoryPriceTypes)
    .values({ categoryId: 10, counterpartyId: 'c-1', priceTypeId: 3 })
    .run();
  return db;
}

const inDb = (db: LocalDatabase, element: ReactElement) =>
  render(<LocalDatabaseProvider database={db}>{element}</LocalDatabaseProvider>);

describe('ProductCatalog', () => {
  beforeEach(async () => {
    mockBreakpoint = 'phone';
    await act(async () => useSelectedCustomerStore.getState().select('c-1'));
  });

  it('shows the customer prices by category rule and default (SC-006)', async () => {
    await inDb(seed(), <ProductCatalog isOnline onOpenProduct={jest.fn()} />);

    expect(screen.getByRole('button', { name: /^Ручка Нова хром, 200,00/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /^Замок врізний, 300,00/ })).toBeTruthy();
  });

  it('narrows by category, stock and text, then opens a product (SC-008)', async () => {
    const onOpenProduct = jest.fn();
    await inDb(seed(), <ProductCatalog isOnline onOpenProduct={onOpenProduct} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Ручки' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Лише в наявності' }));
    expect(screen.queryByText('Замок врізний')).toBeNull();
    expect(screen.queryByText('Ручка Класик бронза')).toBeNull();

    await fireEvent.changeText(screen.getByLabelText('Пошук товару'), '101');
    await fireEvent.press(screen.getByText('Ручка Нова хром'));
    expect(onOpenProduct).toHaveBeenCalledWith(101);
  });

  it('opens the detail next to the list on a tablet', async () => {
    mockBreakpoint = 'tablet';
    const onOpenProduct = jest.fn();
    await inDb(seed(), <ProductCatalog isOnline onOpenProduct={onOpenProduct} />);

    await fireEvent.press(screen.getByText('Замок врізний'));

    expect(onOpenProduct).not.toHaveBeenCalled();
    expect(screen.getByText('Ціна для Альфа')).toBeTruthy();
  });
});

describe('ProductCatalog with a calculation', () => {
  beforeEach(async () => {
    await act(async () => useSelectedCustomerStore.getState().select('c-1'));
  });

  it('adds a product with «+» on a phone', async () => {
    mockBreakpoint = 'phone';
    const onAdd = jest.fn();
    await inDb(seed(), <ProductCatalog isOnline onAdd={onAdd} onOpenProduct={jest.fn()} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Додати Замок врізний' }));
    expect(onAdd).toHaveBeenCalledWith(expect.objectContaining({ id: 201, priceKopecks: 30_000 }));
  });

  it('keeps the calculation next to the products on a wide tablet (SC-024)', async () => {
    mockBreakpoint = 'wide';
    const onAdd = jest.fn();
    await inDb(
      seed(),
      <ProductCatalog
        isOnline
        onAdd={onAdd}
        onOpenProduct={jest.fn()}
        sidePanel={<Text>Панель розрахунку</Text>}
      />,
    );

    expect(screen.getByText('Панель розрахунку')).toBeTruthy();
    await fireEvent.press(screen.getByText('Замок врізний'));
    await fireEvent.press(screen.getByRole('button', { name: 'Додати в розрахунок' }));
    expect(onAdd).toHaveBeenCalledWith(expect.objectContaining({ id: 201 }));
  });
});

describe('ProductScreen', () => {
  beforeEach(async () => {
    await act(async () => useSelectedCustomerStore.getState().select('c-1'));
  });

  it('shows out of stock and the scheme switch', async () => {
    await inDb(seed(), <ProductScreen isOnline productId={102} />);

    expect(screen.getByText('немає в наявності')).toBeTruthy();
    expect(screen.getByText('Ручки › На розетці')).toBeTruthy();
  });

  it('opens the photo full screen', async () => {
    await inDb(seed(), <ProductScreen isOnline productId={101} />);

    expect(screen.getByRole('tab', { name: 'Схема' })).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Фото 1 з 1 на весь екран' }));
    expect(screen.getByRole('button', { name: 'Закрити' })).toBeTruthy();
  });
});
