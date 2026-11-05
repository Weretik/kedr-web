import { useSearchParams } from 'react-router-dom';

import { writeSiteQuery } from '../model/site-models-url-state';

import type { SiteModelsQuery, SiteShowcaseQuery } from '@admin/site-models/model';

/** A list query kept in the address: a filter change goes back to the first page. */
export function useSiteQueryParams<T extends SiteShowcaseQuery | SiteModelsQuery>(
  read: (params: URLSearchParams) => T,
) {
  const [params, setParams] = useSearchParams();
  const query = read(params);
  const replace = (next: T) => setParams(writeSiteQuery(next), { replace: true });
  return {
    query,
    filter: (change: Partial<T>) => replace({ ...query, ...change, page: 1 }),
    page: (page: number) => replace({ ...query, page }),
    pageSize: (pageSize: number) => replace({ ...query, pageSize, page: 1 }),
  };
}
