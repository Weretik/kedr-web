import { describe, expect, it } from 'vitest';

import {
  isValidSiteOrderId,
  parseSiteOrderPageQuery,
  siteOrderPageSearch,
} from './site-order-page-params';

describe('site order URL state', () => {
  it('reads page, size, search and the problem switch', () => {
    expect(
      parseSiteOrderPageQuery('?page=2&pageSize=50&search=%20Ірина%20&delivery=problem'),
    ).toEqual({
      page: 2,
      pageSize: 50,
      search: 'Ірина',
      problemOnly: true,
    });
  });

  it('falls back for invalid values and ignores an unknown delivery filter', () => {
    expect(parseSiteOrderPageQuery('?page=0&pageSize=500&search=%20%20&delivery=sent')).toEqual({
      page: 1,
      pageSize: 20,
    });
  });

  it('writes a stable query that reads back the same', () => {
    const query = { page: 3, pageSize: 20, search: '067', problemOnly: true };
    expect(siteOrderPageSearch(query)).toBe('?page=3&pageSize=20&search=067&delivery=problem');
    expect(parseSiteOrderPageQuery(siteOrderPageSearch(query))).toEqual(query);
    expect(siteOrderPageSearch({ page: 1, pageSize: 20 })).toBe('?page=1&pageSize=20');
  });

  it('accepts only a UUID as an order id', () => {
    expect(isValidSiteOrderId('3f2b8c1e-7a4d-4e1b-9c2a-1d2e3f4a5b6c')).toBe(true);
    expect(isValidSiteOrderId('123')).toBe(false);
    expect(isValidSiteOrderId(undefined)).toBe(false);
  });
});
