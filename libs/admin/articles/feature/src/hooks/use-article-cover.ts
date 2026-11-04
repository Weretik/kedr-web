import { useUploadArticleCoverMutation } from '@admin/articles/data-access';
import { articleCoverFileError } from '@admin/articles/model';
import { useGetMediaFilesQuery } from '@admin/media/data-access';
import { defaultMediaFilesQuery } from '@admin/media/model';
import { useEffect, useMemo, useState } from 'react';

import { articleCoverErrorMessage } from '../errors/article-error-message';

import type { ArticleCover } from '@admin/articles/model';
import type { MediaFile, MediaFilesQuery } from '@admin/media/model';

const searchDelayMs = 300;

/**
 * The cover of the article form, new or saved: a picture from the computer is uploaded at once into the media
 * library (CDN folder `articles`), or one is picked from the library. Either way it becomes part of the draft and
 * is saved with the article.
 */
export function useArticleCover(onChange: (cover: ArticleCover | null) => void) {
  const [error, setError] = useState<string | undefined>();
  const [upload, uploadState] = useUploadArticleCoverMutation();
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

  const choose = async (file: File) => {
    const fileError = articleCoverFileError(file);
    setError(fileError);
    if (fileError) return;
    try {
      onChange(await upload(file).unwrap());
    } catch (cause) {
      setError(articleCoverErrorMessage(cause));
    }
  };

  return {
    busy: uploadState.isLoading,
    choose,
    clear: () => {
      setError(undefined);
      onChange(null);
    },
    error,
    picker: {
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
          setError(undefined);
          onChange({ mediaFileId: selected[0].id, url: selected[0].url });
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
