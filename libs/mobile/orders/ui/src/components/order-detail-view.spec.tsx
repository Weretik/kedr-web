import { render } from '@testing-library/react-native';

import { OrderDetailView } from './order-detail-view';

import type { OrderDetail } from '@mobile/orders/model';

function createOrder(overrides: Partial<OrderDetail> = {}): OrderDetail {
  return {
    acceptedAtUtc: null,
    comment: null,
    counterparty: { counterpartyId: 'cp-1', name: 'ТОВ Кедр', phone: null },
    createdAtUtc: '2026-09-17T11:35:00Z',
    lines: [{ amount: 25000, productId: 'p-1', productName: 'Стілець', quantity: 2 }],
    oneCDocumentNumber: null,
    orderId: 7,
    orderNumber: 'ORD-7',
    syncStatus: 'Accepted',
    totalAmount: 25000,
    ...overrides,
  };
}

describe('OrderDetailView', () => {
  it('renders authoritative fields and omits absent optional sections', () => {
    const view = render(<OrderDetailView order={createOrder()} />);
    expect(view.getByText('Замовлення № ORD-7')).toBeTruthy();
    expect(view.getByText('Стілець')).toBeTruthy();
    expect(view.queryByText('Коментар')).toBeNull();
    expect(view.queryByText('Документ 1С')).toBeNull();
  });

  it('shows optional comment, 1С document and accepted Kyiv time', () => {
    const view = render(
      <OrderDetailView
        order={createOrder({
          acceptedAtUtc: '2026-09-17T11:35:00Z',
          comment: 'Доставити після 15:00',
          lines: [],
          oneCDocumentNumber: '1C-77',
        })}
      />,
    );
    expect(view.getByText('Доставити після 15:00')).toBeTruthy();
    expect(view.getByText('1C-77')).toBeTruthy();
    expect(view.getAllByText('17.09.2026, 14:35')).toHaveLength(2);
  });
});
