import { formatOrderDateTime, type OrderDetail } from '@mobile/orders/model';
import { StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';

import { OrderStatusChip } from './order-status-chip';

export function OrderDetailSummary({ order }: Readonly<{ order: OrderDetail }>) {
  return (
    <Card mode="outlined">
      <Card.Content style={styles.content}>
        <Text variant="headlineSmall">Замовлення № {order.orderNumber}</Text>
        <Text>{formatOrderDateTime(order.createdAtUtc)}</Text>
        <Text variant="titleMedium">{order.counterparty.name}</Text>
        <OrderStatusChip status={order.syncStatus} />
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({ content: { gap: 12 } });
