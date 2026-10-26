import { formatOrderAmount, type OrderDetail } from '@mobile/orders/model';
import { KedrCard, tabularNumbers, useKedrTheme } from '@mobile/shared/ui';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { OrderDetailLine } from './order-detail-line';

export function OrderDetailProducts({ order }: Readonly<{ order: OrderDetail }>) {
  const { kedr } = useKedrTheme();

  return (
    <>
      <KedrCard title="Товари">
        {order.lines.map((line) => (
          <OrderDetailLine key={`${line.productId}-${line.productName}`} line={line} />
        ))}
      </KedrCard>
      <View
        style={[
          styles.total,
          { backgroundColor: kedr.colors.inverseSurface, borderRadius: kedr.radius.xl },
        ]}
      >
        <Text style={{ color: kedr.colors.inverseOnSurface, opacity: 0.75 }} variant="labelLarge">
          Разом
        </Text>
        <Text style={[kedr.type.total, tabularNumbers, { color: kedr.colors.inverseOnSurface }]}>
          {formatOrderAmount(order.totalAmount)}
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({ total: { gap: 2, padding: 16 } });
