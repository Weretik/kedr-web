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
import { AppText, ListRow, StatusPill } from '@mobile/shared/ui';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

const isKnownStatus = (status: string): status is OrderSyncStatus =>
  (ORDER_SYNC_STATUSES as readonly string[]).includes(status);

const linesLabel = (count: number) => `${count} поз.`;

/** An order of the customer; only a sync problem or a waiting order gets a pill. */
export function OrderRow({ order }: Readonly<{ order: CustomerOrder }>) {
  const status = isKnownStatus(order.syncStatus) ? order.syncStatus : null;
  const kind = status ? getOrderSyncStatusKind(status) : null;
  const showPill = status !== null && (kind === 'error' || kind === 'warning');

  return (
    <ListRow
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
export function DraftRow({ draft }: Readonly<{ draft: CustomerDraft }>) {
  return (
    <ListRow
      subtitle={`Змінено ${formatDate(draft.updatedAtUtc)} · ${linesLabel(draft.lineCount)}`}
      title={draft.title}
    />
  );
}

const styles = StyleSheet.create((theme) => ({
  trailing: { alignItems: 'flex-end', gap: theme.space.xs },
}));
