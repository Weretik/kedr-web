import type { CustomerPageQuery, CustomerSort } from './customer-page';

const customerSorts: readonly CustomerSort[] = [
  'name',
  '-name',
  'counterpartyId',
  '-counterpartyId',
  'phone',
  '-phone',
];

function isCustomerSort(value: string | null): value is CustomerSort {
  return value !== null && customerSorts.some((sort) => sort === value);
}

function optionalFilter(params: URLSearchParams, key: string): string | undefined {
  const value = params.get(key)?.trim();
  return value ? value.slice(0, 100) : undefined;
}

export function parseCustomerPageQuery(search: string): CustomerPageQuery {
  const params = new URLSearchParams(search);
  const page = Number(params.get('page'));
  const pageSize = Number(params.get('pageSize'));
  const searchTerm = optionalFilter(params, 'searchTerm');
  const sort = params.get('sort');
  return {
    page: Number.isInteger(page) && page >= 1 ? page : 1,
    pageSize: Number.isInteger(pageSize) && pageSize >= 1 && pageSize <= 100 ? pageSize : 20,
    ...(searchTerm && { searchTerm }),
    ...(isCustomerSort(sort) && { sort }),
  };
}

export function customerPageSearch(query: CustomerPageQuery): string {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize),
  });
  const searchTerm = query.searchTerm?.trim();
  if (searchTerm) params.set('searchTerm', searchTerm.slice(0, 100));
  if (query.sort && query.sort !== 'name') params.set('sort', query.sort);
  return `?${params}`;
}

export function isValidCustomerId(value: string | undefined): boolean {
  return typeof value === 'string' && value.length <= 64 && /\S/.test(value);
}
