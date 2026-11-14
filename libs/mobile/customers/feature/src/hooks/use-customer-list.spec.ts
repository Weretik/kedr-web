import { act, renderHook } from '@testing-library/react-native';

import { useCustomerList } from './use-customer-list';

const mockSelect = jest.fn();
const mockCustomer = (counterpartyId: string, name: string) => ({
  counterpartyId,
  name,
  phone: null,
  email: '',
  defaultPriceTypeId: 1,
  debtKopecks: null,
  balanceKopecks: null,
});

jest.mock('@mobile/customers/data-access', () => ({
  useCustomers: () => [mockCustomer('1', 'Альфа'), mockCustomer('2', 'Бета')],
  useSelectedCustomerStore: (pickState: (state: object) => unknown) =>
    pickState({ recentIds: ['2'], selectedId: null, select: mockSelect }),
}));

describe('useCustomerList', () => {
  it('shows recent customers first, narrows on search, and picks a customer', async () => {
    const onPicked = jest.fn();
    const { result } = await renderHook(() => useCustomerList(onPicked));
    expect(result.current.items[0]).toMatchObject({ kind: 'header', title: 'Недавні' });

    await act(() => result.current.setQuery('альф'));
    expect(result.current.items.map((item) => item.key)).toEqual(['found', 'found:1']);

    await act(() => result.current.pick('1'));
    expect(mockSelect).toHaveBeenCalledWith('1');
    expect(onPicked).toHaveBeenCalledWith('1');
  });
});
