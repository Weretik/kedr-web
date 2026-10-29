import { createSiteConfig } from '@site/core/config';

import { buildRobotsFile } from './robots-file';
import { buildSitemapEntries } from './sitemap-entries';

const production = createSiteConfig({ SITE_ENV: 'production', SITE_INDEXING: 'true' });
const preview = createSiteConfig({ SITE_ENV: 'preview' });

describe('robots.txt', () => {
  it('disallows everything while indexing is off', () => {
    expect(buildRobotsFile(preview)).toEqual({ rules: { userAgent: '*', disallow: '/' } });
  });

  it('allows the site but not private pages once indexing is on', () => {
    const robots = buildRobotsFile(production);

    expect(robots.sitemap).toBe('https://classkedr.com.ua/sitemap.xml');
    expect(robots.rules).toMatchObject({
      allow: '/',
      disallow: expect.arrayContaining(['/api/', '/uk/checkout', '/ru/cabinet', '/uk/login']),
    });
  });
});

describe('sitemap entries', () => {
  it('lists every language version with alternates', () => {
    const entries = buildSitemapEntries([{ path: '/' }], production);

    expect(entries.map((entry) => entry.url)).toEqual([
      'https://classkedr.com.ua/uk',
      'https://classkedr.com.ua/ru',
    ]);
    expect(entries[0]?.alternates?.languages).toEqual({
      'uk-UA': 'https://classkedr.com.ua/uk',
      'ru-UA': 'https://classkedr.com.ua/ru',
    });
  });
});
