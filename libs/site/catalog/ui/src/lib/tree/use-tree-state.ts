'use client';

import { useCallback, useEffect, useState } from 'react';

/** Where the tree panel keeps the visitor's choices between pages and visits. */
export const TREE_STORAGE_KEY = 'kedr-site:catalog-tree';

type StoredTree = { collapsed: number[]; hidden: boolean };

const read = (): StoredTree | null => {
  try {
    const value = JSON.parse(
      window.localStorage.getItem(TREE_STORAGE_KEY) ?? 'null',
    ) as Partial<StoredTree> | null;
    if (!value) return null;
    return {
      collapsed: Array.isArray(value.collapsed) ? value.collapsed.filter(Number.isInteger) : [],
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
 * Collapsed branches and panel visibility. The server and the first client render show everything expanded
 * and visible, so the HTML holds every link; saved choices apply right after hydration.
 */
export function useTreeState() {
  const [state, setState] = useState<StoredTree>({ collapsed: [], hidden: false });

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
        collapsed: current.collapsed.includes(id)
          ? current.collapsed.filter((other) => other !== id)
          : [...current.collapsed, id],
      })),
    [update],
  );

  const toggleHidden = useCallback(
    () => update((current) => ({ ...current, hidden: !current.hidden })),
    [update],
  );

  return { collapsed: state.collapsed, hidden: state.hidden, toggleBranch, toggleHidden };
}
