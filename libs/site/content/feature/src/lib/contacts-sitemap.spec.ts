import { createSiteConfig } from '@site/core/config';
import { buildSitemapEntries } from '@site/core/seo';

import { getContactsSitemapPages } from './contacts-sitemap';

describe('contacts sitemap', () => {
  it('adds one locale-free path for the app aggregator without a made-up timestamp', () => {
    expect(getContactsSitemapPages()).toEqual([{ path: '/contacts' }]);
  });

  it('preserves other entries and adds both locales with reciprocal alternates', () => {
    const entries = buildSitemapEntries(
      [{ path: '/' }, { path: '/catalog' }, ...getContactsSitemapPages()],
      createSiteConfig({ SITE_URL: 'https://example.com' }),
    );
    expect(entries.map((entry) => entry.url)).toEqual([
      'https://example.com/uk',
      'https://example.com/ru',
      'https://example.com/uk/catalog',
      'https://example.com/ru/catalog',
      'https://example.com/uk/contacts',
      'https://example.com/ru/contacts',
    ]);
    for (const entry of entries.filter((entry) => entry.url.endsWith('/contacts'))) {
      expect(entry.lastModified).toBeUndefined();
      expect(entry.alternates?.languages).toEqual({
        'uk-UA': 'https://example.com/uk/contacts',
        'ru-UA': 'https://example.com/ru/contacts',
      });
    }
  });
});
