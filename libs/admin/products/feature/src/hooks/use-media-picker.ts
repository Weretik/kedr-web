import { useGetMediaFilesQuery } from '@admin/media/data-access';
import { defaultMediaFilesQuery } from '@admin/media/model';
import { useEffect, useMemo, useState } from 'react';

import type { MediaFilesQuery } from '@admin/media/model';

const searchDelayMs = 300;

/** What the picker adds: photos (several) or the scheme (one). */
export type MediaPickerTarget = 'photos' | 'scheme';

/** Open state, search, and page of the library picker; files load only while it is open. */
export function useMediaPicker() {
  const [target, setTarget] = useState<MediaPickerTarget | null>(null);
  const [search, setSearchState] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), searchDelayMs);
    return () => clearTimeout(timer);
  }, [search]);

  const query = useMemo<MediaFilesQuery>(
    () => ({ ...defaultMediaFilesQuery, search: debouncedSearch, page }),
    [debouncedSearch, page],
  );
  const files = useGetMediaFilesQuery(query, { skip: target === null });
  const pageCount = files.data
    ? Math.max(1, Math.ceil(files.data.totalCount / files.data.pageSize))
    : 1;

  return {
    target,
    open: (next: MediaPickerTarget) => setTarget(next),
    close: () => setTarget(null),
    search,
    setSearch: (next: string) => {
      setSearchState(next);
      setPage(1);
    },
    page,
    setPage,
    pageCount,
    files: files.data?.items ?? [],
    loading: files.isFetching,
    error: files.isError,
    retry: () => void files.refetch(),
  };
}
