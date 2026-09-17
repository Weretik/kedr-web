import { AppProviders } from '@mobile/core/shell';
import { render, waitFor } from '@testing-library/react-native';

import CartRoute from '../app/(tabs)/cart';
import CatalogRoute from '../app/(tabs)/catalog';
import StartRoute from '../app/(tabs)/index';
import ProfileRoute from '../app/(tabs)/profile';
import ProductDetailsRoute from '../app/product/[productSlug]';

const mockPush = jest.fn();
let mockProductPress: ((product: { productSlug: string }) => void) | undefined;

jest.mock('@mobile/catalog/feature', () => ({
  CatalogScreen: ({
    onProductPress,
  }: {
    onProductPress: (product: { productSlug: string }) => void;
  }) => {
    const { Text: MockText } = jest.requireActual('react-native');
    mockProductPress = onProductPress;

    return <MockText accessibilityRole="header">Каталог</MockText>;
  },
  ProductDetailsScreen: ({ productSlug }: { productSlug?: string }) => {
    const { Text: MockText } = jest.requireActual('react-native');
    return <MockText>Деталі: {productSlug}</MockText>;
  },
}));

jest.mock('@mobile/cart/feature', () => ({
  CartScreen: () => {
    const { Text: MockText } = jest.requireActual('react-native');
    return <MockText accessibilityRole="header">Кошик</MockText>;
  },
}));

jest.mock('expo-router', () => {
  const Tabs = () => null;
  Tabs.Screen = () => null;

  const Stack = () => null;
  Stack.Screen = () => null;

  return {
    router: { push: (...args: unknown[]) => mockPush(...args) },
    Stack,
    Tabs,
    useLocalSearchParams: () => ({ productSlug: ['kabel-12', 'ignored'] }),
  };
});

describe('StartRoute', () => {
  it('renders the home tab placeholder', async () => {
    const { getByRole, getByText } = render(
      <AppProviders>
        <StartRoute />
      </AppProviders>,
    );

    await waitFor(() => {
      expect(getByRole('header', { name: 'Головна' })).toBeTruthy();
      expect(getByText('Тут з’являться актуальні пропозиції та новини.')).toBeTruthy();
    });
  });

  it('renders the catalog and profile root tab routes', async () => {
    const { getByRole } = render(
      <AppProviders>
        <CatalogRoute />
        <ProfileRoute />
      </AppProviders>,
    );

    await waitFor(() => {
      expect(getByRole('header', { name: 'Каталог' })).toBeTruthy();
      expect(getByRole('header', { name: 'Профіль' })).toBeTruthy();
    });
  });

  it('renders the cart feature route', async () => {
    const { getByRole } = render(
      <AppProviders>
        <CartRoute />
      </AppProviders>,
    );

    await waitFor(() => expect(getByRole('header', { name: 'Кошик' })).toBeTruthy());
  });

  it('opens the selected catalog slug and normalizes the product route parameter', async () => {
    const { getByText } = render(
      <AppProviders>
        <CatalogRoute />
        <ProductDetailsRoute />
      </AppProviders>,
    );

    await waitFor(() => expect(getByText('Деталі: kabel-12')).toBeTruthy());
    mockProductPress?.({ productSlug: 'kabel-12' });
    expect(mockPush).toHaveBeenCalledWith({
      params: { productSlug: 'kabel-12' },
      pathname: '/product/[productSlug]',
    });
  });
});
