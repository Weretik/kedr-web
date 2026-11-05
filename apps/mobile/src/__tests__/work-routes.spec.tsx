import { useMobileSession } from '@mobile/core/auth';
import { act, fireEvent, renderRouter, screen } from 'expo-router/testing-library';

import WorkAreaLayout from '../app/(work)/_layout';
import CabinetRoute from '../app/(work)/cabinet';
import CalculationRoute from '../app/(work)/calculation';
import CustomerChoiceRoute from '../app/(work)/customer/index';
import OrdersRoute from '../app/(work)/orders/index';
import SectionLayout from '../app/(work)/products/_layout';
import ProductsRoute from '../app/(work)/products/index';
import IndexRoute from '../app/index';

jest.mock('@mobile/core/auth', () => ({
  logout: jest.fn(),
  QuickUnlockRow: () => null,
  useMobileSession: jest.fn(),
}));

let mockCustomer: { name: string; priceTypeName: string | null } | null = null;

jest.mock('@mobile/catalog/feature', () => ({
  PhotoDownloadCard: () => null,
  ProductCatalog: () => null,
  ProductScreen: () => null,
  useKeepEssentialPhotos: jest.fn(),
}));

jest.mock('@mobile/core/local-db', () => ({
  LocalDatabaseProvider: ({ children }: { children: unknown }) => children,
}));

jest.mock('@mobile/customers/data-access', () => ({
  useSelectedCustomerStore: { getState: () => ({ clear: jest.fn() }) },
}));

jest.mock('@mobile/customers/feature', () => {
  const { Text } = jest.requireActual('react-native');
  return {
    CustomerCard: () => null,
    CustomerChoice: () => <Text>Оберіть клієнта</Text>,
    useSelectedCustomerSummary: () => mockCustomer,
  };
});

jest.mock('@mobile/sync/feature', () => ({
  clearDeviceData: jest.fn(),
  SyncProvider: ({ children }: { children: unknown }) => children,
  SyncStatusStrip: () => null,
}));

const manager = {
  avatarUrl: null,
  email: 'olena@classkedr.com.ua',
  fullName: 'Олена Коваль',
  id: 'u-1',
  roles: ['Manager'],
};

const routes = {
  '(work)/_layout': WorkAreaLayout,
  '(work)/cabinet': CabinetRoute,
  '(work)/calculation': CalculationRoute,
  '(work)/customer/_layout': SectionLayout,
  '(work)/customer/index': CustomerChoiceRoute,
  '(work)/orders/_layout': SectionLayout,
  '(work)/products/_layout': SectionLayout,
  '(work)/orders/index': OrdersRoute,
  '(work)/products/index': ProductsRoute,
  index: IndexRoute,
};

describe('working area without a customer', () => {
  beforeEach(() => {
    mockCustomer = null;
    jest
      .mocked(useMobileSession)
      .mockReturnValue({ status: 'authenticated', user: manager } as never);
  });

  it('starts on customer choice with products, calculation and orders locked (SC-001, SC-003)', async () => {
    await act(async () => {
      renderRouter(routes, { initialUrl: '/' });
    });

    expect(screen).toHavePathname('/customer');
    expect(screen.getByText('Оберіть клієнта')).toBeTruthy();

    await act(async () => {
      fireEvent.press(screen.getByRole('tab', { name: 'Товари, спочатку оберіть клієнта' }));
    });
    expect(screen).toHavePathname('/customer');
  });

  it('sends a link into a locked section back to customer choice', async () => {
    await act(async () => {
      renderRouter(routes, { initialUrl: '/products' });
    });

    expect(screen).toHavePathname('/customer');
  });

  it('opens the cabinet without a customer', async () => {
    await act(async () => {
      renderRouter(routes, { initialUrl: '/cabinet' });
    });

    expect(screen.getByText('olena@classkedr.com.ua')).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Світла' })).toBeTruthy();
  });
});

describe('working area with a customer', () => {
  beforeEach(() => {
    mockCustomer = { name: 'ТОВ «Альфа»', priceTypeName: 'Оптова' };
    jest
      .mocked(useMobileSession)
      .mockReturnValue({ status: 'authenticated', user: manager } as never);
  });

  it('opens products with the customer bar (SC-003)', async () => {
    await act(async () => {
      renderRouter(routes, { initialUrl: '/products' });
    });

    expect(screen).toHavePathname('/products');
    expect(screen.getByText('ТОВ «Альфа»')).toBeTruthy();
    expect(screen.getByText('Ціни: Оптова')).toBeTruthy();
  });
});
