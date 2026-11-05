import {
  openDraftInCalculation,
  openReturnedEntry,
  orderWorkspaceApi,
  readCalculation,
  type OrderWorkspaceApi,
} from '@mobile/calculation/data-access';
import { useLocalDatabase } from '@mobile/core/local-db';
import { useState } from 'react';

import type { OutboxEntry } from '@mobile/calculation/model';

const busyCalculation = 'Спочатку відправте або збережіть поточний розрахунок.';

/**
 * Opens a saved draft or a returned order in the calculation (SC-014, SC-017). The calculation the manager is working
 * on is never overwritten: they finish it first.
 */
export function useOpenSavedWork(
  counterpartyId: string,
  isOnline: boolean | null,
  onOpenCalculation: () => void,
  api: OrderWorkspaceApi = orderWorkspaceApi,
) {
  const db = useLocalDatabase();
  const [notice, setNotice] = useState<string | null>(null);
  const [opening, setOpening] = useState(false);

  const hasLines = () => readCalculation(db, counterpartyId).lines.length > 0;

  const openDraft = (draftId: number) => {
    if (hasLines()) return setNotice(busyCalculation);
    if (isOnline !== true) return setNotice('Чернетка відкриється, коли з’явиться мережа.');
    setNotice(null);
    setOpening(true);
    api
      .getDraft(draftId)
      .then((draft) => {
        openDraftInCalculation(db, draft);
        onOpenCalculation();
      })
      .catch(() => setNotice('Не вдалося відкрити чернетку. Спробуйте ще раз.'))
      .finally(() => setOpening(false));
  };

  const openReturned = (entry: OutboxEntry) => {
    if (!openReturnedEntry(db, entry)) return setNotice(busyCalculation);
    setNotice(null);
    onOpenCalculation();
  };

  return { notice, openDraft, openReturned, opening };
}
