import { createSiteConfig } from '@site/core/config';

import { buildWholesaleMetadata } from './wholesale-metadata';

const production = createSiteConfig({ SITE_ENV: 'production', SITE_INDEXING: 'true' });
const pages = [
  {
    locale: 'uk',
    title: 'Дверна фурнітура оптом — замовити',
    description:
      'Дверна фурнітура оптом у Class Kedr: завіси, замки, ручки, циліндри та міжкімнатні механізми. Перегляньте каталог і дізнайтеся оптові умови у менеджера.',
    ogLocale: 'uk_UA',
    otherOgLocale: 'ru_UA',
  },
  {
    locale: 'ru',
    title: 'Дверная фурнитура оптом — заказать',
    description:
      'Дверная фурнитура оптом в Class Kedr: петли, замки, ручки, цилиндры и межкомнатные механизмы. Посмотрите каталог и узнайте оптовые условия у менеджера.',
    ogLocale: 'ru_UA',
    otherOgLocale: 'uk_UA',
  },
] as const;

describe('wholesale metadata', () => {
  it.each(pages)(
    'describes the $locale offer with a plain title and reciprocal language links',
    (page) => {
      const metadata = buildWholesaleMetadata(page.locale, production);

      expect(metadata.title).toBe(page.title);
      expect(metadata.description).toBe(page.description);
      expect(metadata.alternates).toEqual({
        canonical: `/${page.locale}/wholesale`,
        languages: {
          'uk-UA': '/uk/wholesale',
          'ru-UA': '/ru/wholesale',
          'x-default': '/uk/wholesale',
        },
      });
      expect(metadata.openGraph).toMatchObject({
        type: 'website',
        url: `/${page.locale}/wholesale`,
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
      expect(buildWholesaleMetadata(locale, config).robots).toEqual({
        index: false,
        follow: false,
      });
    }
  });
});
