import { defaultMediaFilesQuery } from '@admin/media/model';
import { useEffect, useMemo, useState } from 'react';

import type { MediaFilesQuery, MediaScope } from '@admin/media/model';

const searchDelayMs = 300;

/**
 * Folder, search, subfolders switch, and page of the grid; any change starts from page 1. A folder
 * shows its subfolders' files too by default, so a category folder is never an empty grid.
 */
export function useMediaFilesQuery() {
  const [scope, setScopeState] = useState<MediaScope>(defaultMediaFilesQuery.scope);
  const [search, setSearchState] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [includeSubfolders, setIncludeSubfoldersState] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), searchDelayMs);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => setPage(1), [debouncedSearch]);

  const query = useMemo<MediaFilesQuery>(
    () => ({ ...defaultMediaFilesQuery, scope, search: debouncedSearch, includeSubfolders, page }),
    [debouncedSearch, includeSubfolders, page, scope],
  );

  return {
    query,
    scope,
    search,
    includeSubfolders,
    setIncludeSubfolders: (next: boolean) => {
      setIncludeSubfoldersState(next);
      setPage(1);
    },
    setSearch: setSearchState,
    setPage,
    setScope: (next: MediaScope) => {
      setScopeState(next);
      setPage(1);
    },
  };
}
