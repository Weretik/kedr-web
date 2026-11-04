import { formatPrice } from './price';

describe('formatPrice', () => {
  it('shows kopecks only when the price has them', () => {
    expect(formatPrice('uk', 1245).replace(/\s/g, ' ')).toBe('1 245 грн');
    expect(formatPrice('ru', 12345.5).replace(/\s/g, ' ')).toBe('12 345,50 грн');
  });
});
