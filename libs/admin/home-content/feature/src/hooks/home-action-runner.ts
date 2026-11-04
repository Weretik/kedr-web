import { moveHomeItem } from '@admin/home-content/model';
import { useState } from 'react';

import { homeContentErrorMessage } from '../errors/home-content-error-message';

import type { HomeContentAction } from '../errors/home-content-error-message';

type Request = { unwrap: () => Promise<unknown> };

/**
 * Runs a home content change: a success shows the notice, a failure returns its message instead of throwing.
 * A failed reorder keeps its message for the list, since no dialog is open then.
 */
export function useHomeActionRunner(onNotice: (message: string) => void) {
  const [orderError, setOrderError] = useState<string | null>(null);

  return {
    orderError,
    clearOrderError: () => setOrderError(null),
    run: async (action: HomeContentAction, request: () => Request, done: string) => {
      try {
        await request().unwrap();
        onNotice(done);
        return undefined;
      } catch (error) {
        return homeContentErrorMessage(error, action);
      }
    },
    move: async (
      ids: readonly number[],
      id: number,
      to: number,
      reorder: (ids: number[]) => Request,
    ) => {
      setOrderError(null);
      try {
        await reorder(moveHomeItem(ids, id, to)).unwrap();
      } catch (error) {
        setOrderError(homeContentErrorMessage(error, 'reorder'));
      }
    },
  };
}
