import { parseOrderCreated } from './order-response.schema';

describe('order response validation', () => {
  it('accepts a valid order identifier', () => {
    expect(parseOrderCreated({ orderId: '17e2a82f-d3c8-4a53-b6d8-7189ee58052d' })).toEqual({
      orderId: '17e2a82f-d3c8-4a53-b6d8-7189ee58052d',
    });
  });

  it('rejects an invalid successful response', () => {
    expect(() => parseOrderCreated({ orderId: 42 })).toThrow('Unknown error');
  });
});
