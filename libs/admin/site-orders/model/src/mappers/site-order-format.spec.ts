import { describe, expect, it } from 'vitest';

import { formatSiteOrderMoney, formatSiteOrderTime } from './site-order-format';

describe('site order formats', () => {
  it('shows the time in Kyiv', () => {
    expect(formatSiteOrderTime('2026-11-24T07:45:00Z')).toBe('24.11.2026, 09:45');
    expect(formatSiteOrderTime(null)).toBe('—');
  });

  it('shows money with two decimals', () => {
    expect(formatSiteOrderMoney(7209).replace(/\s/g, ' ')).toBe('7 209,00');
    expect(formatSiteOrderMoney(409.5)).toBe('409,50');
  });
});
