import { type useOutbox } from '@mobile/calculation/data-access';
import { OutboxRow } from '@mobile/calculation/ui';
import { AppText } from '@mobile/shared/ui';

import { useOpenSavedWork } from '../hooks/use-open-saved-work';

import type { OrdersScreenProps } from './orders-screen';

/** The customer's entries on their way to 1C; a returned order opens in the calculation (R-010, R-011). */
export function OutboxQueueRows({
  api,
  counterpartyId,
  entries,
  isOnline,
  onOpenCalculation,
}: Readonly<
  OrdersScreenProps & { counterpartyId: string; entries: ReturnType<typeof useOutbox> }
>) {
  const { notice, openReturned } = useOpenSavedWork(
    counterpartyId,
    isOnline,
    onOpenCalculation,
    api,
  );
  return (
    <>
      {entries.map((entry) => (
        <OutboxRow entry={entry} key={entry.id} onOpen={() => openReturned(entry)} />
      ))}
      {notice ? (
        <AppText tone="warning" variant="secondary">
          {notice}
        </AppText>
      ) : null}
    </>
  );
}
