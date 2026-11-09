import {
  formatDate,
  formatHryvnias,
  type CustomerDraft,
  type CustomerOrder,
} from '@mobile/customers/model';
import {
  getOrderSyncStatusKind,
  getOrderSyncStatusLabel,
  ORDER_SYNC_STATUSES,
  type OrderSyncStatus,
} from '@mobile/shared/model';
import { AppText, createStyles, ListRow, StatusPill, useStyles } from '@mobile/shared/ui';
import { View } from 'react-native';

const isKnownStatus = (status: string): status is OrderSyncStatus =>
  (ORDER_SYNC_STATUSES as readonly string[]).includes(status);

const linesLabel = (count: number) => `${count} поз.`;

/** An order of the customer; only a sync problem or a waiting order gets a pill. */
export function OrderRow({
  onOpen,
  order,
}: Readonly<{ order: CustomerOrder; onOpen?: () => void }>) {
  const styles = useStyles(stylesSheet);
  const status = isKnownStatus(order.syncStatus) ? order.syncStatus : null;
  const kind = status ? getOrderSyncStatusKind(status) : null;
  const showPill = status !== null && (kind === 'error' || kind === 'warning');

  return (
    <ListRow
      onPress={onOpen}
      opensDetail={onOpen !== undefined}
      subtitle={`${formatDate(order.createdAtUtc)} · ${linesLabel(order.lineCount)}`}
      title={`№ ${order.orderNumber}`}
      trailing={
        <View style={styles.trailing}>
          <AppText numeric variant="bodyStrong">
            {formatHryvnias(order.totalAmount)}
          </AppText>
          {showPill && kind ? (
            <StatusPill kind={kind} label={getOrderSyncStatusLabel(status)} />
          ) : null}
        </View>
      }
    />
  );
}

/** A saved draft of the customer. */
export function DraftRow({
  draft,
  onOpen,
}: Readonly<{ draft: CustomerDraft; onOpen?: () => void }>) {
  return (
    <ListRow
      accessibilityHint={onOpen ? 'Відкриває чернетку в розрахунку' : undefined}
      onPress={onOpen}
      opensDetail={onOpen !== undefined}
      subtitle={`Змінено ${formatDate(draft.updatedAtUtc)} · ${linesLabel(draft.lineCount)}`}
      title={draft.title}
    />
  );
}

const stylesSheet = createStyles((theme) => ({
  trailing: { alignItems: 'flex-end', gap: theme.space.xs },
}));
