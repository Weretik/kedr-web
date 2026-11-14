import { createSiteConfig } from '@site/core/config';
import { buildRootMetadata } from '@site/core/seo';

import { buildReturnsMetadata } from './returns-metadata';

const production = createSiteConfig({ SITE_ENV: 'production', SITE_INDEXING: 'true' });
const pages = [
  { locale: 'uk', title: 'Повернення та обмін', ogLocale: 'uk_UA' },
  { locale: 'ru', title: 'Возврат и обмен', ogLocale: 'ru_UA' },
] as const;

describe('returns metadata', () => {
  it.each(pages)('describes the $locale returns page with reciprocal alternates', (page) => {
    const metadata = buildReturnsMetadata(page.locale, production);
    expect(metadata.title).toBe(page.title);
    expect(metadata.description).toContain('Class Kedr');
    expect(metadata.description!.length).toBeLessThanOrEqual(160);
    expect(metadata.alternates).toEqual({
      canonical: `/${page.locale}/returns-exchanges`,
      languages: {
        'uk-UA': '/uk/returns-exchanges',
        'ru-UA': '/ru/returns-exchanges',
        'x-default': '/uk/returns-exchanges',
      },
    });
    expect(metadata.openGraph).toMatchObject({
      url: `/${page.locale}/returns-exchanges`,
      title: page.title,
      locale: page.ogLocale,
    });
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });

  it('retains the noindex gate even when preview requests indexing', () => {
    const preview = createSiteConfig({ SITE_ENV: 'preview', SITE_INDEXING: 'true' });
    expect(buildReturnsMetadata('uk', preview).robots).toEqual({ index: false, follow: false });
  });

  it('lets the existing layout add the brand exactly once', () => {
    expect(buildRootMetadata('uk', production).title).toEqual({
      default: 'Class Kedr',
      template: '%s | Class Kedr',
    });
    for (const page of pages) {
      expect(buildReturnsMetadata(page.locale, production).title).not.toContain('Class Kedr');
      expect(`${page.title} | Class Kedr`.length).toBeLessThanOrEqual(60);
    }
  });
});
