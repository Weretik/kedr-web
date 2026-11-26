import { useGetSiteShowcaseQuery } from '@admin/site-models/data-access';
import { siteProductCandidates } from '@admin/site-models/model';
import { useEffect, useMemo, useState } from 'react';

import type { SiteProductScope } from '@admin/site-models/model';

/** Time after the last keystroke before the catalog is searched. */
export const candidateSearchDelayMs = 350;
const candidatesPageSize = 50;

/**
 * Products to add to a model, searched by name or 1C code in the whole catalog: free products (in no model) by
 * default, or all of them with products of other accepted models locked.
 */
export function useProductCandidates(excludedIds: readonly number[], targetModelId?: number) {
  const [search, setSearch] = useState('');
  const [scope, setScope] = useState<SiteProductScope>('free');
  const [sent, setSent] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setSent(search.trim()), candidateSearchDelayMs);
    return () => clearTimeout(timer);
  }, [search]);

  const query = useGetSiteShowcaseQuery({
    ...(scope === 'free' ? { status: 'none' as const } : {}),
    ...(sent ? { search: sent } : {}),
    page: 1,
    pageSize: candidatesPageSize,
  });
  const rows = query.data?.items;
  const candidates = useMemo(
    () => siteProductCandidates(rows ?? [], excludedIds, targetModelId),
    [rows, excludedIds, targetModelId],
  );

  return {
    search: { value: search, scope, onSearchChange: setSearch, onScopeChange: setScope },
    candidates,
    loading: query.isFetching,
    error: query.isError,
  };
}
