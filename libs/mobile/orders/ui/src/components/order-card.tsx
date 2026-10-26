import {
  formatOrderAmount,
  formatOrderDateTime,
  formatOrderPositionCount,
  type OrderSummary,
} from '@mobile/orders/model';
import { getOrderSyncStatusKind, getOrderSyncStatusLabel } from '@mobile/shared/model';
import { PressableScale, tabularNumbers, useKedrTheme } from '@mobile/shared/ui';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { OrderStatusIcon } from './order-status-icon';

export function OrderCard({
  order,
  onPress,
}: Readonly<{ order: OrderSummary; onPress: (order: OrderSummary) => void }>) {
  const { kedr } = useKedrTheme();
  const status = getOrderSyncStatusLabel(order.syncStatus);
  const statusColor = kedr.colors.status[getOrderSyncStatusKind(order.syncStatus)].foreground;
  const label = `Замовлення ${order.orderNumber}, ${order.counterpartyName}, ${status}, ${formatOrderPositionCount(order.lineCount)}, ${formatOrderAmount(order.totalAmount)}, ${formatOrderDateTime(order.createdAtUtc)}`;

  return (
    <PressableScale
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={() => onPress(order)}
      style={[styles.row, { backgroundColor: kedr.colors.surface, borderRadius: kedr.radius.lg }]}
    >
      <OrderStatusIcon status={order.syncStatus} />
      <View style={styles.main}>
        <Text
          numberOfLines={1}
          style={[tabularNumbers, { color: kedr.colors.onSurface }]}
          variant="labelLarge"
        >
          № {order.orderNumber}
        </Text>
        <Text numberOfLines={1} style={{ color: kedr.colors.onSurface }} variant="bodySmall">
          {order.counterpartyName}
        </Text>
        <Text numberOfLines={1} style={{ color: statusColor }} variant="labelSmall">
          {status}
        </Text>
      </View>
      <View style={styles.side}>
        <Text
          numberOfLines={1}
          style={[kedr.type.price, tabularNumbers, { color: kedr.colors.onSurface }]}
        >
          {formatOrderAmount(order.totalAmount)}
        </Text>
        <Text
          style={[tabularNumbers, { color: kedr.colors.onSurfaceVariant }]}
          variant="labelSmall"
        >
          {formatOrderDateTime(order.createdAtUtc)}
        </Text>
        <Text style={{ color: kedr.colors.onSurfaceVariant }} variant="labelSmall">
          {formatOrderPositionCount(order.lineCount)}
        </Text>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, gap: 2 },
  row: { alignItems: 'center', flexDirection: 'row', gap: 12, padding: 12 },
  side: { alignItems: 'flex-end', gap: 2, maxWidth: '45%' },
});
