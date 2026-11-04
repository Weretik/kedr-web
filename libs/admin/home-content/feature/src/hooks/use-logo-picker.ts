import { useGetMediaFilesQuery, useUploadMediaFileMutation } from '@admin/media/data-access';
import { defaultMediaFilesQuery, uploadIssue } from '@admin/media/model';
import { useEffect, useMemo, useState } from 'react';

import type { HomeBrandLogo } from '@admin/home-content/model';
import type { MediaFile, MediaFilesQuery } from '@admin/media/model';

const searchDelayMs = 300;

const toLogo = (file: MediaFile): HomeBrandLogo => ({
  mediaFileId: file.id,
  url: file.url,
  fileName: file.fileName,
});

/**
 * The logo of the brand dialog: the media library picker (search and page; files load only while it is open)
 * and an upload from the computer into the library root. Either way the brand keeps only the file ID.
 */
export function useLogoPicker() {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<HomeBrandLogo | null>(null);
  const [issue, setIssue] = useState<string | undefined>();
  const [search, setSearchState] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [uploadFile, upload] = useUploadMediaFileMutation();

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
    picked,
    issue,
    uploading: upload.isLoading,
    /** Forgets the picked logo when the brand dialog closes. */
    reset: () => {
      setPicked(null);
      setIssue(undefined);
    },
    upload: async (file: File) => {
      const problem = uploadIssue(file);
      setIssue(problem ?? undefined);
      if (problem) return;
      try {
        setPicked(toLogo(await uploadFile({ file, folderId: null }).unwrap()));
      } catch {
        setIssue(`«${file.name}»: не вдалося завантажити.`);
      }
    },
    dialog: {
      open,
      files: files.data?.items ?? [],
      loading: files.isFetching,
      error: files.isError,
      search,
      page,
      pageCount,
      onOpen: () => setOpen(true),
      onCancel: () => setOpen(false),
      onConfirm: (selected: MediaFile[]) => {
        setOpen(false);
        if (selected[0]) {
          setIssue(undefined);
          setPicked(toLogo(selected[0]));
        }
      },
      onSearchChange: (next: string) => {
        setSearchState(next);
        setPage(1);
      },
      onPageChange: setPage,
      onRetry: () => void files.refetch(),
    },
  };
}
