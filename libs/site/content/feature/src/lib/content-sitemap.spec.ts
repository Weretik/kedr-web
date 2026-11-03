import { createSiteConfig } from '@site/core/config';
import { buildSitemapEntries } from '@site/core/seo';

import { CONTENT_SITEMAP_PAGES } from './content-sitemap';

it('includes exactly one returns URL per locale with reciprocal sitemap alternates', () => {
  const config = createSiteConfig({ SITE_ENV: 'production', SITE_INDEXING: 'true' });
  const entries = buildSitemapEntries([{ path: '/' }, ...CONTENT_SITEMAP_PAGES], config);
  const returns = entries.filter(({ url }) => url.endsWith('/returns-exchanges'));
  expect(returns.map(({ url }) => url)).toEqual([
    'https://classkedr.com.ua/uk/returns-exchanges',
    'https://classkedr.com.ua/ru/returns-exchanges',
  ]);
  for (const entry of returns) {
    expect(entry.alternates?.languages).toEqual({
      'uk-UA': 'https://classkedr.com.ua/uk/returns-exchanges',
      'ru-UA': 'https://classkedr.com.ua/ru/returns-exchanges',
    });
  }
  expect(entries.some(({ url }) => url.endsWith('/uk/delivery-and-payment'))).toBe(true);
});

it('publishes one contacts URL per locale without invented dates and preserves migrated pages', () => {
  const config = createSiteConfig({ SITE_ENV: 'production', SITE_INDEXING: 'true' });
  const entries = buildSitemapEntries([...CONTENT_SITEMAP_PAGES], config);
  const contacts = entries.filter(({ url }) => url.endsWith('/contacts'));

  expect(contacts.map(({ url }) => url)).toEqual([
    'https://classkedr.com.ua/uk/contacts',
    'https://classkedr.com.ua/ru/contacts',
  ]);
  for (const entry of contacts) {
    expect(entry.alternates?.languages).toEqual({
      'uk-UA': 'https://classkedr.com.ua/uk/contacts',
      'ru-UA': 'https://classkedr.com.ua/ru/contacts',
    });
    expect(entry.lastModified).toBeUndefined();
  }
  expect(new Set(entries.map(({ url }) => url)).size).toBe(entries.length);
  for (const locale of ['uk', 'ru']) {
    expect(entries.some(({ url }) => url.endsWith(`/${locale}/delivery-and-payment`))).toBe(true);
    expect(entries.some(({ url }) => url.endsWith(`/${locale}/returns-exchanges`))).toBe(true);
  }
});
