import { fireEvent, render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';

import { ProductDetailsScreen } from './product-details-screen';

const mockQuery = jest.fn();
const mockAddProduct = jest.fn();

jest.mock('@mobile/catalog/data-access', () => ({
  useGetCatalogProductDetailsQuery: (...args: unknown[]) => mockQuery(...args),
}));
jest.mock('@mobile/cart/data-access', () => ({
  useCart: () => ({ addProduct: mockAddProduct, isReady: true, lines: [] }),
}));

const product = {
  breadcrumbs: [],
  categoryName: 'Категорія',
  categorySlug: 'category',
  id: '42',
  imageUrl: null,
  name: 'Товар',
  price: 123.5,
  quantityInPack: 4,
  schemeUrl: null,
  stock: 10,
};
const testTheme = {
  colors: {
    background: '#eee',
    onSurfaceVariant: '#555',
    primary: '#284d37',
    surface: '#fff',
    surfaceVariant: '#ddd',
  },
  dark: false,
};

describe('ProductDetailsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQuery.mockReturnValue({
      data: product,
      isError: false,
      isFetching: false,
      isLoading: false,
      refetch: jest.fn(),
    });
  });

  it('does not request data for an invalid slug', () => {
    const { getByText } = renderScreen('  ');
    expect(getByText('Некоректне посилання')).toBeTruthy();
    expect(mockQuery).toHaveBeenCalledWith('', { skip: true });
  });

  it('shows the dedicated offline and not-found states', () => {
    mockQuery.mockReturnValue({
      data: undefined,
      isError: false,
      isFetching: false,
      isLoading: false,
      refetch: jest.fn(),
    });
    const offline = renderScreen('product', false);
    expect(offline.getByText('Немає з’єднання')).toBeTruthy();
    offline.unmount();

    mockQuery.mockReturnValue({
      data: undefined,
      error: { code: 'NotFound' },
      isError: true,
      isFetching: false,
      isLoading: false,
      refetch: jest.fn(),
    });
    expect(renderScreen('missing').getByText('Товар не знайдено')).toBeTruthy();
  });

  it('shows loading and retries a transport error', () => {
    mockQuery.mockReturnValue({
      data: undefined,
      isError: false,
      isFetching: true,
      isLoading: true,
      refetch: jest.fn(),
    });
    const loading = renderScreen('product');
    expect(loading.getAllByLabelText('Завантаження товару')).toHaveLength(2);
    loading.unmount();

    const refetch = jest.fn();
    mockQuery.mockReturnValue({
      data: undefined,
      error: { code: 'Server' },
      isError: true,
      isFetching: false,
      isLoading: false,
      refetch,
    });
    const error = renderScreen('product');
    fireEvent.press(error.getByLabelText('Повторити завантаження товару'));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('adds one product and reports success', () => {
    const { getByLabelText, getByText } = renderScreen('product');
    fireEvent.press(getByLabelText('Додати товар у кошик'));

    expect(mockAddProduct).toHaveBeenCalledWith({
      id: '42',
      imageUrl: null,
      name: 'Товар',
      quantityInPack: 4,
      stock: 10,
      unitPrice: 123.5,
    });
    expect(getByText('Товар додано в кошик')).toBeTruthy();
  });

  it.each([
    [{ ...product, price: null }, 'Додавання недоступне: ціна не вказана.'],
    [{ ...product, stock: 0 }, 'Додавання недоступне: товару немає в наявності.'],
  ])('disables adding an ineligible product', (ineligibleProduct, reason) => {
    mockQuery.mockReturnValue({
      data: ineligibleProduct,
      isError: false,
      isFetching: false,
      isLoading: false,
      refetch: jest.fn(),
    });
    const { getByLabelText, getByText } = renderScreen('product');

    fireEvent.press(getByLabelText('Додати товар у кошик'));
    expect(mockAddProduct).not.toHaveBeenCalled();
    expect(getByText(reason)).toBeTruthy();
  });
});

function renderScreen(productSlug?: string, isOnline = true) {
  return render(
    <PaperProvider theme={testTheme}>
      <ProductDetailsScreen isOnline={isOnline} productSlug={productSlug} />
    </PaperProvider>,
  );
}
