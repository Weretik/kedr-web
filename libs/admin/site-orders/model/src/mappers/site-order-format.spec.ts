import { describe, expect, it } from 'vitest';

import { formatSiteOrderMoney, formatSiteOrderTime, siteOrderNumber } from './site-order-format';

describe('site order formats', () => {
  it('shows the time in Kyiv', () => {
    expect(formatSiteOrderTime('2026-11-24T07:45:00Z')).toBe('24.11.2026, 09:45');
    expect(formatSiteOrderTime(null)).toBe('—');
  });

  it('shows the order number as on the site and in Telegram', () => {
    expect(siteOrderNumber('52992220-9449-43ca-aace-c459869adc3b')).toBe('№ 52992220');
    expect(siteOrderNumber('5299222a-9449-43ca-aace-c459869adc3b')).toBe('№ 5299222A');
  });

  it('shows money with two decimals', () => {
    expect(formatSiteOrderMoney(7209).replace(/\s/g, ' ')).toBe('7 209,00');
    expect(formatSiteOrderMoney(409.5)).toBe('409,50');
  });
});
