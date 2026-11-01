'use client';

import { useCallback, useEffect, useState } from 'react';

/** Where the tree panel keeps the visitor's choices between pages and visits. */
export const TREE_STORAGE_KEY = 'kedr-site:catalog-tree';

type StoredTree = { expanded: number[]; hidden: boolean };

const read = (): StoredTree | null => {
  try {
    const value = JSON.parse(
      window.localStorage.getItem(TREE_STORAGE_KEY) ?? 'null',
    ) as Partial<StoredTree> | null;
    if (!value) return null;
    return {
      expanded: Array.isArray(value.expanded) ? value.expanded.filter(Number.isInteger) : [],
      hidden: value.hidden === true,
    };
  } catch {
    return null;
  }
};

const write = (value: StoredTree) => {
  try {
    window.localStorage.setItem(TREE_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Private mode or blocked storage: the choice lasts until the page changes.
  }
};

/**
 * Branches the visitor opened beyond the current path, and panel visibility. The server and the first client
 * render show only the current path open; collapsed branches stay in the HTML (hidden), so every link is
 * crawlable. Saved choices apply right after hydration.
 */
export function useTreeState() {
  const [state, setState] = useState<StoredTree>({ expanded: [], hidden: false });

  useEffect(() => {
    const stored = read();
    if (stored) setState(stored);
  }, []);

  const update = useCallback((change: (current: StoredTree) => StoredTree) => {
    setState((current) => {
      const next = change(current);
      write(next);
      return next;
    });
  }, []);

  const toggleBranch = useCallback(
    (id: number) =>
      update((current) => ({
        ...current,
        expanded: current.expanded.includes(id)
          ? current.expanded.filter((other) => other !== id)
          : [...current.expanded, id],
      })),
    [update],
  );

  const toggleHidden = useCallback(
    () => update((current) => ({ ...current, hidden: !current.hidden })),
    [update],
  );

  return { expanded: state.expanded, hidden: state.hidden, toggleBranch, toggleHidden };
}
