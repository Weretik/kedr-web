import {
  defaultSiteModelsPageSize,
  siteModelProblems,
  siteProductProblems,
} from '@admin/site-models/model';

import type {
  SiteModelsQuery,
  SiteModelStatus,
  SiteProblemFilter,
  SiteShowcaseQuery,
} from '@admin/site-models/model';

const pageSizes = [25, 50, 100];

function readPositive(value: string | null): number | undefined {
  const number = Number(value);
  return value !== null && Number.isInteger(number) && number > 0 ? number : undefined;
}

function readProblem(
  value: string | null,
  allowed: readonly string[],
): SiteProblemFilter | undefined {
  return value === 'any' || (value !== null && allowed.includes(value))
    ? (value as SiteProblemFilter)
    : undefined;
}

function readPaging(params: URLSearchParams) {
  const pageSize = readPositive(params.get('pageSize'));
  return {
    page: readPositive(params.get('page')) ?? 1,
    pageSize: pageSize && pageSizes.includes(pageSize) ? pageSize : defaultSiteModelsPageSize,
  };
}

/** «Вітрина сайту» filters from the address, so «Огляд» can link to them. */
export function readShowcaseQuery(params: URLSearchParams): SiteShowcaseQuery {
  return {
    categoryId: readPositive(params.get('categoryId')),
    problem: readProblem(params.get('problem'), siteProductProblems),
    search: params.get('search')?.trim() || undefined,
    ...readPaging(params),
  };
}

/** «Моделі» filters from the address. */
export function readModelsQuery(params: URLSearchParams): SiteModelsQuery {
  const status = params.get('status');
  return {
    categoryId: readPositive(params.get('categoryId')),
    status:
      status === 'proposed' || status === 'accepted' ? (status as SiteModelStatus) : undefined,
    problem: readProblem(params.get('problem'), siteModelProblems),
    search: params.get('search')?.trim() || undefined,
    ...readPaging(params),
  };
}

/** The address of a query; defaults are left out. */
export function writeSiteQuery(query: SiteShowcaseQuery | SiteModelsQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.categoryId) params.set('categoryId', String(query.categoryId));
  if ('status' in query && query.status) params.set('status', query.status);
  if (query.problem) params.set('problem', query.problem);
  if (query.search) params.set('search', query.search);
  if (query.page > 1) params.set('page', String(query.page));
  if (query.pageSize !== defaultSiteModelsPageSize) params.set('pageSize', String(query.pageSize));
  return params;
}
