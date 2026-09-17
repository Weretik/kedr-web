import { parseCreatedOrder, toCreateOrderRequest } from './order-contract';

describe('admin order contract', () => {
  it('keeps only generated request fields', () => {
    expect(
      toCreateOrderRequest({
        comment: null,
        counterpartyId: 'cp-1',
        lines: [{ amount: 250, productId: 'product-1', quantity: 2 }],
      }),
    ).toEqual({
      comment: null,
      counterpartyId: 'cp-1',
      lines: [{ amount: 250, productId: 'product-1', quantity: 2 }],
    });
  });

  it('validates the created order receipt', () => {
    expect(
      parseCreatedOrder({ orderId: 42, orderNumber: 'SO-20260917-0042', syncStatus: 'Pending' }),
    ).toEqual({ orderId: 42, orderNumber: 'SO-20260917-0042', syncStatus: 'Pending' });
    expect(() =>
      parseCreatedOrder({ orderId: 42, orderNumber: '', syncStatus: 'Accepted' }),
    ).toThrow();
  });
});
