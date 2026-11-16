import { DetailField, DetailFieldList, SectionCard } from '@admin/shared/ui';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import { Button } from '@mui/material';

import {
  canRetryOneCSync,
  isOneCSyncProblem,
  OrderStatusChip,
} from '../components/order-status-chip';
import { formatSyncTime } from '../components/order-sync-note';

import type { OrderSyncState } from '../components/order-sync-note';

interface Props {
  sync: OrderSyncState;
  oneCDocumentNumber: string | null;
  /** Opens the retry panel; the button shows only when 1C refused the order or every attempt failed. */
  onRetry?: () => void;
}

/** «Стан 1С» of one order: the label, the 1C document, and for a problem its reason and attempts. */
export function OrderSyncCard({ sync, oneCDocumentNumber, onRetry }: Props) {
  const problem = isOneCSyncProblem(sync.syncStatus);
  const retry =
    onRetry && canRetryOneCSync(sync.syncStatus) ? (
      <Button onClick={onRetry} startIcon={<ReplayOutlinedIcon />} variant="outlined">
        Повторити
      </Button>
    ) : undefined;

  return (
    <SectionCard action={retry} eyebrow="1С" title="Стан відправлення">
      <DetailFieldList columns={2}>
        <DetailField label="Стан" value={<OrderStatusChip status={sync.syncStatus} />} />
        {oneCDocumentNumber && <DetailField label="Документ 1С" value={oneCDocumentNumber} />}
        {problem && sync.syncError && <DetailField label="Причина" value={sync.syncError} />}
        {problem && sync.syncAttempts > 0 && (
          <DetailField label="Спроб" value={String(sync.syncAttempts)} />
        )}
        {problem && sync.syncLastAttemptAtUtc && (
          <DetailField label="Остання спроба" value={formatSyncTime(sync.syncLastAttemptAtUtc)} />
        )}
        {problem && sync.syncNextAttemptAtUtc && (
          <DetailField label="Наступна спроба" value={formatSyncTime(sync.syncNextAttemptAtUtc)} />
        )}
      </DetailFieldList>
    </SectionCard>
  );
}
