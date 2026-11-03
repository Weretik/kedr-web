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

it('publishes the article list and six slug articles per locale, without IDs, query or invented dates', () => {
  const config = createSiteConfig({ SITE_ENV: 'production', SITE_INDEXING: 'true' });
  const entries = buildSitemapEntries([...CONTENT_SITEMAP_PAGES], config);
  const articles = entries.filter(({ url }) => new URL(url).pathname.includes('/articles'));
  expect(articles).toHaveLength(14);
  for (const locale of ['uk', 'ru']) {
    expect(
      articles.filter(({ url }) => new URL(url).pathname.startsWith(`/${locale}/articles`)),
    ).toHaveLength(7);
    expect(articles.some(({ url }) => url.endsWith(`/${locale}/articles`))).toBe(true);
  }
  expect(new Set(articles.map(({ url }) => url)).size).toBe(14);
  for (const entry of articles) {
    expect(new URL(entry.url).search).toBe('');
    expect(entry.url).not.toMatch(/\/articles\/\d+$/);
    expect(entry.lastModified).toBeUndefined();
    expect(entry.alternates?.languages).toHaveProperty('uk-UA');
    expect(entry.alternates?.languages).toHaveProperty('ru-UA');
  }
});

it('publishes one wholesale URL per language and preserves existing content without invented dates', () => {
  const config = createSiteConfig({ SITE_ENV: 'production', SITE_INDEXING: 'true' });
  const entries = buildSitemapEntries([...CONTENT_SITEMAP_PAGES], config);
  const wholesale = entries.filter(({ url }) => url.endsWith('/wholesale'));
  expect(wholesale.map(({ url }) => url)).toEqual([
    'https://classkedr.com.ua/uk/wholesale',
    'https://classkedr.com.ua/ru/wholesale',
  ]);
  for (const entry of wholesale) {
    expect(entry.lastModified).toBeUndefined();
    expect(entry.alternates?.languages).toEqual({
      'uk-UA': 'https://classkedr.com.ua/uk/wholesale',
      'ru-UA': 'https://classkedr.com.ua/ru/wholesale',
    });
  }
  expect(new Set(entries.map(({ url }) => url)).size).toBe(entries.length);
  for (const locale of ['uk', 'ru']) {
    for (const slug of ['delivery-and-payment', 'returns-exchanges', 'contacts', 'articles']) {
      expect(entries.some(({ url }) => url.endsWith(`/${locale}/${slug}`))).toBe(true);
    }
  }
});

it('publishes one requisites URL per locale with reciprocal alternates and preserves migrated pages', () => {
  const config = createSiteConfig({ SITE_ENV: 'production', SITE_INDEXING: 'true' });
  const entries = buildSitemapEntries([...CONTENT_SITEMAP_PAGES], config);
  const requisites = entries.filter(({ url }) => url.endsWith('/requisites'));

  expect(requisites.map(({ url }) => url)).toEqual([
    'https://classkedr.com.ua/uk/requisites',
    'https://classkedr.com.ua/ru/requisites',
  ]);
  for (const entry of requisites) {
    expect(entry.alternates?.languages).toEqual({
      'uk-UA': 'https://classkedr.com.ua/uk/requisites',
      'ru-UA': 'https://classkedr.com.ua/ru/requisites',
    });
    expect(entry.lastModified).toBeUndefined();
  }
  expect(new Set(entries.map(({ url }) => url)).size).toBe(entries.length);
  for (const locale of ['uk', 'ru']) {
    for (const slug of [
      'delivery-and-payment',
      'returns-exchanges',
      'contacts',
      'wholesale',
      'articles',
    ]) {
      expect(entries.some(({ url }) => url.endsWith('/' + locale + '/' + slug))).toBe(true);
    }
  }
});

it('publishes the public offer once per locale with alternates and preserves existing content', () => {
  const config = createSiteConfig({ SITE_ENV: 'production', SITE_INDEXING: 'true' });
  const entries = buildSitemapEntries([...CONTENT_SITEMAP_PAGES], config);
  const offers = entries.filter(({ url }) => new URL(url).pathname.endsWith('/public-offer'));
  expect(offers.map(({ url }) => url)).toEqual([
    'https://classkedr.com.ua/uk/public-offer',
    'https://classkedr.com.ua/ru/public-offer',
  ]);
  for (const entry of offers) {
    expect(entry.alternates?.languages).toEqual({
      'uk-UA': 'https://classkedr.com.ua/uk/public-offer',
      'ru-UA': 'https://classkedr.com.ua/ru/public-offer',
    });
    expect(entry.lastModified).toBeUndefined();
    expect(new URL(entry.url).search).toBe('');
    expect(new URL(entry.url).hash).toBe('');
  }
  expect(new Set(entries.map(({ url }) => url)).size).toBe(entries.length);
  for (const locale of ['uk', 'ru']) {
    for (const path of [
      '/delivery-and-payment',
      '/returns-exchanges',
      '/contacts',
      '/wholesale',
      '/articles',
    ]) {
      expect(entries.some(({ url }) => url.endsWith('/' + locale + path))).toBe(true);
    }
  }
});

it('publishes the complete privacy policy once per locale and preserves all existing pages', () => {
  const config = createSiteConfig({ SITE_ENV: 'production', SITE_INDEXING: 'true' });
  const entries = buildSitemapEntries([...CONTENT_SITEMAP_PAGES], config);
  const policy = entries.filter(({ url }) => new URL(url).pathname.endsWith('/privacy-policy'));

  expect(policy.map(({ url }) => url)).toEqual([
    'https://classkedr.com.ua/uk/privacy-policy',
    'https://classkedr.com.ua/ru/privacy-policy',
  ]);
  for (const entry of policy) {
    expect(entry.alternates?.languages).toEqual({
      'uk-UA': 'https://classkedr.com.ua/uk/privacy-policy',
      'ru-UA': 'https://classkedr.com.ua/ru/privacy-policy',
    });
    expect(entry.lastModified).toBeUndefined();
    expect(new URL(entry.url).search).toBe('');
    expect(new URL(entry.url).hash).toBe('');
  }
  expect(new Set(entries.map(({ url }) => url)).size).toBe(entries.length);
  for (const locale of ['uk', 'ru']) {
    for (const slug of [
      'delivery-and-payment',
      'returns-exchanges',
      'contacts',
      'requisites',
      'wholesale',
      'articles',
      'public-offer',
    ]) {
      expect(entries.some(({ url }) => url.endsWith('/' + locale + '/' + slug))).toBe(true);
    }
  }
});
it('publishes one gallery URL per locale, preserves existing content and invents no media dates', () => {
  const config = createSiteConfig({ SITE_ENV: 'production', SITE_INDEXING: 'true' });
  const entries = buildSitemapEntries([...CONTENT_SITEMAP_PAGES], config);
  const gallery = entries.filter(({ url }) => new URL(url).pathname.endsWith('/galleria'));
  expect(gallery.map(({ url }) => url)).toEqual([
    'https://classkedr.com.ua/uk/galleria',
    'https://classkedr.com.ua/ru/galleria',
  ]);
  for (const entry of gallery) {
    expect(entry.alternates?.languages).toEqual({
      'uk-UA': 'https://classkedr.com.ua/uk/galleria',
      'ru-UA': 'https://classkedr.com.ua/ru/galleria',
    });
    expect(entry.lastModified).toBeUndefined();
    expect(new URL(entry.url).search).toBe('');
    expect(new URL(entry.url).hash).toBe('');
  }
  expect(new Set(entries.map(({ url }) => url)).size).toBe(entries.length);
  for (const locale of ['uk', 'ru']) {
    for (const route of ['/contacts', '/articles', '/public-offer', '/wholesale', '/requisites']) {
      expect(entries.some(({ url }) => url.endsWith('/' + locale + route))).toBe(true);
    }
  }
});
