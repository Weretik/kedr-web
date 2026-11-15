import { describe, expect, it } from 'vitest';

import { createOrderAttempt } from './order-attempt';

import type { CheckoutCommand } from '@site/cart/model';

const order = (quantity: number) =>
  ({
    firstName: 'Олена',
    phone: '+380501112233',
    lines: [{ variantId: 'v1', quantity }],
  }) as unknown as CheckoutCommand;

describe('createOrderAttempt', () => {
  const keys = () => {
    let n = 0;
    return () => `key-${++n}`;
  };

  it('reuses the key for a retry of the same order after an unknown outcome', () => {
    const attempt = createOrderAttempt(keys());
    expect(attempt.keyFor(order(1))).toBe('key-1');
    attempt.finish({ kind: 'uncertain', messages: [] });
    expect(attempt.keyFor(order(1))).toBe('key-1');
  });

  it('makes a new key when the order changes', () => {
    const attempt = createOrderAttempt(keys());
    attempt.keyFor(order(1));
    expect(attempt.keyFor(order(2))).toBe('key-2');
  });

  it('makes a new key after any known outcome', () => {
    const attempt = createOrderAttempt(keys());
    attempt.keyFor(order(1));
    attempt.finish({ kind: 'conflict', messages: ['Оновіть сторінку.'] } as never);
    expect(attempt.keyFor(order(1))).toBe('key-2');
  });
});
