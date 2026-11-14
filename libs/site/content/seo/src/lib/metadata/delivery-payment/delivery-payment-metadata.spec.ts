import { createSiteConfig } from '@site/core/config';
import { buildRootMetadata } from '@site/core/seo';

import { buildDeliveryPaymentMetadata } from '../../../index';

const production = createSiteConfig({ SITE_ENV: 'production', SITE_INDEXING: 'true' });

const localizedPages = [
  {
    locale: 'uk',
    title: 'Доставка та оплата',
    description:
      'Умови доставки й оплати Class Kedr: відвантаження по Україні, тарифи перевізника, оплата за реквізитами та погодження післяплати.',
    ogLocale: 'uk_UA',
    otherOgLocale: 'ru_UA',
  },
  {
    locale: 'ru',
    title: 'Доставка и оплата',
    description:
      'Условия доставки и оплаты Class Kedr: отгрузка по Украине, тарифы перевозчика, оплата по реквизитам и согласование наложенного платежа.',
    ogLocale: 'ru_UA',
    otherOgLocale: 'uk_UA',
  },
] as const;

describe('buildDeliveryPaymentMetadata', () => {
  it.each(localizedPages)('describes the localized $locale public page', (page) => {
    const metadata = buildDeliveryPaymentMetadata(page.locale, production);
    const canonical = `/${page.locale}/delivery-and-payment`;

    expect(metadata.title).toBe(page.title);
    expect(metadata.description).toBe(page.description);
    expect(metadata.alternates).toEqual({
      canonical,
      languages: {
        'uk-UA': '/uk/delivery-and-payment',
        'ru-UA': '/ru/delivery-and-payment',
        'x-default': '/uk/delivery-and-payment',
      },
    });
    expect(metadata.openGraph).toMatchObject({
      type: 'website',
      siteName: 'Class Kedr',
      url: canonical,
      title: page.title,
      description: page.description,
      locale: page.ogLocale,
      alternateLocale: [page.otherOgLocale],
    });
  });

  it.each([
    ['unset environment', {}, false],
    ['preview with opt-in', { SITE_ENV: 'preview', SITE_INDEXING: 'true' }, false],
    ['development with opt-in', { SITE_ENV: 'development', SITE_INDEXING: 'true' }, false],
    ['production without opt-in', { SITE_ENV: 'production' }, false],
    ['production with opt-in', { SITE_ENV: 'production', SITE_INDEXING: 'true' }, true],
  ] as const)('uses the shared indexing gate for %s', (_name, env, enabled) => {
    const metadata = buildDeliveryPaymentMetadata('uk', createSiteConfig(env));

    expect(metadata.robots).toEqual({ index: enabled, follow: enabled });
  });

  it('uses plain localized titles so the existing layout adds the brand once', () => {
    const layout = buildRootMetadata('uk', production);
    expect(layout.title).toEqual({ default: 'Class Kedr', template: '%s | Class Kedr' });
    for (const { locale, title } of localizedPages) {
      expect(buildDeliveryPaymentMetadata(locale, production).title).toBe(title);
      expect(title).not.toContain('Class Kedr');
      expect(`${title} | Class Kedr`.length).toBeLessThanOrEqual(60);
    }
  });

  it('keeps both descriptions within the documented snippet limit', () => {
    for (const { locale } of localizedPages) {
      const description = buildDeliveryPaymentMetadata(locale, production).description;
      expect(description).toBeTruthy();
      expect(description!.length).toBeLessThanOrEqual(160);
    }
  });
});
