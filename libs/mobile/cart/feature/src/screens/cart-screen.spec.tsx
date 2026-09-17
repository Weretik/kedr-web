import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';

import { CartScreen } from './cart-screen';

const mockClear = jest.fn(async () => true);
const mockCreateOrder = jest.fn();
const mockUnwrap = jest.fn();

jest.mock('@mobile/cart/data-access', () => ({
  useCart: () => ({
    clear: mockClear,
    decrement: jest.fn(),
    increment: jest.fn(),
    isReady: true,
    lines: [
      {
        id: 'p-1',
        imageUrl: null,
        name: 'Кабель',
        quantity: 2,
        quantityInPack: 1,
        stock: 5,
        unitPrice: 25,
      },
    ],
    remove: jest.fn(),
    storageError: null,
  }),
  useCreateCartOrderMutation: () => [mockCreateOrder, { isLoading: false }],
}));

jest.mock('@mobile/customers/data-access', () => ({
  useGetCustomersQuery: () => ({
    data: [{ counterpartyId: 'c-1', name: 'Клієнт', phone: null }],
    isError: false,
    isFetching: false,
    isLoading: false,
    refetch: jest.fn(),
  }),
}));

const theme = {
  colors: {
    background: '#fff',
    error: '#c00',
    onSurface: '#111',
    outlineVariant: '#ddd',
    surface: '#fff',
  },
  dark: false,
};

describe('CartScreen checkout flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUnwrap.mockResolvedValue({ orderId: 'o-1', orderNumber: 'ORD-1', syncStatus: 'Pending' });
    mockCreateOrder.mockReturnValue({ unwrap: mockUnwrap });
  });

  it('submits one order, clears the cart and shows the pending receipt', async () => {
    const view = render(
      <PaperProvider theme={theme}>
        <CartScreen />
      </PaperProvider>,
    );

    fireEvent.press(view.getByLabelText('Оформити замовлення'));
    await waitFor(() => expect(view.getByLabelText('Вибрати клієнта')).toBeTruthy());
    fireEvent.press(view.getByLabelText('Вибрати клієнта'));
    await waitFor(() => expect(view.getByLabelText('Обрати клієнта Клієнт')).toBeTruthy());
    fireEvent.press(view.getByLabelText('Обрати клієнта Клієнт'));
    fireEvent.changeText(view.getByLabelText('Коментар до замовлення'), ' Терміново ');
    fireEvent.press(view.getByLabelText('Підтвердити замовлення'));
    fireEvent.press(view.getByLabelText('Підтвердити замовлення'));

    await waitFor(() => expect(mockCreateOrder).toHaveBeenCalledTimes(1));
    expect(mockCreateOrder).toHaveBeenCalledWith({
      idempotencyKey: expect.stringMatching(/^[0-9a-f-]{36}$/i),
      payload: {
        comment: 'Терміново',
        counterpartyId: 'c-1',
        lines: [{ amount: 50, productId: 'p-1', quantity: 2 }],
      },
    });
    await waitFor(() => expect(mockClear).toHaveBeenCalledTimes(1));
    expect(view.getByText('Замовлення №ORD-1')).toBeTruthy();
    expect(view.getByText('Статус синхронізації: Очікує на відправлення в 1С')).toBeTruthy();
  });

  it('reuses the same idempotency key for an unchanged ambiguous retry', async () => {
    mockUnwrap
      .mockRejectedValueOnce({ code: 'Network', message: 'Мережа недоступна.' })
      .mockResolvedValueOnce({ orderId: 'o-1', orderNumber: 'ORD-1', syncStatus: 'Pending' });
    const view = render(
      <PaperProvider theme={theme}>
        <CartScreen />
      </PaperProvider>,
    );

    fireEvent.press(view.getByLabelText('Оформити замовлення'));
    await waitFor(() => expect(view.getByLabelText('Вибрати клієнта')).toBeTruthy());
    fireEvent.press(view.getByLabelText('Вибрати клієнта'));
    await waitFor(() => expect(view.getByLabelText('Обрати клієнта Клієнт')).toBeTruthy());
    fireEvent.press(view.getByLabelText('Обрати клієнта Клієнт'));
    fireEvent.press(view.getByLabelText('Підтвердити замовлення'));

    await waitFor(() => expect(view.getByText('Мережа недоступна.')).toBeTruthy());
    fireEvent.press(view.getByLabelText('Підтвердити замовлення'));
    await waitFor(() => expect(mockCreateOrder).toHaveBeenCalledTimes(2));
    expect(mockCreateOrder.mock.calls[1][0].idempotencyKey).toBe(
      mockCreateOrder.mock.calls[0][0].idempotencyKey,
    );
    await waitFor(() => expect(mockClear).toHaveBeenCalledTimes(1));
  });

  it('does not submit until a customer is selected', async () => {
    const view = render(
      <PaperProvider theme={theme}>
        <CartScreen />
      </PaperProvider>,
    );

    fireEvent.press(view.getByLabelText('Оформити замовлення'));
    await waitFor(() => expect(view.getByLabelText('Підтвердити замовлення')).toBeTruthy());
    fireEvent.press(view.getByLabelText('Підтвердити замовлення'));
    await waitFor(() => expect(view.getByText('Оберіть клієнта.')).toBeTruthy());
    expect(mockCreateOrder).not.toHaveBeenCalled();
  });
});
