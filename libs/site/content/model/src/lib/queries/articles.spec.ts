import { buildArticlesListing } from './articles-listing';
import { articlesHref, parseArticlesQuery, serializeArticlesQuery } from './articles-query';
import { ARTICLE_PAGE_SIZES, DEFAULT_ARTICLES_QUERY } from '../entities/article-types';
import { articlePlainText } from '../mappers/article-text';

import type { Article } from '../entities/article-types';

const articles: Article[] = Array.from({ length: 51 }, (_, index) => ({
  id: index + 1,
  slug: 'article-' + (index + 1),
  title: 'Матеріал ' + (index + 1),
  excerpt: 'Огляд',
  bodyHtml:
    index === 25
      ? '<p>Прихований <strong>МЕХАНІЗМ</strong> для дверей</p>'
      : '<p>Текст про фурнітуру</p>',
  image: null,
  publishedAt: '2026-03-24',
}));
describe('article URL and listing rules', () => {
  it('defaults to 10 and offers exactly 10/20/50', () => {
    expect(parseArticlesQuery({})).toEqual(DEFAULT_ARTICLES_QUERY);
    expect(ARTICLE_PAGE_SIZES).toEqual([10, 20, 50]);
    const result = buildArticlesListing(articles, DEFAULT_ARTICLES_QUERY);
    expect(result.items).toHaveLength(10);
    expect(result).toMatchObject({ total: 51, pageCount: 6, start: 1, end: 10 });
  });
  it('normalizes repeated parameters, whitespace and supported page size', () => {
    expect(
      parseArticlesQuery({ q: ['  дверні   ручки ', 'ignored'], page: ['3', '5'], pageSize: '20' }),
    ).toEqual({ q: 'дверні ручки', page: 3, pageSize: 20 });
  });
  it.each(['-1', '0', '1.2', 'Infinity', '9007199254740992', 'garbage'])(
    'normalizes invalid page %s',
    (page) => {
      expect(parseArticlesQuery({ page, pageSize: '999' })).toEqual(DEFAULT_ARTICLES_QUERY);
    },
  );
  it('bounds the search term and normalizes Unicode', () => {
    expect(parseArticlesQuery({ q: 'Ａ'.repeat(250) }).q).toBe('A'.repeat(200));
  });
  it('serializes only meaningful normalized choices in a fixed order', () => {
    const query = parseArticlesQuery({ q: 'ZAMAK & ручки', pageSize: '20', page: '2' });
    expect(serializeArticlesQuery(query)).toBe(
      'q=ZAMAK+%26+%D1%80%D1%83%D1%87%D0%BA%D0%B8&pageSize=20&page=2',
    );
    expect(serializeArticlesQuery(DEFAULT_ARTICLES_QUERY)).toBe('');
    expect(articlesHref('/uk/articles', DEFAULT_ARTICLES_QUERY)).toBe('/uk/articles');
    expect(articlesHref('/ru/articles', query)).toBe(
      '/ru/articles?' + serializeArticlesQuery(query),
    );
  });
  it('searches full text outside the first page before paginating, without case sensitivity', () => {
    const result = buildArticlesListing(articles, { q: 'механізм', page: 3, pageSize: 10 });
    expect(result.items.map((item) => item.id)).toEqual([26]);
    expect(result).toMatchObject({ total: 1, pageCount: 1, start: 1, end: 1, query: { page: 1 } });
  });
  it('reads article HTML as plain text for search', () => {
    expect(
      articlePlainText('<h2>Заголовок</h2><p>Текст&nbsp;і <a href="/x">ZAMAK &amp; Co</a></p>'),
    ).toBe('Заголовок Текст і ZAMAK & Co');
  });
  it('supports matching a title without changing source order', () => {
    const result = buildArticlesListing(articles, { ...DEFAULT_ARTICLES_QUERY, q: 'матеріал 2' });
    expect(result.items.map((item) => item.id)).toEqual([2, 20, 21, 22, 23, 24, 25, 26, 27, 28]);
    expect(result.total).toBe(11);
    expect(articles[0].id).toBe(1);
  });
  it.each([
    { pageSize: 10 as const, pages: 3, start: 21, end: 26 },
    { pageSize: 20 as const, pages: 2, start: 21, end: 26 },
    { pageSize: 50 as const, pages: 1, start: 1, end: 26 },
  ])('clamps to the final page with page size $pageSize', ({ pageSize, pages, start, end }) => {
    const result = buildArticlesListing(articles.slice(0, 26), { q: '', page: 99, pageSize });
    expect(result).toMatchObject({
      total: 26,
      pageCount: pages,
      start,
      end,
      query: { page: pages },
    });
    expect(result.items).toHaveLength(end - start + 1);
  });
  it('never displays a 1–0 range for empty data or no search results', () => {
    for (const data of [[], articles]) {
      const result = buildArticlesListing(data, { q: 'no match exists', page: 3, pageSize: 20 });
      expect(result).toMatchObject({
        items: [],
        total: 0,
        pageCount: 0,
        start: 0,
        end: 0,
        query: { page: 1 },
      });
    }
  });
});
