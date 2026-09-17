import { createAdminOrderPayload, resolveOrderAttempt } from './order';

import type { CartLine } from './cart';

const lines: CartLine[] = [
  {
    id: 'product-1',
    imageUrl: null,
    name: 'Товар',
    quantity: 2,
    quantityInPack: 1,
    stock: 5,
    unitPrice: 125.125,
  },
];

describe('admin order model', () => {
  it('maps cart data to a trimmed payload with complete line amounts', () => {
    expect(createAdminOrderPayload(lines, '  cp-1 ', '  Коментар  ')).toEqual({
      comment: 'Коментар',
      counterpartyId: 'cp-1',
      lines: [{ amount: 250.25, productId: 'product-1', quantity: 2 }],
    });
    expect(createAdminOrderPayload(lines, 'cp-1', '   ').comment).toBeNull();
  });

  it('reuses an attempt only while the canonical payload is unchanged', () => {
    const keys = ['key-1', 'key-2'];
    const createKey = jest.fn(() => keys.shift() ?? 'unexpected');
    const payload = createAdminOrderPayload(lines, 'cp-1', 'Коментар');
    const first = resolveOrderAttempt(payload, null, createKey);
    const retry = resolveOrderAttempt(payload, first, createKey);
    const changed = resolveOrderAttempt({ ...payload, comment: 'Інший' }, retry, createKey);

    expect(first.idempotencyKey).toBe('key-1');
    expect(retry).toBe(first);
    expect(changed.idempotencyKey).toBe('key-2');
    expect(createKey).toHaveBeenCalledTimes(2);
  });
});
