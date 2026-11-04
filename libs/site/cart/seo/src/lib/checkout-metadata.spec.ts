import { describe, expect, it } from 'vitest';

import { buildCheckoutMetadata } from './checkout-metadata';

describe('private checkout metadata', () => {
  it.each(['uk', 'ru'] as const)(
    'always excludes %s from indexing when production indexing is enabled',
    (locale) => {
      const metadata = buildCheckoutMetadata(locale, { indexingEnabled: true });
      expect(metadata.robots).toEqual({ index: false, follow: true });
      expect(metadata.title).toBe(locale === 'uk' ? 'Оформлення замовлення' : 'Оформление заказа');
    },
  );

  it.each(['uk', 'ru'] as const)('preserves the preview indexing gate for %s', (locale) => {
    expect(buildCheckoutMetadata(locale, { indexingEnabled: false }).robots).toEqual({
      index: false,
      follow: false,
    });
  });

  it('does not publish cart canonical, hreflang or order structured data', () => {
    const metadata = buildCheckoutMetadata('uk', { indexingEnabled: true });
    expect(metadata.alternates).toBeUndefined();
    expect(metadata.openGraph).toBeUndefined();
    expect(metadata.description).toMatch(/контакт|замовлення/);
  });
});
