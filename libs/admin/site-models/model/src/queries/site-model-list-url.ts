import { isSiteModelProblem } from '../entities/models/site-model-problem';

import type { SiteModelStatus } from '../entities/models/site-model';
import type { SiteModelListQuery } from '../entities/models/site-model-list';
import type { SiteProblemFilter } from '../entities/models/site-model-problem';

/** What «Моделі» keeps in the address: search, filters and the page. */
export interface SiteModelsListState {
  search: string;
  categoryId: number | undefined;
  status: SiteModelStatus | undefined;
  problem: SiteProblemFilter | undefined;
  page: number;
  pageSize: number;
}

export const siteModelsPageSizes: readonly number[] = [10, 20, 30, 50];

export const defaultSiteModelsListState: SiteModelsListState = {
  search: '',
  categoryId: undefined,
  status: undefined,
  problem: undefined,
  page: 1,
  pageSize: 20,
};

const listKeys = ['search', 'categoryId', 'status', 'problem', 'page', 'pageSize'] as const;

const positive = (value: string | null) => {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : undefined;
};

const readStatus = (value: string | null): SiteModelStatus | undefined =>
  value === 'proposed' || value === 'accepted' ? value : undefined;

const readProblem = (value: string | null): SiteProblemFilter | undefined =>
  value === 'any' || (value !== null && isSiteModelProblem(value)) ? value : undefined;

export function readSiteModelsListUrl(params: URLSearchParams): SiteModelsListState {
  const pageSize = positive(params.get('pageSize'));
  return {
    search: params.get('search') ?? '',
    categoryId: positive(params.get('categoryId')),
    status: readStatus(params.get('status')),
    problem: readProblem(params.get('problem')),
    page: positive(params.get('page')) ?? 1,
    pageSize:
      pageSize !== undefined && siteModelsPageSizes.includes(pageSize)
        ? pageSize
        : defaultSiteModelsListState.pageSize,
  };
}

/** The address of the list; params that are not the list's (for example the open panel) stay. */
export function writeSiteModelsListUrl(
  state: SiteModelsListState,
  current: URLSearchParams = new URLSearchParams(),
): URLSearchParams {
  const params = new URLSearchParams(current);
  listKeys.forEach((key) => params.delete(key));
  const search = state.search.trim();
  if (search) params.set('search', search);
  if (state.categoryId !== undefined) params.set('categoryId', String(state.categoryId));
  if (state.status) params.set('status', state.status);
  if (state.problem) params.set('problem', state.problem);
  if (state.page > 1) params.set('page', String(state.page));
  if (state.pageSize !== defaultSiteModelsListState.pageSize)
    params.set('pageSize', String(state.pageSize));
  return params;
}

/** The server query of the list; empty filters are left out. */
export function siteModelsListQuery(state: SiteModelsListState): SiteModelListQuery {
  const search = state.search.trim();
  return {
    ...(state.categoryId !== undefined ? { categoryId: state.categoryId } : {}),
    ...(state.status ? { status: state.status } : {}),
    ...(state.problem ? { problem: state.problem } : {}),
    ...(search ? { search } : {}),
    page: state.page,
    pageSize: state.pageSize,
  };
}

/** «До моделей» from the model page: the list with its search and filters, without an open panel. */
export function siteModelsBackPath(listSearch: string | undefined): string {
  const params = new URLSearchParams(listSearch ?? '');
  params.delete('panel');
  const search = params.toString();
  return search ? `/site-models?${search}` : '/site-models';
}
