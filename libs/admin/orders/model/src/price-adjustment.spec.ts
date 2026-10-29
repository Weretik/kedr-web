import {
  adjustedLine,
  formatPriceAdjustment,
  parsePriceAdjustment,
  priceAdjustmentTone,
} from './price-adjustment';

describe('price adjustment', () => {
  it('reads discounts, markups, commas and empty input', () => {
    expect(parsePriceAdjustment('-50')).toEqual({ value: -50 });
    expect(parsePriceAdjustment('+50')).toEqual({ value: 50 });
    expect(parsePriceAdjustment('12,5')).toEqual({ value: 12.5 });
    expect(parsePriceAdjustment(' ')).toEqual({ value: 0 });
    expect(parsePriceAdjustment('-')).toEqual({ value: 0 });
  });

  it('rejects text, a third decimal and values above the limit', () => {
    expect(parsePriceAdjustment('abc')).toHaveProperty('error');
    expect(parsePriceAdjustment('1.005')).toHaveProperty('error');
    expect(parsePriceAdjustment('1000000.01')).toHaveProperty('error');
  });

  it('names the tone and formats the sign', () => {
    expect(priceAdjustmentTone(-1)).toBe('discount');
    expect(priceAdjustmentTone(2)).toBe('markup');
    expect(priceAdjustmentTone(0)).toBe('none');
    expect(formatPriceAdjustment(-50)).toMatch(/^−50,00/);
    expect(formatPriceAdjustment(10.5)).toMatch(/^\+10,50/);
    expect(formatPriceAdjustment(0)).toBe('—');
  });

  it('applies the adjustment per unit', () => {
    expect(adjustedLine(200, -50, 2)).toEqual({ unitPrice: 150, lineAmount: 300 });
    expect(adjustedLine(100, 10.5, 3)).toEqual({ unitPrice: 110.5, lineAmount: 331.5 });
  });
});
