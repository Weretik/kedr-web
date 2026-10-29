import { quoteErrorMessage } from './quote-error-message';

describe('quoteErrorMessage', () => {
  it('shows the Ukrainian server text only for codes worded for the manager', () => {
    const message = 'Ціна «Ручка» після знижки 0,50 ₴, а має бути щонайменше 1,00 ₴ за шт.';
    expect(quoteErrorMessage({ reason: 'price_below_minimum', message })).toBe(message);
    expect(
      quoteErrorMessage({ reason: 'unavailable_price', message: 'A UAH price is unavailable' }),
    ).toMatch(/немає ціни для цього клієнта/);
    expect(quoteErrorMessage(new Error('network'))).toMatch(/Не вдалося розрахувати ціну/);
  });
});
