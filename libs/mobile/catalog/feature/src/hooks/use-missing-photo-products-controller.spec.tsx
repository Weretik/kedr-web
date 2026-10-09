import { act, renderHook } from '@testing-library/react-native';

import { useMissingPhotoProductsController } from './use-missing-photo-products-controller';

const mockUseGetMissingPhotoProductsQuery = jest.fn();

jest.mock('@mobile/catalog/data-access', () => ({
  useGetMissingPhotoProductsQuery: (...args: unknown[]) =>
    mockUseGetMissingPhotoProductsQuery(...args),
}));

const products = [
  {
    availability: 'in_stock' as const,
    id: '1',
    imageUrl: null,
    name: 'Кабель',
    price: 10,
    productSlug: 'kabel',
  },
];

describe('useMissingPhotoProductsController', () => {
  const refetch = jest.fn();

  beforeEach(() => {
    refetch.mockClear();
    mockUseGetMissingPhotoProductsQuery.mockReset();
    mockUseGetMissingPhotoProductsQuery.mockReturnValue({
      data: {
        items: products,
        pageNumber: 1,
        pageSize: 20,
        totalPages: 2,
        totalRecords: 21,
      },
      isError: false,
      isFetching: false,
      isLoading: false,
      refetch,
    });
  });

  it('exposes cached items and advances only while another page exists', () => {
    const { result } = renderHook(() => useMissingPhotoProductsController());

    expect(result.current.items).toEqual(products);
    act(() => result.current.loadNextPage());
    expect(mockUseGetMissingPhotoProductsQuery).toHaveBeenLastCalledWith({ page: 2 });
  });

  it('refreshes page one directly and exposes explicit retry', () => {
    const { result } = renderHook(() => useMissingPhotoProductsController());

    act(() => result.current.refresh());
    act(() => result.current.retry());

    expect(refetch).toHaveBeenCalledTimes(2);
  });

  it('does not advance while the current request is fetching', () => {
    mockUseGetMissingPhotoProductsQuery.mockReturnValue({
      data: {
        items: products,
        pageNumber: 1,
        pageSize: 20,
        totalPages: 2,
        totalRecords: 21,
      },
      isError: false,
      isFetching: true,
      isLoading: false,
      refetch,
    });
    const { result } = renderHook(() => useMissingPhotoProductsController());

    act(() => result.current.loadNextPage());

    expect(mockUseGetMissingPhotoProductsQuery).toHaveBeenLastCalledWith({ page: 1 });
  });
});
