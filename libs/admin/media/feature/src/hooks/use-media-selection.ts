import { useCallback, useState } from 'react';

/** Files picked for a bulk move; cleared when the grid shows another folder or page. */
export function useMediaSelection() {
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<number>>(new Set());
  const toggle = useCallback(
    (id: number) =>
      setSelectedIds((current) => {
        const next = new Set(current);
        if (!next.delete(id)) next.add(id);
        return next;
      }),
    [],
  );
  // Keeps the same set when nothing is selected, so clearing on every query change does not re-render.
  const clear = useCallback(
    () => setSelectedIds((current) => (current.size === 0 ? current : new Set())),
    [],
  );
  return { selectedIds, toggle, clear };
}
