/** List state kept in the URL: page, page size, search by name or phone, and «Лише з проблемою». */
export interface SiteOrderPageQuery {
  page: number;
  pageSize: number;
  search?: string;
  problemOnly?: boolean;
}

const searchMaxLength = 100;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function parseSiteOrderPageQuery(search: string): SiteOrderPageQuery {
  const params = new URLSearchParams(search);
  const page = Number(params.get('page'));
  const pageSize = Number(params.get('pageSize'));
  const text = params.get('search')?.trim().slice(0, searchMaxLength);
  return {
    page: Number.isInteger(page) && page >= 1 ? page : 1,
    pageSize: Number.isInteger(pageSize) && pageSize >= 1 && pageSize <= 100 ? pageSize : 20,
    ...(text && { search: text }),
    ...(params.get('delivery') === 'problem' && { problemOnly: true }),
  };
}

export function siteOrderPageSearch(query: SiteOrderPageQuery): string {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize),
  });
  const text = query.search?.trim();
  if (text) params.set('search', text.slice(0, searchMaxLength));
  if (query.problemOnly) params.set('delivery', 'problem');
  return `?${params}`;
}

/** The order id is a UUID; anything else is rejected before a request. */
export function isValidSiteOrderId(value: string | undefined): value is string {
  return typeof value === 'string' && uuid.test(value);
}
