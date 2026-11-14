import { createSiteConfig } from '@site/core/config';
import { DEFAULT_OG_IMAGE, buildRootMetadata } from '@site/core/seo';

import { buildGalleryMetadata } from './gallery-metadata';

const production = createSiteConfig({
  SITE_ENV: 'production',
  SITE_INDEXING: 'true',
  SITE_URL: 'https://gallery.example.test/',
});
const pages = [
  {
    locale: 'uk',
    title: 'Галерея та відео',
    description:
      'Медіаматеріали Class Kedr про дверну фурнітуру: деталі, фактури та конструкцію механізмів. Переглядайте доступні матеріали галереї.',
    ogLocale: 'uk_UA',
    otherOgLocale: 'ru_UA',
  },
  {
    locale: 'ru',
    title: 'Галерея и видео',
    description:
      'Медиаматериалы Class Kedr о дверной фурнитуре: детали, фактуры и конструкция механизмов. Смотрите доступные материалы галереи.',
    ogLocale: 'ru_UA',
    otherOgLocale: 'uk_UA',
  },
] as const;

describe('gallery metadata', () => {
  it.each(pages)(
    'describes the canonical $locale gallery with reciprocal language links',
    (page) => {
      const metadata = buildGalleryMetadata(page.locale, production);

      expect(metadata.title).toBe(page.title);
      expect(metadata.description).toBe(page.description);
      expect(metadata.description!.length).toBeLessThanOrEqual(160);
      expect(metadata.alternates).toEqual({
        canonical: `/${page.locale}/galleria`,
        languages: {
          'uk-UA': '/uk/galleria',
          'ru-UA': '/ru/galleria',
          'x-default': '/uk/galleria',
        },
      });
      expect(metadata.openGraph).toEqual({
        type: 'website',
        siteName: 'Class Kedr',
        url: `/${page.locale}/galleria`,
        title: page.title,
        description: page.description,
        locale: page.ogLocale,
        alternateLocale: [page.otherOgLocale],
        images: [DEFAULT_OG_IMAGE],
      });
      expect(metadata.robots).toEqual({ index: true, follow: true });
      expect(metadata.twitter).toBeUndefined();
    },
  );

  it.each(pages)('resolves the $locale page URLs against the configured root origin', (page) => {
    const metadata = buildGalleryMetadata(page.locale, production);
    const rootMetadata = buildRootMetadata(page.locale, production);
    const canonical = metadata.alternates?.canonical;

    expect(canonical).toBe(`/${page.locale}/galleria`);
    expect(new URL(canonical as string, rootMetadata.metadataBase!).href).toBe(
      `https://gallery.example.test/${page.locale}/galleria`,
    );
    expect(rootMetadata.title).toMatchObject({ template: '%s | Class Kedr' });
  });

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
      expect(buildGalleryMetadata(locale, config).robots).toEqual({ index: false, follow: false });
    }
  });
});
