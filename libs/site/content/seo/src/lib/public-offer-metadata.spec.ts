import { createSiteConfig } from '@site/core/config';
import { DEFAULT_OG_IMAGE, buildRootMetadata } from '@site/core/seo';

import { buildPublicOfferMetadata } from './public-offer-metadata';

const production = createSiteConfig({ SITE_ENV: 'production', SITE_INDEXING: 'true' });
const pages = [
  {
    locale: 'uk',
    title: 'Публічна оферта',
    description:
      'Публічна оферта та правила користування сайтом Class Kedr: умови замовлення, оплати, доставки, повернення товарів і обробки персональних даних.',
    ogLocale: 'uk_UA',
    otherOgLocale: 'ru_UA',
  },
  {
    locale: 'ru',
    title: 'Публичная оферта',
    description:
      'Публичная оферта и правила пользования сайтом Class Kedr: условия заказа, оплаты, доставки, возврата товаров и обработки персональных данных.',
    ogLocale: 'ru_UA',
    otherOgLocale: 'uk_UA',
  },
] as const;

describe('public offer metadata', () => {
  it.each(pages)(
    'describes the $locale page with a self canonical and reciprocal alternates',
    (page) => {
      const metadata = buildPublicOfferMetadata(page.locale, production);

      expect(metadata.title).toBe(page.title);
      expect(metadata.description).toBe(page.description);
      expect(metadata.description!.length).toBeLessThanOrEqual(160);
      expect(metadata.alternates).toEqual({
        canonical: `/${page.locale}/public-offer`,
        languages: {
          'uk-UA': '/uk/public-offer',
          'ru-UA': '/ru/public-offer',
          'x-default': '/uk/public-offer',
        },
      });
      expect(metadata.openGraph).toEqual({
        type: 'website',
        siteName: 'Class Kedr',
        url: `/${page.locale}/public-offer`,
        title: page.title,
        description: page.description,
        locale: page.ogLocale,
        alternateLocale: [page.otherOgLocale],
        images: [DEFAULT_OG_IMAGE],
      });
      expect(metadata.robots).toEqual({ index: true, follow: true });
    },
  );

  it.each([
    { environment: 'production without indexing opt-in', env: { SITE_ENV: 'production' } },
    {
      environment: 'preview with indexing requested',
      env: { SITE_ENV: 'preview', SITE_INDEXING: 'true' },
    },
    {
      environment: 'development with indexing requested',
      env: { SITE_ENV: 'development', SITE_INDEXING: 'true' },
    },
  ])('keeps both languages noindex in $environment', ({ env }) => {
    const config = createSiteConfig(env);
    for (const { locale } of pages) {
      expect(buildPublicOfferMetadata(locale, config).robots).toEqual({
        index: false,
        follow: false,
      });
    }
  });

  it('leaves the shared layout to add the brand exactly once', () => {
    for (const page of pages) {
      expect(buildRootMetadata(page.locale, production).title).toEqual({
        default: 'Class Kedr',
        template: '%s | Class Kedr',
      });
      expect(buildPublicOfferMetadata(page.locale, production).title).toBe(page.title);
      expect(page.title).not.toContain('Class Kedr');
      expect(`${page.title} | Class Kedr`.length).toBeLessThanOrEqual(60);
    }
  });
});
