import { formatPrice } from './price';

// Intl uses a narrow no-break space as the group separator.
const normalize = (value: string) => value.replace(/\s/g, ' ');

describe('formatPrice', () => {
  it('formats whole and fractional prices in hryvnias', () => {
    expect(normalize(formatPrice(1245, 'uk'))).toBe('1 245 грн');
    expect(normalize(formatPrice(245.5, 'ru'))).toBe('245,50 грн');
  });
});
