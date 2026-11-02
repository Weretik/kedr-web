import { COMPANY, createSiteConfig } from '@site/core/config';
import { LOCALES } from '@site/core/i18n';

import { buildContactsJsonLd } from './contacts-json-ld';
import { buildContactsMetadata } from './contacts-metadata';

const config = createSiteConfig({
  SITE_URL: 'https://example.com',
  SITE_ENV: 'production',
  SITE_INDEXING: 'true',
});

describe('contacts SEO', () => {
  it.each(LOCALES)('builds localized metadata with a self canonical for %s', (locale) => {
    const metadata = buildContactsMetadata(locale, config);
    const title =
      locale === 'uk'
        ? 'Контакти — зв’язок із відділом продажу'
        : 'Контакты — связь с отделом продаж';

    expect(metadata.title).toBe(title);
    expect(`${metadata.title} | ${COMPANY.name}`.length).toBeLessThanOrEqual(60);
    expect(metadata.description).toContain(COMPANY.phone.display);
    expect(metadata.description).toContain(COMPANY.address.city[locale]);
    expect(metadata.description!.length).toBeLessThanOrEqual(160);
    expect(metadata.alternates).toEqual({
      canonical: `/${locale}/contacts`,
      languages: { 'uk-UA': '/uk/contacts', 'ru-UA': '/ru/contacts', 'x-default': '/uk/contacts' },
    });
    expect(metadata.openGraph).toMatchObject({
      url: `/${locale}/contacts`,
      title,
      locale: `${locale}_UA`,
    });
  });

  it.each([
    { SITE_ENV: 'production', SITE_INDEXING: 'true', allowed: true },
    { SITE_ENV: 'production', SITE_INDEXING: 'false', allowed: false },
    { SITE_ENV: 'preview', SITE_INDEXING: 'true', allowed: false },
    { SITE_ENV: 'development', SITE_INDEXING: 'true', allowed: false },
  ])('respects the site indexing policy: $SITE_ENV / $SITE_INDEXING', ({ allowed, ...env }) => {
    expect(buildContactsMetadata('uk', createSiteConfig(env)).robots).toEqual({
      index: allowed,
      follow: allowed,
    });
  });

  it.each(LOCALES)(
    'links %s ContactPage and breadcrumbs to the existing organization',
    (locale) => {
      const canonical = `https://example.com/${locale}/contacts`;
      const name = locale === 'uk' ? 'Контакти' : 'Контакты';
      const data = buildContactsJsonLd(locale, config);

      expect(data).toHaveLength(2);
      expect(data[0]).toMatchObject({
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name,
        inLanguage: `${locale}-UA`,
        mainEntity: { '@id': 'https://example.com/#organization' },
      });
      expect(data[1]).toMatchObject({
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: locale === 'uk' ? 'Головна' : 'Главная',
            item: `https://example.com/${locale}`,
          },
          { '@type': 'ListItem', position: 2, name, item: canonical },
        ],
      });
      const serialized = JSON.stringify(data);
      for (const field of [
        'LocalBusiness',
        'Store',
        'streetAddress',
        'openingHours',
        'geo',
        'lastModified',
      ]) {
        expect(serialized).not.toContain(`"${field}"`);
      }
      expect(data.map((entry) => entry['@type'])).not.toContain('Organization');
    },
  );
});
