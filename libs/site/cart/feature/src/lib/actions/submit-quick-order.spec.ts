import { createQuickOrder } from '@site/cart/data-access';

import { submitQuickOrder } from './submit-quick-order';

vi.mock('server-only', () => ({}));
vi.mock('@site/cart/data-access', () => ({ createQuickOrder: vi.fn() }));

const createOrder = vi.mocked(createQuickOrder);
const input = {
  firstName: 'Ірина',
  phone: '+38 (050) 123-45-67',
  lines: [{ productId: '731', title: 'Ручка', unitPrice: 120.5, quantity: 2 }],
};

describe('submitQuickOrder', () => {
  beforeEach(() => {
    createOrder.mockReset();
  });

  it.each([null, 'untrusted', {}, { ...input, lines: [] }, { ...input, phone: '123' }])(
    'rejects unknown invalid input before the order boundary',
    async (body) => {
      expect(await submitQuickOrder(body)).toMatchObject({ kind: 'validation' });
      expect(createOrder).not.toHaveBeenCalled();
    },
  );

  it('passes only a validated command and returns the serialized domain result', async () => {
    const result = { kind: 'created' as const, orderId: '550e8400-e29b-41d4-a716-446655440000' };
    createOrder.mockResolvedValue(result);

    expect(
      await submitQuickOrder({
        ...input,
        firstName: '  Ірина  ',
        backendUrl: 'https://untrusted.example',
      }),
    ).toEqual(result);
    expect(createOrder).toHaveBeenCalledExactlyOnceWith(input);
  });

  it('maps a thrown failure to uncertainty without leaking details or retrying', async () => {
    createOrder.mockRejectedValue(new Error('private backend stack'));

    expect(await submitQuickOrder(input)).toEqual({ kind: 'uncertain', messages: [] });
    expect(createOrder).toHaveBeenCalledTimes(1);
  });
});
