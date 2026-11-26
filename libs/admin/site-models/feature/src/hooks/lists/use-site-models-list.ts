import {
  useGetSiteModelCategoriesQuery,
  useGetSiteModelsQuery,
} from '@admin/site-models/data-access';
import {
  readSiteModelsListUrl,
  siteModelsListQuery,
  writeSiteModelsListUrl,
} from '@admin/site-models/model';
import { useSearchParams } from 'react-router-dom';

import type {
  SiteModelsListState,
  SiteModelStatus,
  SiteProblemFilter,
} from '@admin/site-models/model';

/** «Моделі»: the list state in the address, the page of models and the category tree (spec 001 R-002). */
export function useSiteModelsList() {
  const [params, setParams] = useSearchParams();
  const state = readSiteModelsListUrl(params);
  const query = useGetSiteModelsQuery(siteModelsListQuery(state));
  const categories = useGetSiteModelCategoriesQuery();

  /** A filter change goes back to the first page; the same value changes nothing. */
  const update = (patch: Partial<SiteModelsListState>) =>
    setParams((current) => {
      const previous = readSiteModelsListUrl(current);
      const keys = Object.keys(patch) as (keyof SiteModelsListState)[];
      if (keys.every((key) => previous[key] === patch[key])) return current;
      const resetPage = !('page' in patch);
      return writeSiteModelsListUrl(
        { ...previous, ...(resetPage ? { page: 1 } : {}), ...patch },
        current,
      );
    });

  const filtered = Boolean(
    state.search.trim() || state.categoryId || state.status || state.problem,
  );

  return {
    state,
    rows: query.data?.items ?? [],
    rowCount: query.data?.totalCount ?? 0,
    loading: query.isFetching,
    error: query.isError,
    retry: () => void query.refetch(),
    emptyMessage: filtered ? 'Нічого не знайдено' : 'Моделей ще немає',
    categories: categories.data ?? [],
    categoriesLoading: categories.isLoading,
    changeSearch: (search: string) => update({ search }),
    changeCategory: (categoryId: number | undefined) => update({ categoryId }),
    changeStatus: (status: SiteModelStatus | undefined) => update({ status }),
    changeProblem: (problem: SiteProblemFilter | undefined) => update({ problem }),
    changePage: (page: number) => update({ page }),
    changePageSize: (pageSize: number) => update({ pageSize }),
  };
}
