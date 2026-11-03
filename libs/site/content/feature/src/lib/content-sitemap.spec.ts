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
});
