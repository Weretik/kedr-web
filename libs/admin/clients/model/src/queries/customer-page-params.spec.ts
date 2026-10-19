import { describe, expect, it } from 'vitest';

import {
  customerPageSearch,
  isValidCustomerId,
  parseCustomerPageQuery,
} from './customer-page-params';

describe('customer URL context', () => {
  it('reads valid page and page size', () => {
    expect(parseCustomerPageQuery('?page=3&pageSize=50')).toEqual({ page: 3, pageSize: 50 });
  });

  it('falls back for invalid pagination values', () => {
    expect(parseCustomerPageQuery('?page=-2&pageSize=500')).toEqual({ page: 1, pageSize: 20 });
  });

  it('creates a stable return query', () => {
    expect(customerPageSearch({ page: 3, pageSize: 50 })).toBe('?page=3&pageSize=50');
  });

  it('preserves the single server search through details navigation', () => {
    const query = parseCustomerPageQuery(
      '?page=3&pageSize=50&searchTerm=%20%D0%9A%D0%B5%D0%B4%D1%80%20&name=%20%D0%90%D0%BD%D0%BD%D0%B0%20&phone=050&counterpartyId=012&sort=-phone',
    );
    expect(query).toEqual({
      page: 3,
      pageSize: 50,
      searchTerm: 'Кедр',
    });
    expect(parseCustomerPageQuery(customerPageSearch(query))).toEqual(query);
  });

  it('drops obsolete column filters and sorting', () => {
    expect(parseCustomerPageQuery('?page=2&name=%20%20&sort=unknown')).toEqual({
      page: 2,
      pageSize: 20,
    });
  });

  it('rejects blank and oversized IDs before HTTP', () => {
    expect(isValidCustomerId('  ')).toBe(false);
    expect(isValidCustomerId('x'.repeat(65))).toBe(false);
    expect(isValidCustomerId('0002')).toBe(true);
  });
});
