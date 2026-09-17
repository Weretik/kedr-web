import { act, renderHook, waitFor } from '@testing-library/react-native';

import { useOrderHistoryController } from './use-order-history-controller';

const mockReduxDispatch = jest.fn();
const mockGetCustomers = jest.fn();
const mockGetOrders = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => mockReduxDispatch,
  useSelector: (selector: (state: unknown) => unknown) => selector({ orderFilterSession: {} }),
}));
jest.mock('@mobile/customers/data-access', () => ({
  useGetCustomersQuery: () => mockGetCustomers(),
}));
jest.mock('@mobile/orders/data-access', () => ({
  useGetOrderHistoryQuery: (...args: unknown[]) => mockGetOrders(...args),
}));

const page = {
  items: [
    {
      counterpartyName: 'ТОВ Кедр',
      createdAtUtc: '2026-09-17T11:35:00Z',
      lineCount: 1,
      orderId: 7,
      orderNumber: '7',
      syncStatus: 'Pending',
      totalAmount: 10,
    },
  ],
  pageNumber: 1,
  pageSize: 20,
  totalPages: 2,
  totalRecords: 21,
};

describe('useOrderHistoryController', () => {
  beforeEach(() => {
    mockReduxDispatch.mockClear();
    mockGetOrders.mockClear();
    mockGetCustomers.mockReturnValue({
      currentData: [{ counterpartyId: 'cp-1', name: 'ТОВ Кедр', phone: null }],
      isError: false,
      isLoading: false,
      refetch: jest.fn(),
    });
    mockGetOrders.mockReturnValue({
      currentData: page,
      isError: false,
      isFetching: false,
      isLoading: false,
      refetch: jest.fn(),
    });
  });

  it('requests page one, accumulates data and advances while another page exists', async () => {
    const { result } = renderHook(() => useOrderHistoryController());
    await waitFor(() => expect(result.current.history.items).toHaveLength(1));
    expect(mockGetOrders).toHaveBeenCalledWith(
      { counterpartyId: undefined, page: 1 },
      { refetchOnMountOrArgChange: true },
    );
    act(() => result.current.history.loadNextPage());
    expect(mockGetOrders).toHaveBeenLastCalledWith(
      { counterpartyId: undefined, page: 2 },
      { refetchOnMountOrArgChange: true },
    );
  });

  it('filters customers locally and stores the selected identity', () => {
    const { result } = renderHook(() => useOrderHistoryController());
    act(() => result.current.filter.pickerDispatch({ type: 'searchChanged', value: 'кедр' }));
    expect(result.current.filter.customers).toHaveLength(1);
    act(() => result.current.filter.chooseCustomer(result.current.filter.customers[0]));
    expect(mockReduxDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ payload: { counterpartyId: 'cp-1', name: 'ТОВ Кедр' } }),
    );
  });
});
