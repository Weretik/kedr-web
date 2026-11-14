import { createSiteConfig } from '@site/core/config';
import { DEFAULT_OG_IMAGE, buildRootMetadata } from '@site/core/seo';

import { buildPrivacyMetadata } from './privacy-metadata';

const production = createSiteConfig({ SITE_ENV: 'production', SITE_INDEXING: 'true' });
const pages = [
  {
    locale: 'uk',
    title: 'Політика конфіденційності',
    description:
      'Політика конфіденційності Class Kedr: обробка персональних даних, їх захист, права користувачів та контакти для звернень.',
    ogLocale: 'uk_UA',
    otherOgLocale: 'ru_UA',
  },
  {
    locale: 'ru',
    title: 'Политика конфиденциальности',
    description:
      'Политика конфиденциальности Class Kedr: обработка персональных данных, их защита, права пользователей и контакты для обращений.',
    ogLocale: 'ru_UA',
    otherOgLocale: 'uk_UA',
  },
] as const;

describe('privacy metadata', () => {
  it.each(pages)(
    'describes the $locale page with its own canonical and reciprocal language alternates',
    (page) => {
      const metadata = buildPrivacyMetadata(page.locale, production);

      expect(metadata.title).toBe(page.title);
      expect(metadata.description).toBe(page.description);
      expect(metadata.description!.length).toBeLessThanOrEqual(160);
      expect(metadata.alternates).toEqual({
        canonical: `/${page.locale}/privacy-policy`,
        languages: {
          'uk-UA': '/uk/privacy-policy',
          'ru-UA': '/ru/privacy-policy',
          'x-default': '/uk/privacy-policy',
        },
      });
      expect(metadata.openGraph).toEqual({
        type: 'website',
        siteName: 'Class Kedr',
        url: `/${page.locale}/privacy-policy`,
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
      expect(buildPrivacyMetadata(locale, config).robots).toEqual({
        index: false,
        follow: false,
      });
    }
  });

  it.each(pages)('lets the root title template add the brand exactly once for $locale', (page) => {
    const rootTitle = buildRootMetadata(page.locale, production).title as {
      default: string;
      template: string;
    };
    const pageTitle = buildPrivacyMetadata(page.locale, production).title;

    expect(rootTitle).toEqual({ default: 'Class Kedr', template: '%s | Class Kedr' });
    expect(pageTitle).toBe(page.title);
    const finalTitle = rootTitle.template.replace('%s', String(pageTitle));
    expect(finalTitle).toBe(`${page.title} | Class Kedr`);
    expect(finalTitle.match(/Class Kedr/g)).toHaveLength(1);
    expect(finalTitle.length).toBeLessThanOrEqual(60);
  });

  it.each(pages)('resolves $locale public URLs against the configured root origin', (page) => {
    const config = createSiteConfig({
      SITE_URL: 'https://privacy.example.test/',
      SITE_ENV: 'production',
      SITE_INDEXING: 'true',
    });
    const root = buildRootMetadata(page.locale, config);
    const metadata = buildPrivacyMetadata(page.locale, config);
    const canonical = String(metadata.alternates?.canonical);

    expect(new URL(canonical, root.metadataBase!).href).toBe(
      `https://privacy.example.test/${page.locale}/privacy-policy`,
    );
    expect(new URL(String(metadata.openGraph?.url), root.metadataBase!).href).toBe(
      `https://privacy.example.test/${page.locale}/privacy-policy`,
    );
  });
});
