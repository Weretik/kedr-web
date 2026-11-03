import { createSiteConfig } from '@site/core/config';

import { buildContactsMetadata } from './contacts-metadata';

const production = createSiteConfig({ SITE_ENV: 'production', SITE_INDEXING: 'true' });
const pages = [
  {
    locale: 'uk',
    title: 'Контакти',
    description:
      'Контакти Class Kedr: телефон відділу продажу, Telegram, Viber, електронна пошта та розташування в Харкові. Дверна фурнітура оптом і в роздріб.',
    ogLocale: 'uk_UA',
    otherOgLocale: 'ru_UA',
  },
  {
    locale: 'ru',
    title: 'Контакты',
    description:
      'Контакты Class Kedr: телефон отдела продаж, Telegram, Viber, электронная почта и расположение в Харькове. Дверная фурнитура оптом и в розницу.',
    ogLocale: 'ru_UA',
    otherOgLocale: 'uk_UA',
  },
] as const;

describe('contacts metadata', () => {
  it.each(pages)('describes the $locale page with reciprocal language links', (page) => {
    const metadata = buildContactsMetadata(page.locale, production);

    expect(metadata.title).toBe(page.title);
    expect(metadata.description).toBe(page.description);
    expect(metadata.description!.length).toBeLessThanOrEqual(160);
    expect(metadata.alternates).toEqual({
      canonical: `/${page.locale}/contacts`,
      languages: {
        'uk-UA': '/uk/contacts',
        'ru-UA': '/ru/contacts',
        'x-default': '/uk/contacts',
      },
    });
    expect(metadata.openGraph).toMatchObject({
      type: 'website',
      url: `/${page.locale}/contacts`,
      title: page.title,
      description: page.description,
      locale: page.ogLocale,
      alternateLocale: [page.otherOgLocale],
    });
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });

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
      expect(buildContactsMetadata(locale, config).robots).toEqual({ index: false, follow: false });
    }
  });
});
