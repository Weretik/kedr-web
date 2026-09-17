import {
  formatOrderAmount,
  formatOrderDateTime,
  formatOrderPositionCount,
} from './order-formatters';

describe('order formatters', () => {
  it('formats UAH using the agreed Ukrainian notation', () => {
    expect(formatOrderAmount(25_000)).toBe('25 000,00 грн.');
    expect(formatOrderAmount(12.5)).toBe('12,50 грн.');
  });

  it('formats UTC timestamps in Europe/Kyiv including daylight saving time', () => {
    expect(formatOrderDateTime('2026-09-17T11:35:00Z')).toBe('17.09.2026, 14:35');
    expect(formatOrderDateTime('2026-01-17T11:35:00Z')).toBe('17.01.2026, 13:35');
  });

  it.each([
    [1, '1 позиція'],
    [2, '2 позиції'],
    [5, '5 позицій'],
    [11, '11 позицій'],
    [21, '21 позиція'],
  ])('formats %i with the correct Ukrainian plural form', (count, expected) => {
    expect(formatOrderPositionCount(count)).toBe(expected);
  });
});
