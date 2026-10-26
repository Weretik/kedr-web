import { fireEvent, render } from '@testing-library/react-native';

import { OrderCard } from './order-card';

import type { OrderSummary } from '@mobile/orders/model';

const summary: OrderSummary = {
  counterpartyName: 'ТОВ Кедр',
  createdAtUtc: '2026-09-17T11:35:00Z',
  lineCount: 2,
  orderId: 7,
  orderNumber: 'ORD-7',
  syncStatus: 'Accepted',
  totalAmount: 25000,
};

describe('OrderCard', () => {
  it('shows every localized summary field and opens the order', () => {
    const onPress = jest.fn();
    const view = render(<OrderCard order={summary} onPress={onPress} />);
    expect(view.getByText('№ ORD-7')).toBeTruthy();
    expect(view.getByText('ТОВ Кедр')).toBeTruthy();
    expect(view.getByText('Прийнято в 1С')).toBeTruthy();
    expect(view.getByText('2 позиції')).toBeTruthy();
    expect(view.getByText('25 000,00 грн.')).toBeTruthy();
    fireEvent.press(view.getByRole('button'));
    expect(onPress).toHaveBeenCalledWith(summary);
  });
});
