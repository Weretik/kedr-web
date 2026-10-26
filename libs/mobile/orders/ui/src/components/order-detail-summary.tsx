import { formatOrderDateTime, type OrderDetail } from '@mobile/orders/model';
import { useKedrTheme } from '@mobile/shared/ui';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { OrderStatusChip } from './order-status-chip';

export function OrderDetailSummary({ order }: Readonly<{ order: OrderDetail }>) {
  const { kedr } = useKedrTheme();

  return (
    <View
      style={[styles.card, { backgroundColor: kedr.colors.surface, borderRadius: kedr.radius.xl }]}
    >
      <Text
        accessibilityRole="header"
        style={[kedr.type.productTitle, { color: kedr.colors.onSurface }]}
      >
        Замовлення № {order.orderNumber}
      </Text>
      <Text style={{ color: kedr.colors.onSurfaceVariant }} variant="labelSmall">
        {formatOrderDateTime(order.createdAtUtc)}
      </Text>
      <Text style={{ color: kedr.colors.onSurface }} variant="bodyLarge">
        {order.counterparty.name}
      </Text>
      <OrderStatusChip status={order.syncStatus} />
    </View>
  );
}

const styles = StyleSheet.create({ card: { gap: 8, padding: 16 } });
