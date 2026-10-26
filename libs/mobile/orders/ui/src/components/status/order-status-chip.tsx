import {
  getOrderSyncStatusKind,
  getOrderSyncStatusLabel,
  type OrderSyncStatus,
} from '@mobile/shared/model';
import { StatusPill } from '@mobile/shared/ui';
import { View } from 'react-native';

export function OrderStatusChip({ status }: Readonly<{ status: OrderSyncStatus }>) {
  const label = getOrderSyncStatusLabel(status);
  return (
    <View accessible accessibilityLabel={`Статус: ${label}`}>
      <StatusPill kind={getOrderSyncStatusKind(status)} label={label} />
    </View>
  );
}
