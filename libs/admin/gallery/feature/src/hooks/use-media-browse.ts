import { useGetMediaFilesQuery, useGetMediaFoldersQuery } from '@admin/media/data-access';
import { defaultMediaFilesQuery, folderPath } from '@admin/media/model';
import { useEffect, useMemo, useState } from 'react';

import type { MediaScope } from '@admin/media/model';

const searchDelayMs = 300;

/** Folder, search and page of the media picker, with the folder list as «Папка / Підпапка» labels. */
export function useMediaBrowse(open: boolean) {
  const [scope, setScope] = useState<MediaScope>({ kind: 'all' });
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [page, setPage] = useState(1);
  const folders = useGetMediaFoldersQuery(undefined, { skip: !open });
  const query = useMemo(
    () => ({ ...defaultMediaFilesQuery, scope, search: debounced, page }),
    [debounced, page, scope],
  );
  const files = useGetMediaFilesQuery(query, { skip: !open });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(search);
      setPage(1);
    }, searchDelayMs);
    return () => clearTimeout(timer);
  }, [search]);

  const folderList = folders.data?.folders;
  const options = useMemo(
    () =>
      (folderList ?? [])
        .map((folder) => ({
          id: folder.id,
          label: folderPath(folderList ?? [], folder.id).join(' / '),
        }))
        .sort((a, b) => a.label.localeCompare(b.label, 'uk')),
    [folderList],
  );

  return {
    scope,
    changeScope: (next: MediaScope) => {
      setScope(next);
      setPage(1);
    },
    search,
    setSearch,
    searching: debounced !== '',
    page,
    setPage,
    files,
    options,
  };
}
