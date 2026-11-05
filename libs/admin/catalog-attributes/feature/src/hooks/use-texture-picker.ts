import { useGetMediaFilesQuery } from '@admin/media/data-access';
import { defaultMediaFilesQuery } from '@admin/media/model';
import { useEffect, useMemo, useState } from 'react';

import type { MediaFile, MediaFilesQuery } from '@admin/media/model';

const searchDelayMs = 300;

/** The «Медіа» picker for a decor texture; files load only while it is open. */
export function useTexturePicker(onPicked: (file: MediaFile) => void) {
  const [open, setOpen] = useState(false);
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
  const files = useGetMediaFilesQuery(query, { skip: !open });
  const pageCount = files.data
    ? Math.max(1, Math.ceil(files.data.totalCount / files.data.pageSize))
    : 1;

  return {
    open,
    onOpen: () => setOpen(true),
    onCancel: () => setOpen(false),
    onConfirm: (picked: MediaFile[]) => {
      setOpen(false);
      if (picked[0]) onPicked(picked[0]);
    },
    search,
    onSearchChange: (next: string) => {
      setSearchState(next);
      setPage(1);
    },
    page,
    onPageChange: setPage,
    pageCount,
    files: files.data?.items ?? [],
    loading: files.isFetching,
    error: files.isError,
    onRetry: () => void files.refetch(),
  };
}
