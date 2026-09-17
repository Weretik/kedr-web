import { formatOrderAmount, type OrderDetail } from '@mobile/orders/model';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { OrderDetailLine } from './order-detail-line';

export function OrderDetailProducts({ order }: Readonly<{ order: OrderDetail }>) {
  return (
    <>
      <View style={styles.section}>
        <Text accessibilityRole="header" variant="titleLarge">
          Товари
        </Text>
        {order.lines.map((line) => (
          <OrderDetailLine key={`${line.productId}-${line.productName}`} line={line} />
        ))}
      </View>
      <View style={styles.total}>
        <Text variant="titleLarge">Разом</Text>
        <Text variant="headlineSmall">{formatOrderAmount(order.totalAmount)}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  total: { flexDirection: 'row', justifyContent: 'space-between' },
});
