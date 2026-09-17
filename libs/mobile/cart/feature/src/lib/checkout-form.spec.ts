import { checkoutFormSchema, createIdempotencyKey } from './checkout-form';

describe('checkout form', () => {
  it('requires a customer and limits the optional comment', () => {
    expect(checkoutFormSchema.safeParse({ comment: '', counterpartyId: '' }).success).toBe(false);
    expect(
      checkoutFormSchema.safeParse({ comment: 'x'.repeat(1001), counterpartyId: 'c-1' }).success,
    ).toBe(false);
    expect(checkoutFormSchema.parse({ comment: ' note ', counterpartyId: ' c-1 ' })).toEqual({
      comment: 'note',
      counterpartyId: 'c-1',
    });
  });

  it('creates UUID-shaped idempotency keys', () => {
    expect(createIdempotencyKey()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });
});
