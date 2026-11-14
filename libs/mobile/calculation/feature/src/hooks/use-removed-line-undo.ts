import { useEffect } from 'react';

import { useRemovedLineStore } from '../state/removed-line-store';

/** How long «Скасувати» stays after a line is removed. */
const undoMs = 5_000;

/** The line this customer removed last, forgotten when «Скасувати» has been on screen long enough. */
export function useRemovedLineUndo(counterpartyId: string) {
  const removed = useRemovedLineStore((state) =>
    state.removed?.counterpartyId === counterpartyId ? state.removed : null,
  );

  useEffect(() => {
    if (!removed) return;
    const timer = setTimeout(() => useRemovedLineStore.getState().forget(), undoMs);
    return () => clearTimeout(timer);
  }, [removed]);

  return removed;
}
