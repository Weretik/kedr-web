import { fireEvent, render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';

import { MissingPhotoProductsScreen } from './missing-photo-products-screen';

const mockUseGetMissingPhotoProductsQuery = jest.fn();

jest.mock('@mobile/catalog/data-access', () => ({
  useGetMissingPhotoProductsQuery: (...args: unknown[]) =>
    mockUseGetMissingPhotoProductsQuery(...args),
}));

const product = {
  availability: 'in_stock' as const,
  id: '12',
  imageUrl: null,
  name: 'Кабель',
  price: 120,
  productSlug: 'kabel-12',
};

describe('MissingPhotoProductsScreen', () => {
  beforeEach(() => {
    mockUseGetMissingPhotoProductsQuery.mockReset();
  });

  it('renders the section heading and initial loading state', async () => {
    mockUseGetMissingPhotoProductsQuery.mockReturnValue(
      queryResult({ isFetching: true, isLoading: true }),
    );
    const { getByLabelText, getByRole } = await renderScreen();

    expect(getByRole('header', { name: 'Товари без фотографій' })).toBeTruthy();
    expect(getByLabelText('Завантаження товарів без фотографій')).toBeTruthy();
  });

  it('renders authoritative products and opens the selected existing details', async () => {
    const onProductPress = jest.fn();
    mockUseGetMissingPhotoProductsQuery.mockReturnValue(
      queryResult({ data: page([product]), isFetching: false, isLoading: false }),
    );
    const { getByLabelText } = await renderScreen(onProductPress);

    expect(getByLabelText('Фото товару відсутнє')).toBeTruthy();
    await fireEvent.press(getByLabelText(/Товар Кабель/));
    expect(onProductPress).toHaveBeenCalledWith(product);
  });

  it('renders the positive empty state after a successful response', async () => {
    mockUseGetMissingPhotoProductsQuery.mockReturnValue(
      queryResult({ data: page([]), isFetching: false, isLoading: false }),
    );
    const { getByText } = await renderScreen();

    expect(getByText('Усі товари мають фотографії')).toBeTruthy();
  });

  it('retries an initial failure without duplicating the section', async () => {
    const refetch = jest.fn();
    mockUseGetMissingPhotoProductsQuery.mockReturnValue(
      queryResult({ isError: true, isFetching: false, isLoading: false, refetch }),
    );
    const { getAllByRole, getByRole } = await renderScreen();

    await fireEvent.press(getByRole('button', { name: 'Повторити' }));
    expect(refetch).toHaveBeenCalledTimes(1);
    expect(getAllByRole('header', { name: 'Товари без фотографій' })).toHaveLength(1);
  });

  it('keeps rows while loading or retrying the next page', async () => {
    const refetch = jest.fn();
    mockUseGetMissingPhotoProductsQuery.mockReturnValue(
      queryResult({
        data: page([product], { pageNumber: 1, totalPages: 2 }),
        isError: true,
        isFetching: false,
        isLoading: false,
        refetch,
      }),
    );
    const { getByRole, getByText } = await renderScreen();

    expect(getByText('Кабель')).toBeTruthy();
    await fireEvent.press(
      getByRole('button', { name: 'Повторити завантаження наступної сторінки' }),
    );
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('refreshes visible rows and loads the next page explicitly', async () => {
    const refetch = jest.fn();
    mockUseGetMissingPhotoProductsQuery.mockReturnValue(
      queryResult({
        data: page([product], { pageNumber: 1, totalPages: 2 }),
        isFetching: false,
        isLoading: false,
        refetch,
      }),
    );
    const { getByRole, getByTestId } = await renderScreen();

    await fireEvent(getByTestId('catalog-list'), 'refresh');
    expect(refetch).toHaveBeenCalledTimes(1);

    await fireEvent.press(getByRole('button', { name: 'Завантажити ще' }));
    expect(mockUseGetMissingPhotoProductsQuery).toHaveBeenLastCalledWith({ page: 2 });
  });
});

async function renderScreen(onProductPress = jest.fn()) {
  return await render(
    <PaperProvider theme={testTheme}>
      <MissingPhotoProductsScreen onProductPress={onProductPress} />
    </PaperProvider>,
  );
}

function page(items: readonly (typeof product)[], metadata = {}) {
  return {
    items,
    pageNumber: 1,
    pageSize: 20,
    totalPages: 1,
    totalRecords: items.length,
    ...metadata,
  };
}

function queryResult(overrides: Record<string, unknown> = {}) {
  return {
    data: undefined,
    isError: false,
    isFetching: false,
    isLoading: false,
    refetch: jest.fn(),
    ...overrides,
  };
}

const testTheme = {
  colors: {
    background: '#eef1ee',
    error: '#c00',
    onPrimary: '#fff',
    onPrimaryContainer: '#000',
    onSurface: '#000',
    onSurfaceVariant: '#555',
    primary: '#070',
    primaryContainer: '#efe',
    surface: '#fff',
    surfaceVariant: '#eee',
    tertiary: '#aa0',
  },
  dark: false,
};
