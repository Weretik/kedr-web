/** List state kept in the URL: page, page size, and the search words. */
export interface SiteRedirectPageQuery {
  page: number;
  pageSize: number;
  search?: string;
}

const searchMaxLength = 200;
const pageSizes = [10, 25, 50, 100];

export function parseSiteRedirectPageQuery(search: string): SiteRedirectPageQuery {
  const params = new URLSearchParams(search);
  const page = Number(params.get('page'));
  const pageSize = Number(params.get('pageSize'));
  const text = params.get('search')?.trim().slice(0, searchMaxLength);
  return {
    page: Number.isInteger(page) && page >= 1 ? page : 1,
    pageSize: pageSizes.includes(pageSize) ? pageSize : 25,
    ...(text && { search: text }),
  };
}

export function siteRedirectPageSearch(query: SiteRedirectPageQuery): string {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize),
  });
  const text = query.search?.trim();
  if (text) params.set('search', text.slice(0, searchMaxLength));
  return `?${params}`;
}

export const siteRedirectPageSizes = pageSizes;
