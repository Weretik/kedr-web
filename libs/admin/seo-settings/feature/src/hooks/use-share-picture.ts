import { useGetMediaFilesQuery, useUploadMediaFileMutation } from '@admin/media/data-access';
import { defaultMediaFilesQuery, uploadIssue } from '@admin/media/model';
import { useEffect, useMemo, useState } from 'react';

import type { MediaFile, MediaFilesQuery } from '@admin/media/model';
import type { SharePicture } from '@admin/seo-settings/model';

const searchDelayMs = 300;

const toPicture = (file: MediaFile): SharePicture => ({
  mediaFileId: file.id,
  url: file.url,
  fileName: file.fileName,
  width: file.width,
  height: file.height,
  missing: false,
});

/**
 * The picture of the edit panel: the media library picker (search and page; files load only while it is open) and
 * an upload from the computer into the library root. Either way the settings keep only the file ID.
 */
export function useSharePicture() {
  const [picture, setPicture] = useState<SharePicture | null>(null);
  const [open, setOpen] = useState(false);
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
    picture,
    issue,
    uploading: upload.isLoading,
    /** Starts an opening of the panel with the saved picture. */
    reset: (saved: SharePicture | null) => {
      setPicture(saved);
      setIssue(undefined);
    },
    remove: () => setPicture(null),
    upload: async (file: File) => {
      const problem = uploadIssue(file);
      setIssue(problem ?? undefined);
      if (problem) return;
      try {
        setPicture(toPicture(await uploadFile({ file, folderId: null }).unwrap()));
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
          setPicture(toPicture(selected[0]));
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
