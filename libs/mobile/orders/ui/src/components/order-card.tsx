import {
  formatOrderAmount,
  formatOrderDateTime,
  formatOrderPositionCount,
  getOrderSyncStatusLabel,
  type OrderSummary,
} from '@mobile/orders/model';
import { Pressable, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

import { OrderStatusChip } from './order-status-chip';

export function OrderCard({
  order,
  onPress,
}: Readonly<{ order: OrderSummary; onPress: (order: OrderSummary) => void }>) {
  const label = `Замовлення ${order.orderNumber}, ${order.counterpartyName}, ${getAccessibleStatus(order)}, ${formatOrderPositionCount(order.lineCount)}, ${formatOrderAmount(order.totalAmount)}, ${formatOrderDateTime(order.createdAtUtc)}`;
  return (
    <Pressable accessibilityLabel={label} accessibilityRole="button" onPress={() => onPress(order)}>
      <Card mode="outlined">
        <Card.Content style={styles.content}>
          <View style={styles.row}>
            <Text variant="titleMedium">№ {order.orderNumber}</Text>
            <Text>{formatOrderDateTime(order.createdAtUtc)}</Text>
          </View>
          <Text variant="bodyLarge">{order.counterpartyName}</Text>
          <OrderStatusChip status={order.syncStatus} />
          <View style={styles.row}>
            <Text>{formatOrderPositionCount(order.lineCount)}</Text>
            <Text variant="titleMedium">{formatOrderAmount(order.totalAmount)}</Text>
          </View>
        </Card.Content>
      </Card>
    </Pressable>
  );
}

function getAccessibleStatus(order: OrderSummary) {
  return getOrderSyncStatusLabel(order.syncStatus);
}
const styles = StyleSheet.create({
  content: { gap: 10, paddingVertical: 14 },
  row: { alignItems: 'center', flexDirection: 'row', gap: 12, justifyContent: 'space-between' },
});
