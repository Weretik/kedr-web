import { createSiteConfig } from '@site/core/config';

import { buildRequisitesMetadata } from './requisites-metadata';

const production = createSiteConfig({ SITE_ENV: 'production', SITE_INDEXING: 'true' });
const pages = [
  {
    locale: 'uk',
    title: 'Реквізити',
    description:
      'Офіційні реквізити адміністрації Class Kedr: дані ФОП, IBAN і банк. Контакт менеджера для уточнення реквізитів оплати замовлення.',
    ogLocale: 'uk_UA',
    otherOgLocale: 'ru_UA',
  },
  {
    locale: 'ru',
    title: 'Реквизиты',
    description:
      'Официальные реквизиты администрации Class Kedr: данные ФОП, IBAN и банк. Контакт менеджера для уточнения реквизитов оплаты заказа.',
    ogLocale: 'ru_UA',
    otherOgLocale: 'uk_UA',
  },
] as const;

describe('requisites metadata', () => {
  it.each(pages)(
    'describes the $locale page with self canonical and reciprocal alternates',
    (page) => {
      const metadata = buildRequisitesMetadata(page.locale, production);

      expect(metadata.title).toBe(page.title);
      expect(metadata.description).toBe(page.description);
      expect(metadata.description!.length).toBeLessThanOrEqual(160);
      expect(metadata.alternates).toEqual({
        canonical: `/${page.locale}/requisites`,
        languages: {
          'uk-UA': '/uk/requisites',
          'ru-UA': '/ru/requisites',
          'x-default': '/uk/requisites',
        },
      });
      expect(metadata.openGraph).toEqual({
        type: 'website',
        siteName: 'Class Kedr',
        url: `/${page.locale}/requisites`,
        title: page.title,
        description: page.description,
        locale: page.ogLocale,
        alternateLocale: [page.otherOgLocale],
      });
      expect(metadata.robots).toEqual({ index: true, follow: true });
    },
  );

  it.each([
    { environment: 'production without indexing opt-in', env: { SITE_ENV: 'production' } },
    {
      environment: 'production with indexing disabled',
      env: { SITE_ENV: 'production', SITE_INDEXING: 'false' },
    },
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
      expect(buildRequisitesMetadata(locale, config).robots).toEqual({
        index: false,
        follow: false,
      });
    }
  });
});
