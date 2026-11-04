import { defaultMediaFilesQuery } from '@admin/media/model';
import { useEffect, useMemo, useState } from 'react';

import type { MediaFilesQuery, MediaScope } from '@admin/media/model';

const searchDelayMs = 300;

/** Folder, search, and page of the grid; a new folder or search starts from page 1. */
export function useMediaFilesQuery() {
  const [scope, setScopeState] = useState<MediaScope>(defaultMediaFilesQuery.scope);
  const [search, setSearchState] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), searchDelayMs);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => setPage(1), [debouncedSearch]);

  const query = useMemo<MediaFilesQuery>(
    () => ({ ...defaultMediaFilesQuery, scope, search: debouncedSearch, page }),
    [debouncedSearch, page, scope],
  );

  return {
    query,
    scope,
    search,
    setSearch: setSearchState,
    setPage,
    setScope: (next: MediaScope) => {
      setScopeState(next);
      setPage(1);
    },
  };
}
