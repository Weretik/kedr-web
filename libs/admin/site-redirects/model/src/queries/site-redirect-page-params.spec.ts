import { parseSiteRedirectPageQuery, siteRedirectPageSearch } from './site-redirect-page-params';

describe('site redirect list URL state', () => {
  it('reads valid values and falls back to page 1 of 25', () => {
    expect(parseSiteRedirectPageQuery('page=3&pageSize=50&search=%20region%20')).toEqual({
      page: 3,
      pageSize: 50,
      search: 'region',
    });
    expect(parseSiteRedirectPageQuery('page=-1&pageSize=7')).toEqual({ page: 1, pageSize: 25 });
  });

  it('writes the state back', () => {
    expect(siteRedirectPageSearch({ page: 2, pageSize: 25, search: 'uk old' })).toBe(
      '?page=2&pageSize=25&search=uk+old',
    );
  });
});
