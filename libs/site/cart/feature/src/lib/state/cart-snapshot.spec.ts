import { describe, expect, it } from 'vitest';

import { checkoutOutcome, withoutEmptyCartMessage, withoutFieldError } from './cart-snapshot';

import type { CheckoutResult } from '@site/cart/model';

const validation = (messages: string[], fieldErrors = {}): CheckoutResult => ({
  kind: 'validation',
  fieldErrors,
  messages,
});

describe('cart snapshot results', () => {
  it('drops the empty-cart message and the whole result when nothing is left', () => {
    expect(withoutEmptyCartMessage(validation(['empty-cart']))).toBeNull();
    expect(withoutEmptyCartMessage(validation(['empty-cart', 'other']))).toEqual(
      validation(['other']),
    );
  });

  it('clears only the edited field error', () => {
    const result = validation([], { firstName: 'required', phone: 'invalid' });
    expect(withoutFieldError(result, 'phone')).toEqual(validation([], { firstName: 'required' }));
  });
});

describe('checkoutOutcome', () => {
  it('keeps the basket for an answer other than a created order', () => {
    const result = validation(['other']);
    expect(checkoutOutcome(result, { unitCount: 2, goodsSubtotal: 100 }, null)).toEqual({
      pending: false,
      result,
    });
  });

  it('empties the basket and keeps the receipt for a created order', () => {
    const outcome = checkoutOutcome(
      { kind: 'created', orderId: 'A-1' } as CheckoutResult,
      { unitCount: 2, goodsSubtotal: 100 },
      'write-failed',
    );
    expect(outcome).toMatchObject({
      lines: [],
      receipt: { orderId: 'A-1', unitCount: 2, goodsSubtotal: 100 },
      storageIssue: 'write-failed',
    });
  });
});
