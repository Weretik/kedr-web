import {
  useGetSiteModelCategoriesQuery,
  useGetSiteShowcaseQuery,
} from '@admin/site-models/data-access';
import { siteQueueCounts, siteQueueFilter, siteQueueSelection } from '@admin/site-models/model';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { readSiteQueueState, writeSiteQueueState } from '../model/site-showcase-url-state';

import type { SiteQueueState } from '../model/site-showcase-url-state';

const SEARCH_DELAY_MS = 350;

/** The queue of «Моделі»: state in the address, delayed search, rows, counts, and the open row. */
export function useSiteModelsQueue() {
  const [params, setParams] = useSearchParams();
  const state = readSiteQueueState(params);
  const [search, setSearch] = useState(state.search ?? '');
  const categories = useGetSiteModelCategoriesQuery();
  const showcase = useGetSiteShowcaseQuery({
    categoryId: state.categoryId,
    search: state.search,
    ...siteQueueFilter(state.view),
    page: 1,
    pageSize: 200,
  });

  const update = (change: Partial<SiteQueueState>, replace = false) =>
    setParams(writeSiteQueueState({ ...state, ...change }), { replace });

  // The search goes to the address after a pause in typing.
  useEffect(() => {
    const next = search.trim() || undefined;
    if (next === state.search) return;
    const timer = setTimeout(
      () => update({ search: next, item: undefined }, true),
      SEARCH_DELAY_MS,
    );
    return () => clearTimeout(timer);
  });

  const rows = showcase.data?.items ?? [];
  const selection = siteQueueSelection(rows, state.item);

  return {
    state,
    update,
    search,
    setSearch,
    categories,
    showcase,
    rows,
    selection,
    counts: categories.data ? siteQueueCounts(categories.data, state.categoryId) : undefined,
    openNext: () => {
      if (selection.nextKey) update({ item: selection.nextKey });
    },
  };
}
