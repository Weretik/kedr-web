import { defaultMediaFilesQuery } from '@admin/media/model';
import { useEffect, useMemo, useState } from 'react';

import { useGetMediaFilesQuery } from './admin-media.api';

import type { MediaFile, MediaFilesQuery } from '@admin/media/model';

const searchDelayMs = 300;

/**
 * One-file picker over the media library for `MediaPickerDialog`: search with a short delay and pages; files load only
 * while it is open, and `onPicked` gets the chosen file.
 */
export function useMediaPicker(onPicked: (file: MediaFile) => void) {
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
