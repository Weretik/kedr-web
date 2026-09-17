import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { PaperProvider } from 'react-native-paper';

import { CatalogScreen } from './catalog-screen';

const mockUseGetCatalogProductsQuery = jest.fn();
const mockUseGetCatalogCategoriesQuery = jest.fn();

jest.mock('@mobile/catalog/data-access', () => ({
  useGetCatalogCategoriesQuery: (...args: unknown[]) => mockUseGetCatalogCategoriesQuery(...args),
  useGetCatalogProductsQuery: (...args: unknown[]) => mockUseGetCatalogProductsQuery(...args),
}));

const catalogPage = {
  items: [
    {
      availability: 'in_stock' as const,
      id: '1',
      imageUrl: null,
      name: 'Кабель',
      price: 10,
      productSlug: 'kabel',
    },
  ],
  pageNumber: 1,
  pageSize: 20,
  totalPages: 2,
  totalRecords: 21,
};

describe('CatalogScreen', () => {
  beforeEach(() => {
    mockUseGetCatalogCategoriesQuery.mockReturnValue({
      currentData: [],
      isError: false,
      isLoading: false,
      refetch: jest.fn(),
    });
    mockUseGetCatalogProductsQuery.mockReturnValue({
      currentData: undefined,
      error: undefined,
      isError: false,
      isFetching: true,
      isLoading: true,
      refetch: jest.fn(),
    });
  });

  it('renders the current loading state on the theme background', () => {
    const { getAllByTestId, getByLabelText } = renderScreen();

    expect(getByLabelText('Завантаження')).toBeTruthy();
    expect(StyleSheet.flatten(getAllByTestId('catalog-screen')[0].props.style)).toMatchObject({
      backgroundColor: '#eef1ee',
    });
  });

  it('registers its search action for the layout Appbar', () => {
    const onSearchActionChange = jest.fn();
    renderScreen(testTheme, onSearchActionChange);

    expect(onSearchActionChange).toHaveBeenCalledWith(expect.any(Function));
  });

  it('applies search only after Apply and allows history selection as a draft', async () => {
    let openSearch: (() => void) | undefined;
    const { getByLabelText } = renderScreen(testTheme, (action) => {
      openSearch = action;
    });

    await waitFor(() => expect(openSearch).toEqual(expect.any(Function)));
    act(() => openSearch?.());
    await waitFor(() => expect(getByLabelText('Пошук товарів')).toBeTruthy());
    fireEvent.changeText(getByLabelText('Пошук товарів'), '   ');
    fireEvent.press(getByLabelText('Шукати товари'));
    await waitFor(() =>
      expect(mockUseGetCatalogProductsQuery).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 1, search: '' }),
        { refetchOnMountOrArgChange: true },
      ),
    );

    act(() => openSearch?.());
    await waitFor(() => expect(getByLabelText('Пошук товарів')).toBeTruthy());
    fireEvent.changeText(getByLabelText('Пошук товарів'), '  Мідний   кабель ');

    expect(mockUseGetCatalogProductsQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({ search: '' }),
      { refetchOnMountOrArgChange: true },
    );

    fireEvent.press(getByLabelText('Шукати товари'));
    await waitFor(() =>
      expect(mockUseGetCatalogProductsQuery).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 1, search: 'Мідний кабель' }),
        { refetchOnMountOrArgChange: true },
      ),
    );

    act(() => openSearch?.());
    await waitFor(() => expect(getByLabelText('Шукати: Мідний кабель')).toBeTruthy());
    fireEvent.press(getByLabelText('Шукати: Мідний кабель'));
    expect(mockUseGetCatalogProductsQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({ search: 'Мідний кабель' }),
      { refetchOnMountOrArgChange: true },
    );
  });

  it('uses the active dark theme background', () => {
    const { getAllByTestId } = renderScreen(darkTestTheme);

    expect(StyleSheet.flatten(getAllByTestId('catalog-screen')[0].props.style)).toMatchObject({
      backgroundColor: '#101010',
    });
  });

  it('renders product cards through the catalog list and preserves pagination', async () => {
    mockUseGetCatalogProductsQuery.mockReturnValue({
      currentData: catalogPage,
      isError: false,
      isFetching: false,
      isLoading: false,
      refetch: jest.fn(),
    });
    const { getByRole, getByTestId, getByText } = renderScreen();

    await waitFor(() => expect(getByTestId('catalog-list')).toBeTruthy());
    expect(getByText('10 грн.')).toBeTruthy();
    expect(getByText('ID: 1')).toBeTruthy();
    fireEvent.press(getByRole('button', { name: 'Завантажити ще' }));
    expect(mockUseGetCatalogProductsQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 2 }),
      { refetchOnMountOrArgChange: true },
    );
  });

  it('forwards the selected product to navigation', async () => {
    mockUseGetCatalogProductsQuery.mockReturnValue({
      currentData: catalogPage,
      isError: false,
      isFetching: false,
      isLoading: false,
      refetch: jest.fn(),
    });
    const onProductPress = jest.fn();
    const { getByLabelText } = renderScreen(testTheme, undefined, onProductPress);

    await waitFor(() => fireEvent.press(getByLabelText(/Товар Кабель/)));
    expect(onProductPress).toHaveBeenCalledWith(catalogPage.items[0]);
  });

  it('preserves the current empty state', () => {
    mockUseGetCatalogProductsQuery.mockReturnValue({
      currentData: { ...catalogPage, items: [], totalRecords: 0 },
      isError: false,
      isFetching: false,
      isLoading: false,
      refetch: jest.fn(),
    });
    const { getByTestId } = renderScreen();

    expect(getByTestId('catalog-state-empty')).toBeTruthy();
  });

  it('preserves the current error state and retry action', () => {
    const refetch = jest.fn();
    mockUseGetCatalogProductsQuery.mockReturnValue({
      currentData: undefined,
      error: new Error('offline'),
      isError: true,
      isFetching: false,
      isLoading: false,
      refetch,
    });
    const { getByRole, getByTestId } = renderScreen();

    expect(getByTestId('catalog-state-error')).toBeTruthy();
    fireEvent.press(getByRole('button', { name: 'Повторити спробу' }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });
});

function renderScreen(
  theme = testTheme,
  onSearchActionChange?: (action: (() => void) | undefined) => void,
  onProductPress = jest.fn(),
) {
  return render(
    <PaperProvider theme={theme}>
      <CatalogScreen onProductPress={onProductPress} onSearchActionChange={onSearchActionChange} />
    </PaperProvider>,
  );
}

const testTheme = {
  colors: {
    background: '#eef1ee',
    onPrimaryContainer: '#000',
    onSurface: '#000',
    onSurfaceVariant: '#000',
    primaryContainer: '#fff',
    surface: '#fff',
    surfaceVariant: '#fff',
  },
  dark: false,
};

const darkTestTheme = {
  ...testTheme,
  colors: { ...testTheme.colors, background: '#101010' },
  dark: true,
};
