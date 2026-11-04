import { folderAncestorIds } from '@admin/media/model';
import { useCallback, useEffect, useState } from 'react';

import type { MediaFolder, MediaScope } from '@admin/media/model';

const storageKey = 'kedr-admin.media.open-folders';

function readStored(): Set<number> {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(storageKey) ?? '[]');
    return new Set(Array.isArray(parsed) ? parsed.filter(Number.isInteger) : []);
  } catch {
    return new Set();
  }
}

function store(ids: ReadonlySet<number>) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify([...ids]));
  } catch {
    // Private mode or blocked storage: the tree still works, it just forgets on reload.
  }
}

/**
 * Open folders of the tree, remembered in this browser. Everything starts closed; the folders
 * above the selected one open so it stays visible.
 */
export function useMediaFolderExpansion(folders: readonly MediaFolder[], scope: MediaScope) {
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<number>>(readStored);

  const selectedId = scope.kind === 'folder' ? scope.folderId : null;
  useEffect(() => {
    if (selectedId === null) return;
    const ancestors = folderAncestorIds(folders, selectedId);
    setExpandedIds((current) => {
      if (ancestors.every((id) => current.has(id))) return current;
      const next = new Set([...current, ...ancestors]);
      store(next);
      return next;
    });
  }, [folders, selectedId]);

  const toggle = useCallback((folderId: number) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (!next.delete(folderId)) next.add(folderId);
      store(next);
      return next;
    });
  }, []);

  return { expandedIds, toggle };
}
